'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, X, Phone, ArrowRight } from 'lucide-react';

interface SubmissionThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  userName?: string;
  userPhone?: string;
  showWhatsApp?: boolean;
}

export default function SubmissionThankYouModal({
  isOpen,
  onClose,
  title = 'Thank You!',
  message = 'We have received your details. Our senior property manager will review your submission and contact you shortly.',
  userName,
  userPhone,
  showWhatsApp = true,
}: SubmissionThankYouModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyOverflow = document.body.style.overflow;

      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      return () => {
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalBodyOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const whatsappMessage = encodeURIComponent(
    `Hello KPN Promoters, I just submitted an inquiry on your website${userName ? ` (Name: ${userName}` : ''}${userPhone ? `, Phone: ${userPhone}` : ''}). Could you please share more details?`
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
          {/* Dark Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[480px] overflow-hidden rounded-[32px] bg-white p-7 sm:p-9 text-slate-800 shadow-2xl border border-slate-100/80 font-sans"
            style={{ boxShadow: '0 25px 60px -15px rgba(41, 36, 124, 0.35)' }}
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#29247c] via-[#f12131] to-[#29247c]" />

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-all hover:bg-slate-200 hover:text-slate-800 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Icon + Title Block */}
            <div className="text-center pt-2">
              {/* Animated Glowing Checkmark */}
              <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60 shadow-inner">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-20 duration-1000" />
                <CheckCircle2 className="h-10 w-10 text-emerald-600 stroke-[2.2]" />
              </div>

              {/* Tag / Category Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-[#29247c] mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Request Received Successfully</span>
              </div>

              <h3 className="text-2xl sm:text-[26px] font-black tracking-tight text-[#29247c] font-heading">
                {title}
              </h3>

              {userName && (
                <p className="mt-1 text-sm font-bold text-slate-700">
                  Thank you, <span className="text-[#f12131]">{userName}</span>!
                </p>
              )}

              <p className="mt-3 text-xs sm:text-sm font-medium text-slate-600 leading-relaxed max-w-[380px] mx-auto">
                {message}
              </p>

              {userPhone && (
                <div className="mt-4 inline-block rounded-xl bg-slate-50 px-4 py-2 border border-slate-100 text-xs font-semibold text-slate-600">
                  Confirmation sent to: <span className="text-[#29247c] font-bold">{userPhone}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-7 space-y-2.5">
              <button
                type="button"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#29247c] py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-[#29247c]/20 transition-all hover:bg-[#1f1b5c] hover:shadow-xl active:scale-[0.99] cursor-pointer"
              >
                <span>Done</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {showWhatsApp && (
                <a
                  href={`https://api.whatsapp.com/send?phone=918925924128&text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 py-3 text-center text-xs sm:text-sm font-bold text-emerald-700 border border-emerald-200/80 transition-all hover:bg-emerald-100 active:scale-[0.99]"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Connect Instantly on WhatsApp</span>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
