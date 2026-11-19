import type { CheckoutSession, PaymentVerification } from "@/types";
import { ApiNotImplementedError } from "./errors";

/**
 * STRIPE CHECKOUT
 * ---------------
 * Payment success is never assumed in the browser. After Stripe redirects
 * back, call verifyPayment() and trust only the verified backend response.
 */

// TODO: Implement POST /api/payments/checkout.
// Auth: customer JWT.
// Body: { appointmentId: string }.
// Response: { success, message, data: CheckoutSession }.
// Then redirect the browser to data.checkoutUrl.
// Used by: CustomerAppointmentsPage "Pay now" action.
export async function createCheckoutSession(
  appointmentId: string,
): Promise<CheckoutSession> {
  void appointmentId;
  throw new ApiNotImplementedError("createCheckoutSession");
}

// TODO: Implement GET /api/payments/verify?session_id=...
// Auth: customer JWT.
// Query: session_id (the Stripe Checkout Session ID from the URL).
// Response: { success, message, data: PaymentVerification }.
// Only show "Payment successful" when data.status === "paid".
// Used by: PaymentSuccessPage.
export async function verifyPayment(
  sessionId: string,
): Promise<PaymentVerification> {
  void sessionId;
  throw new ApiNotImplementedError("verifyPayment");
}
