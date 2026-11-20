import type { AppointmentPaymentStatus, AppointmentStatus, ServiceSnapshot } from "@/features/appointments/types";
import type { User } from "@/features/users/types";

export type TransactionStatus = "paid" | "failed";

export interface TransactionAppointment {
  id: string;
  appointmentDate: string;
  timeSlot: string;
  status: AppointmentStatus;
  paymentStatus: AppointmentPaymentStatus;
  servicePrice: number;
  serviceSnapshot: ServiceSnapshot | null;
}

export interface Transaction {
  id: string;
  appointmentId: string;
  customerId: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  stripeEventId: string;
  paymentIntentId: string | null;
  status: TransactionStatus;
  createdAt: string;
  appointment: TransactionAppointment | null;
  /** Present only on the admin transactions endpoint. */
  customer?: User | null;
}

export interface TransactionListParams {
  status?: TransactionStatus | "";
  page?: number;
  limit?: number;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  pagination: import("@/types/api").Pagination;
}
