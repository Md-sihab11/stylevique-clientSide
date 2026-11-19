"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type { SalonService, ServiceSort, ServiceStatus } from "@/types";
import {
  deleteService,
  getAdminServices,
  getServiceCategories,
  isApiNotImplementedError,
  updateServiceStatus,
} from "@/lib/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { FEATURED_CATEGORIES, SORT_OPTIONS } from "@/constants/salon";
import { formatCurrency, formatDate, formatDuration } from "@/lib/format";
import { PageHeader } from "@/components/common/page-header";
import { PrimaryButton } from "@/components/common/primary-button";
import { SafeImage } from "@/components/common/safe-image";
import { DataTable, type DataTableColumn } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { PaginationControls } from "@/components/common/pagination-controls";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { PendingIntegration } from "@/components/common/pending-integration";
import { TableSkeleton, Skeleton } from "@/components/common/skeleton-loader";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 10;

type PendingAction = {
  type: "status" | "delete";
  service: SalonService;
};

/**
 * Admin service management.
 * Filters and pagination mirror GET /api/admin/services. Status changes and
 * deletion use their dedicated endpoints. Until those API functions are
 * written, the dialogs explain that the integration is pending.
 */
export function AdminServices() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ServiceStatus | "">("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<ServiceSort>("newest");
  const [page, setPage] = useState(1);

  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [isActing, setIsActing] = useState(false);

  const { data, error, isLoading, isPendingIntegration, reload } = useApiResource(
    () =>
      getAdminServices({
        search: search || undefined,
        status: status || undefined,
        category: category || undefined,
        sort,
        page,
        limit: PAGE_SIZE,
      }),
    `admin-services|${search}|${status}|${category}|${sort}|${page}`,
  );

  const { data: categoryData } = useApiResource(
    () => getServiceCategories(),
    "admin-service-categories",
  );

  const categoryNames = Array.from(
    new Set([
      ...FEATURED_CATEGORIES.map((item) => item.name),
      ...(categoryData?.categories ?? []),
      ...(data?.services.map((service) => service.category) ?? []),
    ]),
  ).sort((a, b) => a.localeCompare(b));

  const hasFilters = Boolean(
    search || status || category || sort !== "newest",
  );

  function resetFilters() {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setCategory("");
    setSort("newest");
    setPage(1);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  }

  async function handleConfirmAction() {
    if (!pendingAction) return;

    const { type, service } = pendingAction;
    setIsActing(true);

    try {
      if (type === "delete") {
        await deleteService(service.id);
        toast.success("Service deleted", {
          description: `${service.serviceName} is no longer on the menu.`,
        });
        setPendingAction(null);
        setPage(1);
        reload();
      } else {
        const nextStatus: ServiceStatus =
          service.status === "active" ? "inactive" : "active";

        await updateServiceStatus(service.id, nextStatus);
        toast.success(
          nextStatus === "active" ? "Service activated" : "Service deactivated",
          {
            description:
              nextStatus === "active"
                ? `${service.serviceName} is visible on the public menu again.`
                : `${service.serviceName} is hidden from new bookings.`,
          },
        );
        setPendingAction(null);
        reload();
      }
    } catch (actionError) {
      if (isApiNotImplementedError(actionError)) {
        toast.info("API integration pending", {
          description:
            type === "delete"
              ? "Implement deleteService() in src/lib/api/services.ts to remove this service."
              : "Implement updateServiceStatus() in src/lib/api/services.ts to change availability.",
        });
        setPendingAction(null);
      } else {
        toast.error(
          type === "delete"
            ? "Could not delete the service"
            : "Could not update the service",
          {
            description:
              actionError instanceof Error
                ? actionError.message
                : "Please check your connection and try again.",
          },
        );
      }
    } finally {
      setIsActing(false);
    }
  }

  const columns: DataTableColumn<SalonService>[] = [
    {
      key: "service",
      header: "Service",
      cell: (service) => (
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-sm bg-secondary">
            <SafeImage src={service.image} alt={service.serviceName} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {service.serviceName}
            </p>
            <p className="mt-0.5 truncate text-[0.68rem] uppercase tracking-[0.1em] text-muted-foreground">
              {service.category}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      cell: (service) => (
        <span className="text-sm font-medium text-foreground">
          {formatCurrency(service.price)}
        </span>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      cell: (service) => (
        <span className="text-sm text-muted-foreground">
          {formatDuration(service.duration)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (service) => <StatusBadge status={service.status} />,
    },
    {
      key: "updated",
      header: "Updated",
      cell: (service) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(service.updatedAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-[1%] whitespace-nowrap",
      cell: (service) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            render={<Link href={`/dashboard/admin/services/${service.id}/edit`} />}
          >
            <Pencil className="size-3.5" aria-hidden="true" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setPendingAction({ type: "status", service })}
            aria-label={
              service.status === "active"
                ? `Deactivate ${service.serviceName}`
                : `Activate ${service.serviceName}`
            }
            title={service.status === "active" ? "Deactivate" : "Activate"}
          >
            {service.status === "active" ? (
              <EyeOff className="size-3.5" aria-hidden="true" />
            ) : (
              <Eye className="size-3.5" aria-hidden="true" />
            )}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full"
            onClick={() => setPendingAction({ type: "delete", service })}
            aria-label={`Delete ${service.serviceName}`}
            title="Delete service"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      ),
    },
  ];

  const isStatusAction = pendingAction?.type === "status";
  const willActivate = pendingAction?.service.status === "inactive";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Salon administration"
        title="Services"
        description="Create treatments, adjust prices and control which services appear on the public menu."
        action={
          <PrimaryButton href="/dashboard/admin/services/add" size="sm">
            <Plus className="size-3.5" aria-hidden="true" />
            Add service
          </PrimaryButton>
        }
      />

      <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
        <form
          onSubmit={handleSearchSubmit}
          className="grid gap-3 lg:grid-cols-[1fr_170px_190px_190px_auto] lg:items-end"
        >
          <div className="space-y-2">
            <label
              htmlFor="admin-service-search"
              className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              Search services
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="admin-service-search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by service name"
                maxLength={100}
                className="h-10 rounded-md bg-background pl-9 pr-20 text-sm"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-primary px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="admin-service-status"
              className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              Status
            </label>
            <select
              id="admin-service-status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as ServiceStatus | "");
                setPage(1);
              }}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="admin-service-category"
              className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              Category
            </label>
            <select
              id="admin-service-category"
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              <option value="">All categories</option>
              {categoryNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="admin-service-sort"
              className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              Sort by
            </label>
            <select
              id="admin-service-sort"
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as ServiceSort);
                setPage(1);
              }}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            disabled={!hasFilters}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-border px-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X className="size-3.5" aria-hidden="true" />
            Clear
          </button>
        </form>

        {hasFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <SlidersHorizontal
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              Active filters
            </span>
            {search && (
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground">
                “{search}”
              </span>
            )}
            {status && (
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs capitalize text-foreground">
                {status}
              </span>
            )}
            {category && (
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground">
                {category}
              </span>
            )}
            {sort !== "newest" && (
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground">
                {SORT_OPTIONS.find((option) => option.value === sort)?.label}
              </span>
            )}
          </div>
        )}
      </div>

      {isLoading && (
        <>
          <div className="hidden md:block">
            <TableSkeleton rows={6} />
          </div>
          <div className="space-y-4 md:hidden">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-44 w-full rounded-lg" />
            ))}
          </div>
        </>
      )}

      {!isLoading && isPendingIntegration && (
        <PendingIntegration
          apiName="getAdminServices()"
          filePath="src/lib/api/services.ts"
          compact
        />
      )}

      {!isLoading && Boolean(error) && (
        <ErrorState
          title="The service list could not load"
          description="The filters and management actions are ready. Implement getAdminServices() and try again."
          onRetry={reload}
        />
      )}

      {!isLoading && !isPendingIntegration && !error && data?.services.length === 0 && (
        <EmptyState
          icon={Search}
          title={hasFilters ? "No services match these filters" : "No services yet"}
          description={
            hasFilters
              ? "Try another search term or clear the filters to see the full menu."
              : "Add the salon's first service and it will appear on the public menu."
          }
          action={
            hasFilters ? (
              <PrimaryButton size="sm" variant="outline" onClick={resetFilters}>
                Clear filters
              </PrimaryButton>
            ) : (
              <PrimaryButton href="/dashboard/admin/services/add" size="sm">
                <Plus className="size-3.5" aria-hidden="true" />
                Add the first service
              </PrimaryButton>
            )
          }
        />
      )}

      {!isLoading && !isPendingIntegration && !error && data && data.services.length > 0 && (
        <>
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              rows={data.services}
              getRowKey={(service) => service.id}
              caption="Salon services"
            />
          </div>

          <div className="space-y-4 md:hidden">
            {data.services.map((service) => (
              <article
                key={service.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-sm bg-secondary">
                      <SafeImage src={service.image} alt={service.serviceName} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {service.serviceName}
                      </p>
                      <p className="mt-0.5 truncate text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground">
                        {service.category}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatCurrency(service.price)} · {formatDuration(service.duration)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={service.status} />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    render={<Link href={`/dashboard/admin/services/${service.id}/edit`} />}
                  >
                    <Pencil className="size-3.5" aria-hidden="true" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setPendingAction({ type: "status", service })}
                  >
                    {service.status === "active" ? (
                      <EyeOff className="size-3.5" aria-hidden="true" />
                    ) : (
                      <Eye className="size-3.5" aria-hidden="true" />
                    )}
                    {service.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setPendingAction({ type: "delete", service })}
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>

          <PaginationControls
            pagination={data.pagination}
            onPageChange={setPage}
            className="border-t border-border pt-6"
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingAction)}
        onOpenChange={(open) => {
          if (!open) setPendingAction(null);
        }}
        title={
          isStatusAction
            ? willActivate
              ? "Activate this service?"
              : "Deactivate this service?"
            : "Delete this service permanently?"
        }
        description={
          isStatusAction ? (
            willActivate ? (
              <>
                <strong className="text-foreground">
                  {pendingAction?.service.serviceName}
                </strong>{" "}
                will be visible on the public menu and available for new bookings.
              </>
            ) : (
              <>
                <strong className="text-foreground">
                  {pendingAction?.service.serviceName}
                </strong>{" "}
                will be hidden from the public menu and cannot receive new
                bookings. Existing appointments keep their service snapshot.
              </>
            )
          ) : (
            <>
              This removes{" "}
              <strong className="text-foreground">
                {pendingAction?.service.serviceName}
              </strong>{" "}
              from the service menu. Existing appointments keep a snapshot of the
              service name and price, but this action cannot be undone.
            </>
          )
        }
        confirmLabel={
          isStatusAction ? (willActivate ? "Yes, activate" : "Yes, deactivate") : "Yes, delete"
        }
        cancelLabel="Keep service"
        onConfirm={handleConfirmAction}
        isLoading={isActing}
        destructive={pendingAction?.type === "delete"}
      />
    </div>
  );
}
