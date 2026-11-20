"use client";

import Link from "next/link";
import {
  CalendarCheck,
  CalendarDays,
  CalendarX,
  Hourglass,
  Search,
  Sparkles,
} from "lucide-react";
import { getCustomerDashboard } from "@/features/dashboard/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { useSession } from "@/lib/auth/auth-client";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { Skeleton } from "@/components/common/skeleton-loader";
import { ErrorState } from "@/components/common/error-state";
import { PrimaryButton } from "@/components/common/primary-button";

/**
 * Customer overview.
 * The four cards read from GET /api/dashboard/customer.
 */
export function CustomerOverview() {
  const { data: session } = useSession();
  const { data, error, isLoading, reload } = useApiResource(
    () => getCustomerDashboard(),
    "customer-dashboard",
  );

  const firstName = session?.user.name?.split(" ")[0] ?? "there";

  const stats = [
    {
      label: "Total appointments",
      value: data ? data.totalAppointments : "—",
      helper: "All requests in your account",
      icon: CalendarDays,
    },
    {
      label: "Pending",
      value: data ? data.pendingAppointments : "—",
      helper: "Waiting for salon confirmation",
      icon: Hourglass,
    },
    {
      label: "Confirmed",
      value: data ? data.confirmedAppointments : "—",
      helper: "Reserved appointments",
      icon: CalendarCheck,
    },
    {
      label: "Cancelled",
      value: data ? data.cancelledAppointments : "—",
      helper: "Released time slots",
      icon: CalendarX,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Customer dashboard"
        title={`Welcome back, ${firstName}.`}
        description="A clear view of your appointments and the next steps. Everything here comes from your Stylevique account."
        action={
          <PrimaryButton href="/services" size="sm">
            Book an appointment
          </PrimaryButton>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Skeleton key={stat.label} className="h-36 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              helper={stat.helper}
              icon={stat.icon}
            />
          ))}
        </div>
      )}

      {Boolean(error) && (
        <ErrorState
          title="Your overview could not load"
          description="Check the dashboard API connection and try again."
          onRetry={reload}
        />
      )}

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
            <p className="eyebrow">Your next step</p>
          </div>
          <h2 className="mt-3 font-section text-3xl font-medium tracking-[0.02em] text-foreground uppercase">
            One place for every appointment.
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
            Track pending requests, pay for confirmed appointments and keep your
            contact details up to date. If a detail looks wrong, the salon is only
            a message away.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <PrimaryButton href="/dashboard/customer/appointments" size="sm" variant="outline">
              View appointments
            </PrimaryButton>
            <PrimaryButton href="/dashboard/customer/profile" size="sm" variant="ghost">
              Edit profile
            </PrimaryButton>
          </div>
        </div>

        <div className="rounded-lg bg-secondary/55 p-6">
          <p className="eyebrow">How it flows</p>
          <ol className="mt-5 space-y-4">
            {[
              "Send an appointment request from any service page.",
              "The salon confirms your date and time.",
              "Pay online after confirmation if you choose.",
            ].map((step, index) => (
              <li key={step} className="flex gap-3 text-sm leading-6 text-foreground/80">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-background font-heading text-sm text-primary">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary hover:text-primary/80"
          >
            <Search className="size-3.5" aria-hidden="true" />
            Find a service
          </Link>
        </div>
      </div>
    </div>
  );
}
