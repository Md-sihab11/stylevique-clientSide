"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
  CalendarCheck,
  CalendarDays,
  CalendarX,
  CreditCard,
  Hourglass,
  Plus,
  Scissors,
  UsersRound,
} from "lucide-react";
import { getAdminDashboard } from "@/lib/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { formatCurrency } from "@/lib/format";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { PrimaryButton } from "@/components/common/primary-button";
import { Skeleton } from "@/components/common/skeleton-loader";
import { ErrorState } from "@/components/common/error-state";
import { PendingIntegration } from "@/components/common/pending-integration";

const QUICK_ACTIONS = [
  {
    title: "Add a service",
    description: "Publish a new treatment with price, duration and an image.",
    href: "/dashboard/admin/services/add",
    icon: Plus,
  },
  {
    title: "Review appointments",
    description: "Confirm requested times or cancel a booking when needed.",
    href: "/dashboard/admin/appointments",
    icon: CalendarDays,
  },
  {
    title: "Manage customers",
    description: "Search accounts, review details and control blocked status.",
    href: "/dashboard/admin/users",
    icon: UsersRound,
  },
  {
    title: "Check transactions",
    description: "Follow paid and failed Stripe payment records.",
    href: "/dashboard/admin/transactions",
    icon: CreditCard,
  },
];

/**
 * Administrator overview.
 * Every number comes from GET /api/dashboard/admin via the TODO API function.
 * While that function is unimplemented the cards show dashes and the page
 * clearly says the integration is pending.
 */
export function AdminOverview() {
  const { data, error, isLoading, isPendingIntegration, reload } = useApiResource(
    () => getAdminDashboard(),
    "admin-dashboard",
  );

  const primaryStats = [
    {
      label: "Total revenue",
      value: data ? formatCurrency(data.totalRevenue, data.currency) : "—",
      helper: "Successful payments only",
      icon: Banknote,
    },
    {
      label: "Successful payments",
      value: data ? data.totalSuccessfulPayments : "—",
      helper: "Paid Stripe transactions",
      icon: CreditCard,
    },
    {
      label: "Registered customers",
      value: data ? data.totalRegisteredCustomers : "—",
      helper: "Customer accounts",
      icon: UsersRound,
    },
    {
      label: "Active services",
      value: data ? data.totalActiveServices : "—",
      helper: "Visible on the public menu",
      icon: Scissors,
    },
  ];

  const appointmentStats = [
    {
      label: "Total appointments",
      value: data ? data.totalAppointments : "—",
      helper: "All time",
      icon: CalendarDays,
    },
    {
      label: "Pending",
      value: data ? data.pendingAppointments : "—",
      helper: "Awaiting confirmation",
      icon: Hourglass,
    },
    {
      label: "Confirmed",
      value: data ? data.confirmedAppointments : "—",
      helper: "Reserved slots",
      icon: CalendarCheck,
    },
    {
      label: "Cancelled",
      value: data ? data.cancelledAppointments : "—",
      helper: "Released slots",
      icon: CalendarX,
    },
  ];

  const totalAppointments = data?.totalAppointments ?? 0;
  const hasAppointmentData = totalAppointments > 0;
  const pendingPercent = hasAppointmentData
    ? Math.round(((data?.pendingAppointments ?? 0) / totalAppointments) * 100)
    : 0;
  const confirmedPercent = hasAppointmentData
    ? Math.round(((data?.confirmedAppointments ?? 0) / totalAppointments) * 100)
    : 0;
  const cancelledPercent = hasAppointmentData ? 100 - pendingPercent - confirmedPercent : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Salon administration"
        title="The salon at a glance."
        description="A live summary of appointments, services and payments. Use the quick actions below to move between the day-to-day tools."
        action={
          <div className="flex flex-wrap gap-2">
            <PrimaryButton href="/dashboard/admin/appointments" size="sm" variant="outline">
              Manage appointments
            </PrimaryButton>
            <PrimaryButton href="/dashboard/admin/services/add" size="sm">
              <Plus className="size-3.5" aria-hidden="true" />
              Add service
            </PrimaryButton>
          </div>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {primaryStats.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                helper={stat.helper}
                icon={stat.icon}
              />
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {appointmentStats.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                helper={stat.helper}
                icon={stat.icon}
              />
            ))}
          </div>
        </div>
      )}

      {!isLoading && isPendingIntegration && (
        <PendingIntegration
          apiName="getAdminDashboard()"
          filePath="src/lib/api/dashboard.ts"
          compact
        />
      )}

      {!isLoading && Boolean(error) && (
        <ErrorState
          title="The salon overview could not load"
          description="The dashboard cards are ready. Check the admin dashboard API request and try again."
          onRetry={reload}
        />
      )}

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Appointment mix</p>
              <h2 className="mt-2 text-3xl font-medium text-foreground">
                Where the bookings stand.
              </h2>
            </div>
            <CalendarDays className="size-5 text-primary" aria-hidden="true" />
          </div>

          {hasAppointmentData ? (
            <>
              <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-muted">
                <span
                  className="h-full bg-[#c9a86a]"
                  style={{ width: `${pendingPercent}%` }}
                  aria-hidden="true"
                />
                <span
                  className="h-full bg-[#6b8a63]"
                  style={{ width: `${confirmedPercent}%` }}
                  aria-hidden="true"
                />
                <span
                  className="h-full bg-primary"
                  style={{ width: `${cancelledPercent}%` }}
                  aria-hidden="true"
                />
              </div>
              <dl className="mt-5 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <dt className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="size-2 rounded-full bg-[#c9a86a]" aria-hidden="true" />
                    Pending
                  </dt>
                  <dd className="mt-1 text-lg font-medium text-foreground">{pendingPercent}%</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="size-2 rounded-full bg-[#6b8a63]" aria-hidden="true" />
                    Confirmed
                  </dt>
                  <dd className="mt-1 text-lg font-medium text-foreground">
                    {confirmedPercent}%
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
                    Cancelled
                  </dt>
                  <dd className="mt-1 text-lg font-medium text-foreground">
                    {cancelledPercent}%
                  </dd>
                </div>
              </dl>
            </>
          ) : (
            <div className="mt-6 rounded-md border border-dashed border-border px-5 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {isPendingIntegration
                  ? "The appointment mix appears once GET /api/dashboard/admin is connected."
                  : "There are no appointments to summarise yet."}
              </p>
            </div>
          )}

          <Link
            href="/dashboard/admin/appointments"
            className="mt-6 inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary hover:text-primary/80"
          >
            Open appointment management
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="rounded-lg bg-secondary/50 p-6">
          <p className="eyebrow">Quick actions</p>
          <div className="mt-4 grid gap-2">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-start gap-3 rounded-md border border-transparent bg-background/70 p-4 transition-colors hover:border-accent/40 hover:bg-background"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  <action.icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                    {action.title}
                    <ArrowUpRight
                      className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    {action.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Payment reference</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Revenue is calculated from paid transactions recorded by the Stripe
              webhook. The browser never decides that a payment succeeded — only the
              verified backend response does.
            </p>
          </div>
          <PrimaryButton href="/dashboard/admin/transactions" variant="outline" size="sm">
            View transactions
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
