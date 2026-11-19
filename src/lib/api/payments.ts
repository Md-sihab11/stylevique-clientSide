import { apiRequest } from "@/lib/api-client";
import type { CheckoutSession, PaymentVerification } from "@/types";

/**
 * STRIPE CHECKOUT
 * ---------------
 * The frontend never marks a payment as successful. After Stripe redirects
 * back, verifyPayment() asks the backend, which trusts only its webhook data.
 */

export async function createCheckoutSession(
  appointmentId: string,
): Promise<CheckoutSession> {
  return apiRequest<CheckoutSession>("/api/payments/checkout", {
    method: "POST",
    auth: true,
    body: { appointmentId },
  });
}

export async function verifyPayment(
  sessionId: string,
): Promise<PaymentVerification> {
  return apiRequest<PaymentVerification>("/api/payments/verify", {
    auth: true,
    query: { session_id: sessionId },
  });
}
