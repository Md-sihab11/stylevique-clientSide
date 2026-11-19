import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: {
    default: "Payment",
    template: "%s · Stylevique",
  },
  robots: { index: false, follow: false },
};

/**
 * Focused layout for the Stripe return screens.
 * No public navbar or footer, so customers can read the verification result
 * without distractions.
 */
export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="border-b border-border">
        <div className="page-width flex h-20 items-center justify-between gap-4">
          <Logo />
          <Link
            href="/"
            className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to site
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border">
        <p className="page-width py-6 text-center text-[0.68rem] text-muted-foreground">
          Stylevique · Salon & Beauty Studio · Payments are verified by the salon
          backend.
        </p>
      </footer>
    </div>
  );
}
