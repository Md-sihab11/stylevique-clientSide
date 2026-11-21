import Link from "next/link";
import { Menu } from "lucide-react";
import { MAIN_NAV_LINKS } from "@/constants/salon";
import { Logo } from "@/components/brand/logo";

/**
 * Static shell for the public navbar.
 *
 * The real navbar reads `usePathname()` to highlight the active page, which
 * must stream inside a Suspense boundary during prerendering. This fallback
 * keeps the header layout stable until that boundary resolves.
 */
export function NavbarFallback() {
  const bookButtonClasses =
    "inline-flex h-12 items-center justify-center rounded-lg border border-on-dark-text/25 bg-on-dark px-7 text-[0.72rem] font-semibold tracking-[0.18em] text-on-dark-text uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8d5360] hover:bg-[#8d5360] hover:text-white hover:shadow-[0_10px_24px_-10px_rgba(141,83,96,0.55)] dark:hover:border-[#c9a878] dark:hover:bg-[#c9a878] dark:hover:text-[#1a1917] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <header className="sticky top-0 z-40 bg-background">
      <div className="page-width relative flex h-20 items-center justify-between gap-6 lg:h-24">
        <Logo />

        <nav
          aria-label="Main navigation"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex xl:gap-10"
        >
          {MAIN_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            Sign In
          </Link>
          <Link href="/services" className={bookButtonClasses}>
            Book Appointment
          </Link>
        </div>

        <span
          className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
          aria-hidden="true"
        >
          <Menu className="size-5" />
        </span>
      </div>
    </header>
  );
}
