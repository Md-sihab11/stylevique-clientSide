import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentSuccess } from "@/components/payment/payment-success";
import { Skeleton } from "@/components/common/skeleton-loader";

export const metadata: Metadata = {
  title: "Payment verification",
};

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="page-width flex justify-center py-16">
          <Skeleton className="h-80 w-full max-w-xl rounded-lg" />
        </div>
      }
    >
      <PaymentSuccess />
    </Suspense>
  );
}
