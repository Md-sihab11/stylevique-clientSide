import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/common/skeleton-loader";
import { AdminEditService } from "@/components/dashboard/admin/admin-edit-service";

export const metadata: Metadata = {
  title: "Edit service",
};

export default function AdminEditServicePage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-lg" />}>
      <AdminEditService />
    </Suspense>
  );
}
