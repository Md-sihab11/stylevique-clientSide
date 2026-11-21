"use client";

import { useState } from "react";
import { Check, Star, X } from "lucide-react";
import { toast } from "sonner";
import type { ReviewStatus } from "@/features/reviews/types";
import { getAdminReviews, updateReviewStatus } from "@/features/reviews/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { getApiErrorMessage } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/common/page-header";
import { PaginationControls } from "@/components/common/pagination-controls";
import { StatusBadge } from "@/components/common/status-badge";
import { Skeleton } from "@/components/common/skeleton-loader";
import { ErrorState } from "@/components/common/error-state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

/** Admin moderation queue for customer reviews. */
export function AdminReviews() {
  const [status, setStatus] = useState<ReviewStatus | "">("");
  const [page, setPage] = useState(1);
  const [actingId, setActingId] = useState<string | null>(null);

  const { data, error, isLoading, reload } = useApiResource(
    () => getAdminReviews({ status, page, limit: PAGE_SIZE }),
    `admin-reviews|${status}|${page}`,
  );

  async function handleDecision(id: string, next: "approved" | "rejected") {
    if (actingId) return;
    setActingId(id);

    try {
      await updateReviewStatus(id, next);
      toast.success(next === "approved" ? "Review approved" : "Review rejected");
      reload();
    } catch (error) {
      toast.error("Could not update the review", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setActingId(null);
    }
  }

  function handleStatusChange(next: ReviewStatus | "") {
    setStatus(next);
    setPage(1);
  }

  const reviews = data?.reviews ?? [];

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Salon administration"
        title="Reviews"
        description="Approve or reject customer reviews. Only approved reviews appear in the public carousel."
      />

      <div className="flex flex-wrap items-center gap-2">
        {[
          { value: "", label: "All" },
          { value: "pending", label: "Pending" },
          { value: "approved", label: "Approved" },
          { value: "rejected", label: "Rejected" },
        ].map((option) => (
          <button
            key={option.value || "all"}
            type="button"
            onClick={() => handleStatusChange(option.value as ReviewStatus | "")}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
              status === option.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && Boolean(error) && (
        <ErrorState
          title="Reviews could not load"
          description="Check the admin API connection and try again."
          onRetry={reload}
        />
      )}

      {!isLoading && !error && reviews.length === 0 && (
        <p className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No reviews in this view yet.
        </p>
      )}

      {!isLoading && !error && reviews.length > 0 && (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="flex flex-col rounded-lg border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {review.customerName || "Stylevique guest"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {review.serviceName}
                    </p>
                  </div>
                  <StatusBadge status={review.status} />
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-0.5 text-[#c2a678]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={cn(
                          "size-3.5",
                          index < review.rating
                            ? "fill-current"
                            : "fill-transparent text-border",
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {review.rating}/5
                  </span>
                </div>

                {review.highlights.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {review.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full bg-secondary px-2.5 py-1 text-[0.62rem] text-foreground/80"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}

                {review.note && (
                  <p className="mt-3 flex-1 text-sm leading-6 text-foreground/80">
                    “{review.note}”
                  </p>
                )}

                <p className="mt-4 border-t border-border pt-3 text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
                  {formatDate(review.createdAt)}
                </p>

                {review.status === "pending" && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="rounded-full bg-[#b49162] text-white hover:bg-[#9d7a51]"
                      onClick={() => handleDecision(review.id, "approved")}
                      disabled={actingId === review.id}
                    >
                      <Check className="size-3.5" aria-hidden="true" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => handleDecision(review.id, "rejected")}
                      disabled={actingId === review.id}
                    >
                      <X className="size-3.5" aria-hidden="true" />
                      Reject
                    </Button>
                  </div>
                )}
              </article>
            ))}
          </div>

          {data && (
            <PaginationControls
              pagination={data.pagination}
              onPageChange={setPage}
              className="border-t border-border pt-6"
            />
          )}
        </>
      )}
    </div>
  );
}
