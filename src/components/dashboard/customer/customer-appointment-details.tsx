"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  CreditCard,
  MessageSquare,
  ReceiptText,
} from "lucide-react";
import { getAppointmentById } from "@/lib/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { getAppointmentService } from "@/lib/appointment-rules";
import {
  formatAppointmentDateTime,
  formatCurrency,
  formatDateTime,
  formatDuration,
} from "@/lib/format";
import { Skeleton } from "@/components/common/skeleton-loader";
import { StatusBadge } from "@/components/common/status-badge";
import { ErrorState } from "@/components/common/error-state";
import { PendingIntegration } from "@/components/common/pending-integration";
import { PrimaryButton } from "@/components/common/primary-button";
import { SafeImage } from "@/components/common/safe-image";
import { CustomerAppointmentActions } from "@/components/appointments/customer-appointment-actions";

const OBJECT_ID_PATTERN = /^[a-fA-F0-9]{24}$/;

/** Full customer-facing appointment detail with the same guarded actions. */
export function CustomerAppointmentDetails() {
  const params = useParams<{ id: string }>();
  const appointmentId = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");
  const isValidId = OBJECT_ID_PATTERN.test(appointmentId);

  const { data, error, isLoading, isPendingIntegration, reload } = useApiResource(
    () => getAppointmentById(appointmentId),
    appointmentId,
  );

  const backLink = (
    <Link
      href="/dashboard/customer/appointments"
      className="inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-3.5" aria-hidden="true" />
      All appointments
    </Link>
  );

  if (!isValidId) {
    return (
      <div className="space-y-8">
        {backLink}
        <ErrorState
          title="This appointment link is not valid"
          description="The appointment ID in the address is not in the expected format."
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-7">
        {backLink}
        <Skeleton className="h-12 w-2/3" />
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (isPendingIntegration) {
    return (
      <div className="space-y-8">
        {backLink}
        <PendingIntegration
          apiName="getAppointmentById()"
          filePath="src/lib/api/appointments.ts"
        />
      </div>
    );
  }

  if (error || !data?.appointment) {
    return (
      <div className="space-y-8">
        {backLink}
        <ErrorState
          title="Appointment could not be loaded"
          description="It may belong to another account, or the request may not be connected yet."
          onRetry={reload}
        />
      </div>
    );
  }

  const appointment = data.appointment;
  const service = getAppointmentService(appointment);

  return (
    <div className="space-y-7">
      {backLink}

      <div className="flex flex-col gap-4 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Appointment details</p>
          <h1 className="mt-3 text-4xl font-medium leading-none text-foreground sm:text-5xl">
            {service.name}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Reference #{appointment.id.slice(-6).toUpperCase()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={appointment.status} />
          <StatusBadge status={appointment.paymentStatus} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-secondary">
            <SafeImage src={service.image} alt={service.name} priority />
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <p className="eyebrow">Service</p>
            <h2 className="mt-2 text-2xl font-medium text-foreground">{service.name}</h2>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
              {service.category}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Clock3 className="size-4" aria-hidden="true" />
                {service.duration ? formatDuration(service.duration) : "Duration in confirmation"}
              </span>
              <span className="font-semibold text-foreground">
                {formatCurrency(appointment.servicePrice)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
            <p className="eyebrow">The appointment</p>
            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <CalendarDays className="size-3.5" aria-hidden="true" />
                  Date & time
                </dt>
                <dd className="mt-2 text-sm leading-6 text-foreground">
                  {formatAppointmentDateTime(
                    appointment.appointmentDate,
                    appointment.timeSlot,
                  )}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <ReceiptText className="size-3.5" aria-hidden="true" />
                  Requested
                </dt>
                <dd className="mt-2 text-sm leading-6 text-foreground">
                  {formatDateTime(appointment.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <CreditCard className="size-3.5" aria-hidden="true" />
                  Payment
                </dt>
                <dd className="mt-2">
                  <StatusBadge status={appointment.paymentStatus} />
                </dd>
              </div>
              <div>
                <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Price
                </dt>
                <dd className="mt-2 text-sm font-semibold text-primary">
                  {formatCurrency(appointment.servicePrice)}
                </dd>
              </div>
            </dl>

            {appointment.message && (
              <div className="mt-5 rounded-md bg-muted/60 p-4">
                <p className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <MessageSquare className="size-3.5" aria-hidden="true" />
                  Your note
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">{appointment.message}</p>
              </div>
            )}

            <div className="mt-6 border-t border-border pt-5">
              <CustomerAppointmentActions
                appointment={appointment}
                onChanged={reload}
                showDetailsLink={false}
              />
              {appointment.status === "pending" && (
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  This request is waiting for the salon. You can cancel it while it
                  is pending.
                </p>
              )}
              {appointment.status === "confirmed" && appointment.paymentStatus === "unpaid" && (
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  Your appointment is confirmed. Payment is optional online and can
                  be completed now.
                </p>
              )}
              {appointment.status === "confirmed" && appointment.paymentStatus === "paid" && (
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  This appointment is confirmed and paid. Please contact the salon if
                  you need to make a change.
                </p>
              )}
              {appointment.status === "cancelled" && (
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  This appointment was cancelled. You can request a new time from the
                  service page.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg bg-secondary/50 p-5">
            <p className="eyebrow">A note on changes</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Pending appointments can be cancelled here. Once confirmed, contact the
              salon directly so the team can help with changes.
            </p>
            <PrimaryButton href="/contact" variant="outline" size="sm" className="mt-4">
              Contact the salon
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
