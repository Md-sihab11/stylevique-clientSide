import type { User } from "./user";

export type AppointmentStatus = "pending" | "confirmed" | "cancelled";
export type AppointmentPaymentStatus = "unpaid" | "paid";

/** A lightweight copy of the service stored with each appointment. */
export interface ServiceSnapshot {
  serviceName: string;
  category: string;
  image: string;
  duration: number;
}

export interface Appointment {
  id: string;
  serviceId: string;
  customerId: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  message: string;
  servicePrice: number;
  status: AppointmentStatus;
  paymentStatus: AppointmentPaymentStatus;
  serviceSnapshot: ServiceSnapshot | null;
  checkoutSessionId: string | null;
  confirmedAt: string | null;
  cancelledAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Admin appointment rows include the related customer record. */
export interface AdminAppointment extends Appointment {
  customer: User | null;
}

export interface AppointmentListParams {
  status?: AppointmentStatus | "";
  page?: number;
  limit?: number;
}

export interface AdminAppointmentListParams extends AppointmentListParams {
  date?: string;
}

export interface AppointmentListResponse {
  appointments: Appointment[];
  pagination: import("./api").Pagination;
}

export interface AdminAppointmentListResponse {
  appointments: AdminAppointment[];
  pagination: import("./api").Pagination;
}

export interface AppointmentResponse {
  appointment: Appointment;
}

/** Body accepted by POST /api/appointments */
export interface CreateAppointmentInput {
  serviceId: string;
  appointmentDate: string;
  timeSlot: string;
  message?: string;
}

/** Body accepted by PATCH /api/admin/appointments/:id/status */
export interface UpdateAppointmentStatusInput {
  status: "confirmed" | "cancelled";
}
