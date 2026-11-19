export type UserRole = "customer" | "admin";

/**
 * The backend `normalizeUser()` shape.
 * The auth client exposes the same fields through the Better Auth session.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  phone: string;
  role: UserRole;
  isBlocked: boolean;
  emailVerified: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UserListParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface UserListResponse {
  users: User[];
  pagination: import("./api").Pagination;
}

export interface UserResponse {
  user: User;
}

/** Only these fields are editable through PATCH /api/users/me. */
export interface UpdateProfileInput {
  name?: string;
  image?: string;
  phone?: string;
}
