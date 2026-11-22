import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/common/skeleton-loader";
import { ServiceDetails } from "@/features/services/components/service-details";
import { getServerSession } from "@/lib/auth/server-session";

export const metadata: Metadata = {
  title: "Service details",
  description:
    "View a Stylevique service, its price, duration and guest reviews, then request your preferred time.",
};

/**
 * Reading the session from cookies makes this route dynamic, so it must block
 * instead of producing a static shell (same approach as the dashboard guards).
 */
export const instant = false;

/**
 * Service details are for signed-in guests only. Clicking a service (or typing
 * its URL) while signed out lands on the sign-in page, with a callbackUrl so
 * the guest returns to this exact service afterwards.
 */
export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, session] = await Promise.all([params, getServerSession()]);

  if (!session) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(`/services/${id}`)}`);
  }

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
