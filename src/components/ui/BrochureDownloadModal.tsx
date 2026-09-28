'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, FileText, Download } from 'lucide-react';
import { submitEnquiry } from '@/lib/cmsClient';
import PhoneInputWithCountry from '@/components/ui/PhoneInputWithCountry';
import { Country, DEFAULT_COUNTRY } from '@/lib/countryCodes';
import { cleanName, validateName, cleanEmail, validateEmail, validatePhone } from '@/lib/formValidation';

interface BrochureRequestDetail {
  brochureUrl: string;
  projectName: string;
}

export default function BrochureDownloadModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [brochureInfo, setBrochureInfo] = useState<BrochureRequestDetail | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleOpenBrochureModal = (e: Event) => {
      const customEvent = e as CustomEvent<BrochureRequestDetail>;
      if (customEvent.detail && customEvent.detail.brochureUrl) {
        setBrochureInfo(customEvent.detail);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: `Inquiry for ${customEvent.detail.projectName || 'project'} brochure download.`,
        });
        setSelectedCountry(DEFAULT_COUNTRY);
        setErrors({});
        setSubmitted(false);
        setIsOpen(true);
      }
    };

    window.addEventListener('kpn_open_brochure_modal', handleOpenBrochureModal);
    return () => window.removeEventListener('kpn_open_brochure_modal', handleOpenBrochureModal);
  }, []);

  // Lock body & html scroll completely when popup modal is active
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

  const handleClose = () => {
    setIsOpen(false);
  };

  const triggerDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNameChange = (val: string) => {
    const cleaned = cleanName(val);
    setFormData((prev) => ({ ...prev, name: cleaned }));
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: validateName(cleaned).error }));
    }
  };

  const handleEmailChange = (val: string) => {
    const cleaned = cleanEmail(val);
    setFormData((prev) => ({ ...prev, email: cleaned }));
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(cleaned, true).error }));
    }
  };

  const handlePhoneChange = (val: string) => {
    setFormData((prev) => ({ ...prev, phone: val }));
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: validatePhone(val, selectedCountry, true).error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameRes = validateName(formData.name);
    const emailRes = validateEmail(formData.email, true);
    const phoneRes = validatePhone(formData.phone, selectedCountry, true);

    const newErrors = {
      name: nameRes.error,
      email: emailRes.error,
      phone: phoneRes.error,
    };
    setErrors(newErrors);

    if (!nameRes.isValid || !emailRes.isValid || !phoneRes.isValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      await submitEnquiry({
        name: formData.name.trim(),
        phone: `${selectedCountry.dialCode} ${formData.phone.trim()}`,
        email: formData.email.trim(),
        projectName: brochureInfo?.projectName,
        message: formData.message.trim(),
        source: 'Brochure Download Request',
      });
    } catch {
      // Proceed with brochure download even if analytics / lead endpoint has fallback
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);

      // Trigger brochure download automatically
      if (brochureInfo?.brochureUrl) {
        triggerDownload(brochureInfo.brochureUrl);
      }

      setTimeout(() => {
        handleClose();
      }, 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-[540px] overflow-hidden rounded-[32px] bg-white p-8 sm:p-10 text-slate-800 shadow-2xl border border-slate-100 font-sans"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close modal"
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-800 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 pr-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3.5 py-1 text-xs font-bold text-[#f12131]">
                <FileText className="h-3.5 w-3.5" />
                <span>Instant Download</span>
              </div>
              <h3 className="text-3xl sm:text-[32px] font-black tracking-tight text-[#29247c] font-heading">
                Download Brochure
              </h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Please enter your details below to immediately receive and download the{' '}
                <span className="font-bold text-slate-800">{brochureInfo?.projectName || 'project'}</span> brochure.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-4"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-2xl font-bold text-[#29247c] font-heading">Downloading Brochure!</h4>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                  Thank you! Your brochure download has started. If it didn’t start automatically,{' '}
                  {brochureInfo?.brochureUrl && (
                    <button
                      onClick={() => triggerDownload(brochureInfo.brochureUrl)}
                      className="font-bold text-[#f12131] underline hover:text-red-700"
                    >
                      click here
                    </button>
                  )}
                  .
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                {/* Full Name */}
                <div>
                  <input
                    type="text"
                    required
                    suppressHydrationWarning
                    placeholder="Enter your full name *"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onBlur={() => {
                      setErrors((prev) => ({
                        ...prev,
                        name: validateName(formData.name).error,
                      }));
                    }}
                    className={`h-13 w-full rounded-2xl border bg-slate-50/70 px-5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-slate-300 focus:bg-white focus:ring-4 ${
                      errors.name
                        ? 'border-red-400 bg-red-50/40 text-red-900 focus:border-red-500 focus:ring-red-400/20'
                        : 'border-slate-200 focus:border-[#29247c] focus:ring-[#29247c]/10'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1.5 px-1 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Mobile Number with Country Code & Search */}
                <div>
                  <PhoneInputWithCountry
                    phone={formData.phone}
                    selectedCountry={selectedCountry}
                    onPhoneChange={handlePhoneChange}
                    onCountryChange={(c) => {
                      setSelectedCountry(c);
                      if (formData.phone) {
                        setErrors((prev) => ({
                          ...prev,
                          phone: validatePhone(formData.phone, c, true).error,
                        }));
                      }
                    }}
                    error={errors.phone}
                    required
                    onBlur={() => {
                      setErrors((prev) => ({
                        ...prev,
                        phone: validatePhone(formData.phone, selectedCountry, true).error,
                      }));
                    }}
                  />
                </div>

                {/* Email Address */}
                <div>
                  <input
                    type="email"
                    required
                    suppressHydrationWarning
                    placeholder="Email Address* (e.g. name@gmail.com)"
                    value={formData.email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onBlur={() => {
                      setErrors((prev) => ({
                        ...prev,
                        email: validateEmail(formData.email, true).error,
                      }));
                    }}
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.com"
                    title="Email must include '@' and end with '.com' (e.g. name@gmail.com)"
                    className={`h-13 w-full rounded-2xl border bg-slate-50/70 px-5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-slate-300 focus:bg-white focus:ring-4 ${
                      errors.email
                        ? 'border-red-400 bg-red-50/40 text-red-900 focus:border-red-500 focus:ring-red-400/20'
                        : 'border-slate-200 focus:border-[#29247c] focus:ring-[#29247c]/10'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 px-1 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Message / Specific Note */}
                <div>
                  <textarea
                    rows={3}
                    suppressHydrationWarning
                    placeholder="Message or specific requirements (Optional)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-slate-300 focus:border-[#29247c] focus:bg-white focus:ring-4 focus:ring-[#29247c]/10"
                  />
                </div>

                {/* Submit & Download Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  suppressHydrationWarning
                  className="mt-2 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#f12131] text-sm sm:text-base font-extrabold text-white shadow-xl shadow-red-500/25 transition-all hover:bg-[#d81928] hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer font-heading tracking-wide"
                >
                  <Download className="h-4 w-4" />
                  <span>{isSubmitting ? 'Verifying & Generating...' : 'Submit & Download Brochure'}</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
