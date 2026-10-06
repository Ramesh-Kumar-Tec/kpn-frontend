import { NextResponse } from 'next/server';
import { KPN_SYSTEM_PROMPT, generateLocalBotResponse } from '@/data/chatbotKnowledge';
import { projectsData, ProjectItem } from '@/data/siteData';
import { resolveNavigationIntent } from '@/lib/chatbot/navigationResolver';
import { executePropertyQuery } from '@/lib/chatbot/propertyQueryEngine';
import { resolveEmiIntent } from '@/lib/chatbot/emiCalculator';
import { resolveBrochureIntent } from '@/lib/chatbot/brochureResolver';
import { resolveLandmarkIntent } from '@/lib/chatbot/landmarkResolver';

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_ITEMS = 12;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const requestLog = new Map<string, { startedAt: number; count: number }>();
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api').replace(/\/$/, '');

function getClientKey(req: Request) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = requestLog.get(key);

  if (!current || now - current.startedAt >= RATE_LIMIT_WINDOW_MS) {
    requestLog.set(key, { startedAt: now, count: 1 });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

async function getPublishedCatalog(): Promise<ProjectItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects?limit=100`, {
      signal: AbortSignal.timeout(2500),
      cache: 'no-store',
    });

    if (!response.ok) return projectsData;

    const payload = await response.json();
    if (!Array.isArray(payload?.data) || payload.data.length === 0) return projectsData;

    const fallbackBySlug = new Map(projectsData.map((project) => [project.slug, project]));
    return payload.data.map((remote: any) => {
      const fallback = fallbackBySlug.get(remote.slug);
      return {
        ...fallback,
        ...remote,
        type: remote.propertyType || remote.type || fallback?.type || 'Apartments',
        status: remote.status || fallback?.status || 'Ongoing',
        image: remote.image || fallback?.image || '/images/kpn_logo.webp',
        description: remote.shortDescription || remote.description || fallback?.description,
      } as ProjectItem;
    });
  } catch (error) {
    console.warn('[Chatbot] Live project catalog unavailable; using fallback catalog:', error);
    return projectsData;
  }
}

export async function POST(req: Request) {
  try {
    if (isRateLimited(getClientKey(req))) {
      return NextResponse.json(
        { reply: 'You have sent several messages quickly. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { messages = [], userMessage = '' } = body || {};

    if (!Array.isArray(messages) || typeof userMessage !== 'string') {
      return NextResponse.json({ reply: 'Please send your question as text.' }, { status: 400 });
    }

    const latestText = (userMessage || (messages[messages.length - 1]?.content ?? '')).trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!latestText) {
      return NextResponse.json({ reply: 'Please type a question about our projects.' }, { status: 400 });
    }
    const lower = latestText.toLowerCase();
    const conversationHistory = messages
      .slice(-MAX_HISTORY_ITEMS)
      .filter((message: any) =>
        message &&
        (message.role === 'user' || message.role === 'assistant') &&
        typeof message.content === 'string'
      )
      .map((message: any) => ({
        role: message.role === 'assistant' ? 'model' : 'user',
        text: message.content.slice(0, MAX_MESSAGE_LENGTH),
      }));

    // The client includes the latest user message in `messages`; avoid sending it twice.
    if (conversationHistory.at(-1)?.role === 'user' && conversationHistory.at(-1)?.text === latestText) {
      conversationHistory.pop();
    }

    // 1. Instant Natural Greetings (Instant reply in <5ms)
    const cleanGreeting = lower.replace(/[!?.,]/g, '').trim();
    const commonGreetings = [
      'hi', 'hello', 'hey', 'hii', 'hiii', 'helo', 'hello there', 'hi there',
      'good morning', 'good afternoon', 'good evening', 'namaste', 'vanakkam'
    ];

    if (commonGreetings.includes(cleanGreeting)) {
      return NextResponse.json({
        reply: `Hello! 👋 Welcome to **KPN Promoters**.\n\nI am your AI Real Estate Assistant. How can I help you today? You can ask me to **open pages**, search **apartments or plots by budget**, **calculate loan EMI**, **download brochures**, or **book a free site visit**!`,
        quickChips: [
          { label: '💰 Check Loan EMI', query: 'What is the EMI for 25 Lakhs loan?' },
          { label: '📄 Download Brochures', query: 'download brochure for Monica Residency' },
          { label: '📍 Near Kilambakkam', query: 'Which projects are near Kilambakkam Bus Terminus?' },
          { label: '🏢 Homes Under 35L', query: 'Show me apartments under 35 Lakhs' },
          { label: '🏡 Approved Plots (< 15L)', query: 'What approved plots are available under 15 Lakhs?' },
        ],
      });
    }

    // 2. Direct High-Precision Intercept for Cab / Taxi inquiries
    if (
      lower.includes('cab') ||
      lower.includes('taxi') ||
      lower.includes('pickup') ||
      lower.includes('drop') ||
      lower.includes('transport') ||
      lower.includes('car facility')
    ) {
      const local = generateLocalBotResponse(latestText);
      return NextResponse.json({
        ...local,
        quickChips: [
          { label: '📅 Book Guided Site Visit', query: 'I want to book a free site visit' },
          { label: '🏢 View Office Location', query: 'open contact page' },
          { label: '📞 Call Advisor', query: 'open contact page' },
        ],
      });
    }

    // 3. Navigation Intent Resolver (Instant execution: "open projects page", "go to contact page", etc.)
    const navMatch = resolveNavigationIntent(latestText);
    if (navMatch.matched) {
      return NextResponse.json({
        reply: navMatch.reply,
        action: navMatch.action,
        quickChips: navMatch.quickChips,
      });
    }

    // Contact intent must be handled before the generic knowledge fallback.
    // Phrases such as "how can I connect" are high-value sales questions,
    // not property searches.
    const isContactQuery =
      /\b(connect|contact|reach|call|speak|talk|phone|whatsapp|advisor|agent|office)\b/.test(lower) &&
      !/\b(connectivity|connected road|road connection)\b/.test(lower);

    if (isContactQuery) {
      return NextResponse.json({
        reply:
          'You can connect with our KPN property advisor in any of these ways:\n\n' +
          '• **Call**: +91 8925924128\n' +
          '• **WhatsApp**: +91 8925924128\n' +
          '• **Alternate number**: +91 7338834233\n' +
          '• **Office**: No. 48, Karanai Puducherry Road, Urapakkam, Chennai - 603210\n\n' +
          'You can also request a free guided site visit, and our team will contact you shortly.',
        action: {
          type: 'NAVIGATE',
          url: '/contact-us',
          pageTitle: 'Contact KPN Promoters',
          description: 'Speak with our property advisory team or request a site visit.',
        },
        quickChips: [
          { label: '📅 Book Site Visit', query: 'I want to book a free site visit' },
          { label: '📄 Get Brochure', query: 'download brochure' },
        ],
      });
    }

    // 4. Brochure Downloader Intent Resolver ("download brochure", "monica residency brochure", etc.)
    const brochureMatch = resolveBrochureIntent(latestText);
    if (brochureMatch.isBrochureQuery) {
      return NextResponse.json({
        reply: brochureMatch.reply,
        action: brochureMatch.action,
        quickChips: brochureMatch.quickChips,
        showLeadForm: brochureMatch.showLeadForm,
      });
    }

    // 5. In-Chat Loan & EMI Calculator ("What is the EMI for 25 Lakhs", etc.)
    const emiMatch = resolveEmiIntent(latestText);
    if (emiMatch.isEmiQuery) {
      return NextResponse.json({
        reply: emiMatch.reply,
        action: emiMatch.action,
        quickChips: emiMatch.quickChips,
        showLeadForm: emiMatch.showLeadForm,
      });
    }

    // 6. Landmark & Transit Proximity Search ("near Kilambakkam", "near Guduvanchery station", etc.)
    const landmarkMatch = resolveLandmarkIntent(latestText);
    if (landmarkMatch.isLandmarkQuery) {
      return NextResponse.json({
        reply: landmarkMatch.reply,
        action: landmarkMatch.action,
        quickChips: landmarkMatch.quickChips,
        showLeadForm: landmarkMatch.showLeadForm,
      });
    }

    // 7. Intelligent Property Query & Budget Filter Engine
    // Handles queries like: "show under 12 L apartments", "apartments under 35l", "plots under 2000/sqft"
    const liveCatalog = await getPublishedCatalog();

    // Availability questions need a count, not a catalogue dump.
    const asksAvailability =
      /\b(how many|how much|available|availability|vacant|remaining|left)\b/.test(lower) &&
      /\b(plot|plots|land|apartment|apartments|flat|flats|villa|villas|unit|units|project|projects)\b/.test(lower);

    if (asksAvailability) {
      const requestedType = /\b(plot|plots|land)\b/.test(lower)
        ? 'Plots'
        : /\b(villa|villas)\b/.test(lower)
          ? 'Villas'
          : /\b(apartment|apartments|flat|flats)\b/.test(lower)
            ? 'Apartments'
            : undefined;

      const typedProjects = liveCatalog.filter((project) => !requestedType || project.type === requestedType);
      const matchedProject = typedProjects.find((project) => {
        const projectName = project.name.toLowerCase();
        const projectSlug = project.slug.toLowerCase().replace(/-/g, ' ');
        return lower.includes(projectName) || lower.includes(projectSlug);
      });
      const projects = matchedProject ? [matchedProject] : typedProjects;
      const availableUnits = projects.reduce((total, project) => {
        if (typeof project.availableUnits === 'number') return total + project.availableUnits;
        if (Array.isArray(project.plots)) {
          return total + project.plots.filter((plot: any) => !plot.status || plot.status === 'available').length;
        }
        return total;
      }, 0);

      const label = requestedType ? requestedType.toLowerCase() : 'properties';
      const availabilityLabel = matchedProject ? `in **${matchedProject.name}**` : `across **${projects.length} published projects**`;
      return NextResponse.json({
        reply:
          availableUnits > 0
            ? `We currently have approximately **${availableUnits} available ${label} units** ${availabilityLabel}. Availability can change quickly, so please contact our advisor to confirm a specific unit or plot number.`
            : `I couldn't confirm live availability for ${label} right now. Please contact our advisor and we will check the latest inventory for you.`,
        action: {
          type: 'NAVIGATE',
          url: '/contact-us',
          pageTitle: 'Confirm Live Availability',
          description: 'Our advisor can confirm the latest available units and plot numbers.',
        },
        recommendedProjects: projects.slice(0, 3),
        showLeadForm: availableUnits === 0,
        quickChips: [
          { label: '📅 Book Site Visit', query: 'I want to book a free site visit' },
          { label: '📞 Speak with Advisor', query: 'how can I connect with you' },
        ],
      });
    }

    const propQuery = executePropertyQuery(latestText, liveCatalog);
    if (propQuery.isQuery) {
      return NextResponse.json({
        reply: propQuery.reply,
        action: propQuery.action,
        recommendedProjects: propQuery.matchedProjects,
        showLeadForm: propQuery.showLeadForm,
        quickChips: propQuery.quickChips,
      });
    }

    // 5. If Gemini API Key is configured, call Google Gemini with system_instruction
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (apiKey && apiKey.trim() !== '') {
      try {
        const payload = {
          system_instruction: {
            parts: [{ text: KPN_SYSTEM_PROMPT }],
          },
          contents: [
            ...conversationHistory.map((message) => ({
              role: message.role,
              parts: [{ text: message.text }],
            })),
            {
              role: 'user',
              parts: [{ text: latestText }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 600,
          },
        };

        const models = ['gemini-3.1-flash-lite', 'gemini-3-flash-preview'];
        let geminiReply = '';

        for (const model of models) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3500);

            const res = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal,
              }
            );

            clearTimeout(timeoutId);

            if (res.ok) {
              const data = await res.json();
              const parts = data.candidates?.[0]?.content?.parts || [];
              let text = parts.map((p: any) => p.text || '').join('\n').trim();

              if (text) {
                text = text
                  .replace(/^Draft Content\*{0,3}:\s*/gim, '')
                  .replace(/^\*{0,3}Draft:\*{0,3}\s*/gim, '')
                  .replace(/^Response:\s*/gim, '')
                  .trim();

                geminiReply = text;
                break;
              }
            } else {
              const errBody = await res.text();
              console.error(`[Chatbot] Gemini model ${model} HTTP ${res.status}:`, errBody);
              if (res.status === 429 || res.status === 403 || res.status === 401) {
                break;
              }
            }
          } catch (err) {
            console.warn(`[Chatbot] Model ${model} request failed or timed out:`, err);
          }
        }

        if (geminiReply) {
          let recs: typeof projectsData = [];
          if (lower.includes('apartment') || lower.includes('flat') || lower.includes('bhk')) {
            recs = projectsData.filter((p) => p.type === 'Apartments').slice(0, 3);
          } else if (lower.includes('plot') || lower.includes('land')) {
            recs = projectsData.filter((p) => p.type === 'Plots').slice(0, 3);
          }

          return NextResponse.json({
            reply: geminiReply,
            recommendedProjects: recs.length > 0 ? recs : undefined,
            showLeadForm: lower.includes('price') || lower.includes('book') || lower.includes('visit') || lower.includes('contact'),
            quickChips: [
              { label: '🏢 View All Projects', query: 'open projects page' },
              { label: '📅 Book Free Site Visit', query: 'I want to book a free site visit' },
              { label: '📞 Talk to Advisor', query: 'open contact page' },
            ],
          });
        }
      } catch (geminiError) {
        console.warn('[Chatbot] Gemini API error, using smart fallback:', geminiError);
      }
    }

    // 6. High-speed smart knowledge engine fallback (Zero API cost)
    const localResult = generateLocalBotResponse(latestText);
    return NextResponse.json({
      ...localResult,
      quickChips: [
        { label: '🏢 View All Projects', query: 'open projects page' },
        { label: '🏡 Explore Plots', query: 'What DTCP and RERA approved plots do you have available?' },
        { label: '📅 Book Site Visit', query: 'I want to book a free site visit' },
        { label: '📞 Contact Us', query: 'open contact page' },
      ],
    });
  } catch (error) {
    console.error('[Chatbot API Error]:', error);
    return NextResponse.json(
      {
        reply: 'Thank you for reaching out to KPN Promoters! Our customer advisor is ready to assist you. You can connect with us directly on WhatsApp at **+91 8925924128** or call us anytime.',
      },
      { status: 200 }
    );
  }
}
