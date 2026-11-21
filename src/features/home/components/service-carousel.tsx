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
 * One card per view on phones, two on tablets and three on desktop — so the
 * next button reveals the remaining services a page at a time.
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

  const scrollByPage = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
    requestAnimationFrame(checkEdges);
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
        role="region"
        aria-label="Featured services carousel"
      >
        {services.map((service) => (
          <div
            key={service.id}
            className="w-full shrink-0 snap-start px-2 sm:w-1/2 sm:px-3 lg:w-1/3"
          >
            <ServiceCard service={service} />
          </div>
        ))}
      </div>

      {services.length > 0 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={atStart}
            aria-label="Previous services"
            className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={atEnd}
            aria-label="Next services"
            className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
