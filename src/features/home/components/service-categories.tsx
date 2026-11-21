"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getServiceCategories } from "@/features/services/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { FEATURED_CATEGORIES } from "@/constants/salon";
import { SectionHeading } from "@/components/common/section-heading";
import { PrimaryButton } from "@/components/common/primary-button";
import { Skeleton } from "@/components/common/skeleton-loader";
import { ErrorState } from "@/components/common/error-state";

const DEFAULT_BLURB = "Explore services in this category.";

/**
 * Home "Salon Service Categories" section.
 * Categories come from GET /api/services/categories (distinct categories of
 * active services in the database), so the section updates automatically when
 * the admin publishes a service in a new category. Editorial blurbs are
 * matched from FEATURED_CATEGORIES when the label is known.
 */
export function ServiceCategories() {
  const { data, error, isLoading, reload } = useApiResource(
    () => getServiceCategories(),
    "home-categories",
  );

  const categories = (data?.categories ?? []).map((name, index) => {
    const known = FEATURED_CATEGORIES.find(
      (category) => category.name.toLowerCase() === name.toLowerCase(),
    );

    return {
      name,
      number: String(index + 1).padStart(2, "0"),
      blurb: known?.blurb ?? DEFAULT_BLURB,
    };
  });

  return (
    <section className="section-space bg-secondary/45">
      <div className="page-width">
        <SectionHeading
          eyebrow="Find your ritual"
          title="A service for every version of you."
          description="Start with the area you would like to focus on. Each category opens a filtered view of the salon menu."
          action={
            <PrimaryButton href="/services" variant="outline" size="sm">
              Browse everything
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </PrimaryButton>
          }
        />

        <div className="mt-12">
          {isLoading && (
            <div className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="border-t border-foreground/15 py-6">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="mt-3 h-4 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && Boolean(error) && (
            <ErrorState
              title="Categories could not load"
              description="Check that the backend is running and NEXT_PUBLIC_API_URL is correct, then try again."
              onRetry={reload}
            />
          )}

          {!isLoading && !error && categories.length > 0 && (
            <div className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/services?category=${encodeURIComponent(category.name)}`}
                  className="group flex items-start justify-between gap-6 border-t border-foreground/15 py-6 transition-colors hover:border-primary/60"
                >
                  <div className="flex gap-5">
                    <span className="pt-0.5 text-xs tabular-nums text-muted-foreground/70">
                      {category.number}
                    </span>
                    <div>
                      <h3 className="font-section text-[1.55rem] leading-tight font-medium tracking-[0.02em] text-foreground uppercase transition-colors group-hover:text-primary">
                        {category.name}
                      </h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        {category.blurb}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </Link>
              ))}

              <Link
                href="/services"
                className="group flex items-start justify-between gap-6 border-t border-foreground/15 py-6 transition-colors hover:border-primary/60"
              >
                <div className="flex gap-5">
                  <span className="pt-0.5 text-xs tabular-nums text-muted-foreground/70">
                    {String(categories.length + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-section text-[1.55rem] leading-tight font-medium tracking-[0.02em] text-foreground uppercase transition-colors group-hover:text-primary">
                      See the full menu
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      Search, filter and compare every service.
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                  aria-hidden="true"
                />
              </Link>
            </div>
          )}

          {!isLoading && !error && categories.length === 0 && (
            <div className="border-t border-foreground/15 py-8">
              <p className="text-sm text-muted-foreground">
                Categories appear here as soon as the salon publishes services.
              </p>
              <div className="mt-5">
                <PrimaryButton href="/services" size="sm">
                  Browse services
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </PrimaryButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
