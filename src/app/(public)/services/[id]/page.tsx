import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/common/skeleton-loader";
import { ServiceDetails } from "@/components/services/service-details";

export const metadata: Metadata = {
  title: "Service details",
  description:
    "View a Stylevique service, its price, duration and appointment availability, then request your preferred time.",
};

export default function ServiceDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="page-width grid gap-10 py-12 lg:grid-cols-2">
          <Skeleton className="aspect-[4/5] w-full" />
          <div className="space-y-4 pt-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-14 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>
      }
    >
      <ServiceDetails />
    </Suspense>
  );
}
