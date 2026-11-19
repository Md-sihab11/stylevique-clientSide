import type {
  UpdateProfileInput,
  UserListParams,
  UserListResponse,
  UserResponse,
} from "@/types";
import { ApiNotImplementedError } from "./errors";

/**
 * CURRENT USER
 * ------------
 * These endpoints work for both customers and admins.
 */

// TODO: Implement GET /api/users/me.
// Auth: any signed-in user.
// Response: UserResponse.
// Used by: Profile forms, dashboard header, role-aware navigation.
export async function getMyProfile(): Promise<UserResponse> {
  throw new ApiNotImplementedError("getMyProfile");
}

// TODO: Implement PATCH /api/users/me.
// Auth: any signed-in user.
// Body: UpdateProfileInput (name, image, phone only).
// Response: UserResponse.
// Used by: CustomerProfilePage and AdminProfilePage.
// Note: email, role and isBlocked are intentionally not editable here.
export async function updateMyProfile(
  input: UpdateProfileInput,
): Promise<UserResponse> {
  void input;
  throw new ApiNotImplementedError("updateMyProfile");
}

/**
 * ADMIN CUSTOMER MANAGEMENT
 * -------------------------
 * Every function below requires an admin JWT.
 */

// TODO: Implement GET /api/admin/users.
// Auth: admin JWT.
// Query: search, page, limit.
// Response: UserListResponse. Administrator accounts are excluded by backend.
// Used by: AdminUsersPage.
export async function getCustomers(
  params: UserListParams = {},
): Promise<UserListResponse> {
  void params;
  throw new ApiNotImplementedError("getCustomers");
}

// TODO: Implement GET /api/admin/users/:id.
// Auth: admin JWT.
// Response: UserResponse.
// Used by: AdminUsersPage "View details" dialog.
export async function getCustomerById(id: string): Promise<UserResponse> {
  void id;
  throw new ApiNotImplementedError("getCustomerById");
}

// TODO: Implement PATCH /api/admin/users/:id/block.
// Auth: admin JWT.
// Body: none.
// Response: UserResponse.
// Used by: AdminUsersPage block confirmation.
export async function blockCustomer(id: string): Promise<UserResponse> {
  void id;
  throw new ApiNotImplementedError("blockCustomer");
}

// TODO: Implement PATCH /api/admin/users/:id/unblock.
// Auth: admin JWT.
// Body: none.
// Response: UserResponse.
// Used by: AdminUsersPage unblock confirmation.
export async function unblockCustomer(id: string): Promise<UserResponse> {
  void id;
  throw new ApiNotImplementedError("unblockCustomer");
}
