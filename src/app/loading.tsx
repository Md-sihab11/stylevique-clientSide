
import { Scissors } from "lucide-react";

export default function Loading() {
  return (
    <main
      className="relative flex min-h-[75svh] items-center justify-center overflow-hidden bg-background px-6"
      role="status"
      aria-live="polite"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-primary/[0.03]" />

      {/* Decorative lines */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border/30" />
      <div className="pointer-events-none absolute left-0 top-1/2 h-px w-full bg-border/30" />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center">
        {/* Animated emblem */}
        <div className="relative mb-9 flex size-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-border/70" />

          <div className="absolute inset-1 rounded-full border border-transparent border-t-primary border-r-primary/30 animate-spin" />

          <div className="absolute inset-3 rounded-full border border-border/50" />

          <div className="flex size-14 items-center justify-center rounded-full bg-card shadow-xl">
            <Scissors className="size-6 text-primary" strokeWidth={1.4} />
          </div>

          <span className="absolute right-1 top-2 size-2 rounded-full bg-primary shadow-[0_0_12px_var(--primary)] animate-pulse" />
        </div>

        {/* Brand */}
        <p className="font-section text-2xl font-semibold tracking-[0.22em] text-foreground">
          STYLEVIQUE
        </p>

        <div className="my-5 h-px w-12 bg-primary/70" />

        {/* Loading message */}
        <h2 className="font-section text-lg uppercase tracking-[0.12em] text-foreground">
          Preparing Your Experience
        </h2>

        <p className="mt-3 max-w-[260px] text-sm leading-6 text-muted-foreground">
          Something exceptional is just around the corner.
        </p>

        {/* Loading indicator */}
        <div className="mt-9 flex items-center gap-2">
          {[0, 1, 2].map((item) => (
            <span
              key={item}
              className="size-1.5 rounded-full bg-primary animate-pulse"
              style={{
                animationDelay: `${item * 180}ms`,
              }}
            />
          ))}
        </div>

        <span className="sr-only">Loading, please wait.</span>
      </div>
    </main>
  );
}
