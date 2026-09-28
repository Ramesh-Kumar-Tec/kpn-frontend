import { NextResponse } from 'next/server';
import { KPN_SYSTEM_PROMPT, generateLocalBotResponse } from '@/data/chatbotKnowledge';
import { projectsData } from '@/data/siteData';
import { resolveNavigationIntent } from '@/lib/chatbot/navigationResolver';
import { executePropertyQuery } from '@/lib/chatbot/propertyQueryEngine';
import { resolveEmiIntent } from '@/lib/chatbot/emiCalculator';
import { resolveBrochureIntent } from '@/lib/chatbot/brochureResolver';
import { resolveLandmarkIntent } from '@/lib/chatbot/landmarkResolver';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages = [], userMessage = '' } = body;

    const latestText = (userMessage || (messages[messages.length - 1]?.content ?? '')).trim();
    const lower = latestText.toLowerCase();

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
    const propQuery = executePropertyQuery(latestText);
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
