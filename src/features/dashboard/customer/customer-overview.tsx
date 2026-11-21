"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays } from "lucide-react";
import { getCustomerDashboard } from "@/features/dashboard/api";
import { getMyAppointments } from "@/features/appointments/api";
import { getServices } from "@/features/services/api";
import { getMyTransactions } from "@/features/transactions/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { useSession } from "@/lib/auth/auth-client";
import { formatAppointmentDateTime, formatCurrency, formatDate } from "@/lib/format";
import { SafeImage } from "@/components/common/safe-image";
import { StatusBadge } from "@/components/common/status-badge";
import { ErrorState } from "@/components/common/error-state";
import { Skeleton } from "@/components/common/skeleton-loader";
import { PrimaryButton } from "@/components/common/primary-button";
import { HERO_IMAGE_SRC } from "@/constants/salon";
import { cn } from "@/lib/utils";

/**
 * Customer overview.
 * All numbers, the next appointment and the booking history come from the
 * existing customer APIs. Nothing is invented on the browser.
 */
export function CustomerOverview() {
  const { data: session } = useSession();
  const { data, error, isLoading, reload } = useApiResource(
    () => getCustomerDashboard(),
    "customer-dashboard",
  );
  const { data: appointmentsData } = useApiResource(
    () => getMyAppointments({ page: 1, limit: 50 }),
    "customer-home-appointments",
  );
  const { data: transactionsData } = useApiResource(
    () => getMyTransactions({ page: 1, limit: 100 }),
    "customer-home-transactions",
  );
  const { data: servicesData } = useApiResource(
    () => getServices({ page: 1, limit: 6, sort: "newest" }),
    "customer-home-services",
  );

  const firstName = session?.user.name?.split(" ")[0] ?? "there";

  const appointments = appointmentsData?.appointments ?? [];
  const today = new Date().toISOString().slice(0, 10);

  const upcoming = appointments
    .filter((item) => item.status === "confirmed" && item.appointmentDate >= today)
    .sort((a, b) =>
      `${a.appointmentDate}${a.timeSlot}`.localeCompare(`${b.appointmentDate}${b.timeSlot}`),
    );
  const nextAppointment = upcoming[0] ?? null;
  const completed = appointments.filter(
    (item) => item.status === "confirmed" && item.appointmentDate < today,
  ).length;

  const paid = (transactionsData?.transactions ?? []).filter((t) => t.status === "paid");
  const totalSpent = paid.reduce((total, t) => total + t.amount, 0);
  const currency = paid[0]?.currency ?? "USD";

  const recent = [...appointments]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const promoServices = (servicesData?.services ?? []).slice(0, 2);

  const stats = [
    { label: "Total appointments", value: data ? data.totalAppointments : "—" },
    { label: "Upcoming", value: data ? data.confirmedAppointments : "—" },
    { label: "Completed", value: appointmentsData ? completed : "—" },
    {
      label: "Total spent",
      value: transactionsData ? formatCurrency(totalSpent, currency) : "—",
    },
  ];

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-4xl font-medium tracking-tight text-[#302b2b]">
            Overview
          </h1>
          <p className="mt-1 text-sm text-[#8c7f74]">
            Welcome back, {firstName}. Here is your salon at a glance.
          </p>
        </div>
      </div>

      {Boolean(error) && (
        <ErrorState
          title="Your overview could not load"
          description="Check the dashboard API connection and try again."
          onRetry={reload}
        />
      )}

      {/* Hero banner */}
      <section className="grid overflow-hidden rounded-xl border border-[#e8dccb] bg-[#efe7dd] md:grid-cols-[1fr_0.9fr]">
        <div className="flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-12">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#9a7a4f]">
            Your salon space
          </p>
          <h2 className="mt-4 font-heading text-4xl leading-[1.05] text-[#302b2b] sm:text-5xl">
            Your Time. Your Style.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#6d625a]">
            Schedule your next signature grooming or styling session.
          </p>
          <div className="mt-6">
            <Link
              href="/services"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-[#302b2b] px-5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#4a403c]"
            >
              Book an Appointment
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="relative min-h-44 md:min-h-full">
          <SafeImage
            src={HERO_IMAGE_SRC}
            alt="A warmly lit Stylevique salon interior"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* Stats strip */}
      {isLoading ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : (
        <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-[#e8dccb] bg-white/70 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "px-5 py-5",
                index > 0 && "border-l border-[#e8dccb]",
                index === 2 && "md:border-l",
              )}
            >
              <p className="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-[#8c7f74]">
                {stat.label}
              </p>
              <p className="mt-1.5 font-heading text-3xl text-[#b49162]">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Next appointment */}
      <section>
        <h2 className="font-heading text-xl text-[#302b2b]">Next appointment</h2>
        <div className="mt-3 rounded-xl border border-[#e8dccb] bg-white/70 p-4">
          {nextAppointment ? (
            <Link
              href={`/dashboard/customer/appointments/${nextAppointment.id}`}
              className="group flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-md bg-[#efe7dd] sm:w-44">
                <SafeImage
                  src={nextAppointment.serviceSnapshot?.image}
                  alt={nextAppointment.serviceSnapshot?.serviceName ?? "Salon service"}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-[#302b2b] group-hover:text-[#8d5360]">
                  {nextAppointment.serviceSnapshot?.serviceName ?? "Salon service"}
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8c7f74]">
                  <CalendarDays className="size-3.5" aria-hidden="true" />
                  {formatAppointmentDateTime(
                    nextAppointment.appointmentDate,
                    nextAppointment.timeSlot,
                  )}
                </p>
                <p className="mt-1 text-[0.68rem] text-[#a19991]">
                  Booked online · {formatDate(nextAppointment.createdAt)}
                </p>
              </div>
              <StatusBadge status={nextAppointment.status} />
            </Link>
          ) : (
            <div className="flex flex-col items-start gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-[#302b2b]">No upcoming appointment yet.</p>
                <p className="mt-1 text-xs text-[#8c7f74]">
                  Explore the menu and request a time that suits you.
                </p>
              </div>
              <PrimaryButton href="/services" size="sm">
                Browse services
              </PrimaryButton>
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Recent booking history */}
        <section className="rounded-xl border border-[#e8dccb] bg-white/70 p-5 sm:p-6">
          <h2 className="font-heading text-xl text-[#302b2b]">Recent Booking History</h2>
          {recent.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e8dccb] text-[0.62rem] uppercase tracking-[0.14em] text-[#9a8d82]">
                    <th className="pb-2 font-medium">Service</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#efe8de]">
                  {recent.map((item) => (
                    <tr key={item.id} className="text-[#4a423d]">
                      <td className="py-3 pr-3">
                        <Link
                          href={`/dashboard/customer/appointments/${item.id}`}
                          className="hover:text-[#8d5360]"
                        >
                          {item.serviceSnapshot?.serviceName ?? "Salon service"}
                        </Link>
                      </td>
                      <td className="py-3 pr-3 text-[#6d625a]">{formatDate(item.appointmentDate)}</td>
                      <td className="py-3">
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#8c7f74]">
              Your bookings will appear here once you request an appointment.
            </p>
          )}
          <Link
            href="/dashboard/customer/appointments"
            className="mt-4 inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#8d5360] hover:text-[#6f3f4b]"
          >
            View all appointments
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </section>

        {/* Promo cards */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-2">
          {promoServices.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="group overflow-hidden rounded-xl border border-[#e8dccb] bg-white/70"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#efe7dd]">
                <SafeImage
                  src={service.image}
                  alt={service.serviceName}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-xs font-medium leading-5 text-[#302b2b] group-hover:text-[#8d5360]">
                  {service.serviceName}
                </p>
                <p className="mt-1 text-[0.65rem] text-[#8c7f74]">{service.category}</p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
