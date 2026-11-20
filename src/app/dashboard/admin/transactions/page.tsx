import type { Metadata } from "next";
import { AdminTransactions } from "@/features/dashboard/admin/admin-transactions";

export const metadata: Metadata = {
  title: "Transactions",
};

export default function AdminTransactionsPage() {
  return <AdminTransactions />;
}
