/**
 * Phase Three payment configuration and data types.
 *
 * Stripe secret operations must remain in a server-only function. This module
 * deliberately contains no browser-side Stripe secret or direct payment writes.
 */

export interface PaymentIntent {
  id: string;
  projectId: string;
  amountCents: number;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

export interface PaymentConfiguration {
  configured: boolean;
  recurringBillingEnabled: boolean;
  webhookConfigured: boolean;
}

export function getPaymentConfiguration(): PaymentConfiguration {
  return {
    configured: Boolean(import.meta.env["VITE_STRIPE_PUBLISHABLE_KEY"]),
    recurringBillingEnabled: false,
    webhookConfigured: false,
  };
}

export function validateFixedScopeAmount(amountCents: number): boolean {
  return Number.isInteger(amountCents) && amountCents > 0;
}
