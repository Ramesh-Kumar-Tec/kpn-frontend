'use client';

import { useState } from 'react';
import FadeIn from '@/components/animation/FadeIn';
import StaggerContainer from '@/components/animation/StaggerContainer';
import StaggerItem from '@/components/animation/StaggerItem';
import { submitEnquiry } from '@/lib/cmsClient';
import PhoneInputWithCountry from '@/components/ui/PhoneInputWithCountry';
import { Country, DEFAULT_COUNTRY } from '@/lib/countryCodes';
import { cleanName, validateName, cleanEmail, validateEmail, validatePhone } from '@/lib/formValidation';
import JointDevelopmentForm from '@/components/forms/JointDevelopmentForm';
import SubmissionThankYouModal from '@/components/ui/SubmissionThankYouModal';

interface AssociatePageProps {
  title: string;
  tagline?: string;
  heroImage?: string;
}

export default function AssociatePageTemplate({
  title,
}: AssociatePageProps) {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    city: '',
    message: '',
    consent: false,
  });
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; city?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
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
    const cityRes = formData.city.trim() ? { isValid: true, error: '' } : { isValid: false, error: 'City is required' };

    const newErrors = {
      name: nameRes.error,
      email: emailRes.error,
      phone: phoneRes.error,
      city: cityRes.error,
    };
    setErrors(newErrors);

    if (!nameRes.isValid || !emailRes.isValid || !phoneRes.isValid || !cityRes.isValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      const additionalNotes = [
        formData.companyName ? `Company: ${formData.companyName}` : '',
        formData.city ? `City: ${formData.city}` : '',
        formData.message ? `Details: ${formData.message}` : '',
      ]
        .filter(Boolean)
        .join(' • ');

      const currentName = formData.name.trim();
      const currentPhone = `${selectedCountry.dialCode} ${formData.phone.trim()}`;
      setSubmittedInfo({ name: currentName, phone: currentPhone });

      await submitEnquiry({
        name: currentName,
        phone: currentPhone,
        email: formData.email.trim(),
        projectName: `${title} Program`,
        message: additionalNotes || `Inquiry for ${title}`,
        source: 'Associate Page',
      });

      setShowThankYou(true);
      setFormData({
        name: '',
        companyName: '',
        email: '',
        phone: '',
        city: '',
        message: '',
        consent: false,
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
    <main className="min-h-screen bg-white text-slate-800 antialiased">
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
          4. CONTACT FORM + GOOGLE MAP
      ========================================================= */}
      <section
        id="map-section"
        className="overflow-hidden px-4 pb-24 sm:px-6 lg:px-10"
      >
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 lg:grid-cols-2">

          {/* -----------------------------------------------------
              FORM (SLIDES IN FROM LEFT)
          ----------------------------------------------------- */}
          <FadeIn direction="left" distance={40} duration={0.8}>
            {title === 'Joint Development' ? (
              <JointDevelopmentForm />
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-7"
              >

                {/* Name */}
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Name*"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onBlur={() => {
                      setErrors((prev) => ({
                        ...prev,
                        name: validateName(formData.name).error,
                      }));
                    }}
                    suppressHydrationWarning
                    className={`h-14 w-full rounded-full border px-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-500 transition ${
                      errors.name
                        ? 'border-red-400 bg-red-50/40 focus:ring-2 focus:ring-red-400/30'
                        : 'border-0 bg-slate-100 focus:ring-2 focus:ring-rose-500'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1.5 px-4 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Company */}
                <input
                  type="text"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      companyName: e.target.value,
                    })
                  }
                  suppressHydrationWarning
                  className="h-14 w-full rounded-full border-0 bg-slate-100 px-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-rose-500"
                />

                {/* Email */}
                <div>
                  <input
                    type="email"
                    required
                    placeholder="E-mail* (e.g. name@gmail.com)"
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
                    className={`h-14 w-full rounded-full border px-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-500 transition ${
                      errors.email
                        ? 'border-red-400 bg-red-50/40 focus:ring-2 focus:ring-red-400/30'
                        : 'border-0 bg-slate-100 focus:ring-2 focus:ring-rose-500'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 px-4 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
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

                {/* City */}
                <div>
                  <input
                    type="text"
                    required
                    placeholder="City*"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        city: e.target.value,
                      })
                    }
                    onBlur={() => {
                      setErrors((prev) => ({
                        ...prev,
                        city: formData.city.trim() ? '' : 'City is required',
                      }));
                    }}
                    suppressHydrationWarning
                    className={`h-14 w-full rounded-full border px-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-500 transition ${
                      errors.city
                        ? 'border-red-400 bg-red-50/40 focus:ring-2 focus:ring-red-400/30'
                        : 'border-0 bg-slate-100 focus:ring-2 focus:ring-rose-500'
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1.5 px-4 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
                      {errors.city}
                    </p>
                  )}
                </div>


                {/* Message */}
                <textarea
                  required
                  rows={5}
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      message: e.target.value,
                    })
                  }
                  className="w-full resize-none rounded-[28px] border-0 bg-slate-100 px-7 py-6 text-sm text-slate-800 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-rose-500"
                />


                {/* Consent */}
                <div className="flex items-start gap-3">

                  <input
                    type="checkbox"
                    required
                    checked={formData.consent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        consent: e.target.checked,
                      })
                    }
                    className="mt-1 h-4 w-4 accent-rose-600"
                  />

                  <label className="text-xs leading-relaxed text-slate-600">
                    I authorise KPN Promoters Pvt Ltd and its representatives
                    to contact me with updates and notifications via Email /
                    SMS / WhatsApp / Call. This will override on DND/NDNC.
                  </label>

                </div>


                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  suppressHydrationWarning
                  className="rounded-full bg-[#ff202d] px-8 py-4 text-sm font-bold text-white transition-all hover:bg-[#d81928] active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? 'Submitting Details...' : 'Submit Application'}
                </button>

              </form>
            )}

          </FadeIn>


          {/* -----------------------------------------------------
              GOOGLE MAP (SLIDES IN FROM RIGHT)
          ----------------------------------------------------- */}
          <FadeIn direction="right" distance={40} duration={0.8} delay={0.1} className="h-[500px] overflow-hidden rounded-[28px] shadow-lg">

            <iframe
              title="KPN Promoters Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1944.8927309719153!2d80.07172777610008!3d12.859373099999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52f647c2f9b237%3A0xe23caa8bd97601c3!2sKPN%20Promoters%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

          </FadeIn>

        </div>
      </section>

      {/* Branded Thank You Modal */}
      <SubmissionThankYouModal
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
        title={`${title} Request Received!`}
        message={`Thank you for submitting your details for ${title}! We have received your inquiry and our team will contact you shortly.`}
        userName={submittedInfo.name}
        userPhone={submittedInfo.phone}
      />
    </main>
  );
}