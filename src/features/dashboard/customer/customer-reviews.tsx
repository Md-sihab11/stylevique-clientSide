"use client";

import { CalendarDays, MessageSquareHeart } from "lucide-react";
import { getMyAppointments } from "@/features/appointments/api";
import { getMyReviews } from "@/features/reviews/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { formatAppointmentDateTime, formatDate } from "@/lib/format";
import { PageHeader } from "@/components/common/page-header";
import { PrimaryButton } from "@/components/common/primary-button";
import { SafeImage } from "@/components/common/safe-image";
import { StatusBadge } from "@/components/common/status-badge";
import { Skeleton } from "@/components/common/skeleton-loader";
import { ErrorState } from "@/components/common/error-state";
import { ReviewForm } from "@/features/reviews/components/review-form";

/**
 * Customer reviews page.
 * Only completed (confirmed, past) appointments can be reviewed, and the
 * backend enforces the same rule plus one review per appointment.
 */
export function CustomerReviews() {
  const {
    data: reviewsData,
    error: reviewsError,
    isLoading: reviewsLoading,
    reload: reloadReviews,
  } = useApiResource(() => getMyReviews({ page: 1, limit: 100 }), "my-reviews");

  const {
    data: appointmentsData,
    error: appointmentsError,
    isLoading: appointmentsLoading,
    reload: reloadAppointments,
  } = useApiResource(
    () => getMyAppointments({ status: "confirmed", page: 1, limit: 100 }),
    "my-reviews-appointments",
  );

  const reviews = reviewsData?.reviews ?? [];
  const today = new Date().toISOString().slice(0, 10);

  const completed = (appointmentsData?.appointments ?? [])
    .filter((appointment) => appointment.appointmentDate < today)
    .sort((a, b) => b.appointmentDate.localeCompare(a.appointmentDate));

  const reviewByAppointment = new Map(
    reviews.map((review) => [review.appointmentId, review]),
  );

  const items = completed.map((appointment) => ({
    appointment,
    review: reviewByAppointment.get(appointment.id) ?? null,
  }));

  const isLoading = reviewsLoading || appointmentsLoading;
  const error = reviewsError ?? appointmentsError;

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Your salon space"
        title="Reviews"
        description="Share how your visit felt. Reviews are published once the salon has approved them."
      />

      {Boolean(error) && (
        <ErrorState
          title="Your reviews could not load"
          description="Check the API connection and try again."
          onRetry={() => {
            reloadReviews();
            reloadAppointments();
          }}
        />
      )}

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-40 rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <MessageSquareHeart
            className="mx-auto size-7 text-primary"
            aria-hidden="true"
          />
          <p className="mt-4 text-sm font-medium text-foreground">
            No completed visits to review yet.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            After a confirmed appointment has taken place, you can leave a review here.
          </p>
          <div className="mt-5">
            <PrimaryButton href="/services" size="sm">
              Book a service
            </PrimaryButton>
          </div>
        </div>
      )}

      {!isLoading && !error && items.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map(({ appointment, review }) => {
            const serviceName =
              appointment.serviceSnapshot?.serviceName ?? "Salon service";
            return (
              <article
                key={appointment.id}
                className="flex flex-col rounded-lg border border-border bg-card p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                    <SafeImage src={appointment.serviceSnapshot?.image} alt={serviceName} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {serviceName}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" aria-hidden="true" />
                      {formatAppointmentDateTime(
                        appointment.appointmentDate,
                        appointment.timeSlot,
                      )}
                    </p>
                    <p className="mt-1 text-[0.65rem] text-muted-foreground/80">
                      {formatDate(appointment.createdAt)}
                    </p>
                  </div>
                </div>

                {review && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                    <StatusBadge status={review.status} />
                    <span className="text-xs text-muted-foreground">
                      {review.rating}/5 · {review.highlights.length} highlights
                    </span>
                    {review.status === "rejected" && (
                      <span className="text-xs text-[#8d5360]">
                        You can edit and resubmit.
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  {(!review || review.status === "rejected") && (
                    <ReviewForm
                      appointment={appointment}
                      existing={review?.status === "rejected" ? review : null}
                      onSubmitted={reloadReviews}
                    />
                  )}
                  {review && review.status !== "rejected" && (
                    <span className="inline-flex items-center text-xs text-muted-foreground">
                      Already submitted
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
