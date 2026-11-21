import type { Metadata } from "next";
import { CustomerReviews } from "@/features/dashboard/customer/customer-reviews";

export const metadata: Metadata = {
  title: "My reviews",
};

export default function CustomerReviewsPage() {
  return <CustomerReviews />;
}
