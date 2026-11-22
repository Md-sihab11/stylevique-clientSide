"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth/auth-client";
import { AUTH_NAV_LINKS, MAIN_NAV_LINKS } from "@/constants/salon";
import { Logo } from "@/components/brand/logo";
import { PrimaryButton } from "@/components/common/primary-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Public site navigation.
 *
 * `useSession()` comes from Better Auth, so the navbar updates immediately
 * after sign-in, sign-up or sign-out without a full page reload.
 */
export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = session?.user;
  const dashboardHref =
    user?.role === "admin" ? "/dashboard/admin" : "/dashboard/customer";

  const isActiveLink = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  /** Dark CTA that mirrors the hero buttons (uppercase, tracked, rounded-lg). */
  const ctaButtonClasses =
    "inline-flex h-12 items-center justify-center rounded-lg border border-on-dark-text/25 bg-on-dark px-7 text-[0.72rem] font-semibold tracking-[0.18em] text-on-dark-text uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8d5360] hover:bg-[#8d5360] hover:text-white hover:shadow-[0_10px_24px_-10px_rgba(141,83,96,0.55)] dark:hover:border-[#c9a878] dark:hover:bg-[#c9a878] dark:hover:text-[#1a1917] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

  async function handleSignOut() {
    setMobileOpen(false);

    const result = await authClient.signOut();

    if (result.error) {
      toast.error(result.error.message ?? "Could not sign out. Please try again.");
      return;
    }

    toast.success("You have been signed out.");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 bg-background">
      <div className="page-width relative flex h-20 items-center justify-between gap-6 lg:h-24">
        <Logo />

        {/* Desktop Main Navigation — optically centred in the bar */}
        <nav
          aria-label="Main navigation"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex xl:gap-10"
        >
          {MAIN_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                isActiveLink(link.href)
                  ? "text-foreground"
                  : "text-foreground/60 hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions & Account Menu */}
        <div className="hidden items-center gap-5 lg:flex">
          <ThemeToggle />
          {isPending ? (
            <div
              className="size-9 animate-pulse rounded-full bg-secondary"
              aria-label="Loading account"
            />
          ) : user ? (
            <>
              <Link href="/services" className={ctaButtonClasses}>
                Book Appointment
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-full p-1 pr-2 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="size-9">
                    <AvatarImage src={user.image ?? undefined} alt={user.name} />
                    <AvatarFallback className="bg-secondary text-xs text-primary">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-28 truncate text-xs font-medium text-foreground">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  <span className="sr-only">Open account menu</span>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="truncate text-sm font-medium leading-none">{user.name}</p>
                        <p className="truncate text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => router.push(dashboardHref)}
                      className="cursor-pointer"
                    >
                      <LayoutDashboard className="mr-2 size-4" aria-hidden="true" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push(`${dashboardHref}/profile`)}
                      className="cursor-pointer"
                    >
                      <UserRound className="mr-2 size-4" aria-hidden="true" />
                      <span>My profile</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <LogOut className="mr-2 size-4" aria-hidden="true" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {AUTH_NAV_LINKS.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    index === AUTH_NAV_LINKS.length - 1
                      ? ctaButtonClasses
                      : "text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                  }
                >
                  {link.label}
                </Link>
              ))}
            </>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted lg:hidden"
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-full max-w-sm overflow-y-auto bg-background p-0">
          <SheetHeader className="border-b border-border p-6">
            <SheetTitle className="sr-only">Stylevique navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Main links and account actions for the Stylevique website.
            </SheetDescription>
            <Logo />
          </SheetHeader>

          <div className="flex flex-col gap-8 p-6">
            <nav aria-label="Mobile navigation" className="flex flex-col">
              {MAIN_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "border-b border-border py-4 font-heading text-2xl transition-colors hover:text-primary",
                    isActiveLink(link.href) ? "text-primary" : "text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {user ? (
              <div className="rounded-lg bg-card p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={user.image ?? undefined} alt={user.name} />
                    <AvatarFallback className="bg-secondary text-xs text-primary">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-1">
                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <LayoutDashboard className="size-4" aria-hidden="true" />
                    Dashboard
                  </Link>
                  <Link
                    href={`${dashboardHref}/profile`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <UserRound className="size-4" aria-hidden="true" />
                    My profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="size-4" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {AUTH_NAV_LINKS.map((link, index) => (
                  <PrimaryButton
                    key={link.href}
                    href={link.href}
                    variant={index === AUTH_NAV_LINKS.length - 1 ? "primary" : "outline"}
                    size="md"
                    className="w-full"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </PrimaryButton>
                ))}
              </div>
            )}

            {/* Theme switch moved here from the mobile header to keep the bar clean. */}
            <div className="flex items-center justify-between border-t border-border pt-6">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">Appearance</span>
                <span className="text-xs text-muted-foreground">Toggle light and dark mode</span>
              </div>
              <ThemeToggle className="size-10 border border-border" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}