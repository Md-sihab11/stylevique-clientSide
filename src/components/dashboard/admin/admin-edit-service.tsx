"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getServiceById } from "@/lib/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { PageHeader } from "@/components/common/page-header";
import { Skeleton } from "@/components/common/skeleton-loader";
import { ErrorState } from "@/components/common/error-state";
import { PendingIntegration } from "@/components/common/pending-integration";
import { PrimaryButton } from "@/components/common/primary-button";
import { AdminServiceForm } from "./admin-service-form";

const OBJECT_ID_PATTERN = /^[a-fA-F0-9]{24}$/;

/**
 * Loads the service before showing the edit form.
 *
 * Important backend limitation: there is no GET /api/admin/services/:id route.
 * The only service-detail endpoint returns ACTIVE services. That means an
 * inactive service cannot be loaded here until it is activated from the
 * services list (or the backend adds an admin detail endpoint). This is
 * documented in API_INTEGRATION.md.
 */
export function AdminEditService() {
  const params = useParams<{ id: string }>();
  const serviceId = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");
  const isValidId = OBJECT_ID_PATTERN.test(serviceId);

  const { data, error, isLoading, isPendingIntegration, reload } = useApiResource(
    () => getServiceById(serviceId),
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

  if (isPendingIntegration) {
    return (
      <div className="space-y-8">
        {backLink}
        <PageHeader
          eyebrow="Salon administration"
          title="Edit service"
          description="The edit form loads the current service before showing the fields."
        />
        <PendingIntegration
          apiName={`getServiceById("${serviceId}")`}
          filePath="src/lib/api/services.ts"
        />
        <div className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">Backend note:</strong> the supplied
          backend has no admin service-detail endpoint. The public{" "}
          <code>GET /api/services/:id</code> route only returns active services.
          Inactive services must be activated from the services list before they can
          be edited, unless you add an admin detail endpoint to the backend.
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
          description="The public service endpoint only returns active services. If this service is inactive, activate it from the services list and try again. Otherwise check your getServiceById() request."
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
