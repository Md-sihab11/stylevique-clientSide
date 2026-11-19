import Link from "next/link";
import { Menu } from "lucide-react";
import { MAIN_NAV_LINKS } from "@/constants/salon";
import { Logo } from "@/components/brand/logo";
import { PrimaryButton } from "@/components/common/primary-button";

/**
 * Static shell for the public navbar.
 *
 * The real navbar reads `usePathname()` to highlight the active page, which
 * must stream inside a Suspense boundary during prerendering. This fallback
 * keeps the header layout stable until that boundary resolves.
 */
export function NavbarFallback() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="page-width flex h-20 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
          {MAIN_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-foreground/75 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/sign-in"
            className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-foreground/75 transition-colors hover:text-primary"
          >
            Sign in
          </Link>
          <PrimaryButton href="/services" size="sm">
            Book now
          </PrimaryButton>
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
