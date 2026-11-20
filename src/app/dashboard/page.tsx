import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/server-session";

/**
 * This entry point reads the session cookie and redirects by role, so it must
 * render at request time rather than as a static shell.
 */
export const instant = false;

/** Sends signed-in users to the dashboard that matches their role. */
export default async function DashboardIndexPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in?callbackUrl=/dashboard");
  }

  if (session.user.role === "admin") {
    redirect("/dashboard/admin");
  }

  redirect("/dashboard/customer");
}
