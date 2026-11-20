import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { SalonService } from "@/types";
import { formatCurrency, formatDuration } from "@/lib/format";
import { SafeImage } from "@/components/common/safe-image";

const DEFAULT_CURRENCY = "USD";

interface ServiceCardProps {
  service: SalonService;
}

/**
 * Public-facing service card. The whole card is a link, so it is easy to use
 * on mobile while still giving a clear "View details" affordance.
 */
export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="group">
      <Link
        href={`/services/${service.id}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-secondary">
          <SafeImage
            src={service.image}
            alt={service.serviceName}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-foreground backdrop-blur-sm">
            {service.category}
          </span>
        </div>

        <div className="pt-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-section text-[1.45rem] leading-snug font-medium tracking-[0.02em] text-foreground uppercase transition-colors group-hover:text-primary">
              {service.serviceName}
            </h3>
            <p className="shrink-0 pt-1 font-sans text-sm font-semibold text-primary">
              {formatCurrency(service.price, DEFAULT_CURRENCY)}
            </p>
          </div>

          <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {service.description}
          </p>

          <div className="mt-4 flex items-center justify-between gap-4 border-t border-border pt-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock3 className="size-3.5" aria-hidden="true" />
              {formatDuration(service.duration)}
            </span>
            <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-foreground transition-colors group-hover:text-primary">
              View details
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
