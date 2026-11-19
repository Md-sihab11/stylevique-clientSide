import { apiRequest } from "@/lib/api-client";
import type { AdminDashboardStats, CustomerDashboardStats } from "@/types";

export async function getCustomerDashboard(): Promise<CustomerDashboardStats> {
  return apiRequest<CustomerDashboardStats>("/api/dashboard/customer", {
    auth: true,
  });
}

export async function getAdminDashboard(): Promise<AdminDashboardStats> {
  return apiRequest<AdminDashboardStats>("/api/dashboard/admin", {
    auth: true,
  });
}
