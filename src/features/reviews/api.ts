import { apiRequest } from "@/lib/api-client";
import type {
  CreateReviewInput,
  Review,
  ReviewListParams,
  ReviewListResponse,
  ReviewStatus,
  ReviewSummaryResponse,
  UpdateReviewInput,
} from "@/features/reviews/types";

/** Public: approved reviews only. */
export async function getReviews(
  params: ReviewListParams = {},
): Promise<ReviewListResponse> {
  return apiRequest<ReviewListResponse>("/api/reviews", {
    query: {
      serviceId: params.serviceId,
      page: params.page,
      limit: params.limit,
    },
  });
}

/** Public: average rating and count from approved reviews only. */
export async function getReviewSummary(
  serviceId?: string,
): Promise<ReviewSummaryResponse> {
  return apiRequest<ReviewSummaryResponse>("/api/reviews/summary", {
    query: { serviceId },
  });
}

/** Customer: reviews attached to the signed-in account. */
export async function getMyReviews(
  params: { page?: number; limit?: number } = {},
): Promise<ReviewListResponse> {
  return apiRequest<ReviewListResponse>("/api/reviews/my", {
    auth: true,
    query: { page: params.page, limit: params.limit },
  });
}

export async function createReview(
  input: CreateReviewInput,
): Promise<{ review: Review }> {
  return apiRequest<{ review: Review }>("/api/reviews", {
    method: "POST",
    auth: true,
    body: input,
  });
}

/** Customer: resubmit a rejected review. */
export async function updateReview(
  id: string,
  input: UpdateReviewInput,
): Promise<{ review: Review }> {
  return apiRequest<{ review: Review }>(`/api/reviews/${id}`, {
    method: "PATCH",
    auth: true,
    body: input,
  });
}

/** Admin: every review, optionally filtered by status. */
export async function getAdminReviews(
  params: ReviewListParams = {},
): Promise<ReviewListResponse> {
  return apiRequest<ReviewListResponse>("/api/admin/reviews", {
    auth: true,
    query: {
      status: params.status,
      page: params.page,
      limit: params.limit,
    },
  });
}

/** Admin: approve or reject a pending review. */
export async function updateReviewStatus(
  id: string,
  status: Extract<ReviewStatus, "approved" | "rejected">,
): Promise<{ review: Review }> {
  return apiRequest<{ review: Review }>(`/api/admin/reviews/${id}/status`, {
    method: "PATCH",
    auth: true,
    body: { status },
  });
}
