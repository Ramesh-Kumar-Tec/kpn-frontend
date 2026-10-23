'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, CheckCircle2, Send, MapPin, Building2 } from 'lucide-react';
import PhoneInputWithCountry from '@/components/ui/PhoneInputWithCountry';
import { Country, DEFAULT_COUNTRY } from '@/lib/countryCodes';
import { cleanName, validateName, cleanEmail, validateEmail, validatePhone } from '@/lib/formValidation';
import { submitEnquiry } from '@/lib/cmsClient';
import { ProjectItem } from '@/data/siteData';

interface SiteVisitModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SiteVisitModal({ project, isOpen, onClose }: SiteVisitModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    visitDate: '',
    timeSlot: 'Morning (10:00 AM - 1:00 PM)',
    message: '',
  });
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; visitDate?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameRes = validateName(formData.name);
    const phoneRes = validatePhone(formData.phone, selectedCountry, true);

    const newErrors: { name?: string; phone?: string; visitDate?: string } = {
      name: nameRes.error,
      phone: phoneRes.error,
    };

    if (!formData.visitDate) {
      newErrors.visitDate = 'Please select a preferred site visit date';
    }

    setErrors(newErrors);

    if (nameRes.isValid && phoneRes.isValid && formData.visitDate) {
      setIsSubmitting(true);
      try {
        await submitEnquiry({
          name: formData.name,
          email: formData.email || 'sitevisit@kpnpromoters.in',
          phone: `${selectedCountry.dialCode} ${formData.phone}`,
          projectName: project.name,
          source: 'Projects Listing - Book Site Visit',
          message: `Site Visit Scheduled for ${formData.visitDate} (${formData.timeSlot}). ${formData.message ? `Notes: ${formData.message}` : ''}`,
        });

        setSubmitted(true);
      } catch (err) {
        console.error('Failed to book site visit:', err);
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
        visitDate: '',
        timeSlot: 'Morning (10:00 AM - 1:00 PM)',
        message: '',
      });
      setErrors({});
    }, 300);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-[28px] sm:rounded-[32px] bg-white p-6 sm:p-8 text-slate-800 shadow-2xl border border-slate-100 font-sans"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-rose-50 hover:text-[#f12131] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="space-y-1.5 pr-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#f12131]">
              <Calendar className="h-3 w-3" />
              <span>Complimentary Guided Visit</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#29247c]">
              Book a Site Visit
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Schedule a free visit with our senior property manager for{' '}
              <strong className="text-slate-900">{project.name}</strong>.
            </p>
          </div>

          {/* Project Mini-Preview Card */}
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-2.5">
            <img
              src={project.image}
              alt={project.name}
              className="h-14 w-16 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-[#29247c] truncate">{project.name}</h4>
              <p className="flex items-center gap-1 text-[11px] text-slate-500 truncate mt-0.5">
                <MapPin className="h-3 w-3 text-[#f12131]" />
                {project.location}
              </p>
              <span className="text-[11px] font-extrabold text-[#d97706]">{project.budget}</span>
            </div>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center space-y-3"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-bold text-[#29247c]">Site Visit Confirmed!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you, <strong className="text-slate-900">{formData.name}</strong>. Our project coordinator will contact you to confirm directions and your appointment on{' '}
                <strong className="text-[#f12131]">{formData.visitDate}</strong>.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-3 rounded-full bg-[#29247c] px-6 py-2 text-xs font-bold text-white hover:bg-[#1e1966] transition cursor-pointer"
              >
                Done
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-3.5">
              {/* Full Name */}
              <div>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name *"
                  value={formData.name}
                  onChange={(e) => {
                    const cleaned = cleanName(e.target.value);
                    setFormData((prev) => ({ ...prev, name: cleaned }));
                    if (errors.name) setErrors((prev) => ({ ...prev, name: validateName(cleaned).error }));
                  }}
                  className={`h-11 w-full rounded-xl border bg-slate-50/60 px-4 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-[#29247c] focus:ring-4 focus:ring-[#29247c]/10 ${
                    errors.name ? 'border-red-400 bg-red-50/40 text-red-900' : 'border-slate-200'
                  }`}
                />
                {errors.name && <p className="mt-1 px-1 text-[10px] font-semibold text-red-600">{errors.name}</p>}
              </div>

              {/* Phone with Country Code */}
              <div>
                <PhoneInputWithCountry
                  phone={formData.phone}
                  selectedCountry={selectedCountry}
                  onPhoneChange={(val) => {
                    setFormData((prev) => ({ ...prev, phone: val }));
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: validatePhone(val, selectedCountry, true).error }));
                  }}
                  onCountryChange={(c) => {
                    setSelectedCountry(c);
                    if (formData.phone) setErrors((prev) => ({ ...prev, phone: validatePhone(formData.phone, c, true).error }));
                  }}
                  error={errors.phone}
                  required
                />
              </div>

              {/* Preferred Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Preferred Visit Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.visitDate}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, visitDate: e.target.value }));
                      if (errors.visitDate) setErrors((prev) => ({ ...prev, visitDate: undefined }));
                    }}
                    className={`h-10 w-full rounded-xl border bg-slate-50/60 px-3 text-xs font-semibold text-slate-900 outline-none transition focus:bg-white focus:border-[#29247c] ${
                      errors.visitDate ? 'border-red-400 bg-red-50/40' : 'border-slate-200'
                    }`}
                  />
                  {errors.visitDate && (
                    <p className="mt-1 px-1 text-[10px] font-semibold text-red-600">{errors.visitDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Time Slot
                  </label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData((prev) => ({ ...prev, timeSlot: e.target.value }))}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-xs font-semibold text-slate-900 outline-none transition focus:bg-white focus:border-[#29247c]"
                  >
                    <option value="Morning (10:00 AM - 1:00 PM)">Morning (10 AM - 1 PM)</option>
                    <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1 PM - 4 PM)</option>
                    <option value="Evening (4:00 PM - 6:30 PM)">Evening (4 PM - 6:30 PM)</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f12131] to-red-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:from-red-600 hover:to-red-700 disabled:opacity-50 transition cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Scheduling Visit...</span>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Confirm Free Site Visit</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
