"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { SalonService } from "@/features/services/types";
import { ServiceCard } from "@/features/services/components/service-card";

interface ServiceCarouselProps {
  services: SalonService[];
}

/**
 * Horizontal service carousel.
 * Buttons scroll by one card at a time; the ends clamp so the layout
 * stays predictable. Touch and trackpad track swipes are enabled by
 * the native scroll container.
 */
export function ServiceCarousel({ services }: ServiceCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

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
  }, [checkEdges]);

  const scrollBy = (amount: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: "smooth" });
    requestAnimationFrame(checkEdges);
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth px-6 md:px-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
        role="region"
        aria-label="Featured services carousel"
      >
        {services.map((service) => (
          <div key={service.id} className="w-[290px] shrink-0 lg:w-[320px]">
            <ServiceCard service={service} />
          </div>
        ))}
      </div>

      {services.length > 0 && (
        <div className="mt-4 flex items-center justify-between gap-3 md:absolute md:-translate-y-1/2 md:left-4 md:top-1/2 md:mt-0 md:w-3/4">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={atStart}
            aria-label="Previous service"
            className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={atEnd}
            aria-label="Next service"
            className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
