import type { Metadata } from "next";
import { CustomerTransactions } from "@/features/dashboard/customer/customer-transactions";

export const metadata: Metadata = {
  title: "Payment history",
};

export default function CustomerTransactionsPage() {
  return <CustomerTransactions />;
}
