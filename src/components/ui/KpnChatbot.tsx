'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  RotateCcw,
  ExternalLink,
  Phone,
  CheckCircle2,
  Calendar,
  Building2,
  Home,
  MapPin,
  Compass,
  ArrowRight,
  AlertCircle,
  Calculator,
  FileText,
  Download,
  Mic,
  MicOff,
  BookOpen,
} from 'lucide-react';
import { ChatMessage } from '@/data/chatbotKnowledge';
import { ProjectItem } from '@/data/siteData';
import PhoneInputWithCountry from '@/components/ui/PhoneInputWithCountry';
import { Country, DEFAULT_COUNTRY } from '@/lib/countryCodes';
import { cleanName, validateName, validatePhone } from '@/lib/formValidation';

export default function KpnChatbot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Lead capture states
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadCountry, setLeadCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [leadErrors, setLeadErrors] = useState<{ name?: string; phone?: string }>({});
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [activeProjectContext, setActiveProjectContext] = useState<string>('');

  // Setup browser Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';

        recognition.onresult = (event: any) => {
          const transcript = event.results?.[0]?.[0]?.transcript;
          if (transcript) {
            setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
          setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice search is not supported on this browser. You can type your question directly.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const initialGreeting: ChatMessage = {
    id: 'welcome-1',
    role: 'assistant',
    content:
      'Hello! 👋 Welcome to **KPN Promoters**.\n\nLooking for apartments, villas, or DTCP/RERA approved plots in Chennai? You can ask me to search active properties by budget, calculate home loan EMI, download brochures, or read our investment guides!',
    timestamp: 'Just now',
    quickChips: [
      { label: '💰 Check Loan EMI', query: 'What is the EMI for 25 Lakhs loan?' },
      { label: '📰 Investment Guides', query: 'show me your latest articles and guides' },
      { label: '📍 Near Kilambakkam', query: 'Which projects are near Kilambakkam Bus Terminus?' },
      { label: '🏢 Homes Under 35L', query: 'Show me apartments under 35 Lakhs' },
      { label: '🏡 Approved Plots (< 15L)', query: 'What approved plots are available under 15 Lakhs?' },
      { label: '📍 Open Projects Page', query: 'open projects page' },
    ],
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestAssistantRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage?.role === 'assistant') {
        latestAssistantRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        scrollToBottom();
      }
      setShowNotification(false);
    }
  }, [messages, isOpen]);

  // Show friendly notification pill after 3 seconds on first visit
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && !hasPrompted) {
        setShowNotification(true);
        setHasPrompted(true);
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, [isOpen, hasPrompted]);

  // Send message handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userMessage: text,
        }),
      });

      const data = await res.json();
      const botReply = data.reply || 'Thank you for your inquiry! Our team is available on WhatsApp at +91 8925924128.';

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProjects: data.recommendedProjects,
        recommendedBlogs: data.recommendedBlogs,
        showLeadForm: data.showLeadForm,
        action: data.action,
        quickChips: data.quickChips,
      };

      setMessages((prev) => [...prev, botMsg]);

      if (data.recommendedProjects && data.recommendedProjects.length > 0) {
        setActiveProjectContext(data.recommendedProjects[0].name);
      } else if (data.action?.brochureDetails?.projectName) {
        setActiveProjectContext(data.action.brochureDetails.projectName);
      }
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        role: 'assistant',
        content:
          'We have received your message! For immediate real estate assistance and site visits, you can also reach our advisor directly at **+91 8925924128**.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit site visit / lead form
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameRes = leadName.trim() ? validateName(leadName) : { isValid: true, error: '' };
    const phoneRes = validatePhone(leadPhone, leadCountry, true);

    setLeadErrors({
      name: nameRes.error,
      phone: phoneRes.error,
    });

    if (!nameRes.isValid || !phoneRes.isValid) return;

    setIsSubmittingLead(true);
    const fullPhone = `${leadCountry.dialCode} ${leadPhone.trim()}`;
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName.trim(),
          phone: fullPhone,
          notes: 'Chatbot site visit request',
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || 'Unable to save the enquiry');
      }

      setLeadSubmitted(true);
      const confMsg: ChatMessage = {
        id: `lead-conf-${Date.now()}`,
        role: 'assistant',
        content: `🎉 Thank you **${leadName.trim() || 'Valued Buyer'}**! Our senior property manager has received your request (**${fullPhone}**) and will call you shortly to arrange your free site visit.`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, confMsg]);

      // If WhatsApp URL provided, trigger in a small moment
      if (data.whatsappUrl) {
        setTimeout(() => {
          window.open(data.whatsappUrl, '_blank');
        }, 1200);
      }
    } catch (err) {
      const failureMsg: ChatMessage = {
        id: `lead-failure-${Date.now()}`,
        role: 'assistant',
        content:
          'I could not save your request right now. Please try again, or contact our advisor directly on WhatsApp at **+91 8925924128**.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, failureMsg]);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Quick Action Chips
  const quickActions = [
    { label: '🏢 Budget Homes (< ₹35L)', query: 'Show me budget apartments under 35 Lakhs in Urapakkam' },
    { label: '🏡 Approved Plots', query: 'What DTCP and RERA approved plots do you have available?' },
    { label: '📅 Book Free Site Visit', query: 'I want to book a free site visit' },
    { label: '📍 Near Kilambakkam', query: 'Which projects are near Kilambakkam Bus Terminus?' },
  ];

  // Helper to format text with bold & linebreaks
  const renderFormattedText = (rawText: string) => {
    // Strip stray draft or quote wrappers
    const text = rawText
      .replace(/^Draft Content\*{0,3}:\s*/gim, '')
      .replace(/^\*{0,3}Draft:\*{0,3}\s*/gim, '')
      .trim();

    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      const isBullet = trimmed.startsWith('• ') || trimmed.startsWith('* ') || trimmed.startsWith('- ');
      const cleanLine = isBullet ? trimmed.replace(/^([•*-]\s*)/, '') : line;

      // Bold regex replacement
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const content = parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={idx} className="font-bold text-[#29247c]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={i} className="my-1 flex items-start gap-1.5 pl-1">
            <span className="text-[#f12131] font-bold leading-tight">•</span>
            <div className="flex-1 leading-relaxed">{content}</div>
          </div>
        );
      }

      return (
        <p key={i} className={trimmed === '' ? 'h-2' : 'my-0.5 leading-relaxed'}>
          {content}
        </p>
      );
    });
  };

  return (
    <>
      {/* ==================================================================== */}
      {/* FLOATING CHAT BUTTON & NOTIFICATION POPUP */}
      {/* ==================================================================== */}
      <div className="fixed bottom-38 right-6 z-50 flex items-center">
        {/* Unread Message Notification Bubble (Positioned to the left) */}
        {showNotification && !isOpen && (
          <div className="absolute right-16 bottom-0 w-[260px] animate-in fade-in slide-in-from-right-3 rounded-2xl bg-white p-3.5 shadow-2xl border border-slate-100 ring-1 ring-slate-900/5 transition-all">
            <button
              onClick={() => setShowNotification(false)}
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300"
              suppressHydrationWarning
            >
              <X className="h-3 w-3" />
            </button>
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#29247c] text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">KPN Assistant</p>
                <p className="text-[11px] font-medium text-slate-500 leading-tight mt-0.5">
                  Looking for homes or plots in Chennai? Let me help you find the best deals! 👋
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowNotification(false);
                setIsOpen(true);
              }}
              className="mt-2.5 w-full rounded-full bg-[#f12131] py-1 text-center text-[11px] font-bold text-white shadow-sm hover:bg-[#d01927]"
              suppressHydrationWarning
            >
              Chat Now
            </button>
          </div>
        )}

        {/* Floating Action Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Open KPN AI Chatbot"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#29247c] to-[#3f38aa] text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgb(41,36,124,0.4)] active:scale-95"
          suppressHydrationWarning
        >
          {/* Subtle pulse wave */}
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#29247c] opacity-25 duration-1000 pointer-events-none" />

          {/* Active / Icon State */}
          {isOpen ? (
            <X className="h-6 w-6 text-white transition-transform duration-200 group-hover:rotate-90" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Bot className="h-7 w-7 text-white transition-transform duration-300 group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f12131] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#f12131]" />
              </span>
            </div>
          )}

          {/* Hover Text Banner (matches WhatsApp button style) */}
          {!isOpen && !showNotification && (
            <div
              className={`
                absolute
                right-16
                top-1/2
                -translate-y-1/2
                whitespace-nowrap
                rounded-full
                bg-slate-900
                px-4
                py-1.5
                text-xs
                font-bold
                text-white
                shadow-xl
                transition-all
                duration-300
                pointer-events-none
                ${
                  isHovered
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-2'
                }
              `}
            >
              <span>Chat with chatbot</span>
            </div>
          )}
        </button>
      </div>

      {/* ==================================================================== */}
      {/* CHAT WINDOW MODAL */}
      {/* ==================================================================== */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 z-50 flex w-[calc(100vw-32px)] sm:w-[410px] h-[590px] max-h-[calc(100vh-120px)] flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl border border-slate-200/90 animate-in fade-in slide-in-from-bottom-5 duration-300"
          style={{ boxShadow: '0 25px 60px -15px rgba(41, 36, 124, 0.3)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#29247c] via-[#332c96] to-[#29247c] px-5 py-4 text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/20">
                <Bot className="h-5 w-5 text-white" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#29247c]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-tight text-white">KPN AI Assistant</h3>
                  <span className="flex items-center gap-0.5 rounded-full bg-[#f12131] px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wider text-white">
                    <Sparkles className="h-2.5 w-2.5" /> AI
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-200/90">
                  Online • Typically replies instantly
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([initialGreeting])}
                title="Reset Chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Action Chips Bar */}
          <div className="border-b border-slate-100 bg-slate-50/80 px-3 py-2">
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(action.query)}
                  className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-xs transition hover:border-[#f12131] hover:text-[#f12131] hover:bg-rose-50/30"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                ref={msg.role === 'assistant' && msg.id === messages[messages.length - 1]?.id ? latestAssistantRef : undefined}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-[#29247c] text-white rounded-br-xs'
                      : 'bg-white text-slate-700 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  {renderFormattedText(msg.content)}
                </div>

                <span className="mt-1 px-1 text-[10px] text-slate-400">{msg.timestamp}</span>

                {/* Interactive Navigation Action Card */}
                {msg.action?.type === 'NAVIGATE' && msg.action.url && (
                  <div className="order-2 mt-2.5 w-full rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/95 via-white to-blue-50/90 p-3.5 shadow-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#29247c] to-[#3f38aa] text-white shadow-xs">
                        <Compass className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-indigo-700">
                          Direct Navigation
                        </span>
                        <h4 className="mt-0.5 text-xs font-bold text-slate-800">
                          {msg.action.pageTitle || 'Target Page'}
                        </h4>
                        {msg.action.description && (
                          <p className="mt-0.5 text-[11px] text-slate-600 leading-snug">
                            {msg.action.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-indigo-100/80 pt-2.5">
                      <span className="text-[10px] font-medium text-slate-500">
                        Ready to view?
                      </span>
                      <button
                        onClick={() => {
                          if (msg.action?.url) {
                            router.push(msg.action.url);
                            setIsOpen(false);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#29247c] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#1e1966] active:scale-95 cursor-pointer"
                      >
                        <span>Open {msg.action.pageTitle || 'Page'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Interactive EMI Loan Calculator Card */}
                {msg.action?.type === 'CALCULATE_EMI' && msg.action.emiDetails && (
                  <div className="order-2 mt-2.5 w-full rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/95 via-white to-teal-50/80 p-3.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-2xs">
                          <Calculator className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-700">Home Loan Estimate</span>
                          <h4 className="text-xs font-bold text-slate-800">₹{msg.action.emiDetails.loanAmountLakhs} Lakhs Loan</h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-medium">Monthly EMI</span>
                        <p className="text-sm font-extrabold text-emerald-700">₹{msg.action.emiDetails.monthlyEmi.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-xl bg-emerald-100/50 p-2 text-center text-[10px]">
                      <div>
                        <span className="text-slate-500 block">Tenure</span>
                        <strong className="font-bold text-slate-800">{msg.action.emiDetails.tenureYears} Yrs</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Interest Rate</span>
                        <strong className="font-bold text-slate-800">{msg.action.emiDetails.interestRate}% p.a.</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Total Interest</span>
                        <strong className="font-bold text-slate-800">₹{msg.action.emiDetails.totalInterestLakhs}L</strong>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-emerald-100">
                      <span>Approved: SBI • HDFC • LIC • Axis</span>
                      <span className="font-bold text-emerald-700">80-90% Loan Approved</span>
                    </div>
                  </div>
                )}

                {/* Interactive PDF Brochure Download Card */}
                {msg.action?.type === 'DOWNLOAD_BROCHURE' && msg.action.brochureDetails && (
                  <div className="order-2 mt-2.5 w-full rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50/95 via-white to-red-50/80 p-3.5 shadow-xs">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f12131] text-white shadow-xs">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="inline-block rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#f12131]">
                          Official PDF Brochure
                        </span>
                        <h4 className="mt-0.5 text-xs font-bold text-slate-800 truncate">
                          {msg.action.brochureDetails.projectName}
                        </h4>
                        <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">
                          {msg.action.brochureDetails.title}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-rose-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-500">Floor plans & layout maps</span>
                      <a
                        href={msg.action.brochureDetails.brochureUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#f12131] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#d01927] active:scale-95 cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download PDF</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Interactive Landmark Proximity Card */}
                {msg.action?.type === 'LANDMARK_SEARCH' && msg.action.landmarkDetails && (
                  <div className="order-2 mt-2.5 w-full rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/80 p-3.5 shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-700">Transit Connectivity</span>
                        <h4 className="text-xs font-bold text-slate-800 truncate">{msg.action.landmarkDetails.landmarkName}</h4>
                      </div>
                    </div>

                    <div className="space-y-1.5 mt-2">
                      {msg.action.landmarkDetails.nearbyProjects.map((p, pIdx) => (
                        <div key={pIdx} className="flex items-center justify-between rounded-xl bg-white p-2 border border-slate-100 shadow-2xs">
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-bold text-[#29247c] truncate">{p.name}</h5>
                            <span className="text-[10px] text-slate-500">{p.type} • {p.budget}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold text-blue-700">
                              {p.distance}
                            </span>
                            <Link
                              href={`/projects/${p.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-[#29247c] hover:text-white transition"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Zero-Result Budget Alert */}
                {msg.action?.type === 'NOT_FOUND_SUGGEST' && (
                  <div className="order-2 mt-2 w-full flex items-start gap-2 rounded-xl border border-amber-200/90 bg-amber-50/80 p-2.5 text-[11px] text-amber-900 shadow-2xs">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                    <div className="leading-snug">
                      <strong className="font-bold">Budget Advisory:</strong> Our closest available apartment and high-value approved plots are shown below.
                    </div>
                  </div>
                )}

                {/* Dynamic Contextual Quick Action Chips */}
                {msg.quickChips && msg.quickChips.length > 0 && (
                  <div className="order-3 mt-2 w-full">
                    <div className="flex flex-wrap gap-1.5">
                      {msg.quickChips.map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => handleSendMessage(chip.query)}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-2xs transition hover:border-[#29247c] hover:bg-indigo-50/60 hover:text-[#29247c] active:scale-95 cursor-pointer"
                        >
                          <span>{chip.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Property Cards Grid */}
                {msg.recommendedProjects && msg.recommendedProjects.length > 0 && (
                  <div className="order-1 mt-2.5 w-full space-y-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Recommended Properties:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.recommendedProjects.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xs transition hover:border-[#29247c]"
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-14 w-16 shrink-0 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="truncate text-xs font-bold text-[#29247c]">
                              {p.name}
                            </h4>
                            <p className="flex items-center gap-1 text-[10px] text-slate-500 truncate">
                              <MapPin className="h-2.5 w-2.5 text-[#f12131]" />
                              {p.location}
                            </p>
                            <span className="inline-block mt-0.5 rounded-sm bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-[#f12131]">
                              {p.budget}
                            </span>
                          </div>
                          <Link
                            href={`/projects/${p.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-[#29247c] hover:text-white transition"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Blog / Article Cards Grid */}
                {msg.recommendedBlogs && msg.recommendedBlogs.length > 0 && (
                  <div className="order-1 mt-2.5 w-full space-y-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Helpful Articles & Guides:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.recommendedBlogs.map((b) => (
                        <div
                          key={b.id}
                          className="flex items-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xs transition hover:border-[#29247c]"
                        >
                          <img
                            src={b.image || '/images/kpn_logo.webp'}
                            alt={b.title}
                            className="h-14 w-16 shrink-0 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="inline-block rounded-xs bg-indigo-50 px-1.5 py-0.2 text-[9px] font-extrabold text-[#29247c]">
                              {b.category}
                            </span>
                            <h4 className="truncate text-xs font-bold text-slate-800 mt-0.5">
                              {b.title}
                            </h4>
                            {b.shortDescription && (
                              <p className="text-[10px] text-slate-500 line-clamp-1">
                                {b.shortDescription}
                              </p>
                            )}
                          </div>
                          <Link
                            href={`/blogs/${b.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-[#29247c] hover:text-white transition"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inline Lead Capture Form */}
                {msg.showLeadForm && !leadSubmitted && (
                  <div className="order-4 mt-3 w-full rounded-2xl border border-rose-200 bg-rose-50/60 p-3.5">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-[#f12131]" />
                      <h4 className="text-xs font-extrabold text-slate-800">
                        Book a Free Site Visit
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-600 mb-3">
                      Drop your phone number to receive project details and schedule your visit.
                    </p>

                    <form onSubmit={handleLeadSubmit} noValidate className="space-y-2.5">
                      <div>
                        <input
                          type="text"
                          placeholder="Your Name (Optional)"
                          value={leadName}
                          onChange={(e) => {
                            const cleaned = cleanName(e.target.value);
                            setLeadName(cleaned);
                            if (leadErrors.name) {
                              setLeadErrors((prev) => ({ ...prev, name: validateName(cleaned).error }));
                            }
                          }}
                          onBlur={() => {
                            if (leadName.trim()) {
                              setLeadErrors((prev) => ({ ...prev, name: validateName(leadName).error }));
                            }
                          }}
                          suppressHydrationWarning
                          className={`h-9 w-full rounded-xl border px-3 text-xs outline-none transition ${
                            leadErrors.name
                              ? 'border-red-400 bg-red-50/40 text-red-900'
                              : 'border-slate-300 bg-white focus:border-[#29247c]'
                          }`}
                        />
                        {leadErrors.name && (
                          <p className="mt-1 px-1 text-[10px] font-semibold text-red-600">
                            {leadErrors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <PhoneInputWithCountry
                          phone={leadPhone}
                          selectedCountry={leadCountry}
                          onPhoneChange={(val) => {
                            setLeadPhone(val);
                            if (leadErrors.phone) {
                              setLeadErrors((prev) => ({
                                ...prev,
                                phone: validatePhone(val, leadCountry, true).error,
                              }));
                            }
                          }}
                          onCountryChange={(c) => {
                            setLeadCountry(c);
                            if (leadPhone) {
                              setLeadErrors((prev) => ({
                                ...prev,
                                phone: validatePhone(leadPhone, c, true).error,
                              }));
                            }
                          }}
                          error={leadErrors.phone}
                          required
                          onBlur={() => {
                            setLeadErrors((prev) => ({
                              ...prev,
                              phone: validatePhone(leadPhone, leadCountry, true).error,
                            }));
                          }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingLead}
                        suppressHydrationWarning
                        className="w-full rounded-xl bg-[#f12131] py-2.5 text-center text-xs font-bold text-white shadow-xs transition hover:bg-[#d01927] disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmittingLead ? 'Submitting...' : 'Request Free Site Visit'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}

            {/* Thinking / Loading Dots */}
            {isLoading && (
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-xs border border-slate-200 bg-white px-4 py-3 w-16">
                <div className="h-2 w-2 animate-bounce rounded-full bg-[#29247c]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-[#29247c] [animation-delay:0.2s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-[#29247c] [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick WhatsApp Support Bar */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2">
            <span className="text-[10px] font-semibold text-slate-500">
              Need immediate assistance?
            </span>
            <a
              href={`https://api.whatsapp.com/send?phone=918925924128&text=${encodeURIComponent(
                activeProjectContext
                  ? `Hi, I am chatting from www.kpnpromoters.in and I am interested in ${activeProjectContext}. Please share more details.`
                  : 'Hi, I am chatting from www.kpnpromoters.in website regarding property details.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
            >
              <Phone className="h-3 w-3" /> WhatsApp Us
            </a>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isListening ? "🎙️ Listening... Speak your message..." : "Ask prices, BHK, loan EMI, brochure..."}
              className={`h-10 flex-1 rounded-full border px-4 text-xs font-medium text-slate-800 outline-none transition ${
                isListening
                  ? 'border-red-400 bg-red-50/60 ring-2 ring-red-400/30'
                  : 'border-slate-200 bg-slate-50 focus:border-[#29247c] focus:bg-white'
              }`}
            />

            {/* Speech-to-text Voice Microphone Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? "Stop listening" : "Speak your question"}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition cursor-pointer ${
                isListening
                  ? 'bg-[#f12131] text-white animate-pulse shadow-md ring-2 ring-[#f12131]/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
              }`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#29247c] text-white transition hover:bg-[#1e1966] disabled:opacity-40 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
