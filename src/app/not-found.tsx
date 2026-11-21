
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Scissors } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[75svh] items-center justify-center overflow-hidden bg-background px-6 py-20">

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-primary/[0.03]" />

      <div className="pointer-events-none absolute -right-24 top-1/2 size-80 -translate-y-1/2 rounded-full border border-border/30 sm:size-[460px]" />

      <div className="pointer-events-none absolute -right-12 top-1/2 size-64 -translate-y-1/2 rounded-full border border-border/20 sm:size-[360px]" />

      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">

        {/* Brand emblem */}
        <div className="mx-auto mb-8 flex size-14 items-center justify-center rounded-full border border-border bg-card shadow-sm">
          <Scissors className="size-6 text-primary" strokeWidth={1.4} />
        </div>

        {/* 404 */}
        <div className="relative">
          <span className="pointer-events-none select-none font-section text-[9rem] font-bold leading-none tracking-[-0.08em] text-foreground/[0.07] sm:text-[13rem]">
            404
          </span>

          <span className="absolute inset-0 flex items-center justify-center font-section text-5xl font-semibold tracking-[0.08em] text-primary sm:text-7xl">
            404
          </span>
        </div>

        {/* Heading */}
        <div className="mt-5">
          <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-primary">
            Wrong Turn, Great Style Still Awaits
          </p>

          <h1 className="font-section text-3xl font-medium uppercase leading-tight tracking-[0.06em] text-foreground sm:text-5xl">
            Looks Like This Page
            <span className="mt-2 block text-primary">
              Missed Its Appointment.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
            The page you are looking for may have moved,
            been removed, or never existed. Let us get
            you back to where the good stuff happens.
          </p>
        </div>

        {/* Divider */}
        <div className="mx-auto my-9 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-border" />
          <span className="size-1 rotate-45 bg-primary" />
          <span className="h-px w-12 bg-border" />
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-sm border border-primary-foreground/20 bg-primary px-7 py-3 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 sm:w-auto"
          >
            <ArrowLeft className="size-4" />
            Back to Homepage
          </Link>

          <Link
            href="/services"
            className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-sm border border-border bg-card px-7 py-3 text-xs font-bold uppercase tracking-[0.16em] text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary sm:w-auto"
          >
            Explore Services
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-12 text-[0.6rem] font-medium uppercase tracking-[0.25em] text-muted-foreground/70">
          STYLEVIQUE · THE ART OF GROOMING
        </p>
      </div>
    </main>
  );
}
