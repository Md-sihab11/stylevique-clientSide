"use client";

import { ArrowRight } from "lucide-react";
import { getServices } from "@/features/services/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { SectionHeading } from "@/components/common/section-heading";
import { PrimaryButton } from "@/components/common/primary-button";
import { ErrorState } from "@/components/common/error-state";
import { EmptyState } from "@/components/common/empty-state";
import { Scissors } from "lucide-react";
import { ServiceCarousel } from "@/features/home/components/service-carousel";

/**
 * This section is a Client Component because it loads data with the API.
 * getServices() calls GET /api/services and returns only active services.
 * The carousel shows the six newest services horizontally with
 * prev/next arrows.
 */
export function FeaturedServices() {
  const { data, error, isLoading, reload } = useApiResource(
    () => getServices({ page: 1, limit: 6, sort: "newest" }),
    "home-featured",
  );

  const services = data?.services.slice(0, 6) ?? [];

  return (
    <section className="section-space bg-background">
      <div className="page-width">
        <SectionHeading
          eyebrow="The service menu"
          title="Considered care, from root to fingertip."
          description="Six pieces of our season's menu, scrolling through each set to invites you in. Browse the full menu to find more."
          action={
            <PrimaryButton href="/services" variant="outline" size="sm">
              View all services
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </PrimaryButton>
          }
        />

        <div className="mt-12 lg:mt-16">
          {isLoading && (
            <div className="flex gap-6 px-6 md:px-4">
              <div className="flex gap-6 overflow-x-auto px-0 md:px-6 md:-mx-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-72 w-[290px] shrink-0 rounded-lg bg-secondary sm:w-[320px]" />
                ))}
              </div>
            </div>
          )}

          {!isLoading && Boolean(error) && (
            <ErrorState
              title="The service menu could not load"
              description="Check that the backend is running and NEXT_PUBLIC_API_URL is correct, then try again."
              onRetry={reload}
            />
          )}

          {!isLoading && !error && data && data.services.length === 0 && (
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

          {!isLoading && !error && services.length > 0 && <ServiceCarousel services={services} />}
        </div>
      </div>
    </section>
  );
}
