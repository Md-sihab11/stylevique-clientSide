import type { Metadata } from "next";
import { AdminServiceForm } from "@/components/dashboard/admin/admin-service-form";

export const metadata: Metadata = {
  title: "Add service",
};

export default function AdminAddServicePage() {
  return <AdminServiceForm mode="create" />;
}
