/**
 * Phase Three billing reconciliation helpers.
 *
 * These helpers do not assume unpublished database tables or perform writes
 * directly from the browser. Persistence belongs in an authenticated server
 * function after the corresponding schema is provisioned.
 */

export type DeliveryStatus = "completed" | "in_progress" | "pending";

export interface PaymentRecord {
  id: string;
  projectId: string;
  amountCents: number;
  status: "pending" | "completed" | "failed";
}

export function getDeliveryStatusByWorkflowState(status: string): DeliveryStatus {
  switch (status) {
    case "completed":
      return "completed";
    case "active":
      return "in_progress";
    default:
      return "pending";
  }
}
