"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock3, Scissors, ShieldCheck, Sparkles } from "lucide-react";
import { getServiceById } from "@/features/services/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { formatCurrency, formatDuration } from "@/lib/format";
import { PrimaryButton } from "@/components/common/primary-button";
import { SafeImage } from "@/components/common/safe-image";
import { Skeleton } from "@/components/common/skeleton-loader";
import { ErrorState } from "@/components/common/error-state";
import { EmptyState } from "@/components/common/empty-state";
import { BookingForm } from "@/features/appointments/components/booking-form";
import { ReviewCarousel } from "@/features/reviews/components/review-carousel";

const OBJECT_ID_PATTERN = /^[a-fA-F0-9]{24}$/;

/**
 * Service details page.
 * Reads the dynamic route ID and loads the active service from
 * GET /api/services/:id.
 */
export function ServiceDetails() {
  const params = useParams<{ id: string }>();
  const serviceId = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");
  const isValidId = OBJECT_ID_PATTERN.test(serviceId);

  const { data, error, isLoading, reload } = useApiResource(
    () => getServiceById(serviceId),
    serviceId,
  );

  if (!isValidId) {
    return (
      <div className="page-width py-20">
        <EmptyState
          icon={Scissors}
          title="This service link is not valid"
          description="The service ID in the address is not in the expected format. Return to the menu to choose a service."
          action={<PrimaryButton href="/services">Back to services</PrimaryButton>}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page-width grid gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-16">
        <Skeleton className="aspect-[4/5] w-full rounded-sm" />
        <div className="space-y-5 pt-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-14 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-12 w-40 rounded-full" />
        </div>
      </div>
    );
  }

  if (error || !data?.service) {
    return (
      <div className="page-width py-20">
        <ErrorState
          title="This service could not be loaded"
          description="The service may be inactive or no longer available. Return to the menu to choose another service."
          onRetry={reload}
        />
        <div className="mt-6 text-center">
          <PrimaryButton href="/services" variant="outline">
            Browse all services
          </PrimaryButton>
        </div>
      </div>
    );
  }

  const service = data.service;

  return (
    <div>
      <div className="page-width py-6">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          All services
        </Link>
      </div>

      <section className="page-width grid gap-10 pb-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:pb-24">
        <div>
          <div className="relative aspect-[4/4.6] overflow-hidden rounded-sm bg-secondary">
            <SafeImage src={service.image} alt={service.serviceName} priority />
            <span className="absolute left-5 top-5 rounded-full bg-background/90 px-3.5 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-foreground backdrop-blur-sm">
              {service.category}
            </span>
          </div>
        </div>

        <div className="lg:pt-4">
          <p className="eyebrow">{service.category}</p>
          <h1 className="mt-3 font-display text-5xl leading-[0.98] font-medium tracking-[0.01em] text-foreground uppercase sm:text-6xl">
            {service.serviceName}
          </h1>
          <p className="mt-6 text-sm leading-7 text-muted-foreground">
            {service.description}
          </p>

          <div className="mt-8 grid gap-4 border-y border-border py-6 sm:grid-cols-3">
            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Duration
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-foreground">
                <Clock3 className="size-3.5 text-primary" aria-hidden="true" />
                {formatDuration(service.duration)}
              </p>
            </div>
            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Investment
              </p>
              <p className="mt-2 text-sm font-semibold text-primary">
                {formatCurrency(service.price)}
              </p>
            </div>
            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Availability
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-foreground">
                <span className="size-1.5 rounded-full bg-[#6b8a63]" aria-hidden="true" />
                Active service
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="flex gap-3">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h2 className="font-section text-sm font-medium tracking-[0.06em] text-foreground uppercase">Personal attention</h2>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Your appointment is reviewed by the salon before it is confirmed.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h2 className="font-section text-sm font-medium tracking-[0.06em] text-foreground uppercase">Clear status</h2>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Follow confirmation and payment updates from your dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-border bg-card p-5 sm:p-6">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Request an appointment
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Choose a preferred date and time. The salon will confirm your slot,
              and you can pay online after confirmation.
            </p>
            <div className="mt-5">
              <BookingForm service={service} />
            </div>
          </div>
        </div>
      </section>

      <ReviewCarousel serviceId={service.id} compact />
    </div>
  );
}
