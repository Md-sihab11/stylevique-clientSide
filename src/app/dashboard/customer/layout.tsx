import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/server-session";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

/**
 * The customer guard reads the Better Auth session from cookies on every
 * request, so this segment is allowed to block instead of producing a static
 * shell.
 */
export const instant = false;

/**
 * Server-side role guard.
 * A customer can never render the admin dashboard by typing its URL.
 */
export default async function CustomerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in?callbackUrl=/dashboard/customer");
  }

  if (session.user.role === "admin") {
    redirect("/dashboard/admin");
  }

  return (
    <DashboardShell
      role="customer"
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
        role: "customer",
      }}
    >
      {children}
    </DashboardShell>
  );
}
