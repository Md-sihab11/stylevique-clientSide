"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CalendarCheck,
  CalendarPlus,
  CalendarX,
  CheckCheck,
  CreditCard,
  type LucideIcon,
} from "lucide-react";
import { getAdminAppointments, getMyAppointments } from "@/features/appointments/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { formatDate, formatTimeSlot } from "@/lib/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NotificationType = "confirmed" | "cancelled" | "paid" | "new_booking";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string | null;
  href: string;
  icon: LucideIcon;
}

const ICONS: Record<NotificationType, LucideIcon> = {
  confirmed: CalendarCheck,
  cancelled: CalendarX,
  paid: CreditCard,
  new_booking: CalendarPlus,
};

function relativeTime(value: string | null) {
  if (!value) return "";
  const elapsed = Date.now() - new Date(value).getTime();
  if (Number.isNaN(elapsed)) return "";
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(value);
}

/**
 * Notification centre.
 *
 * Notifications are derived from real appointment records: a customer sees
 * confirmations, cancellations and verified payments; an admin sees new
 * booking requests. Read state is kept per role in localStorage so the unread
 * dot survives a refresh. Nothing here invents an event.
 */
export function NotificationCenter({ role }: { role: "customer" | "admin" }) {
  const router = useRouter();
  const [seenIds, setSeenIds] = useState<string[]>([]);

  const storageKey = `stylevique-notifications-${role}`;

  useEffect(() => {
    let active = true;

    Promise.resolve().then(() => {
      if (!active) return;
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setSeenIds(parsed.filter((item): item is string => typeof item === "string"));
          }
        }
      } catch {
        // A blocked or malformed store should never break the dashboard.
      }
    });

    return () => {
      active = false;
    };
  }, [storageKey]);

  const { data: customerData } = useApiResource(
    () =>
      role === "customer"
        ? getMyAppointments({ page: 1, limit: 20 })
        : Promise.resolve(null),
    `notifications-customer-${role}`,
  );
  const { data: adminData } = useApiResource(
    () =>
      role === "admin"
        ? getAdminAppointments({ page: 1, limit: 20 })
        : Promise.resolve(null),
    `notifications-admin-${role}`,
  );

  const notifications: NotificationItem[] = [];

  if (role === "customer") {
    for (const appointment of customerData?.appointments ?? []) {
      const service = appointment.serviceSnapshot?.serviceName ?? "Salon service";
      const when = `${formatDate(appointment.appointmentDate)} at ${formatTimeSlot(appointment.timeSlot)}`;

      if (appointment.status === "confirmed" && appointment.confirmedAt) {
        notifications.push({
          id: `${appointment.id}-confirmed`,
          type: "confirmed",
          title: "Appointment confirmed",
          description: `${service} · ${when}`,
          timestamp: appointment.confirmedAt,
          href: `/dashboard/customer/appointments/${appointment.id}`,
          icon: ICONS.confirmed,
        });
      }
      if (appointment.status === "cancelled" && appointment.cancelledAt) {
        notifications.push({
          id: `${appointment.id}-cancelled`,
          type: "cancelled",
          title: "Appointment cancelled",
          description: `${service} · ${when}`,
          timestamp: appointment.cancelledAt,
          href: `/dashboard/customer/appointments/${appointment.id}`,
          icon: ICONS.cancelled,
        });
      }
      if (appointment.paymentStatus === "paid" && appointment.paidAt) {
        notifications.push({
          id: `${appointment.id}-paid`,
          type: "paid",
          title: "Payment confirmed",
          description: `${service} · verified by Stripe`,
          timestamp: appointment.paidAt,
          href: `/dashboard/customer/appointments/${appointment.id}`,
          icon: ICONS.paid,
        });
      }
    }
  } else {
    for (const appointment of adminData?.appointments ?? []) {
      if (appointment.status !== "pending") continue;
      const service = appointment.serviceSnapshot?.serviceName ?? "Salon service";
      const customer = appointment.customer?.name ?? "A customer";
      notifications.push({
        id: `${appointment.id}-new_booking`,
        type: "new_booking",
        title: "New booking request",
        description: `${customer} · ${service} · ${formatDate(appointment.appointmentDate)}`,
        timestamp: appointment.createdAt,
        href: `/dashboard/admin/appointments/${appointment.id}`,
        icon: ICONS.new_booking,
      });
    }
  }

  notifications.sort((a, b) =>
    (b.timestamp ?? "").localeCompare(a.timestamp ?? ""),
  );

  const recent = notifications.slice(0, 12);
  const unreadCount = recent.filter((item) => !seenIds.includes(item.id)).length;

  function markAllRead() {
    const ids = recent.map((item) => item.id);
    setSeenIds(ids);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(ids));
    } catch {
      // Ignore storage failures – the dot still clears for this session.
    }
  }

  return (
    <DropdownMenu onOpenChange={(open) => open && markAllRead()}>
      <DropdownMenuTrigger
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
        className="relative inline-flex size-9 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="size-[1.1rem]" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[0.55rem] font-bold text-primary-foreground ring-2 ring-background">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">Notifications</p>
            <p className="text-[0.65rem] text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : "You are all caught up"}
            </p>
          </div>
          {recent.length > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex items-center gap-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary"
            >
              <CheckCheck className="size-3.5" aria-hidden="true" />
              Read all
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto p-1">
          {recent.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              {role === "admin"
                ? "New booking requests will appear here."
                : "Confirmation, cancellation and payment updates will appear here."}
            </p>
          ) : (
            recent.map((item) => {
              const Icon = item.icon;
              const unread = !seenIds.includes(item.id);
              return (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => router.push(item.href)}
                  className="cursor-pointer items-start gap-3 px-3 py-3"
                >
                  <span
                    className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${
                      unread ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-foreground">
                        {item.title}
                      </span>
                      {unread && <span className="size-1.5 shrink-0 rounded-full bg-primary" />}
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                      {item.description}
                    </span>
                    <span className="mt-1 block text-[0.62rem] text-muted-foreground/80">
                      {relativeTime(item.timestamp)}
                    </span>
                  </span>
                </DropdownMenuItem>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
