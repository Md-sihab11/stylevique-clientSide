"use client";

import { useState } from "react";
import {
  CalendarDays,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { AdminAppointment, AppointmentStatus } from "@/features/appointments/types";
import { getAdminAppointments } from "@/features/appointments/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { APPOINTMENT_STATUS_OPTIONS } from "@/constants/salon";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatTimeSlot,
  getCustomerName,
  getInitials,
} from "@/lib/format";
import { PageHeader } from "@/components/common/page-header";
import { PrimaryButton } from "@/components/common/primary-button";
import { DataTable, type DataTableColumn } from "@/components/common/data-table";
import { PaginationControls } from "@/components/common/pagination-controls";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { TableSkeleton, Skeleton } from "@/components/common/skeleton-loader";
import { AppointmentServiceInfo } from "@/features/appointments/components/appointment-service-info";
import { AdminAppointmentActions } from "@/features/appointments/components/admin-appointment-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const PAGE_SIZE = 10;

function CustomerCell({ appointment }: { appointment: AdminAppointment }) {
  const customer = appointment.customer;

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Avatar className="size-8 shrink-0">
        <AvatarImage src={customer?.image ?? undefined} alt={getCustomerName(customer)} />
        <AvatarFallback className="bg-secondary text-[0.6rem] text-primary">
          {getInitials(getCustomerName(customer))}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {getCustomerName(customer)}
        </p>
        <p className="truncate text-[0.68rem] text-muted-foreground">
          {customer?.email ?? "Customer record unavailable"}
        </p>
      </div>
    </div>
  );
}

/**
 * Admin appointment management.
 * Supports the two filters the backend accepts: status and appointment date.
 * Customer names are attached by the backend on the admin endpoint.
 */
export function AdminAppointments() {
  const [status, setStatus] = useState<AppointmentStatus | "">("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);

  const { data, error, isLoading, reload } = useApiResource(
    () =>
      getAdminAppointments({
        status: status || undefined,
        date: date || undefined,
        page,
        limit: PAGE_SIZE,
      }),
    `admin-appointments|${status}|${date}|${page}`,
  );

  const hasFilters = Boolean(status || date);
  const columns: DataTableColumn<AdminAppointment>[] = [
    {
      key: "customer",
      header: "Customer",
      cell: (appointment) => <CustomerCell appointment={appointment} />,
    },
    {
      key: "service",
      header: "Service",
      cell: (appointment) => <AppointmentServiceInfo appointment={appointment} />,
    },
    {
      key: "message",
      header: "Note",
      cell: (appointment) => (
        <span
          title={appointment.message || undefined}
          className="max-w-[16rem] truncate text-sm text-muted-foreground"
        >
          {appointment.message || "No note"}
        </span>
      ),
      className: "max-w-[22%]",
    },
    {
      key: "schedule",
      header: "Schedule",
      cell: (appointment) => (
        <div>
          <p className="text-sm text-foreground">
            {formatDate(appointment.appointmentDate)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatTimeSlot(appointment.timeSlot)}
          </p>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      cell: (appointment) => (
        <span className="text-sm text-foreground">
          {formatCurrency(appointment.servicePrice)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (appointment) => <StatusBadge status={appointment.status} />,
    },
    {
      key: "payment",
      header: "Payment",
      cell: (appointment) => <StatusBadge status={appointment.paymentStatus} />,
    },
    {
      key: "requested",
      header: "Requested",
      cell: (appointment) => (
        <span className="text-xs text-muted-foreground">
          {formatDateTime(appointment.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-[1%] whitespace-nowrap",
      cell: (appointment) => (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            render={<Link href={`/dashboard/admin/appointments/${appointment.id}`} />}
          >
            View
          </Button>
          <AdminAppointmentActions appointment={appointment} onChanged={reload} />
        </div>
      ),
    },
  ];

  function clearFilters() {
    setStatus("");
    setDate("");
    setPage(1);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Salon administration"
        title="Appointments"
        description="Review requests, confirm times and release slots. The backend only allows pending → confirmed/cancelled and confirmed → cancelled."
        action={
          <PrimaryButton href="/dashboard/admin/services" variant="outline" size="sm">
            Manage services
          </PrimaryButton>
        }
      />

      <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[200px_220px_auto] sm:items-end">
          <div className="space-y-2">
            <label
              htmlFor="admin-appointment-status"
              className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              Appointment status
            </label>
            <select
              id="admin-appointment-status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as AppointmentStatus | "");
                setPage(1);
              }}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              <option value="">All statuses</option>
              {APPOINTMENT_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="admin-appointment-date"
              className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              Appointment date
            </label>
            <Input
              id="admin-appointment-date"
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setPage(1);
              }}
              className="h-10 bg-background text-sm"
            />
          </div>

          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasFilters}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-border px-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 sm:w-fit"
          >
            <X className="size-3.5" aria-hidden="true" />
            Clear filters
          </button>
        </div>

        {hasFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <SlidersHorizontal
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              Filtering by
            </span>
            {status && (
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs capitalize text-foreground">
                {status}
              </span>
            )}
            {date && (
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground">
                {formatDate(date)}
              </span>
            )}
          </div>
        )}
      </div>

      {isLoading && (
        <>
          <div className="hidden md:block">
            <TableSkeleton rows={6} />
          </div>
          <div className="space-y-4 md:hidden">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-56 w-full rounded-lg" />
            ))}
          </div>
        </>
      )}

      {!isLoading && Boolean(error) && (
        <ErrorState
          title="Appointments could not load"
          description="Check the backend connection and try again."
          onRetry={reload}
        />
      )}

      {!isLoading && !error && data?.appointments.length === 0 && (
        <EmptyState
          icon={hasFilters ? Search : CalendarDays}
          title={hasFilters ? "No appointments match these filters" : "No appointments yet"}
          description={
            hasFilters
              ? "Try another status or date, or clear the filters to see every appointment."
              : "New customer requests will appear here as soon as they are submitted."
          }
          action={
            hasFilters ? (
              <PrimaryButton size="sm" variant="outline" onClick={clearFilters}>
                Clear filters
              </PrimaryButton>
            ) : undefined
          }
        />
      )}

      {!isLoading && !error && data && data.appointments.length > 0 && (
        <>
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              rows={data.appointments}
              getRowKey={(appointment) => appointment.id}
              caption="Salon appointments"
            />
          </div>

          <div className="space-y-4 md:hidden">
            {data.appointments.map((appointment) => (
              <article
                key={appointment.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <CustomerCell appointment={appointment} />
                  <StatusBadge status={appointment.status} />
                </div>

                <div className="mt-2">
                  <PrimaryButton
                    href={`/dashboard/admin/appointments/${appointment.id}`}
                    variant="outline"
                    size="sm"
                  >
                    View details
                  </PrimaryButton>
                </div>

                <div className="mt-4 border-t border-border pt-4">
                  <AppointmentServiceInfo appointment={appointment} />
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Date</dt>
                    <dd className="mt-1 text-foreground">
                      {formatDate(appointment.appointmentDate)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Time</dt>
                    <dd className="mt-1 text-foreground">
                      {formatTimeSlot(appointment.timeSlot)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Price</dt>
                    <dd className="mt-1 text-foreground">
                      {formatCurrency(appointment.servicePrice)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Payment</dt>
                    <dd className="mt-1">
                      <StatusBadge status={appointment.paymentStatus} />
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-muted-foreground">Note</dt>
                    <dd
                      className="mt-1 break-words text-sm text-foreground"
                      title={appointment.message || undefined}
                    >
                      {appointment.message || "No note"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Requested</dt>
                    <dd className="mt-1 text-foreground">
                      {formatDateTime(appointment.createdAt)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 border-t border-border pt-4">
                  <AdminAppointmentActions
                    appointment={appointment}
                    onChanged={reload}
                  />
                </div>
              </article>
            ))}
          </div>

          <PaginationControls
            pagination={data.pagination}
            onPageChange={setPage}
            className="border-t border-border pt-6"
          />
        </>
      )}
    </div>
  );
}
