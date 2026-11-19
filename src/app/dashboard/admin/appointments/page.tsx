import type { Metadata } from "next";
import { AdminAppointments } from "@/components/dashboard/admin/admin-appointments";

export const metadata: Metadata = {
  title: "Manage appointments",
};

export default function AdminAppointmentsPage() {
  return <AdminAppointments />;
}
