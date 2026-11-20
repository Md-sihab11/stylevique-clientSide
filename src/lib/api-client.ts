"use client";

import { authClient } from "@/lib/auth/auth-client";
import { API_BASE_URL } from "@/lib/api/config";
import { ApiError } from "@/lib/api/errors";
import type { ApiErrorDetail } from "@/types";

type ApiMethod = "GET" | "POST" | "PATCH" | "DELETE";

type QueryValue = string | number | boolean | null | undefined;

export interface ApiRequestOptions {
  method?: ApiMethod;
  /** Query string values. Empty strings, null and undefined are skipped. */
  query?: Record<string, QueryValue>;
  /** A plain object is sent as JSON. FormData is sent as multipart. */
  body?: unknown;
  /** Set to true for endpoints that need `Authorization: Bearer <JWT>`. */
  auth?: boolean;
}

/**
 * Read a fresh Better Auth JWT.
 *
 * Tokens expire quickly, so we ask Better Auth for a new one on every protected
 * request instead of caching it in localStorage or a module variable.
 */
async function getAccessToken(): Promise<string> {
  try {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new ApiError("Your session has expired. Please sign in again.", 401);
    }

    return data.token;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError("Your session has expired. Please sign in again.", 401);
  }
}

function buildUrl(
  path: string,
  query: Record<string, QueryValue> = {},
): string {
  const baseUrl = API_BASE_URL.replace(/\/+$/, "");
  const url = new URL(`${baseUrl}${path.startsWith("/") ? path : `/${path}`}`);

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

function fallbackMessage(status: number): string {
  switch (status) {
    case 401:
      return "Please sign in to continue.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested record was not found.";
    case 409:
      return "This action conflicts with the current data. Please refresh and try again.";
    case 422:
      return "Some fields are invalid. Please check the form and try again.";
    case 500:
      return "The server encountered an error. Please try again.";
    case 503:
      return "The service is temporarily unavailable. Please try again shortly.";
    default:
      return "The request failed. Please try again.";
  }
}

function readJsonPayload(payload: unknown): {
  message?: string;
  details?: ApiErrorDetail[];
} {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  const body = payload as { message?: unknown; errors?: unknown };
  const message =
    typeof body.message === "string" && body.message.trim()
      ? body.message
      : undefined;

  const details = Array.isArray(body.errors)
    ? body.errors.filter(
        (item): item is ApiErrorDetail =>
          Boolean(item) &&
          typeof item === "object" &&
          typeof (item as ApiErrorDetail).field === "string" &&
          typeof (item as ApiErrorDetail).message === "string",
      )
    : [];

  return { message, details };
}

/**
 * The one fetch wrapper used by every API module.
 *
 * It handles:
 * - the backend base URL and query strings
 * - JSON bodies and FormData uploads
 * - optional JWT authentication
 * - network failures and HTTP errors
 * - the shared `{ success, message, data }` response envelope
 */
export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { method = "GET", query, body, auth = false } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (auth) {
    headers.Authorization = `Bearer ${await getAccessToken()}`;
  }

  let requestBody: BodyInit | undefined;

  if (typeof FormData !== "undefined" && body instanceof FormData) {
    // Do not set Content-Type here. The browser adds the multipart boundary.
    requestBody = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  let response: Response;

  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: requestBody,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "Could not reach the Stylevique API. Check that the backend is running and NEXT_PUBLIC_API_URL is correct.",
      0,
      [],
      true,
    );
  }

  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  const { message, details } = readJsonPayload(payload);

  if (!response.ok) {
    throw new ApiError(
      message ?? fallbackMessage(response.status),
      response.status,
      details,
    );
  }

  // Some servers return HTTP 200 with `{ success: false }`.
  if (
    payload &&
    typeof payload === "object" &&
    "success" in payload &&
    (payload as { success?: unknown }).success === false
  ) {
    throw new ApiError(
      message ?? fallbackMessage(response.status),
      response.status,
      details,
    );
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    !("data" in payload)
  ) {
    throw new ApiError(
      "The server returned an unexpected response.",
      response.status,
    );
  }

  // Pages work with the inner `data` object, not the whole envelope.
  return (payload as { data: T }).data;
}
