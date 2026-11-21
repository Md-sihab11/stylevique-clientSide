"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, CreditCard, Mail, NotebookPen, Phone, ReceiptText } from "lucide-react";
import { getAppointmentById } from "@/features/appointments/api";
import { getCustomerById } from "@/features/users/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { AppointmentServiceInfo } from "@/features/appointments/components/appointment-service-info";
import { AdminAppointmentActions } from "@/features/appointments/components/admin-appointment-actions";
import { getAppointmentService } from "@/features/appointments/rules";
import { formatCurrency, formatDate, formatDateTime, formatTimeSlot } from "@/lib/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/common/skeleton-loader";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";

const OBJECT_ID_PATTERN = /^[a-fA-F0-9]{24}$/;

/**
 * Admin appointment details.
 * Uses the customer appointment endpoint for the appointment and the admin
 * customer endpoint for the related user record.
 */
export function AdminAppointmentDetails() {
  const params = useParams<{ id: string }>();
  const appointmentId = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");
  const isValidId = OBJECT_ID_PATTERN.test(appointmentId);

  const { data, error, isLoading, reload } = useApiResource(
    () => getAppointmentById(appointmentId),
    appointmentId,
  );

  const appointment = data?.appointment ?? null;
  const customerId = appointment?.customerId ?? "";

  const {
    data: customerData,
    error: customerError,
    isLoading: customerLoading,
  } = useApiResource(
    () => getCustomerById(customerId),
    customerId,
  );

  const customer = customerData?.user ?? null;
  const customerErrorInfo = customerError ? customerError : null;

  const backLink = (
    <Link
      href="/dashboard/admin/appointments"
      className="inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-3.5" aria-hidden="true" />
      Back to appointments
    </Link>
  );

  if (!isValidId) {
    return (
      <div className="space-y-8">
        {backLink}
        <EmptyState
          icon={ReceiptText}
          title="This appointment link is not valid"
          description="The appointment ID in the address is not in the expected format."
        />
      </div>
    );
  }

  if (isLoading || appointment == null) {
    return (
      <div className="space-y-7">
        {backLink}
        <Skeleton className="h-12 w-2/3" />
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          <div className="space-y-5 pt-4">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-14 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || appointment == null) {
    return (
      <div className="space-y-8">
        {backLink}
        <ErrorState
          title="Appointment details could not load"
          description="It may have been deleted or no longer be available. Check the connection and try again."
          onRetry={reload}
        />
      </div>
    );
  }

  const service = getAppointmentService(appointment);

  return (
    <div className="space-y-7">
      {backLink}

      <div className="flex flex-col gap-4 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Appointment details</p>
          <h1 className="mt-3 font-display text-4xl font-medium leading-none tracking-[0.01em] text-foreground uppercase sm:text-5xl">
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
          <AppointmentServiceInfo appointment={appointment} />

          <div className="rounded-lg border border-border bg-card p-5">
            <p className="eyebrow">Customer</p>
            <div className="mt-3 flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage src={customer?.image ?? undefined} alt={customer?.name ?? appointment.customerId} />
                <AvatarFallback className="bg-secondary text-xs text-primary">
                  {customer?.name?.slice(0, 2).toUpperCase() ?? appointment.customerId.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {customer?.name ?? appointment.customerId}
                </p>
                <p className="truncate text-[0.68rem] text-muted-foreground">
                  {customer?.email ?? "Customer record unavailable"}
                </p>
                {customerErrorInfo && (
                  <p className="mt-1 text-[0.68rem] text-destructive">{customerErrorInfo.toString()}</p>
                )}
                {customerLoading && <p className="text-[0.68rem] text-muted-foreground">Loading customer…</p>}
              </div>
              {customer?.phone && (
                <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="size-3.5" aria-hidden="true" />
                  {customer.phone}
                </span>
              )}
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
                  {formatDate(appointment.appointmentDate)} · {formatTimeSlot(appointment.timeSlot)}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <ReceiptText className="size-3.5" aria-hidden="true" />
                  Requested
                </dt>
                <dd className="mt-2 text-sm leading-6 text-foreground">{formatDateTime(appointment.createdAt)}</dd>
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
                <dt className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <Clock3 className="size-3.5" aria-hidden="true" />
                  Service time
                </dt>
                <dd className="mt-2 text-sm leading-6 text-foreground">
                  {service.duration ? `${service.duration} minutes` : "Duration in confirmation"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <Mail className="size-3.5" aria-hidden="true" />
                  Price
                </dt>
                <dd className="mt-2 text-lg font-medium text-foreground">
                  {formatCurrency(appointment.servicePrice)}
                </dd>
              </div>
            </dl>
          </div>

          {appointment.message && (
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <NotebookPen className="size-3.5" aria-hidden="true" />
                Customer note
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground">{appointment.message}</p>
            </div>
          )}

          <div className="rounded-lg border border-border bg-card p-5">
            <p className="eyebrow">Status</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge status={appointment.status} label={appointment.status} />
              <StatusBadge status={appointment.paymentStatus} label={appointment.paymentStatus} />
            </div>
            {appointment.status === "confirmed" && appointment.paymentStatus === "paid" && (
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                This appointment is confirmed and paid. The customer should contact
                the salon directly for changes.
              </p>
            )}
            {appointment.status === "pending" && (
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                The appointment is waiting for the salon to confirm or cancel it.
              </p>
            )}
            {appointment.status === "cancelled" && (
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                This appointment was cancelled.
                {appointment.paymentStatus === "paid" ? " A payment was preserved, and no refund is issued by the backend." : ""}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <p className="eyebrow">Actions</p>
        <div className="mt-5">
          <AdminAppointmentActions appointment={appointment} onChanged={reload} />
        </div>
      </div>
    </div>
  );
}
