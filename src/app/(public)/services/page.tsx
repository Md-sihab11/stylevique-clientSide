import type { Metadata } from "next";
import { Suspense } from "react";
import { ServiceGridSkeleton } from "@/components/common/skeleton-loader";
import { ServicesBrowse } from "@/features/services/components/services-browse";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Browse Stylevique salon services for hair, skin, makeup, nails and spa. Search by name, filter by category and compare prices.",
};

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="page-width py-16">
          <ServiceGridSkeleton count={6} />
        </div>
      }
    >
      <ServicesBrowse />
    </Suspense>
  );
}
