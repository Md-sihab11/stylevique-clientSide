import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/common/skeleton-loader";
import { ServiceDetails } from "@/features/services/components/service-details";

export const metadata: Metadata = {
  title: "Service details",
  description:
    "View a Stylevique service, its price, duration and guest reviews, then request your preferred time.",
};

/**
 * Service details are public: guests can read the service information and
 * reviews without signing in. Booking is the protected step — the booking form
 * sends unauthenticated visitors to sign-in with a callbackUrl back to this
 * exact service, and it also handles admin and blocked accounts.
 */
export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;

  return (
    <Suspense
      fallback={
        <div className="page-width grid gap-10 py-12 lg:grid-cols-2">
          <Skeleton className="aspect-[4/5] w-full" />
          <div className="space-y-4 pt-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-14 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>
      }
    >
      <ServiceDetails />
    </Suspense>
  );
}
