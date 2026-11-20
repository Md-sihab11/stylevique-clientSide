import type { Metadata } from "next";
import { CustomerAppointments } from "@/features/dashboard/customer/customer-appointments";

export const metadata: Metadata = {
  title: "My appointments",
};

export default function CustomerAppointmentsPage() {
  return <CustomerAppointments />;
}
