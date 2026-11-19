import type { Metadata } from "next";
import { AdminUsers } from "@/components/dashboard/admin/admin-users";

export const metadata: Metadata = {
  title: "Customers",
};

export default function AdminUsersPage() {
  return <AdminUsers />;
}
