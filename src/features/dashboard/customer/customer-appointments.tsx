"use client";

import { useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import type { Appointment, AppointmentStatus } from "@/features/appointments/types";
import { getMyAppointments } from "@/features/appointments/api";
import { useApiResource } from "@/hooks/use-api-resource";
import {
  APPOINTMENT_STATUS_OPTIONS,
} from "@/constants/salon";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatTimeSlot,
} from "@/lib/format";
import { PageHeader } from "@/components/common/page-header";
import { PrimaryButton } from "@/components/common/primary-button";
import { DataTable, type DataTableColumn } from "@/components/common/data-table";
import { PaginationControls } from "@/components/common/pagination-controls";
import { StatusBadge } from "@/components/common/status-badge";
import { TableSkeleton, Skeleton } from "@/components/common/skeleton-loader";
import { ErrorState } from "@/components/common/error-state";
import { EmptyState } from "@/components/common/empty-state";
import { AppointmentServiceInfo } from "@/features/appointments/components/appointment-service-info";
import { CustomerAppointmentActions } from "@/features/appointments/components/customer-appointment-actions";

const PAGE_SIZE = 8;

/**
 * Customer appointment list.
 * Desktop uses a table; small screens use the same data as stacked cards.
 */
export function CustomerAppointments() {
  const [status, setStatus] = useState<AppointmentStatus | "">("");
  const [page, setPage] = useState(1);

  const { data, error, isLoading, reload } = useApiResource(
    () =>
      getMyAppointments({
        status,
        page,
        limit: PAGE_SIZE,
      }),
    `my-appointments|${status}|${page}`,
  );

  const columns: DataTableColumn<Appointment>[] = [
    {
      key: "service",
      header: "Service",
      cell: (appointment) => <AppointmentServiceInfo appointment={appointment} />,
    },
    {
      key: "schedule",
      header: "Appointment",
      cell: (appointment) => (
        <div>
          <p className="text-sm text-foreground">{formatDate(appointment.appointmentDate)}</p>
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
        <CustomerAppointmentActions appointment={appointment} onChanged={reload} />
      ),
    },
  ];

  function handleStatusChange(nextStatus: AppointmentStatus | "") {
    setStatus(nextStatus);
    setPage(1);
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Customer dashboard"
        title="My appointments"
        description="Review every request, follow confirmation and pay for a confirmed appointment when you are ready."
        action={
          <PrimaryButton href="/services" size="sm">
            Book another service
          </PrimaryButton>
        }
      />

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <label
            htmlFor="appointment-status-filter"
            className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
          >
            Filter by status
          </label>
          <select
            id="appointment-status-filter"
            value={status}
            onChange={(event) =>
              handleStatusChange(event.target.value as AppointmentStatus | "")
            }
            className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            <option value="">All appointments</option>
            {APPOINTMENT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {data && (
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {data.pagination.totalItems} appointment
            {data.pagination.totalItems === 1 ? "" : "s"}
          </p>
        )}
      </div>

      {isLoading && (
        <>
          <div className="hidden md:block">
            <TableSkeleton rows={6} />
          </div>
          <div className="space-y-4 md:hidden">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        </>
      )}

      {!isLoading && Boolean(error) && (
        <ErrorState
          title="Your appointments could not load"
          description="Check the backend connection and try again."
          onRetry={reload}
        />
      )}

      {!isLoading && !error && data?.appointments.length === 0 && (
        <EmptyState
          icon={status ? Search : CalendarDays}
          title={status ? "No appointments with this status" : "No appointments yet"}
          description={
            status
              ? "Try another status or clear the filter to see your full appointment history."
              : "Your first appointment starts with the service menu. Choose something that feels right."
          }
          action={
            status ? (
              <PrimaryButton size="sm" variant="outline" onClick={() => handleStatusChange("")}>
                Clear filter
              </PrimaryButton>
            ) : (
              <PrimaryButton href="/services" size="sm">
                Explore services
              </PrimaryButton>
            )
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
              caption="Your Stylevique appointments"
            />
          </div>

          <div className="space-y-4 md:hidden">
            {data.appointments.map((appointment) => (
              <article
                key={appointment.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <AppointmentServiceInfo appointment={appointment} />
                  <StatusBadge status={appointment.status} />
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
                    <dt className="text-muted-foreground">Requested</dt>
                    <dd className="mt-1 text-foreground">
                      {formatDateTime(appointment.createdAt)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 border-t border-border pt-4">
                  <CustomerAppointmentActions appointment={appointment} onChanged={reload} />
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
