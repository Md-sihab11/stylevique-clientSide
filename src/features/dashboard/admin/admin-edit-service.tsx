"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAdminServiceById } from "@/features/services/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { Skeleton } from "@/components/common/skeleton-loader";
import { ErrorState } from "@/components/common/error-state";
import { PrimaryButton } from "@/components/common/primary-button";
import { AdminServiceForm } from "./admin-service-form";

const OBJECT_ID_PATTERN = /^[a-fA-F0-9]{24}$/;

/**
 * Loads the service before showing the edit form.
 *
 * The backend has no GET /api/admin/services/:id route. getAdminServiceById()
 * therefore pages through GET /api/admin/services and finds the matching id.
 * That works for active and inactive services without changing the backend.
 */
export function AdminEditService() {
  const params = useParams<{ id: string }>();
  const serviceId = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");
  const isValidId = OBJECT_ID_PATTERN.test(serviceId);

  const { data, error, isLoading, reload } = useApiResource(
    () => getAdminServiceById(serviceId),
    serviceId,
  );

  const backLink = (
    <Link
      href="/dashboard/admin/services"
      className="inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-3.5" aria-hidden="true" />
      Back to services
    </Link>
  );

  if (!isValidId) {
    return (
      <div className="space-y-8">
        {backLink}
        <ErrorState
          title="This service link is not valid"
          description="The service ID in the address is not in the expected format."
        />
        <div className="text-center">
          <PrimaryButton href="/dashboard/admin/services" variant="outline" size="sm">
            Return to services
          </PrimaryButton>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        {backLink}
        <Skeleton className="h-14 w-1/2" />
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Skeleton className="h-[34rem] w-full rounded-lg" />
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !data?.service) {
    return (
      <div className="space-y-8">
        {backLink}
        <ErrorState
          title="This service could not be loaded for editing"
          description="Check the backend connection and try again. Inactive services are supported through the admin service list."
          onRetry={reload}
        />
        <div className="text-center">
          <PrimaryButton href="/dashboard/admin/services" variant="outline" size="sm">
            Return to services
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <AdminServiceForm
      mode="edit"
      service={data.service}
      serviceId={data.service.id}
    />
  );
}
