"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DashboardSidebar,
  type DashboardNavItem,
  type DashboardUser,
} from "./dashboard-sidebar";
import { DashboardNavbar } from "./dashboard-navbar";

interface DashboardShellProps {
  user: DashboardUser;
  role: "customer" | "admin";
  navItems: DashboardNavItem[];
  children: ReactNode;
}

/**
 * Shared dashboard frame: fixed sidebar on desktop, drawer on mobile.
 * The role is decided on the server by the role layout and passed in here.
 */
export function DashboardShell({ user, navItems, children }: DashboardShellProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

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
    <div className="flex min-h-svh bg-background">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-border bg-card lg:block">
        <DashboardSidebar
          user={user}
          items={navItems}
          onSignOut={handleSignOut}
          isSigningOut={isSigningOut}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <DashboardNavbar user={user} onOpenMenu={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-7 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[86%] max-w-xs bg-card p-0">
          <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Navigate between the dashboard sections for your account.
          </SheetDescription>
          <DashboardSidebar
            user={user}
            items={navItems}
            onSignOut={handleSignOut}
            onNavigate={() => setMobileOpen(false)}
            isSigningOut={isSigningOut}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
