import { apiRequest } from "@/lib/api-client";
import type { TransactionListParams, TransactionListResponse } from "@/features/transactions/types";

/** Customer payment history. Read-only. */
export async function getMyTransactions(
  params: TransactionListParams = {},
): Promise<TransactionListResponse> {
  return apiRequest<TransactionListResponse>("/api/transactions/my", {
    auth: true,
    query: {
      status: params.status,
      page: params.page,
      limit: params.limit,
    },
  });
}

/** Admin payment history. Each row includes the customer record. Read-only. */
export async function getAdminTransactions(
  params: TransactionListParams = {},
): Promise<TransactionListResponse> {
  return apiRequest<TransactionListResponse>("/api/admin/transactions", {
    auth: true,
    query: {
      status: params.status,
      page: params.page,
      limit: params.limit,
    },
  });
}
