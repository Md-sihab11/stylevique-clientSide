import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/server-session";
import { Skeleton } from "@/components/common/skeleton-loader";
import { ServiceDetails } from "@/features/services/components/service-details";

export const metadata: Metadata = {
  title: "Service details",
  description:
    "View a Stylevique service, its price, duration and appointment availability, then request your preferred time.",
};

/**
 * The salon details page is private. This segment reads the session cookie on
 * every request, so it opts out of instant navigation like the dashboards do.
 */
export const instant = false;

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession();

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
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>
      }
    >
      <ServiceDetails />
    </Suspense>
  );
}
