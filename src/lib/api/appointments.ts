import type {
  AdminAppointmentListParams,
  AdminAppointmentListResponse,
  AppointmentListParams,
  AppointmentListResponse,
  AppointmentResponse,
  CreateAppointmentInput,
  UpdateAppointmentStatusInput,
} from "@/types";
import { ApiNotImplementedError } from "./errors";

/**
 * CUSTOMER APPOINTMENTS
 * ---------------------
 * These endpoints require a customer JWT. Admins cannot create customer
 * appointments, so the booking form is hidden for admin accounts.
 */

// TODO: Implement POST /api/appointments.
// Auth: customer JWT.
// Body: CreateAppointmentInput ({ serviceId, appointmentDate, timeSlot, message }).
// Response: AppointmentResponse.
// Used by: BookingForm on ServiceDetailsPage.
export async function createAppointment(
  input: CreateAppointmentInput,
): Promise<AppointmentResponse> {
  void input;
  throw new ApiNotImplementedError("createAppointment");
}

// TODO: Implement GET /api/appointments/my.
// Auth: customer JWT.
// Query: status, page, limit.
// Response: AppointmentListResponse.
// Used by: CustomerAppointmentsPage, CustomerOverviewPage.
export async function getMyAppointments(
  params: AppointmentListParams = {},
): Promise<AppointmentListResponse> {
  void params;
  throw new ApiNotImplementedError("getMyAppointments");
}

// TODO: Implement GET /api/appointments/:id.
// Auth: customer JWT (or admin JWT).
// Response: AppointmentResponse.
// Used by: AppointmentDetailsPage.
export async function getAppointmentById(
  id: string,
): Promise<AppointmentResponse> {
  void id;
  throw new ApiNotImplementedError("getAppointmentById");
}

// TODO: Implement PATCH /api/appointments/:id/cancel.
// Auth: customer JWT.
// Body: none.
// Response: AppointmentResponse.
// Used by: CustomerAppointmentsPage and AppointmentDetailsPage.
// Rule: customers may cancel pending appointments only.
export async function cancelAppointment(
  id: string,
): Promise<AppointmentResponse> {
  void id;
  throw new ApiNotImplementedError("cancelAppointment");
}

/**
 * ADMIN APPOINTMENTS
 * ------------------
 */

// TODO: Implement GET /api/admin/appointments.
// Auth: admin JWT.
// Query: status, date (YYYY-MM-DD), page, limit.
// Response: AdminAppointmentListResponse. Each row also contains `customer`.
// Used by: AdminAppointmentsPage.
export async function getAdminAppointments(
  params: AdminAppointmentListParams = {},
): Promise<AdminAppointmentListResponse> {
  void params;
  throw new ApiNotImplementedError("getAdminAppointments");
}

// TODO: Implement PATCH /api/admin/appointments/:id/status.
// Auth: admin JWT.
// Body: UpdateAppointmentStatusInput ({ status: "confirmed" | "cancelled" }).
// Response: AppointmentResponse.
// Used by: AdminAppointmentsPage confirm/cancel actions.
// Rule: pending -> confirmed or cancelled; confirmed -> cancelled only.
export async function updateAdminAppointmentStatus(
  id: string,
  input: UpdateAppointmentStatusInput,
): Promise<AppointmentResponse> {
  void id;
  void input;
  throw new ApiNotImplementedError("updateAdminAppointmentStatus");
}
