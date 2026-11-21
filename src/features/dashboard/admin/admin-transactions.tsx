"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ReceiptText,
  Search,
  X,
} from "lucide-react";
import type { Transaction, TransactionStatus } from "@/features/transactions/types";
import { getAdminTransactions } from "@/features/transactions/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { TRANSACTION_STATUS_OPTIONS } from "@/constants/salon";
import {
  formatCurrency,
  formatDateTime,
  getCustomerName,
  getInitials,
} from "@/lib/format";
import { TransactionService } from "@/features/transactions/components/transaction-service";
import { PageHeader } from "@/components/common/page-header";
import { PrimaryButton } from "@/components/common/primary-button";
import { DataTable, type DataTableColumn } from "@/components/common/data-table";
import { PaginationControls } from "@/components/common/pagination-controls";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { TableSkeleton, Skeleton } from "@/components/common/skeleton-loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

function TransactionCustomer({ transaction }: { transaction: Transaction }) {
  const customer = transaction.customer;

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Avatar className="size-8 shrink-0">
        <AvatarImage src={customer?.image ?? undefined} alt={getCustomerName(customer)} />
        <AvatarFallback className="bg-secondary text-[0.6rem] text-primary">
          {getInitials(getCustomerName(customer))}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {getCustomerName(customer)}
        </p>
        <p className="truncate text-[0.68rem] text-muted-foreground">
          {customer?.email ?? "Customer record unavailable"}
        </p>
      </div>
    </div>
  );
}

/**
 * Admin transaction history.
 * Only the backend Stripe webhook creates paid/failed transaction records.
 * This page never invents a payment state; it simply lists the verified data.
 */
export function AdminTransactions() {
  const [status, setStatus] = useState<TransactionStatus | "">("");
  const [page, setPage] = useState(1);

  const { data, error, isLoading, reload } = useApiResource(
    () =>
      getAdminTransactions({
        status: status || undefined,
        page,
        limit: PAGE_SIZE,
      }),
    `admin-transactions|${status}|${page}`,
  );

  const columns: DataTableColumn<Transaction>[] = [
    {
      key: "customer",
      header: "Customer",
      cell: (transaction) => <TransactionCustomer transaction={transaction} />,
    },
    {
      key: "appointment",
      header: "Appointment",
      cell: (transaction) => <TransactionService transaction={transaction} />,
    },
    {
      key: "amount",
      header: "Amount",
      cell: (transaction) => (
        <span className="text-sm font-medium text-foreground">
          {formatCurrency(transaction.amount, transaction.currency)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (transaction) => <StatusBadge status={transaction.status} />,
    },
    {
      key: "session",
      header: "Stripe session",
      cell: (transaction) => (
        <span className="block max-w-[16rem] truncate font-mono text-[0.68rem] text-muted-foreground">
          {transaction.stripeSessionId}
        </span>
      ),
    },
    {
      key: "created",
      header: "Recorded",
      cell: (transaction) => (
        <span className="text-xs text-muted-foreground">
          {formatDateTime(transaction.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Salon administration"
        title="Transactions"
        description="A record of paid and failed Stripe checkouts. Payment success is written by the backend webhook, not by the browser."
        action={
          <PrimaryButton href="/dashboard/admin/appointments" variant="outline" size="sm">
            View appointments
          </PrimaryButton>
        }
      />

      <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="w-full space-y-2 sm:max-w-xs">
            <label
              htmlFor="admin-transaction-status"
              className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              Payment status
            </label>
            <select
              id="admin-transaction-status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as TransactionStatus | "");
                setPage(1);
              }}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              <option value="">All transactions</option>
              {TRANSACTION_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {status && (
            <Button
              variant="outline"
              className="h-10 rounded-full px-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em]"
              onClick={() => {
                setStatus("");
                setPage(1);
              }}
            >
              <X className="size-3.5" aria-hidden="true" />
              Clear filter
            </Button>
          )}

          {data && (
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground sm:ml-auto sm:pb-2.5">
              {data.pagination.totalItems} transaction
              {data.pagination.totalItems === 1 ? "" : "s"}
            </p>
          )}
        </div>

        <div className="mt-4 rounded-md bg-secondary/50 p-3.5 text-xs leading-5 text-muted-foreground">
          Revenue totals live on the{" "}
          <Link href="/dashboard/admin" className="font-medium text-foreground underline-offset-4 hover:underline">
            admin overview
          </Link>
          . This list shows individual webhook records only.
        </div>
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

      {!isLoading && Boolean(error) && (
        <ErrorState
          title="Transactions could not load"
          description="Check the backend connection and try again."
          onRetry={reload}
        />
      )}

      {!isLoading && !error && data?.transactions.length === 0 && (
        <EmptyState
          icon={status ? Search : ReceiptText}
          title={status ? "No transactions with this status" : "No transactions yet"}
          description={
            status
              ? "Try another payment status or clear the filter to see every record."
              : "Paid and failed Stripe checkouts will appear here once the webhook records them."
          }
          action={
            status ? (
              <PrimaryButton
                size="sm"
                variant="outline"
                onClick={() => {
                  setStatus("");
                  setPage(1);
                }}
              >
                Clear filter
              </PrimaryButton>
            ) : undefined
          }
        />
      )}

      {!isLoading && !error && data && data.transactions.length > 0 && (
        <>
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              rows={data.transactions}
              getRowKey={(transaction) => transaction.id}
              caption="Payment transactions"
            />
          </div>

          <div className="space-y-4 md:hidden">
            {data.transactions.map((transaction) => (
              <article
                key={transaction.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <TransactionCustomer transaction={transaction} />
                  <StatusBadge status={transaction.status} />
                </div>

                <div className="mt-4 border-t border-border pt-4">
                  <TransactionService transaction={transaction} />
                </div>

                <dl className="mt-4 space-y-2 border-t border-border pt-4 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Amount</dt>
                    <dd className="font-semibold text-foreground">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Recorded</dt>
                    <dd className="text-foreground">
                      {formatDateTime(transaction.createdAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Stripe session</dt>
                    <dd className="mt-1 break-all font-mono text-[0.65rem] text-foreground">
                      {transaction.stripeSessionId}
                    </dd>
                  </div>
                </dl>
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
    </div>
  );
}
