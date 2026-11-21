"use client";

import Link from "next/link";
import { Menu, UserRound } from "lucide-react";
import type { DashboardUser } from "./dashboard-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/format";

interface DashboardNavbarProps {
  user: DashboardUser;
  onToggle: () => void;
}

/** Compact top bar for the dashboard. Toggle collapses the sidebar on desktop
 *  and opens the navigation drawer on mobile. */
export function DashboardNavbar({ user, onToggle }: DashboardNavbarProps) {
  return (
    <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
          aria-label="Toggle dashboard navigation"
        >
          <Menu className="size-4" aria-hidden="true" />
        </button>
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {user.role === "admin" ? "Admin dashboard" : "Customer dashboard"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="hidden text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground sm:block"
        >
          View website
        </Link>
        <Link
          href={`/dashboard/${user.role}/profile`}
          className="flex items-center gap-2 rounded-full border border-border p-1 pr-3 transition-colors hover:bg-muted"
          aria-label="Open profile"
        >
          <Avatar className="size-7">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="bg-secondary text-[0.6rem] text-primary">
              {getInitials(user.name) || <UserRound className="size-3" />}
            </AvatarFallback>
          </Avatar>
          <span className="max-w-24 truncate text-xs text-foreground">{user.name.split(" ")[0]}</span>
        </Link>
      </div>
    </div>
  );
}
