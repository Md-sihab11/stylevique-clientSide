"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Compass,
  CreditCard,
  ExternalLink,
  LayoutDashboard,
  MessageSquareHeart,
  Scissors,
  UserRound,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  DashboardSidebar,
  type DashboardNavItem,
  type DashboardUser,
} from "./dashboard-sidebar";
import { DashboardNavbar } from "./dashboard-navbar";

export const ADMIN_NAV: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard, exact: true },
  { label: "Services", href: "/dashboard/admin/services", icon: Scissors },
  { label: "Appointments", href: "/dashboard/admin/appointments", icon: CalendarDays },
  { label: "Customers", href: "/dashboard/admin/users", icon: UsersRound },
  { label: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
  { label: "Reviews", href: "/dashboard/admin/reviews", icon: MessageSquareHeart },
  { label: "My profile", href: "/dashboard/admin/profile", icon: UserRound },
];

export const CUSTOMER_NAV: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard, exact: true },
  { label: "Appointments", href: "/dashboard/customer/appointments", icon: CalendarDays },
  { label: "Explore Services", href: "/services", icon: Compass },
  { label: "Payments", href: "/dashboard/customer/transactions", icon: CreditCard },
  { label: "Reviews", href: "/dashboard/customer/reviews", icon: MessageSquareHeart },
  { label: "My Profile", href: "/dashboard/customer/profile", icon: UserRound },
];

interface DashboardShellProps {
  user: DashboardUser;
  role: "customer" | "admin";
  navItems?: DashboardNavItem[];
  children: ReactNode;
}

/**
 * Shared dashboard frame: warm cream sidebar, ivory content area.
 * The sidebar collapses from its own edge button on desktop and becomes an
 * overlay drawer on mobile. Both roles keep a clear route back to the site.
 */
export function DashboardShell({ user, role, navItems, children }: DashboardShellProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const items = navItems ?? (role === "admin" ? ADMIN_NAV : CUSTOMER_NAV);

  async function handleSignOut() {
    setIsSigningOut(true);

    const result = await authClient.signOut();

    if (result.error) {
      toast.error(result.error.message ?? "Could not sign out. Please try again.");
      setIsSigningOut(false);
      return;
    }

    toast.success("Signed out.");
    router.push("/");
    router.refresh();
  }

  return (
    <div data-dashboard className="flex min-h-svh bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex flex-col border-r border-border bg-surface-soft transition-all duration-300",
          "hidden lg:flex",
          isCollapsed ? "w-16" : "w-56",
        )}
      >
        <DashboardSidebar
          user={user}
          items={items}
          onSignOut={handleSignOut}
          isSigningOut={isSigningOut}
          isCollapsed={isCollapsed}
        />

        {/* Side-mounted collapse toggle (desktop) */}
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-6 z-30 inline-flex size-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:border-primary hover:text-primary"
        >
          {isCollapsed ? (
            <ChevronRight className="size-3.5" aria-hidden="true" />
          ) : (
            <ChevronLeft className="size-3.5" aria-hidden="true" />
          )}
        </button>
      </aside>

      <div className={cn("flex min-w-0 flex-1 flex-col", isCollapsed ? "lg:pl-16" : "lg:pl-56")}>
        <DashboardNavbar
          user={user}
          role={role}
          onToggle={() => setMobileDrawerOpen((prev) => !prev)}
          onSignOut={handleSignOut}
          isSigningOut={isSigningOut}
        />
        <main className="min-w-0 flex-1 px-4 py-7 sm:px-6 lg:px-10 lg:py-9">{children}</main>
      </div>

      {/* Mobile overlay drawer */}
      <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <SheetContent side="left" className="w-[86%] max-w-xs border-r border-border bg-surface-soft p-0">
          <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Navigate between the dashboard sections for your account.
          </SheetDescription>
          <DashboardSidebar
            user={user}
            items={items}
            onSignOut={handleSignOut}
            onNavigate={() => setMobileDrawerOpen(false)}
            isSigningOut={isSigningOut}
            isCollapsed={false}
          />
        </SheetContent>
      </Sheet>

      {/* Floating route back to the public site, always reachable */}
      <Link
        href="/"
        aria-label="Back to Stylevique website"
        title="Back to website"
        className="fixed bottom-5 right-5 z-40 inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md transition-colors hover:border-primary hover:text-primary lg:hidden"
      >
        <ExternalLink className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
