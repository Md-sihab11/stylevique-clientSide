import type { SalonService } from "@/features/services/types";
import { ServiceCard } from "./service-card";

interface ServiceGridProps {
  services: SalonService[];
  className?: string;
}

/** Responsive service card grid shared by the homepage and browse page. */
export function ServiceGrid({ services, className }: ServiceGridProps) {
  return (
    <div
      className={`grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 ${className ?? ""}`}
    >
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
