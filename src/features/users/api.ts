import { apiRequest } from "@/lib/api-client";
import type { UpdateProfileInput, UserListParams, UserListResponse, UserResponse } from "@/features/users/types";

/**
 * CURRENT USER
 * ------------
 * Works for both customers and admins.
 */

export async function getMyProfile(): Promise<UserResponse> {
  return apiRequest<UserResponse>("/api/users/me", { auth: true });
}

export async function updateMyProfile(
  input: UpdateProfileInput,
): Promise<UserResponse> {
  // Only name, image and phone are accepted by the backend.
  return apiRequest<UserResponse>("/api/users/me", {
    method: "PATCH",
    auth: true,
    body: input,
  });
}

/**
 * ADMIN CUSTOMER MANAGEMENT
 * -------------------------
 * Administrator accounts are excluded by the backend.
 */

export async function getCustomers(
  params: UserListParams = {},
): Promise<UserListResponse> {
  return apiRequest<UserListResponse>("/api/admin/users", {
    auth: true,
    query: {
      search: params.search,
      page: params.page,
      limit: params.limit,
    },
  });
}

export async function getCustomerById(id: string): Promise<UserResponse> {
  return apiRequest<UserResponse>(`/api/admin/users/${id}`, { auth: true });
}

export async function blockCustomer(id: string): Promise<UserResponse> {
  return apiRequest<UserResponse>(`/api/admin/users/${id}/block`, {
    method: "PATCH",
    auth: true,
  });
}

export async function unblockCustomer(id: string): Promise<UserResponse> {
  return apiRequest<UserResponse>(`/api/admin/users/${id}/unblock`, {
    method: "PATCH",
    auth: true,
  });
}

/** Aliases that match the names used in the integration guide. */
export const getAdminUsers = getCustomers;
export const getAdminUserById = getCustomerById;
export const blockUser = blockCustomer;
export const unblockUser = unblockCustomer;
