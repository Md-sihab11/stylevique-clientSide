
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { SalonService } from "@/features/services/types";
import { formatCurrency, formatDuration } from "@/lib/format";
import { SafeImage } from "@/components/common/safe-image";

const DEFAULT_CURRENCY = "USD";

interface ServiceCardProps {
  service: SalonService;
}

/**
 * Premium public-facing service card.
 * Keeps the existing service data, navigation and formatting logic.
 */
export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="group h-full">
      <Link
        href={`/services/${service.id}`}
        className="flex h-full flex-col overflow-hidden rounded-lg border border-border/70 bg-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        {/* Service Image */}
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <SafeImage
            src={service.image}
            alt={service.serviceName}
            className="transition-transform duration-1000 ease-out group-hover:scale-105"
          />

          {/* Image overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/5 opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Decorative corner accent */}
          <div className="absolute bottom-0 left-5 h-[2px] w-12 bg-primary transition-all duration-500 group-hover:w-20" />
        </div>

        {/* Service Information */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          {/* Category — shown on every card, above the service name */}
          <p className="mb-2.5 inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-primary">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            {service.category?.trim() || "Salon service"}
          </p>

          {/* Title and Price */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="max-w-[70%] font-section text-lg font-medium uppercase leading-snug tracking-[0.04em] text-card-foreground transition-colors duration-300 group-hover:text-primary sm:text-[1.25rem]">
              {service.serviceName}
            </h3>

            <div className="shrink-0 text-right">
              <span className="mb-1 block text-[0.55rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Price
              </span>
              <p className="font-sans text-sm font-semibold tracking-wide text-primary sm:text-base">
                {formatCurrency(service.price, DEFAULT_CURRENCY)}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="mt-2.5 line-clamp-2 min-h-[2.75rem] text-[0.82rem] leading-6 text-muted-foreground">
            {service.description}
          </p>

          {/* Bottom Details */}
          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between gap-3 border-t border-border/80 pt-4">
              {/* Duration */}
              <span className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground">
                <Clock3
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
                {formatDuration(service.duration)}
              </span>

              {/* View Details */}
              <span className="inline-flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-card-foreground transition-colors duration-300 group-hover:text-primary">
                View Details
                <span className="flex size-7 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:rotate-45" />
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
