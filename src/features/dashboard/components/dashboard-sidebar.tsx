"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface DashboardUser {
  name: string;
  email: string;
  image: string | null;
  role: "customer" | "admin";
}

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

interface DashboardSidebarProps {
  user: DashboardUser;
  items: DashboardNavItem[];
  onSignOut: () => void;
  onNavigate?: () => void;
  isSigningOut?: boolean;
  isCollapsed?: boolean;
}

/**
 * Sidebar content shared by the desktop rail and the mobile sheet.
 * Active states are derived from the current pathname.
 */
export function DashboardSidebar({
  user,
  items,
  onSignOut,
  onNavigate,
  isSigningOut,
  isCollapsed = false,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  function isActive(item: DashboardNavItem) {
    return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="bg-background border-b border-border px-6 py-6">
        <Logo />
        {!isCollapsed && (
          <p className="mt-3 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {user.role === "admin" ? "Salon administration" : "Your studio space"}
          </p>
        )}
      </div>

      <nav
        aria-label="Dashboard navigation"
        className="flex-1 space-y-1 overflow-y-auto p-4"
      >
        {items.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                isCollapsed ? "justify-center gap-2" : "",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-4 shrink-0" aria-hidden="true" />
              {!isCollapsed && item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-md bg-muted/50 p-3">
          <Avatar className="size-9">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="bg-secondary text-xs text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">{user.name}</p>
            <p className="truncate text-[0.65rem] text-muted-foreground">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            disabled={isSigningOut}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-destructive disabled:opacity-50"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="size-4" aria-hidden="true" />
          </button>
        </div>
        <Link
          href="/"
          onClick={onNavigate}
          className="mt-3 block text-center text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
        >
          Back to Stylevique
        </Link>
      </div>
    </div>
  );
}
