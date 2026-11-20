import type { Metadata } from "next";
import { CustomerOverview } from "@/features/dashboard/customer/customer-overview";

export const metadata: Metadata = {
  title: "Customer dashboard",
};

export default function CustomerDashboardPage() {
  return <CustomerOverview />;
}
