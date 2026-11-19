import type {
  CreateServiceInput,
  ServiceCategoriesResponse,
  ServiceListParams,
  ServiceListResponse,
  ServiceResponse,
  ServiceStatus,
  UpdateServiceInput,
} from "@/types";
import { ApiNotImplementedError } from "./errors";

/**
 * PUBLIC SERVICES
 * ---------------
 * These three functions power the homepage, the browse page and the service
 * detail page. Only services with status "active" are returned publicly.
 */

// TODO: Implement GET /api/services.
// Auth: none.
// Query: search, category, sort, page, limit.
// Response: ServiceListResponse ({ services, pagination }).
// Used by: HomePage featured services, BrowseServicesPage.
export async function getServices(
  params: ServiceListParams = {},
): Promise<ServiceListResponse> {
  void params;
  throw new ApiNotImplementedError("getServices");
}

// TODO: Implement GET /api/services/categories.
// Auth: none.
// Response: ServiceCategoriesResponse ({ categories: string[] }).
// Used by: HomePage category strip, BrowseServicesPage filter,
// AdminServiceForm category suggestions.
export async function getServiceCategories(): Promise<ServiceCategoriesResponse> {
  throw new ApiNotImplementedError("getServiceCategories");
}

// TODO: Implement GET /api/services/:id.
// Auth: none.
// Response: ServiceResponse ({ service }).
// Used by: ServiceDetailsPage and the admin edit page fallback.
// Note: the public endpoint only returns active services.
export async function getServiceById(id: string): Promise<ServiceResponse> {
  void id;
  throw new ApiNotImplementedError("getServiceById");
}

/**
 * ADMIN SERVICES
 * --------------
 * Every function below requires a signed-in admin. Send the Better Auth JWT
 * as `Authorization: Bearer <token>`.
 */

// TODO: Implement GET /api/admin/services.
// Auth: admin JWT.
// Query: search, category, status, sort, page, limit.
// Response: ServiceListResponse ({ services, pagination }).
// Used by: AdminServicesPage.
export async function getAdminServices(
  params: ServiceListParams = {},
): Promise<ServiceListResponse> {
  void params;
  throw new ApiNotImplementedError("getAdminServices");
}

// TODO: Implement POST /api/services.
// Auth: admin JWT.
// Body: CreateServiceInput.
// Response: ServiceResponse.
// Used by: AdminAddServicePage.
export async function createService(
  input: CreateServiceInput,
): Promise<ServiceResponse> {
  void input;
  throw new ApiNotImplementedError("createService");
}

// TODO: Implement PATCH /api/services/:id.
// Auth: admin JWT.
// Body: UpdateServiceInput (serviceName, category, description, price,
// duration, image). Status is changed with a separate endpoint.
// Response: ServiceResponse.
// Used by: AdminEditServicePage.
export async function updateService(
  id: string,
  input: UpdateServiceInput,
): Promise<ServiceResponse> {
  void id;
  void input;
  throw new ApiNotImplementedError("updateService");
}

// TODO: Implement PATCH /api/services/:id/status.
// Auth: admin JWT.
// Body: { status: "active" | "inactive" }.
// Response: ServiceResponse.
// Used by: AdminServicesPage activate/deactivate confirmation.
export async function updateServiceStatus(
  id: string,
  status: ServiceStatus,
): Promise<ServiceResponse> {
  void id;
  void status;
  throw new ApiNotImplementedError("updateServiceStatus");
}

// TODO: Implement DELETE /api/services/:id.
// Auth: admin JWT.
// Response: ServiceResponse wrapper with { deletedServiceId: string }.
// Used by: AdminServicesPage delete confirmation.
export async function deleteService(
  id: string,
): Promise<{ deletedServiceId: string }> {
  void id;
  throw new ApiNotImplementedError("deleteService");
}
