"use client";

import { FormEvent, useState } from "react";
import {
  CalendarDays,
  Eye,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  ShieldOff,
  UserRound,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import type { User } from "@/features/users/types";
import { blockCustomer, getCustomers, unblockCustomer } from "@/features/users/api";
import { getApiErrorMessage } from "@/lib/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { formatDate, getInitials } from "@/lib/format";
import { PageHeader } from "@/components/common/page-header";
import { PrimaryButton } from "@/components/common/primary-button";
import { DataTable, type DataTableColumn } from "@/components/common/data-table";
import { PaginationControls } from "@/components/common/pagination-controls";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { TableSkeleton, Skeleton } from "@/components/common/skeleton-loader";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PAGE_SIZE = 10;

function CustomerIdentity({ customer }: { customer: User }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className="size-9 shrink-0">
        <AvatarImage src={customer.image ?? undefined} alt={customer.name} />
        <AvatarFallback className="bg-secondary text-[0.65rem] text-primary">
          {getInitials(customer.name) || <UserRound className="size-3" />}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{customer.name}</p>
        <p className="truncate text-[0.68rem] text-muted-foreground">{customer.email}</p>
      </div>
    </div>
  );
}

/**
 * Administrator customer directory.
 * The list endpoint excludes administrator accounts and supports name/email
 * search. Blocking and unblocking call their dedicated endpoints; the UI only
 * changes after the backend confirms.
 */
export function AdminUsers() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [detailsCustomer, setDetailsCustomer] = useState<User | null>(null);
  const [blockTarget, setBlockTarget] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { data, error, isLoading, reload } = useApiResource(
    () =>
      getCustomers({
        search: search || undefined,
        page,
        limit: PAGE_SIZE,
      }),
    `admin-users|${search}|${page}`,
  );

  const shouldBlock = blockTarget ? !blockTarget.isBlocked : false;

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  }

  function clearSearch() {
    setSearchInput("");
    setSearch("");
    setPage(1);
  }

  async function handleBlockToggle() {
    if (!blockTarget || isUpdating) return;

    setIsUpdating(true);

    try {
      if (blockTarget.isBlocked) {
        await unblockCustomer(blockTarget.id);
        toast.success("Customer unblocked", {
          description: "The account can use protected salon features again.",
        });
      } else {
        await blockCustomer(blockTarget.id);
        toast.success("Customer blocked", {
          description: "The account can no longer use protected salon APIs.",
        });
      }

      setBlockTarget(null);
      setDetailsCustomer(null);
      reload();
    } catch (actionError) {
      toast.error("Could not update the customer", {
        description: getApiErrorMessage(actionError),
      });
      setBlockTarget(null);
    } finally {
      setIsUpdating(false);
    }
  }

  const columns: DataTableColumn<User>[] = [
    {
      key: "customer",
      header: "Customer",
      cell: (customer) => <CustomerIdentity customer={customer} />,
    },
    {
      key: "phone",
      header: "Phone",
      cell: (customer) => (
        <span className="text-sm text-muted-foreground">
          {customer.phone || "Not provided"}
        </span>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      cell: (customer) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(customer.createdAt)}
        </span>
      ),
    },
    {
      key: "verified",
      header: "Email",
      cell: (customer) => (
        <StatusBadge
          status={customer.emailVerified ? "active" : "pending"}
          label={customer.emailVerified ? "Verified" : "Not verified"}
        />
      ),
    },
    {
      key: "status",
      header: "Account",
      cell: (customer) => (
        <StatusBadge
          status={customer.isBlocked ? "blocked" : "active"}
          label={customer.isBlocked ? "Blocked" : "Active"}
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-[1%] whitespace-nowrap",
      cell: (customer) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setDetailsCustomer(customer)}
          >
            <Eye className="size-3.5" aria-hidden="true" />
            View
          </Button>
          <Button
            variant={customer.isBlocked ? "outline" : "destructive"}
            size="sm"
            className="rounded-full"
            onClick={() => setBlockTarget(customer)}
          >
            {customer.isBlocked ? (
              <ShieldCheck className="size-3.5" aria-hidden="true" />
            ) : (
              <ShieldOff className="size-3.5" aria-hidden="true" />
            )}
            {customer.isBlocked ? "Unblock" : "Block"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Salon administration"
        title="Customers"
        description="Search customer accounts, review contact details and control whether an account can use protected salon features."
      />

      <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="w-full space-y-2 sm:max-w-md">
            <label
              htmlFor="admin-user-search"
              className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              Search by name or email
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="admin-user-search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Customer name or email"
                maxLength={100}
                className="h-10 bg-background pl-9 pr-20 text-sm"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full border border-primary-foreground/20 bg-primary px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Search
              </button>
            </div>
          </div>

          {search && (
            <Button
              variant="outline"
              className="h-10 rounded-full px-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em]"
              onClick={clearSearch}
            >
              Clear search
            </Button>
          )}

          {data && (
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground sm:ml-auto sm:pb-2.5">
              {data.pagination.totalItems} customer
              {data.pagination.totalItems === 1 ? "" : "s"}
            </p>
          )}
        </form>
      </div>

      {isLoading && (
        <>
          <div className="hidden md:block">
            <TableSkeleton rows={6} />
          </div>
          <div className="space-y-4 md:hidden">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        </>
      )}

      {!isLoading && Boolean(error) && (
        <ErrorState
          title="The customer list could not load"
          description="Check the backend connection and try again."
          onRetry={reload}
        />
      )}

      {!isLoading && !error && data?.users.length === 0 && (
        <EmptyState
          icon={search ? Search : UsersRound}
          title={search ? "No customers match this search" : "No customers yet"}
          description={
            search
              ? "Try a different name or email address."
              : "Customer accounts will appear here after registration."
          }
          action={
            search ? (
              <PrimaryButton size="sm" variant="outline" onClick={clearSearch}>
                Clear search
              </PrimaryButton>
            ) : undefined
          }
        />
      )}

      {!isLoading && !error && data && data.users.length > 0 && (
        <>
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              rows={data.users}
              getRowKey={(customer) => customer.id}
              caption="Registered customers"
            />
          </div>

          <div className="space-y-4 md:hidden">
            {data.users.map((customer) => (
              <article
                key={customer.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <CustomerIdentity customer={customer} />
                  <StatusBadge
                    status={customer.isBlocked ? "blocked" : "active"}
                    label={customer.isBlocked ? "Blocked" : "Active"}
                  />
                </div>

                <dl className="mt-4 space-y-2 border-t border-border pt-4 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd className="text-foreground">{customer.phone || "Not provided"}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Joined</dt>
                    <dd className="text-foreground">{formatDate(customer.createdAt)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Email status</dt>
                    <dd>
                      <StatusBadge
                        status={customer.emailVerified ? "active" : "pending"}
                        label={customer.emailVerified ? "Verified" : "Not verified"}
                      />
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setDetailsCustomer(customer)}
                  >
                    <Eye className="size-3.5" aria-hidden="true" />
                    View details
                  </Button>
                  <Button
                    variant={customer.isBlocked ? "outline" : "destructive"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setBlockTarget(customer)}
                  >
                    {customer.isBlocked ? "Unblock" : "Block account"}
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

      <Dialog
        open={Boolean(detailsCustomer)}
        onOpenChange={(open) => {
          if (!open) setDetailsCustomer(null);
        }}
      >
        <DialogContent className="max-w-md gap-0 p-0 sm:max-w-md">
          {detailsCustomer && (
            <>
              <DialogHeader className="border-b border-border p-6">
                <DialogTitle className="text-3xl">Customer details</DialogTitle>
                <DialogDescription>
                  Account information as returned by the admin customer endpoint.
                </DialogDescription>
              </DialogHeader>

              <div className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="size-14">
                    <AvatarImage
                      src={detailsCustomer.image ?? undefined}
                      alt={detailsCustomer.name}
                    />
                    <AvatarFallback className="bg-secondary font-heading text-lg text-primary">
                      {getInitials(detailsCustomer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-medium text-foreground">
                      {detailsCustomer.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {detailsCustomer.email}
                    </p>
                  </div>
                </div>

                <dl className="mt-6 space-y-4 border-t border-border pt-5 text-sm">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <div>
                      <dt className="text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground">
                        Email
                      </dt>
                      <dd className="mt-0.5 break-all text-foreground">
                        {detailsCustomer.email}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <div>
                      <dt className="text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground">
                        Phone
                      </dt>
                      <dd className="mt-0.5 text-foreground">
                        {detailsCustomer.phone || "Not provided"}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <div>
                      <dt className="text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground">
                        Member since
                      </dt>
                      <dd className="mt-0.5 text-foreground">
                        {formatDate(detailsCustomer.createdAt)}
                      </dd>
                    </div>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-5">
                  <StatusBadge
                    status={detailsCustomer.isBlocked ? "blocked" : "active"}
                    label={detailsCustomer.isBlocked ? "Blocked" : "Active"}
                  />
                  <StatusBadge
                    status={detailsCustomer.emailVerified ? "active" : "pending"}
                    label={
                      detailsCustomer.emailVerified ? "Email verified" : "Email not verified"
                    }
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2 border-t border-border p-5">
                <Button
                  variant="outline"
                  className="rounded-full px-4"
                  onClick={() => setDetailsCustomer(null)}
                >
                  Close
                </Button>
                <Button
                  variant={detailsCustomer.isBlocked ? "outline" : "destructive"}
                  className="rounded-full px-4"
                  onClick={() => setBlockTarget(detailsCustomer)}
                >
                  {detailsCustomer.isBlocked ? "Unblock account" : "Block account"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(blockTarget)}
        onOpenChange={(open) => {
          if (!open) setBlockTarget(null);
        }}
        title={shouldBlock ? "Block this customer?" : "Unblock this customer?"}
        description={
          shouldBlock ? (
            <>
              <strong className="text-foreground">{blockTarget?.name}</strong> will no
              longer be able to use protected APIs, including booking and payment.
              Their existing appointments remain in the salon records.
            </>
          ) : (
            <>
              <strong className="text-foreground">{blockTarget?.name}</strong> will be
              able to sign in and use protected salon features again.
            </>
          )
        }
        confirmLabel={shouldBlock ? "Yes, block account" : "Yes, unblock account"}
        cancelLabel="Keep as is"
        onConfirm={handleBlockToggle}
        isLoading={isUpdating}
        destructive={shouldBlock}
      />
    </div>
  );
}
