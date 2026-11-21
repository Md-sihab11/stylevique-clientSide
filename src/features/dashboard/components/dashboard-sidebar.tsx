"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { ExternalLink } from "lucide-react";
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
}

/**
 * Sidebar content shared by the desktop rail and the mobile sheet.
 * Active states are derived from the current pathname.
 */
export function DashboardSidebar({
  items,
  onNavigate,
  isCollapsed = false,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  function isActive(item: DashboardNavItem) {
    return item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-center px-4 py-6">
        {/* multiply blends the logo's light backdrop into the cream sidebar */}
        <Logo
          href="/"
          imageClassName="mix-blend-multiply"
          className={isCollapsed ? "w-10 overflow-hidden" : undefined}
        />
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
                  ? "bg-[#b49162] font-medium text-white shadow-sm"
                  : "text-[#6d625a] hover:bg-[#e9ddcd] hover:text-[#302b2b]",
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
