"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { getReviewSummary, getReviews } from "@/features/reviews/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { ratingLabel } from "@/features/reviews/constants";
import { SafeImage } from "@/components/common/safe-image";
import { Skeleton } from "@/components/common/skeleton-loader";
import { ErrorState } from "@/components/common/error-state";
import { SectionHeading } from "@/components/common/section-heading";
import { cn } from "@/lib/utils";

interface ReviewCarouselProps {
  /** Filter the carousel to one service. */
  serviceId?: string;
  /** Smaller padding for embedding on a detail page. */
  compact?: boolean;
  /** Keep the arrow controls and also scroll the row horizontally on its own. */
  marquee?: boolean;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "size-3.5",
            index < rating
              ? "fill-accent-gold text-accent-gold"
              : "fill-transparent text-line",
          )}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

/**
 * Public review carousel. Only approved reviews are returned by the backend;
 * this component never decides which reviews are visible.
 */
export function ReviewCarousel({ serviceId, compact = false, marquee = false }: ReviewCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const pausedRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, error, isLoading, reload } = useApiResource(
    () => getReviews({ serviceId, page: 1, limit: 12 }),
    `reviews-${serviceId ?? "all"}`,
  );
  const { data: summary } = useApiResource(
    () => getReviewSummary(serviceId),
    `review-summary-${serviceId ?? "all"}`,
  );

  const reviews = data?.reviews ?? [];
  const canMarquee = marquee && !isLoading && !error && reviews.length > 0;

  const checkEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkEdges, { passive: true });
    checkEdges();
    return () => el.removeEventListener("scroll", checkEdges);
  }, [checkEdges, data]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;

    if (canMarquee) {
      // Let the arrow's smooth scroll finish before the marquee takes over.
      pausedRef.current = true;
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        pausedRef.current = false;
      }, 600);
    }

    el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
    requestAnimationFrame(checkEdges);
  };

  // Honour the visitor's motion preference. When auto-scroll is off, the arrow
  // controls are still there for manual browsing.
  useEffect(() => {
    if (!canMarquee) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = query.matches;
    const handleChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
    };
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, [canMarquee]);

  // Continuous horizontal marquee. Cards are rendered twice, so once the
  // first copy has passed we jump back by exactly one copy's width — the seam
  // is invisible. Clicking an arrow simply changes scrollLeft and the loop
  // carries on from the new position.
  useEffect(() => {
    if (!canMarquee) return;

    let frame = 0;
    let previous = performance.now();
    const speed = 0.06; // pixels per millisecond (~60px/s)

    const step = (now: number) => {
      const el = scrollRef.current;
      const elapsed = Math.min(now - previous, 64);
      previous = now;

      if (el && !pausedRef.current && !reducedMotionRef.current) {
        const copyWidth = el.scrollWidth / 2;
        if (copyWidth > 0) {
          let next = el.scrollLeft + speed * elapsed;
          if (next >= copyWidth) next -= copyWidth;
          el.scrollLeft = next;
        }
      }

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [canMarquee]);

  return (
    <section className={compact ? "py-12" : "section-space bg-secondary/40"}>
      <div className="page-width">
        <SectionHeading
          eyebrow="Kind words"
          title="What our guests are saying."
          description="Notes from visits the salon has completed — shared only after our team approves them."
        />

        {summary && summary.totalReviews > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="font-heading text-4xl text-primary">
              {summary.averageRating.toFixed(1)}
            </span>
            <Stars rating={Math.round(summary.averageRating)} />
            <span className="text-sm text-muted-foreground">
              from {summary.totalReviews} review{summary.totalReviews === 1 ? "" : "s"}
            </span>
          </div>
        )}

        <div className="mt-10">
          {isLoading && (
            <div className="no-scrollbar flex overflow-x-auto">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 w-full shrink-0 px-2 sm:w-1/2 sm:px-3 lg:w-1/3"
                >
                  <Skeleton className="h-full w-full rounded-lg" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && Boolean(error) && (
            <ErrorState
              title="Reviews could not load"
              description="Check the API connection and try again."
              onRetry={reload}
            />
          )}

          {!isLoading && !error && reviews.length === 0 && (
            <p className="rounded-lg border border-border bg-card/70 p-8 text-center text-sm text-muted-foreground">
              No approved reviews yet. Check back after the next visit.
            </p>
          )}

          {!isLoading && !error && reviews.length > 0 && (
            <>
              <div
                ref={scrollRef}
                className={cn(
                  "no-scrollbar flex overflow-x-auto",
                  canMarquee ? "marquee-mask" : "snap-x snap-mandatory scroll-smooth",
                )}
                role="region"
                aria-label="Customer reviews carousel"
                tabIndex={canMarquee ? 0 : undefined}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") pausedRef.current = true;
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === "mouse") pausedRef.current = false;
                }}
                onPointerDown={() => {
                  pausedRef.current = true;
                }}
                onPointerUp={(event) => {
                  if (event.pointerType !== "mouse") pausedRef.current = false;
                }}
                onPointerCancel={() => {
                  pausedRef.current = false;
                }}
                onFocus={() => {
                  pausedRef.current = true;
                }}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    pausedRef.current = false;
                  }
                }}
              >
                {(canMarquee ? [...reviews, ...reviews] : reviews).map((review, index) => (
                  <div
                    key={`${review.id}-${index}`}
                    aria-hidden={canMarquee && index >= reviews.length ? true : undefined}
                    className="w-full shrink-0 snap-start px-2 sm:w-1/2 sm:px-3 lg:w-1/3"
                  >
                    <article className="flex h-full flex-col rounded-lg border border-border bg-card/80 p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary">
                            <Quote className="size-4" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {review.customerName || "Stylevique guest"}
                            </p>
                            <p className="truncate text-[0.68rem] text-muted-foreground">
                              {review.serviceName}
                            </p>
                          </div>
                        </div>
                        {review.serviceImage && (
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-secondary">
                            <SafeImage src={review.serviceImage} alt={review.serviceName} />
                          </div>
                        )}
                      </div>

                      <div className="mt-5 flex items-center gap-2">
                        <Stars rating={review.rating} />
                        <span className="text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
                          {ratingLabel(review.rating)}
                        </span>
                      </div>

                      {review.highlights.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {review.highlights.map((highlight) => (
                            <span
                              key={highlight}
                              className="rounded-full bg-secondary px-2.5 py-1 text-[0.62rem] text-foreground/80"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="mt-4 flex-1 text-sm leading-6 text-foreground/80">
                        {review.note || "A quiet note of thanks."}
                      </p>

                      <p className="mt-5 border-t border-border pt-4 text-[0.62rem] uppercase tracking-[0.12em] text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </article>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => scrollByPage(-1)}
                  disabled={atStart}
                  aria-label="Previous reviews"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByPage(1)}
                  disabled={atEnd}
                  aria-label="Next reviews"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
