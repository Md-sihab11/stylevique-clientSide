import type { ReactNode } from "react";
import { Suspense } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { NavbarFallback } from "@/components/layout/navbar-fallback";

/**
 * Layout for all public pages (home, services, about, contact).
 * Keeping it in a route group lets the dashboard and auth screens use their
 * own layouts without duplicating the public navbar.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Suspense fallback={<NavbarFallback />}>
        <Navbar />
      </Suspense>
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
