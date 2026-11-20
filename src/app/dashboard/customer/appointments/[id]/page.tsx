import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/common/skeleton-loader";
import { CustomerAppointmentDetails } from "@/features/dashboard/customer/customer-appointment-details";

export const metadata: Metadata = {
  title: "Appointment details",
};

export default function CustomerAppointmentDetailsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-lg" />}>
      <CustomerAppointmentDetails />
    </Suspense>
  );
}
