'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, ShieldCheck, Sparkles, Building, PhoneCall, Mail } from 'lucide-react';
import PhoneInputWithCountry from '@/components/ui/PhoneInputWithCountry';
import { Country, DEFAULT_COUNTRY } from '@/lib/countryCodes';
import { validateName, validatePhone, validateEmail } from '@/lib/formValidation';
import { submitEnquiry } from '@/lib/cmsClient';
import { ProjectItem } from '@/data/siteData';

interface ProjectEnquiryModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectEnquiryModal({
  project,
  isOpen,
  onClose,
}: ProjectEnquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'Price Sheet & Detailed Quote',
    message: '',
  });

  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Lock body scroll when modal is active, restore immediately when closed
  useEffect(() => {
    if (isOpen) {
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyOverflow = document.body.style.overflow;

      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalBodyOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameRes = validateName(formData.name);
    const phoneRes = validatePhone(formData.phone, selectedCountry, true);
    let emailError: string | undefined = undefined;
    if (formData.email.trim()) {
      const emailRes = validateEmail(formData.email);
      if (!emailRes.isValid) emailError = emailRes.error;
    }

    const newErrors: { name?: string; phone?: string; email?: string } = {
      name: nameRes.error,
      phone: phoneRes.error,
      email: emailError,
    };

    setErrors(newErrors);

    if (nameRes.isValid && phoneRes.isValid && !emailError) {
      setIsSubmitting(true);
      try {
        await submitEnquiry({
          name: formData.name,
          email: formData.email.trim() || 'enquiry@kpnpromoters.in',
          phone: `${selectedCountry.dialCode} ${formData.phone}`,
          projectName: project.name,
          source: 'Project Details - Instant Enquiry Popup',
          message: `Requirement: ${formData.interest}. ${
            formData.message ? `Notes: ${formData.message}` : ''
          }`,
        });

        setSubmitted(true);
      } catch (err) {
        console.error('Failed to submit enquiry:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        interest: 'Price Sheet & Detailed Quote',
        message: '',
      });
      setErrors({});
    }, 300);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Modal Window: Scrollable flex column fitting all viewports */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3rem)] overflow-hidden z-10 my-auto"
        >
          {/* Header Banner - Fixed at top */}
          <div className="relative shrink-0 bg-gradient-to-r from-[#29247c] via-[#1f1b5c] to-[#29247c] px-6 py-5 text-white sm:px-8">
            {/* Background ambient accent */}
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[#f12131]/20 blur-2xl pointer-events-none" />

            {/* Close Cross Button - Prominent & 100% accessible */}
            <button
              type="button"
              onClick={handleClose}
              title="Close modal (Esc)"
              aria-label="Close modal"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 hover:bg-[#f12131] text-white transition-all hover:scale-105 cursor-pointer shadow-xs z-20"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#f12131] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                <Sparkles className="h-3 w-3" /> Quick Enquiry
              </span>
              <span className="text-xs text-white/75 truncate">
                {project.location || 'Chennai'}
              </span>
            </div>

            <h3
              id="enquiry-modal-title"
              className="text-lg sm:text-2xl font-bold tracking-tight text-white leading-tight pr-8"
            >
              Enquire About {project.name}
            </h3>
            <p className="mt-1 text-xs sm:text-[13px] text-white/80 leading-normal">
              Get official price sheet, master plan, and unit availability directly from our specialist team.
            </p>
          </div>

          {/* Form Content / Success state - Smoothly scrollable with mouse wheel or touch */}
          <div className="overflow-y-auto overscroll-contain p-5 sm:p-7 flex-1">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center space-y-4"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">
                  Enquiry Received Successfully!
                </h4>
                <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-slate-900">{formData.name}</span>! Our relationship manager for{' '}
                  <span className="font-semibold text-[#29247c]">{project.name}</span> will connect with you with pricing and layout details.
                </p>

                <div className="pt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-xl bg-[#29247c] px-6 py-2.5 text-xs font-bold text-white transition hover:bg-[#1e1a5a] cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-[#29247c] focus:outline-hidden focus:ring-1 focus:ring-[#29247c]"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs font-medium text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Mobile Number with Country Code */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <PhoneInputWithCountry
                    phone={formData.phone}
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                    onPhoneChange={(phone: string) => setFormData({ ...formData, phone })}
                    error={errors.phone}
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address <span className="text-xs font-normal text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-[#29247c] focus:outline-hidden focus:ring-1 focus:ring-[#29247c]"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs font-medium text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Requirement / Interested In */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    What are you looking for?
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-[#29247c] focus:outline-hidden focus:ring-1 focus:ring-[#29247c] bg-white cursor-pointer"
                  >
                    <option value="Price Sheet & Detailed Quote">Latest Price Sheet & Payment Plans</option>
                    <option value="Master Layout & Available Plots">Master Layout & Available Plots/Units</option>
                    <option value="Schedule a Free Site Visit">Schedule a Free Site Visit</option>
                    <option value="Bank Loan & EMI Details">Bank Loan & EMI Assistance</option>
                    <option value="Legal Title & CMDA/DTCP Approvals">Legal Title & Approval Documents</option>
                  </select>
                </div>

                {/* Message / Questions */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Message or Specific Questions <span className="text-xs font-normal text-slate-400">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="e.g. Interested in 1200 sq.ft plot, need pricing details..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-[#29247c] focus:outline-hidden focus:ring-1 focus:ring-[#29247c] resize-none"
                  />
                </div>

                {/* Privacy and Trust */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>100% Privacy Guaranteed. Direct developer assistance.</span>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-[#f12131] to-[#d61020] hover:from-[#d61020] hover:to-[#b80816] py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    'Submitting Enquiry...'
                  ) : (
                    <>
                      <span>Get Instant Details & Brochure</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
