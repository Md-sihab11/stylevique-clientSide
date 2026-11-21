"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Compass,
  CreditCard,
  LayoutDashboard,
  Scissors,
  Settings,
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
  { label: "Settings", href: "/dashboard/admin/profile", icon: Settings },
];

export const CUSTOMER_NAV: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard, exact: true },
  { label: "Appointments", href: "/dashboard/customer/appointments", icon: CalendarDays },
  { label: "Explore Services", href: "/services", icon: Compass },
  { label: "Payments", href: "/dashboard/customer/transactions", icon: CreditCard },
  { label: "My Profile", href: "/dashboard/customer/profile", icon: UserRound },
  { label: "Settings", href: "/dashboard/customer/profile", icon: Settings },
];

interface DashboardShellProps {
  user: DashboardUser;
  role: "customer" | "admin";
  navItems?: DashboardNavItem[];
  children: ReactNode;
}

/**
 * Shared dashboard frame: warm cream sidebar, ivory content area.
 * The sidebar collapses on desktop and becomes an overlay drawer on mobile.
 */
export function DashboardShell({ user, role, navItems, children }: DashboardShellProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const items = navItems ?? (role === "admin" ? ADMIN_NAV : CUSTOMER_NAV);

  function handleToggle() {
    setIsCollapsed((prev) => !prev);
    setMobileDrawerOpen((prev) => !prev);
  }

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
    <div className="flex min-h-svh bg-[#fbf8f3]">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex flex-col border-r border-[#e8dccb] bg-[#f3ede3] transition-all duration-300",
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
      </aside>

      <div className={cn("flex min-w-0 flex-1 flex-col", isCollapsed ? "lg:pl-16" : "lg:pl-56")}>
        <DashboardNavbar
          user={user}
          role={role}
          onToggle={handleToggle}
          onSignOut={handleSignOut}
          isSigningOut={isSigningOut}
        />
        <main className="flex-1 px-4 py-7 sm:px-6 lg:px-10 lg:py-9">{children}</main>
      </div>

      {/* Mobile overlay drawer */}
      <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <SheetContent side="left" className="w-[86%] max-w-xs border-r border-[#e8dccb] bg-[#f3ede3] p-0">
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
    </div>
  );
}
