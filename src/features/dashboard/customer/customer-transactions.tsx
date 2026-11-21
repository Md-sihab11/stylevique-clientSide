"use client";

import { useState } from "react";
import { ReceiptText, Search, X } from "lucide-react";
import type { Transaction, TransactionStatus } from "@/features/transactions/types";
import { getMyTransactions } from "@/features/transactions/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { TRANSACTION_STATUS_OPTIONS } from "@/constants/salon";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { PageHeader } from "@/components/common/page-header";
import { PrimaryButton } from "@/components/common/primary-button";
import { DataTable, type DataTableColumn } from "@/components/common/data-table";
import { PaginationControls } from "@/components/common/pagination-controls";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { TableSkeleton, Skeleton } from "@/components/common/skeleton-loader";
import { Button } from "@/components/ui/button";
import {
  TransactionService,
  formatStripeReference,
} from "@/features/transactions/components/transaction-service";

const PAGE_SIZE = 8;

/**
 * Customer payment history.
 *
 * The backend writes these records from verified Stripe webhook events, so this
 * page is read-only. It never creates or changes a payment state.
 */
export function CustomerTransactions() {
  const [status, setStatus] = useState<TransactionStatus | "">("");
  const [page, setPage] = useState(1);

  const { data, error, isLoading, reload } = useApiResource(
    () =>
      getMyTransactions({
        status: status || undefined,
        page,
        limit: PAGE_SIZE,
      }),
    `my-transactions|${status}|${page}`,
  );

  const columns: DataTableColumn<Transaction>[] = [
    {
      key: "service",
      header: "Service",
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
      header: "Stripe reference",
      cell: (transaction) => (
        <span
          className="block max-w-[14rem] truncate font-mono text-[0.68rem] text-muted-foreground"
          title={transaction.stripeSessionId}
        >
          {formatStripeReference(transaction.stripeSessionId)}
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

  function clearStatus() {
    setStatus("");
    setPage(1);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Customer dashboard"
        title="Payment history"
        description="Every payment recorded for your account by the salon's verified Stripe webhook. This history is read-only."
        action={
          <PrimaryButton href="/dashboard/customer/appointments" variant="outline" size="sm">
            View appointments
          </PrimaryButton>
        }
      />

      <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="w-full space-y-2 sm:max-w-xs">
            <label
              htmlFor="customer-transaction-status"
              className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              Payment status
            </label>
            <select
              id="customer-transaction-status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as TransactionStatus | "");
                setPage(1);
              }}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              <option value="">All payments</option>
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
              onClick={clearStatus}
            >
              <X className="size-3.5" aria-hidden="true" />
              Clear filter
            </Button>
          )}

          {data && (
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground sm:ml-auto sm:pb-2.5">
              {data.pagination.totalItems} record
              {data.pagination.totalItems === 1 ? "" : "s"}
            </p>
          )}
        </div>

        <p className="mt-4 rounded-md bg-secondary/50 p-3.5 text-xs leading-5 text-muted-foreground">
          Payment status is confirmed by Stripe and stored by the backend. If a
          payment is missing, open the related appointment or contact the salon.
        </p>
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
          title="Your payment history could not load"
          description="Check the backend connection and try again."
          onRetry={reload}
        />
      )}

      {!isLoading && !error && data?.transactions.length === 0 && (
        <EmptyState
          icon={status ? Search : ReceiptText}
          title={status ? "No payments with this status" : "No payments yet"}
          description={
            status
              ? "Try another payment status or clear the filter to see your full history."
              : "After the salon confirms an appointment, you can pay online. Verified payments will appear here."
          }
          action={
            status ? (
              <PrimaryButton size="sm" variant="outline" onClick={clearStatus}>
                Clear filter
              </PrimaryButton>
            ) : (
              <PrimaryButton href="/dashboard/customer/appointments" size="sm">
                View my appointments
              </PrimaryButton>
            )
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
              caption="Your Stylevique payment history"
            />
          </div>

          <div className="space-y-4 md:hidden">
            {data.transactions.map((transaction) => (
              <article
                key={transaction.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <TransactionService transaction={transaction} />
                  <StatusBadge status={transaction.status} />
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
                    <dt className="text-muted-foreground">Stripe reference</dt>
                    <dd
                      className="mt-1 break-all font-mono text-[0.65rem] text-foreground"
                      title={transaction.stripeSessionId}
                    >
                      {formatStripeReference(transaction.stripeSessionId)}
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
