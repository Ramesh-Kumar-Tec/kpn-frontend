import { NextResponse } from 'next/server';
import { generateLocalBotResponse } from '@/data/chatbotKnowledge';
import { ProjectItem } from '@/data/siteData';
import { resolveNavigationIntent } from '@/lib/chatbot/navigationResolver';
import { executePropertyQuery } from '@/lib/chatbot/propertyQueryEngine';
import { executeBlogQuery } from '@/lib/chatbot/blogQueryEngine';
import { resolveEmiIntent } from '@/lib/chatbot/emiCalculator';
import { resolveBrochureIntent } from '@/lib/chatbot/brochureResolver';
import { resolveLandmarkIntent } from '@/lib/chatbot/landmarkResolver';
import { getLiveKnowledge, buildDynamicSystemPrompt } from '@/lib/chatbot/liveKnowledgeService';

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_ITEMS = 12;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const requestLog = new Map<string, { startedAt: number; count: number }>();

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

/**
 * Detects if a user is asking about a specific named project (e.g. "kpn lenid", "monica residency", etc.)
 */
function detectSpecificProjectQuery(userMessage: string, catalog: ProjectItem[]) {
  const clean = userMessage
    .toLowerCase()
    .replace(/[!?.,:;'"()]/g, ' ')
    .trim();

  // 1. Check if matches any active project in live catalog
  for (const p of catalog) {
    const pName = p.name.toLowerCase();
    const pSlug = p.slug.toLowerCase().replace(/-/g, ' ');
    if (clean.includes(pName) || clean.includes(pSlug)) {
      return { isSpecificProject: true, isFound: true, project: p, requestedName: p.name };
    }
    const words = pName.split(/\s+/).filter((w) => w.length > 3 && !['kpn', 'promoters', 'residency', 'township', 'nagar', 'enclave', 'avenue', 'skyline', 'gardens'].includes(w));
    if (words.some((w) => clean.split(/\s+/).includes(w))) {
      return { isSpecificProject: true, isFound: true, project: p, requestedName: p.name };
    }
  }

  // 2. Check if user asked about a specific project pattern that is NOT in active catalog (e.g. "kpn lenid", "lenid", etc.)
  const kpnNamedMatch = clean.match(/\bkpn\s+([a-z0-9]+)\b/);
  if (kpnNamedMatch && !['promoters', 'project', 'projects', 'apartment', 'apartments', 'flat', 'flats', 'plot', 'plots', 'villa', 'villas', 'office', 'assistant'].includes(kpnNamedMatch[1])) {
    const requestedName = `KPN ${kpnNamedMatch[1].charAt(0).toUpperCase() + kpnNamedMatch[1].slice(1)}`;
    return { isSpecificProject: true, isFound: false, requestedName };
  }

  const singleNameMatch = clean.match(/\b(lenid|monika|serenity|vijayalakshmi|omega|kanagam|thulir|bhavai|ranga)\b/);
  if (singleNameMatch) {
    const requestedName = singleNameMatch[1].charAt(0).toUpperCase() + singleNameMatch[1].slice(1);
    return { isSpecificProject: true, isFound: false, requestedName };
  }

  return { isSpecificProject: false, isFound: false };
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

    // 1. Fetch live knowledge from backend (Projects, Blogs, CMS)
    const { catalog: liveCatalog, blogs: liveBlogs, cms: liveCms } = await getLiveKnowledge();

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

    if (conversationHistory.at(-1)?.role === 'user' && conversationHistory.at(-1)?.text === latestText) {
      conversationHistory.pop();
    }

    // 2. Instant Natural Greetings
    const cleanGreeting = lower.replace(/[!?.,]/g, '').trim();
    const commonGreetings = [
      'hi', 'hello', 'hey', 'hii', 'hiii', 'helo', 'hello there', 'hi there',
      'good morning', 'good afternoon', 'good evening', 'namaste', 'vanakkam'
    ];

    if (commonGreetings.includes(cleanGreeting)) {
      return NextResponse.json({
        reply: `Hello! 👋 Welcome to **KPN Promoters**.\n\nI am your AI Real Estate Assistant. How can I help you today? You can ask me to **search active apartments or plots by budget**, **calculate loan EMI**, **check live unit availability**, **download brochures**, or **book a free site visit**!`,
        quickChips: [
          { label: '🏡 Available Plots', query: 'overall plots how many units available' },
          { label: '🏢 Available Apartments', query: 'how many units available in apartments' },
          { label: '💰 Check Loan EMI', query: 'What is the EMI for 25 Lakhs loan?' },
          { label: '📰 Investment Guides', query: 'show me your latest articles and guides' },
          { label: '📄 Download Brochures', query: 'download brochure' },
        ],
      });
    }

    // 3. Direct High-Precision Intercept for Cab / Taxi inquiries
    if (
      lower.includes('cab') ||
      lower.includes('taxi') ||
      lower.includes('pickup') ||
      lower.includes('drop') ||
      lower.includes('transport') ||
      lower.includes('car facility')
    ) {
      const local = generateLocalBotResponse(latestText, liveCatalog, liveBlogs, liveCms);
      return NextResponse.json({
        ...local,
        quickChips: [
          { label: '📅 Book Guided Site Visit', query: 'I want to book a free site visit' },
          { label: '🏢 View Office Location', query: 'open contact page' },
          { label: '📞 Call Advisor', query: 'open contact page' },
        ],
      });
    }

    // 4. Specific Named Project Intent & Availability Check (e.g. "kpn lenid available?", "is monica residency available?")
    const specificProject = detectSpecificProjectQuery(latestText, liveCatalog);
    if (specificProject.isSpecificProject) {
      if (specificProject.isFound && specificProject.project) {
        const p = specificProject.project;
        let countStr = '';
        if (typeof p.availableUnits === 'number') {
          countStr = p.type === 'Plots' ? `**${p.availableUnits} plots available**` : `**${p.availableUnits} units available**`;
        } else if (Array.isArray(p.plots)) {
          const avail = p.plots.filter((plot: any) => !plot.status || plot.status === 'available').length;
          countStr = `**${avail} plots available**`;
        } else {
          countStr = `**Available** (${p.status})`;
        }

        return NextResponse.json({
          reply:
            `Yes! **${p.name}** in ${p.location} is **active and available**:\n\n` +
            `• **Property Type**: ${p.bhk || p.type}\n` +
            `• **Starting Price**: ${p.budget}\n` +
            `• **Availability**: ${countStr}\n` +
            `• **Status**: ${p.status}\n\n` +
            `Would you like to explore floor plans or schedule a **free guided site visit**?`,
          action: {
            type: 'NAVIGATE',
            url: `/projects/${p.slug}`,
            pageTitle: p.name,
            description: `${p.type} in ${p.location} • ${p.budget}`,
          },
          recommendedProjects: [p],
          showLeadForm: true,
          quickChips: [
            { label: '📅 Book Free Site Visit', query: `I want to visit ${p.name}` },
            { label: '📄 Get Brochure', query: `download brochure for ${p.name}` },
            { label: '💰 Check Loan EMI', query: 'What is the EMI for 25 Lakhs loan?' },
          ],
        });
      } else {
        // Project was deleted / deactivated from live database
        const requested = specificProject.requestedName || 'The requested project';
        const requestedType = lower.includes('plot') || lower.includes('land') ? 'Plots' : 'Apartments';
        const activeAlts = liveCatalog.filter((p) => p.type === requestedType);

        let reply = `❌ **${requested} is currently not available** in our active database (it is no longer listed in our active catalog or has been completed/sold out).\n\n`;

        if (activeAlts.length > 0) {
          reply += `🏢 **Here are our verified available ${requestedType} in Chennai:**\n\n`;
          activeAlts.slice(0, 5).forEach((p) => {
            reply += `• **${p.name}** (${p.location}) — ${p.budget} (${p.status})\n`;
          });
          reply += `\nWould you like to explore any of these active projects or schedule a **free site visit**?`;
        } else {
          reply += `Please contact our property advisor at **${liveCms.phonePrimary}** to check new upcoming launches.`;
        }

        return NextResponse.json({
          reply,
          action: {
            type: 'NOT_FOUND_SUGGEST',
          },
          recommendedProjects: activeAlts.slice(0, 3),
          showLeadForm: true,
          quickChips: [
            { label: '🏢 View Active Projects', query: 'open projects page' },
            { label: '📞 Speak with Advisor', query: 'how can I connect with you' },
            { label: '📅 Book Site Visit', query: 'I want to book a free site visit' },
          ],
        });
      }
    }

    // 5. Navigation Intent Resolver ("open projects page", "go to contact page", etc.)
    const navMatch = resolveNavigationIntent(latestText, liveCatalog);
    if (navMatch.matched) {
      return NextResponse.json({
        reply: navMatch.reply,
        action: navMatch.action,
        quickChips: navMatch.quickChips,
      });
    }

    // 6. Contact Intent Resolver
    const isContactQuery =
      /\b(connect|contact|reach|call|speak|talk|phone|whatsapp|advisor|agent|office)\b/.test(lower) &&
      !/\b(connectivity|connected road|road connection)\b/.test(lower);

    if (isContactQuery) {
      return NextResponse.json({
        reply:
          'You can connect with our KPN property advisor in any of these ways:\n\n' +
          `• **Call**: ${liveCms.phonePrimary}\n` +
          `• **WhatsApp**: ${liveCms.whatsapp}\n` +
          `• **Alternate number**: ${liveCms.phoneSecondary}\n` +
          `• **Office**: ${liveCms.address}\n\n` +
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

    // 7. General Live Unit Inventory & Availability Queries (e.g. "how many units available in plots", "overall plots how many units available")
    const asksAvailability =
      /\b(how many|how much|available|availability|vacant|remaining|left|stock|count|total|overall)\b/.test(lower) &&
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

      const totalUnits = projects.reduce((total, project) => {
        if (typeof project.availableUnits === 'number') return total + project.availableUnits;
        if (Array.isArray(project.plots)) {
          return total + project.plots.filter((plot: any) => !plot.status || plot.status === 'available').length;
        }
        return total;
      }, 0);

      const isPlotType = requestedType === 'Plots';
      const isAptType = requestedType === 'Apartments';
      const itemLabel = isPlotType ? 'plots' : isAptType ? 'apartments' : 'units';
      let reply = '';

      if (projects.length > 0) {
        if (matchedProject) {
          const pAvail = typeof matchedProject.availableUnits === 'number'
            ? matchedProject.availableUnits
            : Array.isArray(matchedProject.plots)
              ? matchedProject.plots.filter((plot: any) => !plot.status || plot.status === 'available').length
              : 0;

          reply = `In **${matchedProject.name}** (${matchedProject.location}), there are currently **${pAvail} ${itemLabel} available** in our live inventory.\n\n` +
            `• **Property Type**: ${matchedProject.type}\n` +
            `• **Price / Rate**: ${matchedProject.budget}\n` +
            `• **Status**: ${matchedProject.status}\n\n` +
            `Would you like to reserve a plot/unit or schedule a **free guided site visit**?`;
        } else {
          reply = `Overall, we currently have **${totalUnits > 0 ? `${totalUnits} ` : ''}available ${itemLabel}** across **${projects.length} active ${requestedType || 'properties'}** in our live database:\n\n`;
          projects.slice(0, 6).forEach((p) => {
            let countStr = '';
            if (typeof p.availableUnits === 'number') {
              countStr = isPlotType ? `**${p.availableUnits} plots available**` : `**${p.availableUnits} units available**`;
            } else if (Array.isArray(p.plots)) {
              const avail = p.plots.filter((plot: any) => !plot.status || plot.status === 'available').length;
              countStr = `**${avail} plots available**`;
            } else {
              countStr = `**Available** (${p.status})`;
            }
            reply += `• **${p.name}** (${p.location}) — ${countStr} • ${p.budget}\n`;
          });
          reply += `\nWould you like to explore layout maps or schedule a **free guided site visit** for any of these?`;
        }
      } else {
        reply = `We currently don't have active ${itemLabel} in this category in our database. Please contact our advisor at **${liveCms.phonePrimary}** to check new upcoming launches!`;
      }

      return NextResponse.json({
        reply,
        action: {
          type: 'NAVIGATE',
          url: '/projects',
          pageTitle: 'View Live Inventory',
          description: 'Browse all available units and layouts.',
        },
        recommendedProjects: projects.slice(0, 3),
        showLeadForm: true,
        quickChips: [
          { label: '📅 Book Site Visit', query: 'I want to book a free site visit' },
          { label: '📞 Speak with Advisor', query: 'how can I connect with you' },
          { label: '💰 Check Loan EMI', query: 'What is the EMI for 25 Lakhs loan?' },
        ],
      });
    }

    // 8. Intelligent Property Search & Budget Filter Engine
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

    // 9. Brochure Downloader Intent Resolver
    const brochureMatch = resolveBrochureIntent(latestText, liveCatalog);
    if (brochureMatch.isBrochureQuery) {
      return NextResponse.json({
        reply: brochureMatch.reply,
        action: brochureMatch.action,
        quickChips: brochureMatch.quickChips,
        showLeadForm: brochureMatch.showLeadForm,
      });
    }

    // 10. In-Chat Loan & EMI Calculator
    const emiMatch = resolveEmiIntent(latestText);
    if (emiMatch.isEmiQuery) {
      return NextResponse.json({
        reply: emiMatch.reply,
        action: emiMatch.action,
        quickChips: emiMatch.quickChips,
        showLeadForm: emiMatch.showLeadForm,
      });
    }

    // 11. Landmark & Transit Proximity Search
    const landmarkMatch = resolveLandmarkIntent(latestText, liveCatalog);
    if (landmarkMatch.isLandmarkQuery) {
      return NextResponse.json({
        reply: landmarkMatch.reply,
        action: landmarkMatch.action,
        quickChips: landmarkMatch.quickChips,
        showLeadForm: landmarkMatch.showLeadForm,
      });
    }

    // 12. Live Blogs & Editorial Guides Resolver (Explicit Blog Queries Only)
    const blogMatch = executeBlogQuery(latestText, liveBlogs);
    if (blogMatch.isBlogQuery) {
      return NextResponse.json({
        reply: blogMatch.reply,
        action: blogMatch.action,
        recommendedBlogs: blogMatch.matchedBlogs,
        quickChips: blogMatch.quickChips,
      });
    }

    // 13. Google Gemini AI with Live Dynamic System Prompt (Live RAG)
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (apiKey && apiKey.trim() !== '') {
      try {
        const dynamicSystemPrompt = buildDynamicSystemPrompt(liveCatalog, liveBlogs, liveCms);
        const payload = {
          system_instruction: {
            parts: [{ text: dynamicSystemPrompt }],
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
          let recs: ProjectItem[] = [];
          if (lower.includes('apartment') || lower.includes('flat') || lower.includes('bhk')) {
            recs = liveCatalog.filter((p) => p.type === 'Apartments').slice(0, 3);
          } else if (lower.includes('plot') || lower.includes('land')) {
            recs = liveCatalog.filter((p) => p.type === 'Plots').slice(0, 3);
          }

          let matchedBlogCards: typeof liveBlogs = [];
          if (lower.includes('blog') || lower.includes('article') || lower.includes('guide') || lower.includes('dtcp') || lower.includes('invest')) {
            matchedBlogCards = liveBlogs.slice(0, 2);
          }

          return NextResponse.json({
            reply: geminiReply,
            recommendedProjects: recs.length > 0 ? recs : undefined,
            recommendedBlogs: matchedBlogCards.length > 0 ? matchedBlogCards : undefined,
            showLeadForm: lower.includes('price') || lower.includes('book') || lower.includes('visit') || lower.includes('contact'),
            quickChips: [
              { label: '🏢 View All Projects', query: 'open projects page' },
              { label: '📰 View Real Estate Guides', query: 'show me your latest articles and guides' },
              { label: '📅 Book Free Site Visit', query: 'I want to book a free site visit' },
              { label: '📞 Talk to Advisor', query: 'open contact page' },
            ],
          });
        }
      } catch (geminiError) {
        console.warn('[Chatbot] Gemini API error, using dynamic fallback:', geminiError);
      }
    }

    // 14. Dynamic Knowledge Engine Fallback (Zero API Cost, 100% live database driven)
    const localResult = generateLocalBotResponse(latestText, liveCatalog, liveBlogs, liveCms);
    return NextResponse.json({
      ...localResult,
      quickChips: [
        { label: '🏢 View All Projects', query: 'open projects page' },
        { label: '📰 Real Estate Guides', query: 'show me your latest articles and guides' },
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
