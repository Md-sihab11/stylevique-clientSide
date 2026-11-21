import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/server-session";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

/**
 * The admin guard reads the Better Auth session from cookies on every request,
 * so this segment is allowed to block instead of producing a static shell.
 */
export const instant = false;

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

  // Blocked admins cannot manage the salon. Keep them out of the dashboard.
  if (session.user.isBlocked) {
    redirect("/blocked");
  }

  return (
    <DashboardShell
      role="admin"
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
