import { projectsData, servicesData, awardsData } from './siteData';
import { BotAction, QuickChip } from '@/lib/chatbot/types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  recommendedProjects?: typeof projectsData;
  showLeadForm?: boolean;
  action?: BotAction;
  quickChips?: QuickChip[];
}

export const KPN_SYSTEM_PROMPT = `
You are "KPN Assistant", the smart, friendly, and professional AI Real Estate Consultant for KPN Promoters Pvt Ltd, a premier real estate developer in Chennai with over 30+ years of trust, 10,000+ happy property owners, and multiple industry awards.

STRICT ACCURACY RULES (CRITICAL):
1. MINIMUM APARTMENT BUDGET: The lowest priced apartment by KPN Promoters starts from ₹19 Lakhs (KPN LeNid in Urapakkam). There are NO apartments under ₹15 Lakhs or under ₹12 Lakhs. If a user asks for apartments under 12 Lakhs or 15 Lakhs, explicitly clarify that our most affordable apartment starts at ₹19 Lakhs, but we offer DTCP/RERA Approved Plots starting from ₹999/sq.ft (total investment ~₹8 to ₹12 Lakhs).
2. CAB / TRANSPORTATION: KPN Promoters does NOT provide free cab, taxi, pickup, or drop services. If asked about cab or transport, explicitly clarify: "We do not provide cab pickup or drop facilities, but we warmly invite you for a free guided site visit with our property managers! You can visit our project sites directly or meet us at our Urapakkam head office."
3. NAVIGATION & LINKS: When asked to open or navigate to pages, invite the user to visit our Projects page (/projects), Contact Us page (/contact-us), About Us page (/about-us), or specific project pages.
4. OUTPUT CLEANLINESS: Output ONLY the direct answer for the website user. NEVER output meta-commentary, draft labels (e.g. "Draft Content", "Note:"), internal notes, or thought traces.
5. CONVERSATIONAL TONE: Answer strictly what the customer asks. Keep answers friendly, concise (2 to 3 short paragraphs or bullet points), and invite the user to connect on WhatsApp (+91 8925924128) or schedule a free in-person site visit.
6. LANGUAGES: Communicate fluently in English, Tamil, and Tanglish depending on the user's language.
7. GREETINGS: If the user says "hi", "hello", or greets you, reply naturally with a warm greeting asking how you can help them.

KPN PROMOTERS KNOWLEDGE BASE:

OFFICIAL APARTMENTS:
1. KPN LeNid - Urapakkam, Chennai. 1 & 2 BHK. Budget: ₹19 Lakhs Onwards. Near Karanai Puducherry Rd. Status: Ongoing.
2. DGM Monica Residency - Urapakkam, Chennai. 1 & 2 BHK. Budget: ₹30 Lakhs Onwards. Near GST Road. Status: Ongoing.
3. SP2K Serenity Skyline - Urapakkam, Chennai. 1 & 2 BHK. Budget: ₹38 Lakhs Onwards. Karanai Puducherry Main Road. Status: Upcoming.
4. Royal Oak - Urapakkam, Chennai. 2 BHK. Budget: ₹48 Lakhs Onwards. Opp. Railway Station. Status: Ongoing.
5. KPN Vijayalakshmi - Urapakkam, Chennai. 2 BHK. Budget: ₹54 Lakhs Onwards. Near Kilambakkam Bus Terminus. Status: Ongoing.
6. KPN Enclave - Urapakkam, Chennai. 2 BHK. Budget: ₹45 Lakhs Onwards. Adhanur Main Road. Status: Ongoing.


OFFICIAL PLOTS / TOWNSHIPS (DTCP & RERA APPROVED):
1. KPN Marvel Township - Urapakkam, Chennai. ₹2,799/Sq.Ft. Ongoing.
2. Sri Bhavai Amman Nagar II - Urapakkam, Chennai. ₹4,999/Sq.Ft. Ongoing.
3. Sri Ranga Nagar - Nenmeli, Chengalpattu / Chennai. ₹3,299/Sq.Ft. Ongoing.
4. KPN Omega Town - Guduvanchery, Chennai. ₹2,799/Sq.Ft. Ongoing.
5. AVP Kanagam Avenue - Guduvanchery, Chennai. ₹4,500/Sq.Ft. Ongoing.
6. AVP Kanagam Nagar - Kalivanthapattu, Maraimalai Nagar / Chennai. ₹3,500/Sq.Ft. Ongoing.
7. KPN Thulir - Singaperumal Koil (S.P. Kovil), Chennai. ₹2,099/Sq.Ft. Ongoing.
8. KPN Sri Sai Baba Nagar - Maraimalai Nagar, Chennai. ₹999/Sq.Ft. (Highly affordable investment). Ongoing.

COMPANY DETAILS:
- Address: No. 48, Karanai Puducherry Road, Urapakkam, Chennai - 603210, Tamil Nadu, India.
- Contact Number: +91 8925924128 / +91 7338834233
- WhatsApp: +91 8925924128
- Website: www.kpnpromoters.in
- Key Advantages: 100% Clear Legal Titles, DTCP & RERA Approvals, Bank Loan Assistance (up to 80-90%), Rapidly Developing Corridor along GST Road & Kilambakkam Terminus.
- Other Services: Joint Development (for land owners), NRI Property Services, Industrial Park ventures, Channel Partner network.
`;

/**
 * Intelligent keyword-based local response generator
 * Used as high-speed instant response or offline fallback when API key is not present.
 */
export function generateLocalBotResponse(userMessage: string): {
  reply: string;
  recommendedProjects?: typeof projectsData;
  showLeadForm?: boolean;
} {
  const q = userMessage.toLowerCase().trim();
  const cleanQ = q.replace(/[!?.,]/g, '').trim();

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
        `🏢 **Head Office**: No. 48, Karanai Puducherry Road, Urapakkam, Chennai - 603210.\n` +
        `📞 **Call/WhatsApp**: **+91 8925924128** / **+91 7338834233**\n\n` +
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
    const plots = projectsData.filter((p) => p.type === 'Plots');
    return {
      reply: `KPN Promoters offers **100% DTCP & RERA Approved Plots** in high-growth investment hubs across Chennai:\n\n` +
        `• **KPN Sri Sai Baba Nagar** (Maraimalai Nagar) — Starting at **₹999 / Sq.Ft**\n` +
        `• **KPN Thulir** (Singaperumal Koil) — Starting at **₹2,099 / Sq.Ft**\n` +
        `• **KPN Marvel Township** (Urapakkam) — Starting at **₹2,799 / Sq.Ft**\n` +
        `• **KPN Omega Town** (Guduvanchery) — Starting at **₹2,799 / Sq.Ft**\n` +
        `• **Sri Ranga Nagar** (Nenmeli) — Starting at **₹3,299 / Sq.Ft**\n` +
        `• **Sri Bhavai Amman Nagar II** (Urapakkam) — Starting at **₹4,999 / Sq.Ft**\n\n` +
        `All our layouts feature blacktop roads, potable water, clear legal documentation, and ready-to-construct approvals.`,
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
    q.includes('bhk') ||
    q.includes('under 30l') ||
    q.includes('under 35l') ||
    q.includes('under 40l') ||
    q.includes('19 lakh')
  ) {
    const budgetApts = projectsData.filter((p) => p.type === 'Apartments');
    return {
      reply: `We have excellent modern apartments in **Urapakkam, Chennai** with clear titles and bank loan approvals:\n\n` +
        `• **KPN LeNid** — 1 & 2 BHK from **₹19 Lakhs** Onwards (Near Karanai Puducherry Rd)\n` +
        `• **DGM Monica Residency** — 1 & 2 BHK from **₹30 Lakhs** Onwards (Near GST Road)\n` +
        `• **SP2K Serenity Skyline** — 1 & 2 BHK from **₹38 Lakhs** Onwards\n` +
        `• **KPN Enclave** — 2 BHK from **₹45 Lakhs** Onwards\n` +
        `• **Royal Oak** — 2 BHK from **₹48 Lakhs** Onwards (Opp. Railway Station)\n` +
        `• **KPN Vijayalakshmi** — 2 BHK from **₹54 Lakhs** Onwards (Near Kilambakkam Bus Terminus)\n\n` +
        `Would you like to book a **free site visit** or explore floor plans for any of these?`,
      recommendedProjects: budgetApts.slice(0, 3),
      showLeadForm: true,
    };
  }

  // 2. Plots / Land inquiry
  if (
    q.includes('plot') ||
    q.includes('land') ||
    q.includes('layout') ||
    q.includes('township') ||
    q.includes('sq.ft') ||
    q.includes('sqft')
  ) {
    const plots = projectsData.filter((p) => p.type === 'Plots');
    return {
      reply: `KPN Promoters offers **100% DTCP & RERA Approved Plots** in high-growth investment hubs across Chennai:\n\n` +
        `• **KPN Sri Sai Baba Nagar** (Maraimalai Nagar) — Starting at **₹999 / Sq.Ft**\n` +
        `• **KPN Thulir** (Singaperumal Koil) — Starting at **₹2,099 / Sq.Ft**\n` +
        `• **KPN Marvel Township** (Urapakkam) — Starting at **₹2,799 / Sq.Ft**\n` +
        `• **KPN Omega Town** (Guduvanchery) — Starting at **₹2,799 / Sq.Ft**\n` +
        `• **Sri Ranga Nagar** (Nenmeli) — Starting at **₹3,299 / Sq.Ft**\n` +
        `• **Sri Bhavai Amman Nagar II** (Urapakkam) — Starting at **₹4,999 / Sq.Ft**\n\n` +
        `All our layouts feature blacktop roads, potable water, clear legal documentation, and ready-to-construct approvals.`,
      recommendedProjects: plots.slice(0, 3),
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
        `📞 **Call/WhatsApp**: **+91 8925924128** / **+91 7338834233**\n` +
        `🏢 **Head Office**: No. 48, Karanai Puducherry Road, Urapakkam, Chennai - 603210.\n\n` +
        `Please drop your phone number below, and our property manager will reach out within 15 minutes!`,
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
        `Are you interested in properties near Urapakkam or Guduvanchery?`,
      recommendedProjects: projectsData.slice(0, 2),
    };
  }

  // 5. NRI Services & Joint Development
  if (q.includes('nri') || q.includes('joint development') || q.includes('partner')) {
    return {
      reply: `KPN Promoters provides dedicated **NRI Real Estate Advisory** and **Joint Development** solutions:\n\n` +
        `• **NRI Services**: Hassle-free legal verification, property management, rental yield optimization, and remote power of attorney advisory.\n` +
        `• **Joint Development**: Maximum land valuation, transparent sharing ratio, and fast construction delivery for landowners.\n\n` +
        `Feel free to share your contact details or WhatsApp us directly at **+91 8925924128** for confidential advisory.`,
      showLeadForm: true,
    };
  }

  // 6. Tamil / Tanglish greetings
  if (q.includes('vanakkam') || q.includes('eppadi') || q.includes('vilai') || q.includes('engu')) {
    return {
      reply: `வணக்கம்! KPN Promoters-க்கு உங்களை வரவேற்கிறோம்.\n\n` +
        `உரப்பாக்கம் மற்றும் கூடுவாஞ்சேரி பகுதிகளில் குறைந்த விலையில் **1 & 2 BHK வீடுகள் (₹19 லட்சம் முதல்)** மற்றும் **DTCP அப்ரூவ்ட் வீட்டு மனைகள் (₹999/sq.ft முதல்)** உள்ளன.\n\n` +
        `உங்களுக்கு வீடுகள் பற்றிய விவரங்கள் வேண்டுமா அல்லது மனைகள் பற்றிய விவரங்கள் வேண்டுமா? இலவசமாக நேரில் வந்து பார்க்க உங்கள் ஃபோன் நம்பரை பகிருங்கள்!`,
      showLeadForm: true,
    };
  }

  // General default fallback
  return {
    reply: `Hello! I am your **KPN Real Estate Assistant** 🏢.\n\n` +
      `How can I assist you with your property search today?\n\n` +
      `• **Apartments**: 1 & 2 BHK homes in Urapakkam from **₹19 Lakhs onwards**\n` +
      `• **Plots**: DTCP/RERA approved plots from **₹999/sq.ft** to **₹4,999/sq.ft**\n` +
      `• **Site Visits**: Free guided property visit with our advisor\n` +
      `• **Loan Assistance**: Up to 80-90% home loans from SBI, HDFC, LIC & Axis Bank.\n\n` +
      `You can ask me any question or choose a quick option below!`,
    recommendedProjects: projectsData.slice(0, 3),
  };
}
