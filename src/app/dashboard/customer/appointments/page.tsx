import type { Metadata } from "next";
import { CustomerAppointments } from "@/components/dashboard/customer/customer-appointments";

export const metadata: Metadata = {
  title: "My appointments",
};

export default function CustomerAppointmentsPage() {
  return <CustomerAppointments />;
}
