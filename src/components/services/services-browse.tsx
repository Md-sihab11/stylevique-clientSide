"use client";

import { FormEvent, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { getServiceCategories, getServices } from "@/lib/api";
import { useApiResource } from "@/hooks/use-api-resource";
import {
  DEFAULT_SERVICE_SORT,
  type ServiceSort,
} from "@/types";
import { FEATURED_CATEGORIES, SORT_OPTIONS } from "@/constants/salon";
import { PrimaryButton } from "@/components/common/primary-button";
import { ServiceGrid } from "@/components/services/service-grid";
import { ServiceGridSkeleton } from "@/components/common/skeleton-loader";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { PaginationControls } from "@/components/common/pagination-controls";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 6;

/**
 * Browse services page.
 *
 * The URL is the source of truth for search, category, sort and page. That
 * means the filter state survives refreshes and can be shared as a link.
 * The API query object below mirrors the backend contract.
 */
export function ServicesBrowse() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search")?.trim() ?? "";
  const category = searchParams.get("category")?.trim() ?? "";
  const sort = (searchParams.get("sort") as ServiceSort | null) ?? DEFAULT_SERVICE_SORT;
  const page = Math.max(Number(searchParams.get("page") ?? "1") || 1, 1);

  const [searchInput, setSearchInput] = useState(search);

  const { data, error, isLoading, reload } = useApiResource(
    () =>
      getServices({
        search: search || undefined,
        category: category || undefined,
        sort,
        page,
        limit: PAGE_SIZE,
      }),
    `services|${search}|${category}|${sort}|${page}`,
  );

  // Categories come from the backend. The editorial names remain as a fallback
  // while the request is loading or if the category endpoint is unavailable.
  const { data: categoryData } = useApiResource(
    () => getServiceCategories(),
    "service-categories",
  );

  const categoryNames = Array.from(
    new Set([
      ...FEATURED_CATEGORIES.map((item) => item.name),
      ...(categoryData?.categories ?? []),
    ]),
  ).sort((a, b) => a.localeCompare(b));

  function updateQuery(updates: Record<string, string | number | undefined>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    }

    // Any filter change starts again from page 1.
    if (!("page" in updates)) {
      params.delete("page");
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateQuery({ search: searchInput.trim() || undefined });
  }

  function clearFilters() {
    setSearchInput("");
    router.push(pathname, { scroll: false });
  }

  const hasFilters = Boolean(search || category || sort !== DEFAULT_SERVICE_SORT);
  const resultCount = data?.pagination.totalItems ?? 0;

  return (
    <div>
      {/* Page intro */}
      <section className="border-b border-border bg-secondary/40">
        <div className="page-width py-14 sm:py-20">
          <div className="flex items-center gap-3">
            <span className="editorial-rule" />
            <p className="eyebrow">The salon menu</p>
          </div>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-2xl text-5xl leading-[0.95] font-medium text-foreground sm:text-6xl">
                Find your next ritual.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
                Explore every service, from a precise haircut to a quiet hour in
                the treatment room. Search by name or narrow the menu by category.
              </p>
            </div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Active services only · All prices in USD
            </p>
          </div>
        </div>
      </section>

      <section className="page-width py-10 lg:py-14">
        {/* Filter bar */}
        <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_210px_auto] lg:items-end">
            <form onSubmit={handleSearchSubmit} className="space-y-2">
              <label
                htmlFor="service-search"
                className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
              >
                Search services
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="service-search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Try “facial” or “haircut”"
                  maxLength={100}
                  className="h-10 rounded-md bg-background pl-9 pr-24 text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-primary px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="space-y-2">
              <label
                htmlFor="category-filter"
                className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
              >
                Category
              </label>
              <select
                id="category-filter"
                value={category}
                onChange={(event) => updateQuery({ category: event.target.value })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
              >
                <option value="">All categories</option>
                {categoryNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="sort-filter"
                className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
              >
                Sort by
              </label>
              <select
                id="sort-filter"
                value={sort}
                onChange={(event) => updateQuery({ sort: event.target.value })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasFilters}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-border px-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              <X className="size-3.5" aria-hidden="true" />
              Clear
            </button>
          </div>

          {hasFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <SlidersHorizontal className="size-3.5 text-muted-foreground" aria-hidden="true" />
              <span className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                Active filters
              </span>
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    updateQuery({ search: undefined });
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground"
                >
                  “{search}” <X className="size-3" aria-hidden="true" />
                </button>
              )}
              {category && (
                <button
                  type="button"
                  onClick={() => updateQuery({ category: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground"
                >
                  {category} <X className="size-3" aria-hidden="true" />
                </button>
              )}
              {sort !== DEFAULT_SERVICE_SORT && (
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground">
                  {SORT_OPTIONS.find((option) => option.value === sort)?.label}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Result count */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {isLoading
              ? "Loading the menu"
              : `${resultCount} service${resultCount === 1 ? "" : "s"}`}
          </p>
          {data && data.pagination.totalPages > 1 && (
            <p className="text-xs text-muted-foreground">
              Page {data.pagination.page} of {data.pagination.totalPages}
            </p>
          )}
        </div>

        <div className="mt-6">
          {isLoading && <ServiceGridSkeleton count={PAGE_SIZE} />}

          {!isLoading && Boolean(error) && (
            <ErrorState
              title="The menu could not load"
              description="Your filters are still selected. Check the backend connection and try again."
              onRetry={reload}
            />
          )}

          {!isLoading && !error && data?.services.length === 0 && (
            <EmptyState
              icon={Search}
              title="No services match these filters"
              description="Try a different search term or clear the category to see the full menu again."
              action={
                <PrimaryButton onClick={clearFilters} size="sm">
                  Clear filters
                </PrimaryButton>
              }
            />
          )}

          {!isLoading && !error && data && data.services.length > 0 && (
            <>
              <ServiceGrid services={data.services} />
              <PaginationControls
                pagination={data.pagination}
                onPageChange={(nextPage) => updateQuery({ page: nextPage })}
                className="mt-14 border-t border-border pt-6"
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
