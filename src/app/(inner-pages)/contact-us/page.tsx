'use client';

import { useState } from 'react';
import Image from 'next/image';
import InnerPageHero from '@/components/sections/InnerPageHero';
import Navbar from '@/components/layout/Navbar';
import FadeIn from '@/components/animation/FadeIn';
import StaggerContainer from '@/components/animation/StaggerContainer';
import StaggerItem from '@/components/animation/StaggerItem';
import { submitEnquiry } from '@/lib/cmsClient';
import PhoneInputWithCountry from '@/components/ui/PhoneInputWithCountry';
import { Country, DEFAULT_COUNTRY } from '@/lib/countryCodes';
import { cleanName, validateName, cleanEmail, validateEmail, validatePhone } from '@/lib/formValidation';
import SubmissionThankYouModal from '@/components/ui/SubmissionThankYouModal';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: '',
  });
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; phone?: string; email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [submittedInfo, setSubmittedInfo] = useState<{ name: string; phone: string }>({ name: '', phone: '' });

  const handleFirstNameChange = (val: string) => {
    const cleaned = cleanName(val);
    setFormData((prev) => ({ ...prev, firstName: cleaned }));
    if (errors.firstName) {
      setErrors((prev) => ({ ...prev, firstName: validateName(cleaned, 'First name').error }));
    }
  };

  const handleLastNameChange = (val: string) => {
    const cleaned = cleanName(val);
    setFormData((prev) => ({ ...prev, lastName: cleaned }));
    if (errors.lastName && cleaned) {
      setErrors((prev) => ({ ...prev, lastName: validateName(cleaned, 'Last name').error }));
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const firstNameRes = validateName(formData.firstName, 'First name');
    const lastNameRes = formData.lastName.trim() ? validateName(formData.lastName, 'Last name') : { isValid: true, error: '' };
    const emailRes = validateEmail(formData.email, true);
    const phoneRes = validatePhone(formData.phone, selectedCountry, true);

    const newErrors = {
      firstName: firstNameRes.error,
      lastName: lastNameRes.error,
      email: emailRes.error,
      phone: phoneRes.error,
    };
    setErrors(newErrors);

    if (!firstNameRes.isValid || !lastNameRes.isValid || !emailRes.isValid || !phoneRes.isValid) {
      return;
    }

    const currentName = `${formData.firstName} ${formData.lastName}`.trim();
    const currentPhone = `${selectedCountry.dialCode} ${formData.phone.trim()}`;
    setSubmittedInfo({ name: currentName, phone: currentPhone });

    setIsSubmitting(true);
    try {
      await submitEnquiry({
        name: currentName,
        phone: currentPhone,
        email: formData.email.trim(),
        message: formData.message.trim(),
        source: 'Contact Page',
      });
      setShowThankYou(true);
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        message: '',
      });
      setSelectedCountry(DEFAULT_COUNTRY);
      setErrors({});
    } catch {
      setShowThankYou(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* =========================================================
          INNER PAGE HERO
      ========================================================= */}
      <Navbar variant="hero" />
      <InnerPageHero
        title="Contact Us"
        breadcrumb="Contact Us"
        description="Our global real estate experts are here to help you in this ever-changing market."
        image="/images/projects/apt_dgm_monica.jpg"
      />
      {/* =========================================================
          2. THREE CONTACT CARDS
      ========================================================= */}
      <section className="px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1200px]">

          <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 gap-6 md:grid-cols-3">

            {/* ---------------------------------------------------
                EMAIL
            --------------------------------------------------- */}
            <StaggerItem className="flex min-h-[300px] flex-col justify-between rounded-[28px] border border-slate-200 bg-white p-10 shadow-sm hover:shadow-md transition-shadow">

              <div>
                <h3 className="text-2xl font-bold text-[#29247c]">
                  Support email
                </h3>

                <p className="mt-2 text-sm text-slate-800">
                  kpnsalesteam@gmail.com
                </p>
              </div>

              <a
                href="mailto:kpnsalesteam@gmail.com"
                className="flex h-12 items-center justify-center rounded-full bg-[#ff202d] text-sm font-bold text-black transition-all hover:scale-[1.02] hover:bg-[#ed1c2a] active:scale-98"
              >
                Email Us
              </a>

            </StaggerItem>


            {/* ---------------------------------------------------
                PHONE
            --------------------------------------------------- */}
            <StaggerItem className="flex min-h-[300px] flex-col justify-between rounded-[28px] border border-slate-200 bg-white p-10 shadow-sm hover:shadow-md transition-shadow">

              <div>
                <h3 className="text-2xl font-bold text-[#29247c]">
                  Phone number
                </h3>

                <p className="mt-2 text-sm text-slate-800">
                  +91 7338834233
                </p>
              </div>

              <a
                href="tel:+917338834233"
                className="flex h-12 items-center justify-center rounded-full bg-[#ff202d] text-sm font-bold text-black transition-all hover:scale-[1.02] hover:bg-[#ed1c2a] active:scale-98"
              >
                Call Us
              </a>

            </StaggerItem>


            {/* ---------------------------------------------------
                LOCATION
            --------------------------------------------------- */}
            <StaggerItem className="flex min-h-[300px] flex-col justify-between rounded-[28px] border border-slate-200 bg-white p-10 shadow-sm hover:shadow-md transition-shadow">

              <div>
                <h3 className="text-2xl font-bold text-[#29247c]">
                  Location
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-800">
                  No. 48, Karanai Puducherry Rd,
                  Senthil Nagar, Urapakkam, Chennai -
                  603 210.
                </p>
              </div>

              <a
                href="#map-section"
                className="flex h-12 items-center justify-center rounded-full bg-[#ff202d] text-sm font-bold text-black transition-all hover:scale-[1.02] hover:bg-[#ed1c2a] active:scale-98"
              >
                Visit Us
              </a>

            </StaggerItem>

          </StaggerContainer>

        </div>
      </section>

      {/* =========================================================
          CONTACT FORM + MAP
      ========================================================= */}
      <section id="map-section" className="overflow-hidden bg-white px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1400px]">

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-8">

            {/* =====================================================
                LEFT SIDE - FORM (SLIDES IN FROM LEFT)
            ===================================================== */}
            <FadeIn direction="left" distance={40} duration={0.8} className="lg:col-span-6">

              {/* Heading */}
              <h2
                className="
                  mb-8
                  text-4xl
                  font-bold
                  tracking-tight
                  text-[#29247c]
                  sm:text-5xl
                  lg:text-[48px]
                  lg:leading-[1.05]
                "
              >
                Leave a message
              </h2>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                noValidate
                suppressHydrationWarning
                className="space-y-6"
              >

                {/* First Name + Last Name */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="First Name*"
                      value={formData.firstName}
                      onChange={(e) => handleFirstNameChange(e.target.value)}
                      onBlur={() => {
                        setErrors((prev) => ({
                          ...prev,
                          firstName: validateName(formData.firstName, 'First name').error,
                        }));
                      }}
                      suppressHydrationWarning
                      className={`h-[54px] w-full rounded-full border px-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-500 transition ${
                        errors.firstName
                          ? 'border-red-400 bg-red-50/40 focus:ring-2 focus:ring-red-400/30'
                          : 'border-0 bg-[#f3f3f3] focus:bg-[#eeeeee] focus:ring-2 focus:ring-[#f12131]/30'
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1.5 px-3 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => handleLastNameChange(e.target.value)}
                      onBlur={() => {
                        if (formData.lastName.trim()) {
                          setErrors((prev) => ({
                            ...prev,
                            lastName: validateName(formData.lastName, 'Last name').error,
                          }));
                        }
                      }}
                      suppressHydrationWarning
                      className={`h-[54px] w-full rounded-full border px-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-500 transition ${
                        errors.lastName
                          ? 'border-red-400 bg-red-50/40 focus:ring-2 focus:ring-red-400/30'
                          : 'border-0 bg-[#f3f3f3] focus:bg-[#eeeeee] focus:ring-2 focus:ring-[#f12131]/30'
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1.5 px-3 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone & Email Row */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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

                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Email* (e.g. name@gmail.com)"
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
                      className={`h-[54px] w-full rounded-full border px-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-500 transition ${
                        errors.email
                          ? 'border-red-400 bg-red-50/40 focus:ring-2 focus:ring-red-400/30'
                          : 'border-0 bg-[#f3f3f3] focus:bg-[#eeeeee] focus:ring-2 focus:ring-[#f12131]/30'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1.5 px-3 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message Textarea */}
                <textarea
                  rows={4}
                  placeholder="Message..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  suppressHydrationWarning
                  className="
                    min-h-[170px]
                    w-full
                    resize-none
                    rounded-[28px]
                    border-0
                    bg-[#f3f3f3]
                    px-7
                    py-6
                    text-sm
                    text-slate-800
                    outline-none
                    placeholder:text-slate-500
                    transition
                    focus:bg-[#eeeeee]
                    focus:ring-2
                    focus:ring-[#f12131]/30
                  "
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  suppressHydrationWarning
                  className="
                    group
                    flex
                    h-[54px]
                    items-center
                    gap-5
                    rounded-full
                    border
                    border-slate-200
                    bg-white
                    pl-7
                    pr-2
                    text-sm
                    font-bold
                    text-black
                    shadow-sm
                    transition-all
                    hover:shadow-md
                    active:scale-98
                    disabled:opacity-50
                  "
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>

                  <span
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      bg-[#f12131]
                      text-white
                      transition-transform
                      duration-300
                      group-hover:rotate-45
                    "
                  >
                    ↗
                  </span>
                </button>

              </form>

              {/* ===================================================
                  OFFICE THUMBNAILS
              =================================================== */}
              <div className="mt-16 flex items-center gap-6">

                <div
                  className="
                    relative
                    h-[72px]
                    w-[150px]
                    overflow-hidden
                    rounded-full
                    shadow-sm
                  "
                >
                  <Image
                    src="/images/about/about-img.jpg"
                    alt="KPN Promoters office"
                    fill
                    sizes="150px"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div
                  className="
                    relative
                    h-[72px]
                    w-[150px]
                    overflow-hidden
                    rounded-full
                    shadow-sm
                  "
                >
                  <Image
                    src="/images/hero/h1_bg.jpg"
                    alt="KPN Promoters project"
                    fill
                    sizes="150px"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

              </div>

            </FadeIn>

            {/* =====================================================
                RIGHT SIDE - GOOGLE MAP (SLIDES IN FROM RIGHT)
            ===================================================== */}
            <FadeIn
              direction="right"
              distance={40}
              duration={0.8}
              delay={0.1}
              className="
                h-[500px]
                overflow-hidden
                rounded-[28px]
                bg-slate-100
                shadow-lg
                lg:col-span-6
                lg:h-[640px]
              "
            >
              <iframe
                title="KPN Promoters Contact Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1944.8927309719153!2d80.07172777610008!3d12.859373099999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52f647c2f9b237%3A0xe23caa8bd97601c3!2sKPN%20Promoters%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </FadeIn>

          </div>

        </div>

        {/* Branded Thank You Modal */}
        <SubmissionThankYouModal
          isOpen={showThankYou}
          onClose={() => setShowThankYou(false)}
          title="Message Received!"
          message="Thank you for contacting KPN Promoters! Our customer advisory team will get in touch with you shortly."
          userName={submittedInfo.name}
          userPhone={submittedInfo.phone}
        />
      </section>
    </>
  );
}