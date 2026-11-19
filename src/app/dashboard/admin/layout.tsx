import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Scissors,
  UserRound,
  UsersRound,
} from "lucide-react";
import { getServerSession } from "@/lib/server-session";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

/**
 * The admin guard reads the Better Auth session from cookies on every request,
 * so this segment is allowed to block instead of producing a static shell.
 */
export const instant = false;

const ADMIN_NAV = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard, exact: true },
  { label: "Services", href: "/dashboard/admin/services", icon: Scissors },
  { label: "Appointments", href: "/dashboard/admin/appointments", icon: CalendarDays },
  { label: "Customers", href: "/dashboard/admin/users", icon: UsersRound },
  { label: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
  { label: "My profile", href: "/dashboard/admin/profile", icon: UserRound },
];

/**
 * Server-side admin guard. Customers are redirected to their own dashboard
 * instead of seeing admin data.
 */
export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in?callbackUrl=/dashboard/admin");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard/customer");
  }

  return (
    <DashboardShell
      role="admin"
      navItems={ADMIN_NAV}
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
        role: "admin",
      }}
    >
      {children}
    </DashboardShell>
  );
}
