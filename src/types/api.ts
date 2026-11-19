/**
 * Shared API types.
 *
 * Every Express endpoint in the Stylevique backend replies with one of these
 * two shapes. Keeping them in one place makes the API placeholders easier to
 * implement later.
 */

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors?: ApiErrorDetail[];
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: Pagination;
}

/**
 * Common query options used by every paginated list endpoint.
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}
