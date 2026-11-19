"use client";

import { ArrowRight } from "lucide-react";
import { getServices } from "@/lib/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { SectionHeading } from "@/components/common/section-heading";
import { PrimaryButton } from "@/components/common/primary-button";
import { ServiceGrid } from "@/components/services/service-grid";
import { ServiceGridSkeleton } from "@/components/common/skeleton-loader";
import { ErrorState } from "@/components/common/error-state";
import { EmptyState } from "@/components/common/empty-state";
import { Scissors } from "lucide-react";

/**
 * This section is a Client Component because it loads data with the API.
 * getServices() calls GET /api/services and returns only active services.
 */
export function FeaturedServices() {
  const { data, error, isLoading, reload } = useApiResource(
    () => getServices({ page: 1, limit: 6, sort: "newest" }),
    "home-featured",
  );

  return (
    <section className="section-space bg-background">
      <div className="page-width">
        <SectionHeading
          eyebrow="The service menu"
          title="Considered care, from root to fingertip."
          description="A focused collection of hair, skin and beauty rituals, each designed to make your visit feel unhurried and personal."
          action={
            <PrimaryButton href="/services" variant="outline" size="sm">
              View all services
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </PrimaryButton>
          }
        />

        <div className="mt-12 lg:mt-16">
          {isLoading && <ServiceGridSkeleton count={6} />}

          {!isLoading && Boolean(error) && (
            <ErrorState
              title="The service menu could not load"
              description="Check that the backend is running and NEXT_PUBLIC_API_URL is correct, then try again."
              onRetry={reload}
            />
          )}

          {!isLoading && !error && data?.services.length === 0 && (
            <EmptyState
              icon={Scissors}
              title="The service menu is being prepared"
              description="Active services will appear here as soon as the salon publishes them."
              action={
                <PrimaryButton href="/services" size="sm">
                  Browse services
                </PrimaryButton>
              }
            />
          )}

          {!isLoading && !error && data && data.services.length > 0 && (
            <ServiceGrid services={data.services.slice(0, 6)} />
          )}
        </div>
      </div>
    </section>
  );
}
