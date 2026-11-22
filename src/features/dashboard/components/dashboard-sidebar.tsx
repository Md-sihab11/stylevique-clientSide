"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { ExternalLink, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Logo } from "@/components/brand/logo";
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
  /** Desktop only: renders the collapse/expand control in the header row. */
  onToggleCollapse?: () => void;
}

/**
 * Sidebar content shared by the desktop rail and the mobile sheet.
 * Active states are derived from the current pathname.
 */
export function DashboardSidebar({
  items,
  onNavigate,
  isCollapsed = false,
  onToggleCollapse,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  function isActive(item: DashboardNavItem) {
    return item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  return (
    <div className="flex h-full flex-col">
      {/*
        Header row matches the dashboard navbar height (4.5rem). The wordmark
        is hidden when collapsed so it is never cropped, and the toggle button
        always stays inside this row instead of floating over the logo.
      */}
      <div
        className={cn(
          "flex h-[4.5rem] shrink-0 items-center border-b border-border",
          isCollapsed
            ? "justify-center px-2"
            : onToggleCollapse
              ? "justify-between gap-2 px-4"
              : "justify-center px-4",
        )}
      >
        {!isCollapsed && (
          <div className="min-w-0 [&_img]:h-9 [&_img]:w-[142px]">
            <Logo href="/" />
          </div>
        )}

        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="size-4" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="size-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      <nav
        aria-label="Dashboard navigation"
        className="no-scrollbar flex-1 space-y-1 overflow-y-auto px-3 pb-4"
      >
        {items.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-[0.82rem] transition-colors",
                isCollapsed ? "justify-center" : "",
                active
                  ? "border border-brand-foreground/20 bg-brand font-medium text-brand-foreground shadow-sm"
                  : "text-ink-soft hover:bg-surface-soft hover:text-ink",
              )}
            >
              <item.icon className="size-[1.05rem] shrink-0" aria-hidden="true" />
              {!isCollapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="border-t border-border p-4">
          <Link
            href="/"
            onClick={onNavigate}
            className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary"
          >
            <ExternalLink className="size-3.5" aria-hidden="true" />
            Back to website
          </Link>
          <p className="mt-2 text-[0.62rem] leading-4 text-muted-foreground/70">
            View the public Stylevique site.
          </p>
        </div>
      )}
    </div>
  );
}
