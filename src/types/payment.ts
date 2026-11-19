import type { AppointmentPaymentStatus } from "./appointment";
import type { Transaction } from "./transaction";

export type PaymentVerificationStatus = "pending" | "paid" | "failed";

export interface CheckoutSession {
  checkoutUrl: string;
  sessionId: string;
  appointmentId: string;
  amount: number;
  currency: string;
}

export interface PaymentVerification {
  status: PaymentVerificationStatus;
  appointmentId: string;
  paymentStatus: AppointmentPaymentStatus;
  amount: number;
  currency: string;
  verifiedByWebhook: boolean;
  transaction: Transaction | null;
}

export interface UploadedImage {
  url: string;
}
