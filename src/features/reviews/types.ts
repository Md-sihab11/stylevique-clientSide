export type ReviewStatus = "pending" | "approved" | "rejected";

/** A customer review exactly as the backend normalizes it. */
export interface Review {
  id: string;
  appointmentId: string;
  customerId: string;
  customerName: string;
  serviceId: string | null;
  serviceName: string;
  serviceImage: string | null;
  rating: number;
  highlights: string[];
  note: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListResponse {
  reviews: Review[];
  pagination: import("@/types/api").Pagination;
}

export interface ReviewSummaryResponse {
  totalReviews: number;
  averageRating: number;
}

export interface ReviewListParams {
  serviceId?: string;
  status?: ReviewStatus | "";
  page?: number;
  limit?: number;
}

export interface CreateReviewInput {
  appointmentId: string;
  rating: number;
  highlights: string[];
  note: string;
}

export interface UpdateReviewInput {
  rating: number;
  highlights: string[];
  note: string;
}
