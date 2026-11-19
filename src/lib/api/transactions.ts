import type { TransactionListParams, TransactionListResponse } from "@/types";
import { ApiNotImplementedError } from "./errors";

// TODO: Implement GET /api/transactions/my.
// Auth: customer JWT.
// Query: status ("paid" | "failed"), page, limit.
// Response: TransactionListResponse. Each row includes appointment details.
// Used by: a customer transaction history section if you add one.
export async function getMyTransactions(
  params: TransactionListParams = {},
): Promise<TransactionListResponse> {
  void params;
  throw new ApiNotImplementedError("getMyTransactions");
}

// TODO: Implement GET /api/admin/transactions.
// Auth: admin JWT.
// Query: status ("paid" | "failed"), page, limit.
// Response: TransactionListResponse. Each row includes appointment and customer.
// Used by: AdminTransactionsPage.
export async function getAdminTransactions(
  params: TransactionListParams = {},
): Promise<TransactionListResponse> {
  void params;
  throw new ApiNotImplementedError("getAdminTransactions");
}
