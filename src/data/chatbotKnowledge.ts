import { ProjectItem, projectsData } from './siteData';
import { BotAction, QuickChip } from '@/lib/chatbot/types';
import { LiveBlogItem, LiveCmsInfo } from '@/lib/chatbot/liveKnowledgeService';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  recommendedProjects?: ProjectItem[];
  recommendedBlogs?: LiveBlogItem[];
  showLeadForm?: boolean;
  action?: BotAction;
  quickChips?: QuickChip[];
}

/**
 * Intelligent keyword-based dynamic response generator
 * Used as high-speed instant response or offline fallback when API key is not present.
 * 100% dynamic: queries live catalog and live CMS info.
 */
export function generateLocalBotResponse(
  userMessage: string,
  catalog: ProjectItem[] = projectsData,
  blogs: LiveBlogItem[] = [],
  cms?: Partial<LiveCmsInfo>
): {
  reply: string;
  recommendedProjects?: ProjectItem[];
  recommendedBlogs?: LiveBlogItem[];
  showLeadForm?: boolean;
} {
  const q = userMessage.toLowerCase().trim();
  const cleanQ = q.replace(/[!?.,]/g, '').trim();

  const phone = cms?.phonePrimary || '+91 8925924128';
  const whatsapp = cms?.whatsapp || '+91 8925924128';
  const address = cms?.address || 'No. 48, Karanai Puducherry Road, Urapakkam, Chennai - 603210';

  // Greetings handler
  const greetings = ['hi', 'hello', 'hey', 'hii', 'hiii', 'helo', 'namaste', 'vanakkam', 'good morning', 'good afternoon', 'good evening'];
  if (greetings.includes(cleanQ)) {
    return {
      reply: `Hello! 👋 Welcome to **KPN Promoters**.\n\nHow can I help you today? Are you looking for **apartments**, **approved plots**, or would you like to **schedule a site visit**?`,
    };
  }

  // Cab / Transportation inquiry
  if (
    q.includes('cab') ||
    q.includes('taxi') ||
    q.includes('pickup') ||
    q.includes('drop') ||
    q.includes('transport') ||
    q.includes('car facility')
  ) {
    return {
      reply: `We do not provide cab pickup or drop facilities, but we warmly invite you for a **free guided site visit**!\n\n` +
        `Our property experts will guide you through all floor plans, plot layouts, and legal documents in person.\n\n` +
        `🏢 **Head Office**: ${address}.\n` +
        `📞 **Call/WhatsApp**: **${phone}**\n\n` +
        `Would you like to schedule a time to meet our advisor?`,
      showLeadForm: true,
    };
  }

  // 1. Plots / Land inquiry
  if (
    q.includes('plot') ||
    q.includes('land') ||
    q.includes('layout') ||
    q.includes('township') ||
    q.includes('sq.ft') ||
    q.includes('sqft')
  ) {
    const plots = catalog.filter((p) => p.type === 'Plots');
    let reply = `KPN Promoters offers **100% DTCP & RERA Approved Plots** in high-growth investment hubs across Chennai:\n\n`;

    if (plots.length > 0) {
      plots.slice(0, 5).forEach((p) => {
        reply += `• **${p.name}** (${p.location}) — Starting at **${p.budget}**\n`;
      });
      reply += `\nAll our layouts feature blacktop roads, potable water, clear legal documentation, and ready-to-construct approvals.`;
    } else {
      reply += `Please connect with our advisory team at **${phone}** for the latest upcoming plot launches.`;
    }

    return {
      reply,
      recommendedProjects: plots.slice(0, 3),
      showLeadForm: true,
    };
  }

  // 2. Budget Apartments query
  if (
    q.includes('budget') ||
    q.includes('cheap') ||
    q.includes('apartment') ||
    q.includes('flat') ||
    q.includes('bhk')
  ) {
    const apartments = catalog.filter((p) => p.type === 'Apartments');
    let reply = `We have excellent modern apartments along the **GST Road corridor** in Chennai with clear titles and bank loan approvals:\n\n`;

    if (apartments.length > 0) {
      apartments.slice(0, 5).forEach((p) => {
        reply += `• **${p.name}** — ${p.bhk || '1 & 2 BHK'} (${p.budget})\n`;
      });
      reply += `\nWould you like to book a **free site visit** or explore floor plans for any of these?`;
    } else {
      reply += `Please contact our advisor at **${phone}** to check new upcoming apartment projects.`;
    }

    return {
      reply,
      recommendedProjects: apartments.slice(0, 3),
      showLeadForm: true,
    };
  }

  // 3. Site visit booking / Contact
  if (
    q.includes('site visit') ||
    q.includes('visit') ||
    q.includes('book') ||
    q.includes('contact') ||
    q.includes('phone') ||
    q.includes('call') ||
    q.includes('whatsapp')
  ) {
    return {
      reply: `We would be delighted to organize a **complimentary guided site visit** for you and your family!\n\n` +
        `📞 **Call/WhatsApp**: **${phone}**\n` +
        `🏢 **Head Office**: ${address}\n\n` +
        `Please drop your phone number below, and our property manager will reach out to confirm your slot!`,
      showLeadForm: true,
    };
  }

  // 4. Location / Urapakkam / Kilambakkam / Connectivity
  if (
    q.includes('location') ||
    q.includes('urapakkam') ||
    q.includes('guduvanchery') ||
    q.includes('kilambakkam') ||
    q.includes('gst road') ||
    q.includes('chengalpattu')
  ) {
    return {
      reply: `Our projects are strategically located along the booming **GST Road Corridor** in South Chennai:\n\n` +
        `• **5 to 10 mins** to the new **Kilambakkam KCBT Bus Terminus**\n` +
        `• Close to **Urapakkam & Guduvanchery Railway Stations**\n` +
        `• Direct access to Mahindra World City, MEPZ, and IT Parks\n` +
        `• Surrounded by premier institutions like SRM University, Crescent University, and top CBSE schools.\n\n` +
        `Are you interested in apartments or plots?`,
      recommendedProjects: catalog.slice(0, 2),
    };
  }

  // 5. NRI Services & Joint Development
  if (q.includes('nri') || q.includes('joint development') || q.includes('partner')) {
    return {
      reply: `KPN Promoters provides dedicated **NRI Real Estate Advisory** and **Joint Development** solutions:\n\n` +
        `• **NRI Services**: Hassle-free legal verification, property management, rental yield optimization, and remote power of attorney advisory.\n` +
        `• **Joint Development**: Maximum land valuation, transparent sharing ratio, and fast construction delivery for landowners.\n\n` +
        `Feel free to share your contact details or WhatsApp us directly at **${whatsapp}** for confidential advisory.`,
      showLeadForm: true,
    };
  }

  // 6. Tamil / Tanglish greetings
  if (q.includes('vanakkam') || q.includes('eppadi') || q.includes('vilai') || q.includes('engu')) {
    return {
      reply: `வணக்கம்! KPN Promoters-க்கு உங்களை வரவேற்கிறோம்.\n\n` +
        `உரப்பாக்கம் மற்றும் கூடுவாஞ்சேரி பகுதிகளில் சிறந்த வீடுகள் மற்றும் **DTCP அப்ரூவ்ட் வீட்டு மனைகள்** உள்ளன.\n\n` +
        `உங்களுக்கு வீடுகள் பற்றிய விவரங்கள் வேண்டுமா அல்லது மனைகள் பற்றிய விவரங்கள் வேண்டுமா? இலவசமாக நேரில் வந்து பார்க்க உங்கள் ஃபோன் நம்பரை பகிருங்கள்!`,
      showLeadForm: true,
    };
  }

  // General default fallback
  return {
    reply: `Hello! I am your **KPN Real Estate Assistant** 🏢.\n\n` +
      `How can I assist you with your property search today?\n\n` +
      `• **Active Projects**: Apartments and DTCP/RERA approved plots\n` +
      `• **Site Visits**: Free guided property visit with our advisor\n` +
      `• **Loan Assistance**: Up to 80-90% home loans from SBI, HDFC, LIC & Axis Bank.\n\n` +
      `You can ask me any question or choose a quick option below!`,
    recommendedProjects: catalog.slice(0, 3),
    recommendedBlogs: blogs.slice(0, 2),
  };
}

