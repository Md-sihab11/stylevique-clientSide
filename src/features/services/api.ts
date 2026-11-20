import { apiRequest } from "@/lib/api-client";
import type { CreateServiceInput, ServiceCategoriesResponse, ServiceListParams, ServiceListResponse, ServiceResponse, ServiceStatus, UpdateServiceInput } from "@/features/services/types";
import { ApiError } from "@/lib/api/errors";

/**
 * PUBLIC SERVICES
 * ---------------
 * These functions power the homepage, browse page and service details page.
 * The backend only returns services with status "active" here.
 */

export async function getServices(
  params: ServiceListParams = {},
): Promise<ServiceListResponse> {
  return apiRequest<ServiceListResponse>("/api/services", {
    query: {
      search: params.search,
      category: params.category,
      sort: params.sort,
      page: params.page,
      limit: params.limit,
    },
  });
}

export async function getServiceCategories(): Promise<ServiceCategoriesResponse> {
  return apiRequest<ServiceCategoriesResponse>("/api/services/categories");
}

export async function getServiceById(id: string): Promise<ServiceResponse> {
  return apiRequest<ServiceResponse>(`/api/services/${id}`);
}

/**
 * ADMIN SERVICES
 * --------------
 * These calls attach the Better Auth JWT automatically because auth is true.
 */

export async function getAdminServices(
  params: ServiceListParams = {},
): Promise<ServiceListResponse> {
  return apiRequest<ServiceListResponse>("/api/admin/services", {
    auth: true,
    query: {
      search: params.search,
      category: params.category,
      status: params.status,
      sort: params.sort,
      page: params.page,
      limit: params.limit,
    },
  });
}

/**
 * The backend has no GET /api/admin/services/:id endpoint. To let admins edit
 * inactive services too, this helper pages through the admin list and finds the
 * matching service. It only uses a real backend endpoint.
 */
export async function getAdminServiceById(id: string): Promise<ServiceResponse> {
  const limit = 100;
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && page <= 50) {
    const result = await getAdminServices({ page, limit });
    const service = result.services.find((item) => item.id === id);

    if (service) {
      return { service };
    }

    totalPages = result.pagination.totalPages;
    page += 1;
  }

  throw new ApiError("Service not found.", 404);
}

export async function createService(
  input: CreateServiceInput,
): Promise<ServiceResponse> {
  return apiRequest<ServiceResponse>("/api/services", {
    method: "POST",
    auth: true,
    body: input,
  });
}

export async function updateService(
  id: string,
  input: UpdateServiceInput,
): Promise<ServiceResponse> {
  return apiRequest<ServiceResponse>(`/api/services/${id}`, {
    method: "PATCH",
    auth: true,
    body: input,
  });
}

export async function updateServiceStatus(
  id: string,
  status: ServiceStatus,
): Promise<ServiceResponse> {
  return apiRequest<ServiceResponse>(`/api/services/${id}/status`, {
    method: "PATCH",
    auth: true,
    body: { status },
  });
}

export async function deleteService(
  id: string,
): Promise<{ deletedServiceId: string }> {
  return apiRequest<{ deletedServiceId: string }>(`/api/services/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
