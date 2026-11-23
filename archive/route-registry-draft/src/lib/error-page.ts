/**
 * CH Business Services - Error Page Component
 * 
 * Implements spec Section 3: Site layers and navigation (error handling)
 * 
 * This provides user-friendly error pages following the operating platform specification.
 */

import Link from "next/link";

// Error page for 404 - spec Section 3 requirements
export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-primary-secondary">404</h1>
        
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
          We couldn't find that page.
        </p>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-prose">
          Check our navigation or contact us directly.
        </p>

        <Link 
          href="/" 
          className="inline-block mt-6 rounded-lg bg-primary px-6 py-3 text-base font-semibold leading-6 text-white ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200"
        >
          Return Home
        </Link>

        {/* Contact info */}
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Questions? Reach out to us via our contact form at office@chbusinessservices.pro
        </p>
      </div>
    </div>
  );
}

// Error page for server issues - spec Section 16 security requirements
export function InternalError({ error }: { error: unknown }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-primary-secondary">500</h1>
        
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
          Something went wrong.
        </p>
        
        {/* Spec Section 16: Security requirements */}
        <div className="rounded-lg border bg-gray-50 dark:bg-gray-800 p-6 max-w-prose">
          <h2 className="text-base font-semibold text-primary-secondary mb-2">
            Contact Us
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            If this is a problem with your inquiry or submission, please reach out to us. We'll review 
            and respond within 24 hours.
          </p>
        </div>

        <Link 
          href="/contact" 
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-base font-semibold leading-6 text-white ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}

// Maintenance mode page - spec Section 3 requirements
export function Maintenance() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-8">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6 text-primary-secondary">
          We're Not Available Right Now
        </h1>
        
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 max-w-prose mx-auto">
          All systems are operational. Please try again later or use our contact form.
        </p>
        
        <div className="rounded-lg bg-primary/5 p-6 mb-6 border-l-4 border-primary">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Our team is focused on delivering commitments and reviewing inquiries thoroughly. 
            Please reach out via our contact form at office@chbusinessservices.pro.
          </p>
        </div>

        <Link 
          href="/contact" 
          className="inline-block rounded-lg bg-primary px-6 py-3 text-base font-semibold leading-6 text-white ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200"
        >
          Contact Us Directly
        </Link>

        {/* Timeout message - spec Section 16 */}
        <div className="mt-8">
          {process.env.NODE_ENV === "development" && (
            <p className="text-xs text-gray-400 mt-4">
              Note: This is a maintenance mode page. 
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Rate limited error - spec Section 7 requirements
export function RateLimited() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-primary-secondary">429</h1>
        
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          Too many submissions
        </p>
        
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-6 border-l-4 border-red-500 max-w-prose mx-auto">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Submit too frequently. Please try again in 60 seconds.
          </p>
          
          <Link 
            href="/contact" 
            className="inline-block rounded-lg bg-primary px-5 py-2 text-base font-semibold leading-6 text-white ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200"
          >
            Try Again Later
          </Link>
        </div>

        {/* Contact info - spec Section 16 */}
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          For support or questions: office@chbusinessservices.pro
        </p>
      </div>
    </div>
  );
}

// Request received - confirmation page - spec Section 7.1 requirements
export function Received() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-8">
      <div className="text-center max-w-lg mx-auto px-4">
        <div className="mb-6">
          <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2v9a7 7 0 01-14 0V10a3 3 0 006 0zM3 5c0 3 3 6 8 6s8-3 8-6zm0 0V5m0 16a8 8 0 008-8h-2a4 4 0 018 0v10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-primary-secondary">We've Received Your Inquiry</h1>
        
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-prose">
          Thank you for reaching out. Our team will contact you within 24 hours.
        </p>

        <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-6 mb-6 border-l-4 border-primary">
          <h3 className="text-base font-semibold text-primary-secondary mb-2">What Happens Next?</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1 max-w-prose">
            <li>We review your inquiry within 4 hours</li>
            <li>Contacted call happens within 24 hours if scheduled</li>
            <li>Discussion about scope, responsibilities, and pricing</li>
            <li>Agreement before any work begins</li>
          </ul>
        </div>

        <Link 
          href="/contact" 
          className="inline-block rounded-lg bg-primary px-6 py-3 text-base font-semibold leading-6 text-white ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200"
        >
          Contact Us Directly
        </Link>

        {/* Privacy notice - spec Section 5.9 */}
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          We do not collect passwords, IDs, medical/tax/immigration files, or access codes through forms.
        </p>
      </div>
    </div>
  );
}

export default {
  NotFound,
  InternalError,
  Maintenance,
  RateLimited,
  Received,
};
