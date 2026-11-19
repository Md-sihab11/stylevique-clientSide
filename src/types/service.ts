export type ServiceStatus = "active" | "inactive";

export type ServiceSort = "newest" | "oldest" | "price_asc" | "price_desc";

/**
 * A salon service exactly as the backend normalizes it.
 * `price` is in the salon currency (the backend defaults to USD).
 */
export interface SalonService {
  id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceListParams {
  search?: string;
  category?: string;
  status?: ServiceStatus | "";
  sort?: ServiceSort;
  page?: number;
  limit?: number;
}

export interface ServiceListResponse {
  services: SalonService[];
  pagination: import("./api").Pagination;
}

export interface ServiceCategoriesResponse {
  categories: string[];
}

export interface ServiceResponse {
  service: SalonService;
}

/** Body accepted by POST /api/services */
export interface CreateServiceInput {
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: ServiceStatus;
}

/** Body accepted by PATCH /api/services/:id (status uses its own endpoint). */
export type UpdateServiceInput = Omit<CreateServiceInput, "status">;

export const DEFAULT_SERVICE_SORT: ServiceSort = "newest";
