<<<<<<< HEAD
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
=======
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { AlertCircle, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { inquiryFieldsSchema } from "@/lib/inquiry-schema";
import { submitInquiry } from "@/lib/inquiries.functions";
import { SERVICE_OPTIONS, SITE } from "@/lib/site";
import { PREFILL_INQUIRY_EVENT, type PrefillInquiryDetail } from "@/lib/agent/roles";
import { cn } from "@/lib/utils";
>>>>>>> 110d2b289c8d5b72653d4df157ec3efa07e47bf3

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

<<<<<<< HEAD
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // In production, this would call /api/inquiries POST
    // For now, show loading state
    console.log("Inquiry submitted:", formData);
    alert("This is a demo form. In production, submit to /api/inquiries endpoint");
  };
=======
  useEffect(() => {
    if (phase.kind === "success") successRef.current?.focus();
  }, [phase.kind]);

  // The site assistant can hand over a visitor-approved summary for the message field.
  useEffect(() => {
    function onPrefill(e: Event) {
      const message = (e as CustomEvent<PrefillInquiryDetail>).detail?.message?.trim();
      if (!message) return;
      setPhase({ kind: "idle" });
      startedAt.current = Date.now();
      // Wait for the form to be visible again if it was showing the success screen.
      window.setTimeout(() => {
        form.setValue("message", message.slice(0, 2000), { shouldDirty: true, shouldValidate: true });
        form.setFocus("message");
      }, 0);
    }
    window.addEventListener(PREFILL_INQUIRY_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_INQUIRY_EVENT, onPrefill);
  }, [form]);

  const onSubmit = form.handleSubmit(async (values) => {
    setPhase({ kind: "idle" });
    try {
      const result = await submit({
        data: {
          ...values,
          company: honeypot.current?.value ?? "",
          elapsedMs: Math.max(0, Date.now() - startedAt.current),
        },
      });
      if (result.ok) {
        setPhase({ kind: "success" });
        form.reset();
      } else {
        setPhase({ kind: "error", message: result.message });
      }
    } catch (err) {
      console.error(err);
      setPhase({
        kind: "error",
        message:
          "We couldn't confirm that your inquiry was sent. Please try again, or contact us directly.",
      });
    }
  });

  if (phase.kind === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="border border-foreground bg-background p-7 outline-none md:p-10"
      >
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background">
          <Check className="h-5 w-5" aria-hidden />
        </span>
        <h3 className="display mt-6 text-3xl md:text-4xl">Thank you.</h3>
        <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed">
          Your inquiry has been received. CH will contact you to discuss the next step.
        </p>

        {SITE.bookingUrl && (
          <div className="mt-8 border-t pt-8">
            <p className="text-[0.98rem] leading-relaxed text-muted-foreground">
              Want to secure a time right away? Schedule directly on our calendar:
            </p>
            <Button asChild size="xl" className="mt-5 w-full sm:w-auto">
              <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer">
                Book 15-Minute Clarity Call
                <ArrowUpRight aria-hidden />
              </a>
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Opens our booking calendar in a new tab. Your inquiry stays on file either way.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            startedAt.current = Date.now();
            setPhase({ kind: "idle" });
          }}
          className="link-underline mt-8 text-sm text-muted-foreground"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  const isSubmitting = form.formState.isSubmitting;
  const messageLength = form.watch("message")?.length ?? 0;
>>>>>>> 110d2b289c8d5b72653d4df157ec3efa07e47bf3

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
