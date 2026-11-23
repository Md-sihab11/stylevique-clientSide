
import { Scissors, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <main
      className="relative flex min-h-[75svh] items-center justify-center overflow-hidden bg-background px-6 py-16"
      role="status"
      aria-live="polite"
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-primary/[0.04]" />

      {/* Decorative vertical lines */}
      <div className="pointer-events-none absolute left-[8%] top-0 h-full w-px bg-border/30" />
      <div className="pointer-events-none absolute right-[8%] top-0 h-full w-px bg-border/30" />

      {/* Main content */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">

        {/* Brand emblem */}
        <div className="relative mb-10 flex h-48 w-full items-center justify-center">

          {/* Oversized background letter */}
          <span className="pointer-events-none absolute select-none font-section text-[180px] font-bold leading-none text-primary/[0.045]">
            S
          </span>

          {/* Architectural frame */}
          <div className="absolute size-32 rotate-45 border border-primary/20" />
          <div className="absolute size-24 border border-border/60" />

          {/* Corner accents */}
          <span className="absolute left-[calc(50%-75px)] top-[calc(50%-75px)] size-2 border-l border-t border-primary" />
          <span className="absolute right-[calc(50%-75px)] top-[calc(50%-75px)] size-2 border-r border-t border-primary" />
          <span className="absolute bottom-[calc(50%-75px)] left-[calc(50%-75px)] size-2 border-b border-l border-primary" />
          <span className="absolute bottom-[calc(50%-75px)] right-[calc(50%-75px)] size-2 border-b border-r border-primary" />

          {/* Icon container */}
          <div className="relative flex size-[76px] items-center justify-center border border-border/70 bg-card shadow-2xl shadow-primary/10">
            <Scissors
              className="size-8 text-primary animate-pulse"
              strokeWidth={1.3}
            />
          </div>

          {/* Floating accent */}
          <Sparkles className="absolute right-[calc(50%-65px)] top-[calc(50%-55px)] size-4 text-primary animate-pulse" />

          {/* Bottom indicator */}
          <span className="absolute bottom-2 text-[9px] font-medium tracking-[0.35em] text-muted-foreground">
            EST. FOR EXCELLENCE
          </span>
        </div>

        {/* Brand name */}
        <div className="space-y-3">
          <h1 className="font-section text-3xl font-semibold tracking-[0.3em] text-foreground">
            STYLEVIQUE
          </h1>

          <p className="text-[9px] font-medium uppercase tracking-[0.4em] text-muted-foreground">
            The Modern Grooming Studio
          </p>
        </div>

        {/* Separator */}
        <div className="my-8 flex w-32 items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="size-1 rotate-45 bg-primary" />
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* Loading text */}
        <div className="space-y-3">
          <h2 className="font-section text-xl font-medium tracking-wide text-foreground">
            A Refined Experience Awaits
          </h2>

          <p className="mx-auto max-w-[280px] text-sm leading-6 text-muted-foreground">
            Preparing every detail for your next grooming experience.
          </p>
        </div>

        {/* Animated loading bars */}
        <div className="mt-10 flex items-center gap-1.5">
          {[0, 1, 2, 3, 4, 5, 6].map((item) => (
            <span
              key={item}
              className="h-5 w-[3px] rounded-full bg-primary animate-pulse"
              style={{
                animationDelay: `${item * 120}ms`,
                opacity: 0.35 + item * 0.09,
              }}
            />
          ))}
        </div>

        {/* Loading label */}
        <p className="mt-4 text-[9px] font-medium uppercase tracking-[0.35em] text-muted-foreground">
          Preparing Your Experience
        </p>

        {/* Footer */}
        <div className="mt-16 flex items-center gap-3 text-[9px] tracking-[0.25em] text-muted-foreground/60">
          <span>PRECISION</span>
          <span className="size-1 rounded-full bg-primary/60" />
          <span>CRAFTSMANSHIP</span>
          <span className="size-1 rounded-full bg-primary/60" />
          <span>STYLE</span>
        </div>
      </div>

      <span className="sr-only">Loading, please wait.</span>
    </main>
  );
}
