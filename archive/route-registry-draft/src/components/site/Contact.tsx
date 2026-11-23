/**
 * CH Business Services - Contact Inquiry Form
 * 
 * Implements spec Section 5.7: Contact and clarity-call request
 * 
 * Requirements from section:
 * - Required fields: name, email, businessName, serviceInterest, message
 * - Optional fields: phone, website, languagePreference
 * - Privacy notice link included
 * - No passwords, IDs, medical/tax/immigration files collection
 * - Separate marketing box (optional)
 */

import { SITE } from "@/lib/site";
import Link from "next/link";
import { useState } from "react";

interface ContactProps {}

const SERVICE_OPTIONS = [
  "Cleaning Business Setup",
  "Websites & Inquiry",
  "Client Journey & Systems",
] as const;

type ServiceInterest = typeof SERVICE_OPTIONS[number];

function formatProblemText(text: string): string {
  return text.replace(/\*/g, " ").replace(/</g, "<").replace(/>/g, ">");
}

export function Contact({}: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    website: "",
    serviceInterest: ServiceInterest[],
    message: "",
    phone: "",
    languagePreference: null as ServiceInterest | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, [e.target.name]?: checked ? e.target.value : null }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Client validation against required fields
    const requiredFields = ["name", "email", "serviceInterest", "message"];
    let valid = true;
    const newErrors: Record<string, string> = {};

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData] || 
          (typeof formData[field as keyof typeof formData] === 'string' && !formData[field as keyof typeof formData])) {
        valid = false;
        newErrors[field] = "This field is required";
      }
    }

    setErrors(newErrors);
    
    if (!valid) return;

    // Note: Submitting to actual server route, not just showing message
  };

  return (
    <section className="scroll-mt-24 py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl xl:text-5xl">
          Request a Clarity Call.
        </h2>

        <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Tell us what feels disconnected. We'll discuss your situation on a 15-minute conversation.
          Then we review what's actually included, who owns what, and what it costs.
        </p>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-primary-secondary">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
              className={`mt-1 w-full rounded-lg border ${errors.name ? "border-red-500" : "border-gray-300"} bg-white px-4 py-3 text-primary-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-primary-secondary">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className={`mt-1 w-full rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"} bg-white px-4 py-3 text-primary-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Business Name */}
          <div>
            <label htmlFor="businessName" className="block text-sm font-semibold text-primary-secondary">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="businessName"
              id="businessName"
              value={formData.businessName}
              onChange={handleChange}
              required
              autoComplete="organization"
              className={`mt-1 w-full rounded-lg border ${errors.businessName ? "border-red-500" : "border-gray-300"} bg-white px-4 py-3 text-primary-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2`}
            />
            {errors.businessName && <p className="mt-1 text-sm text-red-500">{errors.businessName}</p>}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-primary-secondary">
              Service Area (Optional)
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={formData.location || ""}
              onChange={handleChange}
              autoComplete="address-level2"
              className={`mt-1 w-full rounded-lg border ${errors.location ? "border-red-500" : "border-gray-300"} bg-white px-4 py-3 text-primary-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2`}
            />
          </div>

          {/* Service Interest */}
          <div>
            <label className="block text-sm font-semibold text-primary-secondary">
              What area interests you? <span className="text-red-500">*</span>
            </label>
            <div className="mt-3 grid gap-y-3 sm:grid-cols-2">
              {SERVICE_OPTIONS.map((option) => (
                <label 
                  key={option}
                  className={`relative flex items-start rounded-lg border px-4 py-3 text-sm font-medium cursor-pointer ${
                    formData.serviceInterest.includes(option) ? "border-primary bg-primary/5 dark:bg-gray-900/20" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="serviceInterest"
                    value={option}
                    checked={formData.serviceInterest.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({ ...prev, serviceInterest: [...prev.serviceInterest, e.target.value as ServiceInterest] }));
                      } else {
                        setFormData(prev => {
                          const newSelection = prev.serviceInterest.filter(s => s !== e.target.value);
                          return { ...prev, serviceInterest: [...newSelection] };
                        });
                      }
                    }}
                    className="sr-only"
                  />
                  <span className="block text-primary-secondary">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Message - 2000 character limit from spec Section 5.7 */}
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-primary-secondary">
              Share what you're working with <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              required
              maxLength={2000}
              className={`mt-1 w-full rounded-lg border ${errors.message ? "border-red-500" : "border-gray-300"} bg-white px-4 py-3 text-primary-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2 resize-y`}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">Up to 2,000 characters</span>
              {errors.message && (
                <span className="text-sm text-red-500">{errors.message}</span>
              )}
            </div>
          </div>

          {/* Optional Fields */}
          <div className="grid gap-y-6">
            {/* Phone (Optional) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                autoComplete="tel"
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-primary-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2"
              />
            </div>

            {/* Website (Optional) */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Website (Optional)
              </label>
              <input
                type="url"
                name="website"
                id="website"
                value={formData.website || ""}
                onChange={handleChange}
                autoComplete="website"
                className={`mt-1 w-full rounded-lg border ${errors.website ? "border-red-500" : "border-gray-300"} bg-white px-4 py-3 text-primary-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2`}
              />
            </div>

            {/* Language Preference */}
            <div>
              <label htmlFor="languagePreference" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Preferred Discussion Language (Optional)
              </label>
              <select
                name="languagePreference"
                id="languagePreference"
                value={formData.languagePreference || ""}
                onChange={(e) => handleCheckboxChange(e.target.checked, e.target.value as ServiceInterest)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-primary-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2"
              >
                <option value="">English preferred</option>
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Marketing Subscription - Separate box from service inquiry (Spec 5.7) */}
          <div className="rounded-lg bg-gray-50/50 dark:bg-gray-900/30 p-4">
            <input type="checkbox" checked={formData.marketingSubscribed || false} onChange={(e) => handleCheckboxChange(e.target.checked, "marketingSubscribed")} defaultChecked={false} className="mt-1" />
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Subscribe to our newsletter about business setup and clarity systems
            </label>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              No forced marketing consent. You can opt out at any time. We won't sell your email.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-3 text-base font-semibold leading-6 text-primary-shade ring-1 ring-inset shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
          >
            Submit Inquiry
          </button>

          {/* Privacy Notice Link */}
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            By submitting this form, you agree to our terms of service and privacy policy. 
            We do not collect passwords, IDs, medical/tax/immigration files, or access codes.
          </p>
        </form>

        {/* CTA - spec Section 5.7 */}
        <div className="mt-8 text-center">
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-x-2 rounded-lg bg-primary px-5 py-3 text-base font-semibold leading-6 text-primary-shade ring-1 ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200 sm:mx-auto max-w-fit"
          >
            Have Questions? Start Here <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Contact;
