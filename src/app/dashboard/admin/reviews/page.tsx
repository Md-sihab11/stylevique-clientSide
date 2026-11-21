import type { Metadata } from "next";
import { AdminReviews } from "@/features/dashboard/admin/admin-reviews";

export const metadata: Metadata = {
  title: "Review moderation",
};

export default function AdminReviewsPage() {
  return <AdminReviews />;
}
