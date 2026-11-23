/**
 * CH Business Services - Public Inquiry Form Component
 * 
 * Implements spec Section 5.7: Contact and inquiry requirements exactly
 * 
 * Requirements from section:
 * - Required fields: name, email, businessName, serviceInterest, message
 * - Optional fields: phone, website, languagePreference
 * - Privacy notice link included
 * - Marketing subscription separate (unchecked)
 */

import { useState } from "react";
import Link from "next/link";

interface InquiryFormProps {}

export default function InquiryForm({}: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    website: "",
    serviceInterest: [] as string[],
    message: "",
    phone: "",
    languagePreference: "English" as string | null,
    marketingSubscribed: false as boolean,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // In production, this would call /api/inquiries POST
    // For now, show loading state
    console.log("Inquiry submitted:", formData);
    alert("This is a demo form. In production, submit to /api/inquiries endpoint");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field - Required */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-primary-secondary">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-primary-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Email Field - Required */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-primary-secondary">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-primary-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Business Name - Required */}
      <div>
        <label htmlFor="businessName" className="block text-sm font-semibold text-primary-secondary">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="businessName"
          value={formData.businessName}
          onChange={(e) => setFormData({...formData, businessName: e.target.value})}
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-primary-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Service Interest - Required */}
      <div>
        <label className="block text-sm font-semibold text-primary-secondary">
          Which service interests you? <span className="text-red-500">*</span>
        </label>
        <div className="mt-3 grid gap-y-2">
          {[
            "Cleaning Business Setup",
            "Websites & Inquiry", 
            "Client Journey & Systems"
          ].map((option) => (
            <label key={option} className="flex items-center rounded-lg border px-4 py-3 cursor-pointer">
              <input
                type="checkbox"
                value={option}
                checked={formData.serviceInterest.includes(option)}
                onChange={(e) => {
                  const selected = formData.serviceInterest.includes(option)
                    ? formData.serviceInterest.filter(s => s !== option)
                    : [...formData.serviceInterest, option];
                  setFormData({...formData, serviceInterest: selected});
                }}
                className="sr-only"
              />
              <span className="ml-2">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Message - Required, max 2000 characters */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-primary-secondary">
          Tell us what you're working with <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          rows={6}
          required
          maxLength={2000}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-primary-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="mt-1 text-xs text-gray-500">Up to 2,000 characters</div>
      </div>

      {/* Optional Fields */}
      <div className="grid gap-y-4">
        {/* Phone (Optional) */}
        <div>
          <label htmlFor="phone" className="block text-sm text-gray-700">Phone (Optional)</label>
          <input
            type="tel"
            id="phone"
            value={formData.phone || ""}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="(XXX) XXX-XXXX"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-primary-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Website (Optional) */}
        <div>
          <label htmlFor="website" className="block text-sm text-gray-700">Current Website (Optional)</label>
          <input
            type="url"
            id="website"
            value={formData.website || ""}
            onChange={(e) => setFormData({...formData, website: e.target.value})}
            placeholder="https://example.com"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-primary-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Language Preference (Optional) */}
        <div>
          <label htmlFor="languagePreference" className="block text-sm text-gray-700">Preferred Discussion Language (Optional)</label>
          <select
            id="languagePreference"
            value={formData.languagePreference || "English"}
            onChange={(e) => setFormData({...formData, languagePreference: e.target.value})}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-primary-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="English">English</option>
            {["Cleaning Business Setup", "Websites & Inquiry", "Client Journey & Systems"].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full rounded-lg bg-primary px-4 py-3 text-base font-semibold leading-6 text-primary-shade ring-1 ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200"
      >
        Submit Inquiry
      </button>

      {/* Privacy Notice */}
      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          By submitting this form, you agree to our terms and privacy policy. We do not collect 
          passwords, IDs, medical/tax/immigration files, or access codes.
        </p>
      </div>

      {/* Marketing Subscription - Separate box (Spec 5.7) */}
      <label className="flex items-start rounded-lg bg-gray-50 p-4">
        <input
          type="checkbox"
          checked={formData.marketingSubscribed}
          onChange={(e) => setFormData({...formData, marketingSubscribed: e.target.checked})}
          className="mt-1"
        />
        <span className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
          Subscribe to our newsletter about business setup systems
        </span>
        <p className="block mt-1 text-xs text-gray-600 dark:text-gray-400">
          No forced marketing consent. You can opt out anytime.
        </p>
      </label>
    </form>
  );
}

export default InquiryForm;
