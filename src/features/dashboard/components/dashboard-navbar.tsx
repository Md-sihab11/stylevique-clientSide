"use client";

import Link from "next/link";
import { ExternalLink, LogOut, PanelLeft, Search, UserRound } from "lucide-react";
import type { DashboardUser } from "./dashboard-sidebar";
import { NotificationCenter } from "./notification-center";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/format";

interface DashboardNavbarProps {
  user: DashboardUser;
  role: "customer" | "admin";
  onToggle: () => void;
  onSignOut: () => void;
  isSigningOut?: boolean;
}

/**
 * Dashboard top bar: side-panel toggle (mobile), an admin search field,
 * a notification bell, a route back to the website and the user's avatar.
 */
export function DashboardNavbar({
  user,
  role,
  onToggle,
  onSignOut,
  isSigningOut,
}: DashboardNavbarProps) {
  return (
    <div className="sticky top-0 z-30 flex h-[4.5rem] items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-6 lg:px-10">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted lg:hidden"
          aria-label="Open dashboard navigation"
        >
          <PanelLeft className="size-[1.15rem]" aria-hidden="true" />
        </button>

        <Link
          href="/"
          className="hidden items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary sm:inline-flex"
        >
          <ExternalLink className="size-3.5" aria-hidden="true" />
          Back to website
        </Link>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        {role === "admin" && (
          <form action="/dashboard/admin/appointments" className="hidden md:block" role="search">
            <div className="flex h-9 w-48 items-center gap-2 rounded-md border border-input bg-card/70 px-3 lg:w-64">
              <Search className="size-4 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                name="search"
                placeholder="Search appointments, clients..."
                aria-label="Search appointments and clients"
                className="min-w-0 w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/70"
              />
            </div>
          </form>
        )}

        <ThemeToggle />
        <NotificationCenter role={role} />

        <Link
          href={`/dashboard/${role}/profile`}
          className="flex items-center gap-2 rounded-full p-0.5 transition-opacity hover:opacity-80"
          aria-label="Open profile"
        >
          <Avatar className="size-8 border border-border">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="bg-secondary text-[0.65rem] text-primary">
              {getInitials(user.name) || <UserRound className="size-3" />}
            </AvatarFallback>
          </Avatar>
        </Link>

        <button
          type="button"
          onClick={onSignOut}
          disabled={isSigningOut}
          aria-label="Sign out"
          title="Sign out"
          className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-destructive disabled:opacity-50"
        >
          <LogOut className="size-[1.05rem]" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
