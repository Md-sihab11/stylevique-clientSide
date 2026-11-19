/**
 * The base URL of the Express backend.
 * Set NEXT_PUBLIC_API_URL in .env.local (for example http://localhost:5000).
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

/**
 * All Stylevique API calls share the same response envelope:
 *
 *   { success: true, message: "...", data: { ... } }
 *
 * This type demonstrates how the user data will be returned. The actual
 * fetch implementation is intentionally left to the project owner.
 */
export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * The JWT is issued by Better Auth. Retrieve it with:
 *
 *   const { data } = await authClient.token();
 *   const token = data?.token;
 *
 * Then send it to the Express API:
 *
 *   Authorization: `Bearer ${token}`
 */
export const AUTHORIZATION_HEADER = "Authorization";
