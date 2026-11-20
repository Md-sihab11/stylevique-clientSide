import { apiRequest } from "@/lib/api-client";
import type { AdminAppointmentListParams, AdminAppointmentListResponse, AppointmentListParams, AppointmentListResponse, AppointmentResponse, CreateAppointmentInput, UpdateAppointmentStatusInput } from "@/features/appointments/types";

/**
 * CUSTOMER APPOINTMENTS
 * ---------------------
 * All of these calls require a customer JWT. The shared API client adds the
 * `Authorization: Bearer <token>` header because auth is true.
 */

export async function createAppointment(
  input: CreateAppointmentInput,
): Promise<AppointmentResponse> {
  return apiRequest<AppointmentResponse>("/api/appointments", {
    method: "POST",
    auth: true,
    body: input,
  });
}

export async function getMyAppointments(
  params: AppointmentListParams = {},
): Promise<AppointmentListResponse> {
  return apiRequest<AppointmentListResponse>("/api/appointments/my", {
    auth: true,
    query: {
      status: params.status,
      page: params.page,
      limit: params.limit,
    },
  });
}

export async function getAppointmentById(
  id: string,
): Promise<AppointmentResponse> {
  return apiRequest<AppointmentResponse>(`/api/appointments/${id}`, {
    auth: true,
  });
}

export async function cancelAppointment(
  id: string,
): Promise<AppointmentResponse> {
  return apiRequest<AppointmentResponse>(`/api/appointments/${id}/cancel`, {
    method: "PATCH",
    auth: true,
  });
}

/**
 * ADMIN APPOINTMENTS
 * ------------------
 */

export async function getAdminAppointments(
  params: AdminAppointmentListParams = {},
): Promise<AdminAppointmentListResponse> {
  return apiRequest<AdminAppointmentListResponse>("/api/admin/appointments", {
    auth: true,
    query: {
      status: params.status,
      date: params.date,
      page: params.page,
      limit: params.limit,
    },
  });
}

export async function updateAdminAppointmentStatus(
  id: string,
  input: UpdateAppointmentStatusInput,
): Promise<AppointmentResponse> {
  return apiRequest<AppointmentResponse>(
    `/api/admin/appointments/${id}/status`,
    {
      method: "PATCH",
      auth: true,
      body: input,
    },
  );
}

/** Alias that matches the name used in the integration guide. */
export const updateAppointmentStatus = updateAdminAppointmentStatus;
