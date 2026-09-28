'use client';

import { useState } from 'react';
import RunningPillBadge from '../ui/RunningPillBadge';
import FadeIn from '../animation/FadeIn';
import { submitEnquiry } from '@/lib/cmsClient';
import PhoneInputWithCountry from '@/components/ui/PhoneInputWithCountry';
import { Country, DEFAULT_COUNTRY } from '@/lib/countryCodes';
import { cleanName, validateName, cleanEmail, validateEmail, validatePhone } from '@/lib/formValidation';
import SubmissionThankYouModal from '@/components/ui/SubmissionThankYouModal';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export default function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiry: '',
  });
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedInfo, setSubmittedInfo] = useState<{ name: string; phone: string }>({ name: '', phone: '' });

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

    const currentName = formData.name.trim();
    const currentPhone = `${selectedCountry.dialCode} ${formData.phone.trim()}`;
    setSubmittedInfo({ name: currentName, phone: currentPhone });

    setIsSubmitting(true);
    try {
      await submitEnquiry({
        name: currentName,
        phone: currentPhone,
        email: formData.email.trim(),
        message: formData.inquiry ? `Inquiry regarding: ${formData.inquiry}` : 'General Inquiry',
        source: 'Website Contact Section',
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', inquiry: '' });
      setSelectedCountry(DEFAULT_COUNTRY);
      setErrors({});
    } catch {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', inquiry: '' });
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="relative z-10 bg-white pb-20 pt-10 rounded-b-[40px] md:rounded-b-[60px]"
      id="contact"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* Background Wrapper with KPN-Marvel-Township-Urapakkam.jpg */}
        <FadeIn direction="up" distance={30}>
          <div
            className="relative rounded-[40px] overflow-hidden bg-cover bg-center py-20 px-6 sm:px-12 md:px-20 lg:py-28 shadow-xl"
            style={{
              backgroundImage: "url('/images/contact_bg.jpg')",
            }}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-[#0f172a]/35" />

            {/* Form Card */}
            <div className="relative z-10 mx-auto max-w-4xl rounded-[32px] bg-white p-8 md:p-14 shadow-2xl overflow-hidden">
              {/* Left Building Outline */}
              <img
                src="/images/building/h1_shape.png"
                alt="Building blueprint left"
                className="absolute bottom-0 left-0 h-40 sm:h-52 md:h-64 w-auto opacity-60 pointer-events-none object-contain select-none z-0"
              />
              {/* Right Building Outline */}
              <img
                src="/images/building/h1_shape.png"
                alt="Building blueprint right"
                className="absolute bottom-0 right-0 h-40 sm:h-52 md:h-64 w-auto opacity-60 pointer-events-none object-contain select-none z-0 scale-x-[-1]"
              />

              <div className="relative z-10">
                <div className="text-center max-w-xl mx-auto mb-10 space-y-4 flex flex-col items-center">
                  <RunningPillBadge text="ENQUIRY • GET IN TOUCH" />
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#29247c] tracking-tight leading-snug">
                    Get specialist advice for residential, commercial or property
                  </h2>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Row 1: Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Your Name*"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        onBlur={() => {
                          setErrors((prev) => ({
                            ...prev,
                            name: validateName(formData.name).error,
                          }));
                        }}
                        suppressHydrationWarning
                        className={`w-full h-14 rounded-full border px-6 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                          errors.name
                            ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-red-400/40'
                            : 'border-slate-100 bg-slate-50/80 focus:ring-red-400/60 focus:border-transparent'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1.5 px-3 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="email"
                        required
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
                        suppressHydrationWarning
                        className={`w-full h-14 rounded-full border px-6 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                          errors.email
                            ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-red-400/40'
                            : 'border-slate-100 bg-slate-50/80 focus:ring-red-400/60 focus:border-transparent'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1.5 px-3 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Phone and Inquiry */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <PhoneInputWithCountry
                        variant="pill"
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
                    <Select
                      value={formData.inquiry}
                      onValueChange={(val) =>
                        setFormData({ ...formData, inquiry: val })
                      }
                    >
                      <SelectTrigger suppressHydrationWarning className="w-full h-[54px] rounded-full border border-slate-100 bg-slate-50/80 px-6 text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400/60 focus:border-transparent transition-all shadow-none cursor-pointer">
                        <SelectValue placeholder="You inquiry about..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl">
                        <SelectItem value="residential" className="rounded-xl font-semibold py-2.5 text-slate-700">
                          Residential Property
                        </SelectItem>
                        <SelectItem value="commercial" className="rounded-xl font-semibold py-2.5 text-slate-700">
                          Commercial Property
                        </SelectItem>
                        <SelectItem value="jv" className="rounded-xl font-semibold py-2.5 text-slate-700">
                          Our Venture
                        </SelectItem>
                        <SelectItem value="other" className="rounded-xl font-semibold py-2.5 text-slate-700">
                          General Inquiry
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bottom Actions Row */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                    <div className="text-left space-y-0.5">
                      <p className="text-sm font-semibold text-[#29247c]">
                        We&apos;re excited to connect with you!
                      </p>
                      <p className="text-xs text-slate-400">
                        Required fields are marked *
                      </p>
                    </div>
                    <button
                      type="submit"
                      suppressHydrationWarning
                      className="w-full sm:w-auto rounded-full bg-[#f12131] py-3 pl-8 pr-3 flex items-center justify-between text-white font-bold text-sm shadow-md transition-all hover:bg-red-600 hover:scale-102 active:scale-98"
                    >
                      <span>Get A Call Back</span>
                      <span className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-[#f12131] ml-4 transition-transform duration-300 group-hover:scale-110">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 12 h14 M12 5 l7 7 l-7 7"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Branded Thank You Modal */}
      <SubmissionThankYouModal
        isOpen={submitted}
        onClose={() => setSubmitted(false)}
        title="Inquiry Received!"
        message="Thank you for your inquiry! Our senior property advisory team will reach out to you shortly."
        userName={submittedInfo.name}
        userPhone={submittedInfo.phone}
      />
    </section>
  );
}