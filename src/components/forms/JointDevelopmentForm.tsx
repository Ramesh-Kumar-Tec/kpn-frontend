'use client';

import React, { useState } from 'react';
import { submitEnquiry } from '@/lib/cmsClient';
import PhoneInputWithCountry from '@/components/ui/PhoneInputWithCountry';
import { Country, DEFAULT_COUNTRY } from '@/lib/countryCodes';
import {
  cleanName,
  validateName,
  cleanEmail,
  validateEmail,
  validatePhone,
} from '@/lib/formValidation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SubmissionThankYouModal from '@/components/ui/SubmissionThankYouModal';

export default function JointDevelopmentForm() {
  const [formData, setFormData] = useState({
    userRole: '', // 'Owner' | 'Mediator'
    name: '', // Name of the Owner / Contact Person*
    phone: '', // Phone Number*
    email: '', // Email ID*
    propertyLocation: '', // Property Location*
    landArea: '', // Land Area (in sq.ft.)*
    propertyType: '', // Type of Property / Land*
    message: '', // Message / Additional Requirements – Optional
    consent: false,
  });

  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [errors, setErrors] = useState<{
    userRole?: string;
    name?: string;
    phone?: string;
    email?: string;
    propertyLocation?: string;
    landArea?: string;
    propertyType?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [submittedInfo, setSubmittedInfo] = useState<{ name: string; phone: string }>({ name: '', phone: '' });

  const handleNameChange = (val: string) => {
    const cleaned = cleanName(val);
    setFormData((prev) => ({ ...prev, name: cleaned }));
    if (errors.name) {
      setErrors((prev) => ({
        ...prev,
        name: validateName(cleaned, 'Name of Owner / Contact Person').error,
      }));
    }
  };

  const handleEmailChange = (val: string) => {
    const cleaned = cleanEmail(val);
    setFormData((prev) => ({ ...prev, email: cleaned }));
    if (errors.email) {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(cleaned, true).error,
      }));
    }
  };

  const handlePhoneChange = (val: string) => {
    setFormData((prev) => ({ ...prev, phone: val }));
    if (errors.phone) {
      setErrors((prev) => ({
        ...prev,
        phone: validatePhone(val, selectedCountry, true).error,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Are you a?*
    const userRoleError = !formData.userRole
      ? 'Please select whether you are an Owner or Mediator'
      : '';

    // 2. Name of the Owner / Contact Person*
    const nameRes = validateName(formData.name, 'Name of Owner / Contact Person');

    // 3. Phone Number*
    const phoneRes = validatePhone(formData.phone, selectedCountry, true);

    // 4. Email ID*
    const emailRes = validateEmail(formData.email, true);

    // 5. Property Location*
    const propertyLocationError = !formData.propertyLocation.trim()
      ? 'Property Location is required'
      : '';

    // 6. Land Area (in sq.ft.)*
    const landAreaError = !formData.landArea.trim()
      ? 'Land Area (in sq.ft.) is required'
      : '';

    // 7. Type of Property / Land*
    const propertyTypeError = !formData.propertyType
      ? 'Please select Type of Property / Land'
      : '';

    const newErrors = {
      userRole: userRoleError,
      name: nameRes.error,
      phone: phoneRes.error,
      email: emailRes.error,
      propertyLocation: propertyLocationError,
      landArea: landAreaError,
      propertyType: propertyTypeError,
    };

    setErrors(newErrors);

    const hasErrors =
      userRoleError ||
      !nameRes.isValid ||
      !phoneRes.isValid ||
      !emailRes.isValid ||
      propertyLocationError ||
      landAreaError ||
      propertyTypeError;

    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);
    try {
      const additionalNotes = [
        `Role: ${formData.userRole}`,
        `Property Location: ${formData.propertyLocation.trim()}`,
        `Land Area: ${formData.landArea.trim()} sq.ft.`,
        `Property Type: ${formData.propertyType}`,
        formData.message.trim() ? `Additional Requirements: ${formData.message.trim()}` : '',
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
        projectName: 'Joint Development Program',
        message: additionalNotes,
        source: 'Joint Development Form',
      });

      setShowThankYou(true);

      setFormData({
        userRole: '',
        name: '',
        phone: '',
        email: '',
        propertyLocation: '',
        landArea: '',
        propertyType: '',
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
    <form onSubmit={handleSubmit} noValidate className="space-y-6 pt-2">
      {/* 1. Are you a?* - dropdown */}
      <div>
        <Select
          value={formData.userRole || undefined}
          onValueChange={(val) => {
            setFormData((prev) => ({ ...prev, userRole: val }));
            if (errors.userRole) {
              setErrors((prev) => ({ ...prev, userRole: '' }));
            }
          }}
        >
          <SelectTrigger
            suppressHydrationWarning
            className={`h-14 w-full rounded-full border px-7 text-sm font-semibold outline-none transition cursor-pointer ${
              errors.userRole
                ? 'border-red-400 bg-red-50/40 text-slate-800 focus:ring-2 focus:ring-inset focus:ring-red-400/30 focus:ring-offset-0'
                : 'border-0 bg-slate-100 focus:ring-2 focus:ring-inset focus:ring-rose-500 focus:ring-offset-0'
            } ${!formData.userRole ? 'text-slate-500 font-semibold' : 'text-slate-800 font-semibold'}`}
          >
            <SelectValue placeholder="Are you a?*" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl z-50">
            <SelectItem
              value="Owner"
              className="rounded-xl font-semibold py-2.5 text-slate-700 cursor-pointer hover:bg-slate-50"
            >
              Owner
            </SelectItem>
            <SelectItem
              value="Mediator"
              className="rounded-xl font-semibold py-2.5 text-slate-700 cursor-pointer hover:bg-slate-50"
            >
              Mediator
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.userRole && (
          <p className="mt-1.5 px-4 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
            {errors.userRole}
          </p>
        )}
      </div>

      {/* 2. Name of the Owner / Contact Person* */}
      <div>
        <input
          type="text"
          required
          placeholder="Name of the Owner / Contact Person*"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          onBlur={() => {
            setErrors((prev) => ({
              ...prev,
              name: validateName(formData.name, 'Name of Owner / Contact Person').error,
            }));
          }}
          suppressHydrationWarning
          className={`h-14 w-full rounded-full border px-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-500 transition ${
            errors.name
              ? 'border-red-400 bg-red-50/40 focus:ring-2 focus:ring-inset focus:ring-red-400/30'
              : 'border-0 bg-slate-100 focus:ring-2 focus:ring-inset focus:ring-rose-500'
          }`}
        />
        {errors.name && (
          <p className="mt-1.5 px-4 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
            {errors.name}
          </p>
        )}
      </div>

      {/* 3. Phone Number* */}
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
          placeholder="Phone Number*"
          onBlur={() => {
            setErrors((prev) => ({
              ...prev,
              phone: validatePhone(formData.phone, selectedCountry, true).error,
            }));
          }}
        />
      </div>

      {/* 4. Email ID* */}
      <div>
        <input
          type="email"
          required
          placeholder="Email ID* (e.g. name@gmail.com)"
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
              ? 'border-red-400 bg-red-50/40 focus:ring-2 focus:ring-inset focus:ring-red-400/30'
              : 'border-0 bg-slate-100 focus:ring-2 focus:ring-inset focus:ring-rose-500'
          }`}
        />
        {errors.email && (
          <p className="mt-1.5 px-4 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
            {errors.email}
          </p>
        )}
      </div>

      {/* 5. Property Location* */}
      <div>
        <input
          type="text"
          required
          placeholder="Property Location*"
          value={formData.propertyLocation}
          onChange={(e) => {
            const val = e.target.value;
            setFormData((prev) => ({ ...prev, propertyLocation: val }));
            if (errors.propertyLocation) {
              setErrors((prev) => ({
                ...prev,
                propertyLocation: val.trim() ? '' : 'Property Location is required',
              }));
            }
          }}
          onBlur={() => {
            setErrors((prev) => ({
              ...prev,
              propertyLocation: formData.propertyLocation.trim()
                ? ''
                : 'Property Location is required',
            }));
          }}
          suppressHydrationWarning
          className={`h-14 w-full rounded-full border px-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-500 transition ${
            errors.propertyLocation
              ? 'border-red-400 bg-red-50/40 focus:ring-2 focus:ring-inset focus:ring-red-400/30'
              : 'border-0 bg-slate-100 focus:ring-2 focus:ring-inset focus:ring-rose-500'
          }`}
        />
        {errors.propertyLocation && (
          <p className="mt-1.5 px-4 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
            {errors.propertyLocation}
          </p>
        )}
      </div>

      {/* 6. Land Area (in sq.ft.)* */}
      <div>
        <input
          type="text"
          required
          placeholder="Land Area (in sq.ft.)*"
          value={formData.landArea}
          onChange={(e) => {
            const val = e.target.value;
            setFormData((prev) => ({ ...prev, landArea: val }));
            if (errors.landArea) {
              setErrors((prev) => ({
                ...prev,
                landArea: val.trim() ? '' : 'Land Area (in sq.ft.) is required',
              }));
            }
          }}
          onBlur={() => {
            setErrors((prev) => ({
              ...prev,
              landArea: formData.landArea.trim()
                ? ''
                : 'Land Area (in sq.ft.) is required',
            }));
          }}
          suppressHydrationWarning
          className={`h-14 w-full rounded-full border px-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-500 transition ${
            errors.landArea
              ? 'border-red-400 bg-red-50/40 focus:ring-2 focus:ring-inset focus:ring-red-400/30'
              : 'border-0 bg-slate-100 focus:ring-2 focus:ring-inset focus:ring-rose-500'
          }`}
        />
        {errors.landArea && (
          <p className="mt-1.5 px-4 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
            {errors.landArea}
          </p>
        )}
      </div>

      {/* 7. Type of Property / Land* - dropdown */}
      <div>
        <Select
          value={formData.propertyType || undefined}
          onValueChange={(val) => {
            setFormData((prev) => ({ ...prev, propertyType: val }));
            if (errors.propertyType) {
              setErrors((prev) => ({ ...prev, propertyType: '' }));
            }
          }}
        >
          <SelectTrigger
            suppressHydrationWarning
            className={`h-14 w-full rounded-full border px-7 text-sm font-semibold outline-none transition cursor-pointer ${
              errors.propertyType
                ? 'border-red-400 bg-red-50/40 text-slate-800 focus:ring-2 focus:ring-inset focus:ring-red-400/30 focus:ring-offset-0'
                : 'border-0 bg-slate-100 focus:ring-2 focus:ring-inset focus:ring-rose-500 focus:ring-offset-0'
            } ${!formData.propertyType ? 'text-slate-500 font-semibold' : 'text-slate-800 font-semibold'}`}
          >
            <SelectValue placeholder="Type of Property / Land*" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl z-50">
            <SelectItem
              value="Residential"
              className="rounded-xl font-semibold py-2.5 text-slate-700 cursor-pointer hover:bg-slate-50"
            >
              Residential
            </SelectItem>
            <SelectItem
              value="Agricultural"
              className="rounded-xl font-semibold py-2.5 text-slate-700 cursor-pointer hover:bg-slate-50"
            >
              Agricultural
            </SelectItem>
            <SelectItem
              value="Commercial"
              className="rounded-xl font-semibold py-2.5 text-slate-700 cursor-pointer hover:bg-slate-50"
            >
              Commercial
            </SelectItem>
            <SelectItem
              value="Other"
              className="rounded-xl font-semibold py-2.5 text-slate-700 cursor-pointer hover:bg-slate-50"
            >
              Other
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.propertyType && (
          <p className="mt-1.5 px-4 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
            {errors.propertyType}
          </p>
        )}
      </div>

      {/* 8. Message / Additional Requirements – Optional */}
      <div>
        <textarea
          rows={5}
          placeholder="Message / Additional Requirements (Optional)"
          value={formData.message}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              message: e.target.value,
            }))
          }
          className="w-full resize-none rounded-[28px] border-0 bg-slate-100 px-7 py-6 text-sm text-slate-800 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-rose-500 font-medium"
        />
      </div>

      {/* Consent */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          required
          checked={formData.consent}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              consent: e.target.checked,
            }))
          }
          className="mt-1 h-4 w-4 accent-rose-600 cursor-pointer"
        />
        <label className="text-xs leading-relaxed text-slate-600 select-none">
          I authorise KPN Promoters Pvt Ltd and its representatives to contact me with updates and
          notifications via Email / SMS / WhatsApp / Call. This will override on DND/NDNC.
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

      {/* Branded Thank You Modal */}
      <SubmissionThankYouModal
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
        title="Joint Development Request Received!"
        message="Thank you for submitting your details for Joint Development! We have received your property information and our senior development team will contact you shortly."
        userName={submittedInfo.name}
        userPhone={submittedInfo.phone}
      />
    </form>
  );
}
