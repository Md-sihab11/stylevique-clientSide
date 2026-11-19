import type { AdminDashboardStats, CustomerDashboardStats } from "@/types";
import { ApiNotImplementedError } from "./errors";

// TODO: Implement GET /api/dashboard/customer.
// Auth: customer JWT.
// Response: { success: true, message, data: CustomerDashboardStats }.
// Used by: CustomerDashboardPage statistic cards.
export async function getCustomerDashboard(): Promise<CustomerDashboardStats> {
  throw new ApiNotImplementedError("getCustomerDashboard");
}

// TODO: Implement GET /api/dashboard/admin.
// Auth: admin JWT.
// Response: { success: true, message, data: AdminDashboardStats }.
// Used by: AdminDashboardPage statistic cards.
export async function getAdminDashboard(): Promise<AdminDashboardStats> {
  throw new ApiNotImplementedError("getAdminDashboard");
}
