import type { ApiErrorDetail } from "@/types";

/**
 * A single error type for every API failure.
 *
 * `status` is the HTTP status code (0 means the network request never reached
 * the backend). `details` contains the backend's field-level validation errors
 * when the server sends them.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly details: ApiErrorDetail[];
  readonly isNetworkError: boolean;

  constructor(
    message: string,
    status = 0,
    details: ApiErrorDetail[] = [],
    isNetworkError = false,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    this.isNetworkError = isNetworkError;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isConflict(): boolean {
    return this.status === 409;
  }

  get isValidationError(): boolean {
    return this.status === 422;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/** Safe text for a Sonner toast or an error panel. */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

/** Field-level messages returned by a 422 response. */
export function getApiErrorDetails(error: unknown): ApiErrorDetail[] {
  return error instanceof ApiError ? error.details : [];
}
