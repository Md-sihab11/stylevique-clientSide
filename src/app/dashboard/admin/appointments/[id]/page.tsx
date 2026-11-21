import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/common/skeleton-loader";
import { AdminAppointmentDetails } from "@/features/dashboard/admin/admin-appointment-details";

export const metadata: Metadata = {
  title: "Appointment details",
};

export default function AdminAppointmentDetailsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-lg" />}>
      <AdminAppointmentDetails />
    </Suspense>
  );
}
