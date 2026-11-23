"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAdminDashboard } from "@/features/dashboard/api";
import { getAdminAppointments } from "@/features/appointments/api";
import { getAdminTransactions } from "@/features/transactions/api";
import { getServices } from "@/features/services/api";
import { useApiResource } from "@/hooks/use-api-resource";
import type { AdminAppointment } from "@/features/appointments/types";
import type { Transaction } from "@/features/transactions/types";
import { formatCurrency, formatDate, formatTimeSlot } from "@/lib/format";
import { SafeImage } from "@/components/common/safe-image";
import { StatusBadge } from "@/components/common/status-badge";
import { ErrorState } from "@/components/common/error-state";
import { Skeleton } from "@/components/common/skeleton-loader";
import { RevenueChart } from "@/features/dashboard/components/revenue-chart";
import { cn } from "@/lib/utils";

type Range = "weekly" | "monthly";

/** Builds the chart data from verified transactions and real appointments. */
function buildChartPoints(
  range: Range,
  transactions: Transaction[],
  appointments: AdminAppointment[],
) {
  const paid = transactions.filter((t) => t.status === "paid");

  if (range === "weekly") {
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date();
      day.setDate(day.getDate() - (6 - index));
      const key = day.toISOString().slice(0, 10);
      return {
        label: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(day),
        revenue: paid
          .filter((t) => t.createdAt.slice(0, 10) === key)
          .reduce((sum, t) => sum + t.amount, 0),
        count: appointments.filter((a) => a.appointmentDate === key).length,
      };
    });
  }

  return Array.from({ length: 6 }, (_, index) => {
    const month = new Date();
    month.setDate(1);
    month.setMonth(month.getMonth() - (5 - index));
    const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
    return {
      label: new Intl.DateTimeFormat("en-US", { month: "short" }).format(month),
      revenue: paid
        .filter((t) => t.createdAt.slice(0, 7) === key)
        .reduce((sum, t) => sum + t.amount, 0),
      count: appointments.filter((a) => a.appointmentDate.slice(0, 7) === key).length,
    };
  });
}

/**
 * Administrator overview.
 * Every figure and table row comes from the existing admin APIs.
 */
export function AdminOverview() {
  const [range, setRange] = useState<Range>("weekly");

  const { data, error, isLoading, reload } = useApiResource(
    () => getAdminDashboard(),
    "admin-dashboard",
  );
  const { data: appointmentsData } = useApiResource(
    () => getAdminAppointments({ page: 1, limit: 100 }),
    "admin-home-appointments",
  );
  const { data: transactionsData } = useApiResource(
    () => getAdminTransactions({ page: 1, limit: 100 }),
    "admin-home-transactions",
  );
  const { data: servicesData } = useApiResource(
    () => getServices({ page: 1, limit: 6, sort: "newest" }),
    "admin-home-services",
  );

  const transactions = transactionsData?.transactions ?? [];
  const appointments = appointmentsData?.appointments ?? [];
  const popularServices = (servicesData?.services ?? []).slice(0, 3);
  const chartPoints = buildChartPoints(range, transactions, appointments);

  const recentAppointments = [...appointments]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);
  const recentTransactions = transactions.slice(0, 5);

  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const stats = [
    {
      label: "Revenue",
      value: data ? formatCurrency(data.totalRevenue, data.currency) : "—",
      badge: "PAID",
    },
    {
      label: "Total bookings",
      value: data ? data.totalAppointments : "—",
      badge: "ALL TIME",
    },
    {
      label: "Clients",
      value: data ? data.totalRegisteredCustomers : "—",
      badge: "REGISTERED",
    },
    {
      label: "Active services",
      value: data ? data.totalActiveServices : "—",
      badge: "LIVE",
    },
    {
      label: "Pending",
      value: data ? data.pendingAppointments : "—",
      badge: "AWAITING",
    },
    {
      label: "Confirmed",
      value: data ? data.confirmedAppointments : "—",
      badge: "BOOKED",
    },
    {
      label: "Cancelled",
      value: data ? data.cancelledAppointments : "—",
      badge: "CLOSED",
    },
    {
      label: "Successful payments",
      value: data ? data.totalSuccessfulPayments : "—",
      badge: "PAID",
    },
  ];

  return (
    <div className="space-y-7">
      <div>
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-ink-faint">
          Overview
        </p>
        <h1 className="mt-2 font-heading text-4xl font-medium tracking-tight text-ink sm:text-[2.6rem]">
          The Studio Overview.
        </h1>
        <p className="mt-1 text-sm text-ink-muted">{todayLabel}</p>
      </div>

      {Boolean(error) && (
        <ErrorState
          title="The salon overview could not load"
          description="Check the admin dashboard API connection and try again."
          onRetry={reload}
        />
      )}

      {/* Stats */}
      {isLoading ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : (
        <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-line bg-card md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "px-5 py-5",
                index > 0 && index % 2 === 1 && "border-l border-line",
                index > 0 && index % 4 !== 0 && "md:border-l md:border-line",
                index >= 2 && index < 4 && "border-t border-line md:border-t-0",
                index >= 4 && "border-t border-line",
              )}
            >
              <p className="font-heading text-3xl text-ink sm:text-[2.1rem]">{stat.value}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-ink-muted">
                  {stat.label}
                </span>
                <span className="rounded-full bg-surface-soft px-2 py-0.5 text-[0.58rem] font-semibold text-brand-deep">
                  {stat.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
        {/* Revenue analytics */}
        <section className="rounded-xl border border-line bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-xl text-ink">Revenue Analytics</h2>
              <p className="mt-1 text-xs text-ink-muted">Verified payments and booked visits.</p>
            </div>
            <label className="flex items-center gap-2 rounded-md border border-line bg-card px-2.5 py-1.5 text-xs text-ink-soft">
              <span className="sr-only">Chart range</span>
              <select
                value={range}
                onChange={(event) => setRange(event.target.value as Range)}
                className="bg-transparent text-xs outline-none"
                aria-label="Chart range"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>
          </div>
          <div className="mt-5">
            <RevenueChart points={chartPoints} />
          </div>
        </section>

        {/* Popular services */}
        <section className="rounded-xl border border-line bg-card p-5 sm:p-6">
          <h2 className="font-heading text-xl text-ink">Popular Services</h2>
          {popularServices.length > 0 ? (
            <div className="mt-4 space-y-4">
              {popularServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/dashboard/admin/services/${service.id}/edit`}
                  className="group flex items-center gap-3"
                >
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-surface-hero">
                    <SafeImage src={service.image} alt={service.serviceName} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink group-hover:text-link-accent">
                      {service.serviceName}
                    </p>
                    <p className="truncate text-[0.68rem] text-ink-muted">{service.category}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium text-ink">
                      {formatCurrency(service.price)}
                    </p>
                    <p className="text-[0.65rem] text-ink-faint">{service.duration} min</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink-muted">No published services yet.</p>
          )}
          <Link
            href="/dashboard/admin/services"
            className="mt-5 inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-link-accent hover:text-link-accent/80"
          >
            Manage services
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
        {/* Recent appointments */}
        <section className="rounded-xl border border-line bg-card p-5 sm:p-6">
          <h2 className="font-heading text-xl text-ink">Recent Appointments</h2>
          {recentAppointments.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-[0.62rem] uppercase tracking-[0.14em] text-ink-faint">
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Service</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Time</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-soft">
                  {recentAppointments.map((appointment) => (
                    <tr key={appointment.id} className="text-ink-soft">
                      <td className="py-3 pr-3">{appointment.customer?.name ?? "Customer"}</td>
                      <td className="py-3 pr-3">
                        {appointment.serviceSnapshot?.serviceName ?? "Salon service"}
                      </td>
                      <td className="py-3 pr-3 text-ink-soft">
                        {formatDate(appointment.appointmentDate)}
                      </td>
                      <td className="py-3 pr-3 text-ink-soft">
                        {formatTimeSlot(appointment.timeSlot)}
                      </td>
                      <td className="py-3 pr-3">{formatCurrency(appointment.servicePrice)}</td>
                      <td className="py-3">
                        <StatusBadge status={appointment.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink-muted">No appointments have been requested yet.</p>
          )}
          <Link
            href="/dashboard/admin/appointments"
            className="mt-4 inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-link-accent hover:text-link-accent/80"
          >
            View all appointments
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </section>

        {/* Activity & transactions */}
        <section className="rounded-xl border border-line bg-card p-5 sm:p-6">
          <h2 className="font-heading text-xl text-ink">Activity &amp; Transactions</h2>
          {recentTransactions.length > 0 ? (
            <div className="mt-4 space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-3 border-b border-line-soft pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink-soft">
                      {transaction.appointment?.serviceSnapshot?.serviceName ?? "Payment"}
                    </p>
                    <p className="text-[0.65rem] text-ink-faint">
                      {transaction.status === "paid" ? "Card" : "Failed"} ·{" "}
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium text-ink">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </p>
                    <StatusBadge status={transaction.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink-muted">No payment activity recorded yet.</p>
          )}
          <Link
            href="/dashboard/admin/transactions"
            className="mt-4 inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-link-accent hover:text-link-accent/80"
          >
            All transactions
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </section>
      </div>
    </div>
  );
}
