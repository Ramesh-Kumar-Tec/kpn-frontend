'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  Sparkles,
  CheckCircle2,
  Send,
  Maximize2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import PhoneInputWithCountry from '@/components/ui/PhoneInputWithCountry';
import { Country, DEFAULT_COUNTRY } from '@/lib/countryCodes';
import { cleanName, validateName, cleanEmail, validateEmail, validatePhone } from '@/lib/formValidation';
import { submitEnquiry } from '@/lib/cmsClient';

const AD_IMAGE_PATH = '/images/guduvancherry-estates-launch.png';
const LOGO_PATH = '/images/newlogoo.jpeg';
const PHONE_NUMBER = '+91 7338834233';
const PHONE_TEL = '+917338834233';
const WHATSAPP_URL = `https://api.whatsapp.com/send?phone=917338834233&text=${encodeURIComponent(
  'Hello KPN Promoters, I saw the new Guduvancherry Estates launch announcement on your website. Please share the launch offers, pricing, and plot layout details!'
)}`;
const INSTAGRAM_URL = 'https://www.instagram.com/kpnpromotersofficial/';


export default function NewProjectAdModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPillDismissed, setIsPillDismissed] = useState(false);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: 'Interested in priority allotment for Guduvancherry Estates (Coming Soon).',
  });
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Trigger popup on slight scroll down
  useEffect(() => {
    let hasTriggered = false;

    const handleScroll = () => {
      if (hasTriggered) return;

      const hasSeenThisSession = sessionStorage.getItem('kpn_guduvancherry_ad_seen');
      if (hasSeenThisSession) return;

      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      // Trigger as soon as visitor does a slight scroll (> 120px)
      if (scrollTop > 120) {
        hasTriggered = true;
        setIsOpen(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // In case user reloaded while already scrolled down
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when modal is active
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
    sessionStorage.setItem('kpn_guduvancherry_ad_seen', 'true');
  };

  const handlePermanentPillDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPillDismissed(true);
    sessionStorage.setItem('kpn_guduvancherry_pill_dismissed', 'true');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameRes = validateName(formData.name);
    const emailRes = validateEmail(formData.email, false);
    const phoneRes = validatePhone(formData.phone, selectedCountry, true);

    const newErrors = {
      name: nameRes.error,
      email: emailRes.error,
      phone: phoneRes.error,
    };

    setErrors(newErrors);

    if (nameRes.isValid && (!formData.email || emailRes.isValid) && phoneRes.isValid) {
      setIsSubmitting(true);
      try {
        await submitEnquiry({
          name: formData.name,
          email: formData.email || 'prelaunch-lead@kpnpromoters.in',
          phone: `${selectedCountry.dialCode} ${formData.phone}`,
          projectName: 'Guduvancherry Estates (New Launch - Coming Soon)',
          source: 'Website Floating Launch Ad',
          message: formData.message,
        });

        setSubmitted(true);
      } catch (err) {
        console.error('Error submitting pre-launch enquiry:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      {/* ==================================================================== */}
      {/* 1. FLOATING MINIMIZED PILL (KPN Theme: White card + Red & Navy accents) */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {!isOpen && !isPillDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className="fixed bottom-6 left-6 z-40 max-w-[calc(100vw-32px)]"
          >
            <div
              onClick={() => setIsOpen(true)}
              className="
                group relative flex items-center gap-3 rounded-full
                bg-white p-2 pr-4 text-slate-800
                shadow-[0_12px_36px_rgba(41,36,124,0.18),0_4px_12px_rgba(0,0,0,0.06)]
                border-2 border-rose-200 hover:border-[#f12131]
                transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer
              "
              role="button"
              tabIndex={0}
              aria-label="View New Launch: Guduvancherry Estates"
            >
              {/* Icon Circle */}
              <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#f12131] to-[#d01927] text-white shadow-md shadow-red-500/30">
                <Sparkles className="h-5 w-5 animate-spin [animation-duration:8s]" />
              </div>

              {/* Text Badge */}
              <div className="relative flex flex-col pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#f12131] animate-pulse" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#f12131]">
                    New Launch
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#29247c] tracking-tight line-clamp-1">
                  Guduvancherry Estates • Coming Soon
                </span>
              </div>

              {/* View prompt */}
              <div className="relative hidden md:flex items-center pl-1 text-xs font-bold text-[#f12131] group-hover:translate-x-0.5 transition">
                <span>View</span>
                <Maximize2 className="ml-1 h-3.5 w-3.5" />
              </div>

              {/* Dismiss Cross */}
              <button
                onClick={handlePermanentPillDismiss}
                title="Dismiss announcement"
                aria-label="Dismiss announcement"
                className="relative ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-[#f12131] transition cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* 2. FULL PROMOTIONAL FLOATING AD MODAL (KPN Theme) */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ad-modal-title"
          >
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={handleClose}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            {/* Modal Card Frame: Expanded width (max-w-[940px]) & height for perfect poster view */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 18 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="
                relative z-10 w-full max-w-[940px] max-h-[94vh] flex flex-col
                overflow-hidden rounded-[26px] sm:rounded-[32px]
                border border-slate-100 bg-white
                text-slate-800 shadow-[0_25px_80px_rgba(41,36,124,0.22)] font-sans
              "
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Banner Header (KPN Corporate Theme with Logo & Badge) */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 sm:px-7 py-3.5 sm:py-4 shrink-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* KPN Official Logo */}
                  <div className="relative h-9 sm:h-11 w-24 sm:w-28 shrink-0">
                    <Image
                      src={LOGO_PATH}
                      alt="KPN Promoters Pvt Ltd"
                      fill
                      sizes="(max-width: 640px) 96px, 112px"
                      className="object-contain object-left"
                      priority
                    />
                  </div>

                  <div className="h-7 w-px bg-slate-200 hidden xs:block" />

                  {/* Announcement Tag */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/90 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[#f12131]">
                        <span className="h-2 w-2 rounded-full bg-[#f12131] animate-ping" />
                        <span>New Project Launch</span>
                      </span>
                    </div>
                    <p
                      id="ad-modal-title"
                      className="text-xs sm:text-sm font-bold text-[#29247c] mt-0.5"
                    >
                      Your Next Address on Guduvancherry • Coming Soon
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  aria-label="Close Announcement Modal"
                  className="
                    group flex h-10 w-10 items-center justify-center rounded-full
                    bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-[#f12131]
                    transition-all duration-200 cursor-pointer shadow-2xs shrink-0
                  "
                >
                  <X className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="overflow-y-auto px-5 sm:px-7 py-4 space-y-4 max-h-[calc(94vh-145px)]">
                {/* Main Promotional Poster Image (Large, Sharp, 16:9) */}
                <div className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50 shadow-md">
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={AD_IMAGE_PATH}
                      alt="Your Next Address on Guduvancherry - KPN Promoters"
                      fill
                      priority
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                      sizes="(max-width: 960px) 100vw, 940px"
                    />
                  </div>

                  {/* Location Tag */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-[#29247c] border border-slate-200 shadow-md">
                    <span className="h-2 w-2 rounded-full bg-[#f12131] animate-pulse" />
                    <span>Guduvancherry, Chennai</span>
                  </div>
                </div>


                {/* Direct Lead Pre-Registration Form Drawer */}
                {showEnquiryForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50/60 via-white to-slate-50 p-5 shadow-xs"
                  >
                    {submitted ? (
                      <div className="flex flex-col items-center justify-center py-5 text-center space-y-2">
                        <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                          <CheckCircle2 className="h-7 w-7" />
                        </div>
                        <h4 className="text-lg font-bold text-[#29247c]">Priority Interest Registered!</h4>
                        <p className="text-xs text-slate-600 max-w-md">
                          Thank you, <span className="text-[#f12131] font-bold">{formData.name}</span>.
                          Our dedicated project manager will contact you shortly with early-bird pricing and plot layouts.
                        </p>
                        <button
                          onClick={handleClose}
                          className="mt-2 rounded-full bg-[#f12131] px-6 py-2 text-xs font-bold text-white hover:bg-[#d01927] transition"
                        >
                          Done
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleFormSubmit} className="space-y-3.5" noValidate>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-[#29247c]">
                              Pre-Register for Early-Bird Allotment
                            </h4>
                            <p className="text-xs text-slate-500">
                              Get priority access to launch offers and plot selection.
                            </p>
                          </div>
                          <span className="hidden sm:inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                            Zero Obligation
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <input
                              type="text"
                              placeholder="Full Name *"
                              value={formData.name}
                              onChange={(e) => {
                                const val = cleanName(e.target.value);
                                setFormData((prev) => ({ ...prev, name: val }));
                                if (errors.name) {
                                  setErrors((prev) => ({ ...prev, name: validateName(val).error }));
                                }
                              }}
                              className={`h-11 w-full rounded-xl border bg-white px-3.5 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none transition ${
                                errors.name
                                  ? 'border-red-400 bg-red-50/40 text-red-900'
                                  : 'border-slate-300 focus:border-[#29247c] focus:ring-4 focus:ring-[#29247c]/10'
                              }`}
                            />
                            {errors.name && (
                              <p className="mt-1 px-1 text-[10px] font-semibold text-red-600">{errors.name}</p>
                            )}
                          </div>

                          <div>
                            <PhoneInputWithCountry
                              phone={formData.phone}
                              selectedCountry={selectedCountry}
                              onPhoneChange={(val) => {
                                setFormData((prev) => ({ ...prev, phone: val }));
                                if (errors.phone) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    phone: validatePhone(val, selectedCountry, true).error,
                                  }));
                                }
                              }}
                              onCountryChange={(c) => {
                                setSelectedCountry(c);
                                if (formData.phone && errors.phone) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    phone: validatePhone(formData.phone, c, true).error,
                                  }));
                                }
                              }}
                              error={errors.phone}
                              required
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#f12131] py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#d01927] disabled:opacity-50 transition cursor-pointer"
                        >
                          {isSubmitting ? (
                            <span>Submitting...</span>
                          ) : (
                            <>
                              <Send className="h-3.5 w-3.5" />
                              <span>Submit Priority Interest</span>
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Action Buttons Footer (KPN Theme) */}
              <div className="border-t border-slate-100 bg-slate-50/80 px-5 sm:px-7 py-3.5 shrink-0">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Left: Call Us & Instagram */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
                      <span className="text-[#29247c]">Call Us:</span>
                      <a
                        href={`tel:${PHONE_TEL}`}
                        className="text-[#f12131] underline decoration-1 underline-offset-4 hover:opacity-75 transition"
                      >
                        {PHONE_NUMBER}
                      </a>
                    </div>

                    <span className="h-4 w-px bg-slate-300 hidden xs:block" />

                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#f12131] transition"
                      title="Follow us on Instagram"
                    >
                      <svg
                        className="h-4 w-4 fill-current"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span>@kpnpromotersofficial</span>
                    </a>
                  </div>

                  {/* Right: Primary Conversion Buttons */}
                  <div className="flex items-center gap-2.5">
                    {/* Toggle Form Button */}
                    <button
                      onClick={() => setShowEnquiryForm(!showEnquiryForm)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-[#29247c] bg-white px-4 py-2 text-xs sm:text-sm font-bold text-[#29247c] hover:bg-[#29247c] hover:text-white transition cursor-pointer"
                    >
                      <span>{showEnquiryForm ? 'Hide Form' : 'Register Interest'}</span>
                      {showEnquiryForm ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>

                    {/* WhatsApp Button */}
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        flex-1 sm:flex-initial inline-flex items-center justify-center gap-2
                        rounded-full bg-[#25D366] px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-extrabold text-white
                        shadow-md shadow-emerald-700/20 hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition
                      "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className="h-4 w-4 fill-current"
                      >
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                      </svg>
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
