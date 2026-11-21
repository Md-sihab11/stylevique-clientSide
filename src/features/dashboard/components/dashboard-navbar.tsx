"use client";

import Link from "next/link";
import { Bell, LogOut, Menu, Search, UserRound } from "lucide-react";
import type { DashboardUser } from "./dashboard-sidebar";
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
 * Dashboard top bar: mobile menu toggle, an admin search field, a notification
 * bell and the signed-in user's avatar. Sign out stays here so the sidebar can
 * keep the clean, minimal look of the reference design.
 */
export function DashboardNavbar({
  user,
  role,
  onToggle,
  onSignOut,
  isSigningOut,
}: DashboardNavbarProps) {
  return (
    <div className="sticky top-0 z-30 flex h-[4.5rem] items-center justify-between gap-4 border-b border-[#eee5d9] bg-[#fbf8f3]/90 px-4 backdrop-blur-md sm:px-6 lg:px-10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex size-9 items-center justify-center rounded-full text-[#6d625a] transition-colors hover:bg-[#f0e8dd]"
          aria-label="Toggle dashboard navigation"
        >
          <Menu className="size-[1.15rem]" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {role === "admin" && (
          <form
            action="/dashboard/admin/appointments"
            className="hidden md:block"
            role="search"
          >
            <div className="flex h-9 w-56 items-center gap-2 rounded-md border border-[#e3d8cc] bg-white/70 px-3 lg:w-72">
              <Search className="size-4 text-[#9a8d82]" aria-hidden="true" />
              <input
                type="search"
                name="search"
                placeholder="Search appointments, clients..."
                aria-label="Search appointments and clients"
                className="w-full bg-transparent text-xs text-[#302b2b] outline-none placeholder:text-[#a89a8e]"
              />
            </div>
          </form>
        )}

        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex size-9 items-center justify-center rounded-full text-[#6d625a] transition-colors hover:bg-[#f0e8dd]"
        >
          <Bell className="size-[1.1rem]" aria-hidden="true" />
          <span className="absolute right-2 top-1.5 size-1.5 rounded-full bg-[#b49162] ring-2 ring-[#fbf8f3]" />
        </button>

        <Link
          href={`/dashboard/${role}/profile`}
          className="flex items-center gap-2 rounded-full p-0.5 transition-opacity hover:opacity-80"
          aria-label="Open profile"
        >
          <Avatar className="size-8 border border-[#e3d8cc]">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="bg-[#eadfd1] text-[0.65rem] text-[#8a6a42]">
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
          className="inline-flex size-9 items-center justify-center rounded-full text-[#6d625a] transition-colors hover:bg-[#f0e8dd] hover:text-[#a33a36] disabled:opacity-50"
        >
          <LogOut className="size-[1.05rem]" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
