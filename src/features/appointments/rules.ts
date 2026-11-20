import type { Appointment } from "@/features/appointments/types";

/**
 * Display helpers for appointment rows.
 * The backend stores a snapshot of the service, so pages still show a useful
 * name and image even if the service record changes later.
 */
export function getAppointmentService(appointment: Appointment) {
  return {
    name: appointment.serviceSnapshot?.serviceName ?? "Salon service",
    category: appointment.serviceSnapshot?.category ?? "Service",
    image: appointment.serviceSnapshot?.image ?? "",
    duration: appointment.serviceSnapshot?.duration ?? null,
  };
}

/** Customers may cancel pending appointments only. */
export function canCustomerCancel(appointment: Appointment) {
  return appointment.status === "pending";
}

/** Pay is allowed only for confirmed, unpaid appointments. */
export function canCustomerPay(appointment: Appointment) {
  return appointment.status === "confirmed" && appointment.paymentStatus === "unpaid";
}
