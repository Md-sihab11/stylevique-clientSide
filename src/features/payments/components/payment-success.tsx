"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { getApiErrorMessage } from "@/lib/api";
import { verifyPayment } from "@/features/payments/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { useSession } from "@/lib/auth/auth-client";
import { formatCurrency } from "@/lib/format";
import { PrimaryButton } from "@/components/common/primary-button";
import { Skeleton } from "@/components/common/skeleton-loader";

/**
 * Stripe sends the customer back here with ?session_id=...
 *
 * This screen NEVER assumes success. It asks the backend to verify the session
 * and shows the success design only when the backend returns status "paid".
 */
export function PaymentSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id")?.trim() ?? "";
  const { data: session, isPending } = useSession();

  if (!sessionId) {
    return (
      <PaymentMessage
        tone="neutral"
        icon={AlertTriangle}
        eyebrow="Payment return"
        title="No checkout session was provided"
        description="This page needs the Stripe session_id from the checkout redirect. Open your appointments to check the payment status stored by the salon."
      >
        <PrimaryButton href="/dashboard/customer/appointments" size="md">
          View my appointments
        </PrimaryButton>
        <PrimaryButton href="/services" variant="outline" size="md">
          Browse services
        </PrimaryButton>
      </PaymentMessage>
    );
  }

  if (isPending) {
    return (
      <div className="page-width flex justify-center py-16 sm:py-24">
        <div className="w-full max-w-xl space-y-4 rounded-lg border border-border bg-card p-6">
          <Skeleton className="h-14 w-14 rounded-full" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-11 w-40 rounded-full" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    const callbackUrl = `/payment/success?session_id=${encodeURIComponent(sessionId)}`;

    return (
      <PaymentMessage
        tone="neutral"
        icon={ShieldCheck}
        eyebrow="Secure verification"
        title="Sign in to confirm this payment"
        description="Payment verification belongs to the customer account that made the booking. Sign in with that account and you will return to this page automatically."
      >
        <PrimaryButton
          href={`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          size="md"
        >
          Sign in to verify
        </PrimaryButton>
        <PrimaryButton href="/contact" variant="outline" size="md">
          Contact the salon
        </PrimaryButton>
      </PaymentMessage>
    );
  }

  if (session.user.role === "admin") {
    return (
      <PaymentMessage
        tone="neutral"
        icon={ShieldCheck}
        eyebrow="Administrator account"
        title="This page verifies customer payments"
        description="Administrator accounts cannot verify customer checkout sessions. Use the transactions page to review payment records written by the Stripe webhook."
      >
        <PrimaryButton href="/dashboard/admin/transactions" size="md">
          View transactions
        </PrimaryButton>
      </PaymentMessage>
    );
  }

  return <PaymentVerificationPanel sessionId={sessionId} />;
}

function PaymentVerificationPanel({ sessionId }: { sessionId: string }) {
  const { data, error, isLoading, reload } = useApiResource(
    () => verifyPayment(sessionId),
    sessionId,
  );

  if (isLoading) {
    return (
      <div className="page-width flex justify-center py-16 sm:py-24">
        <div
          className="w-full max-w-xl rounded-lg border border-border bg-card p-8 text-center"
          role="status"
          aria-live="polite"
        >
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <RefreshCw className="size-6 animate-spin" aria-hidden="true" />
          </div>
          <h1 className="mt-6 font-display text-4xl font-medium tracking-[0.01em] text-foreground uppercase">
            Confirming your payment
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            We are asking the salon backend to verify the Stripe session. Please keep
            this page open.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <PaymentMessage
        tone="neutral"
        icon={AlertTriangle}
        eyebrow="Verification unavailable"
        title="We could not confirm this payment"
        description={getApiErrorMessage(error)}
      >
        <PrimaryButton size="md" onClick={reload}>
          <RefreshCw className="size-4" aria-hidden="true" />
          Try again
        </PrimaryButton>
        <PrimaryButton href="/dashboard/customer/appointments" variant="outline" size="md">
          View my appointments
        </PrimaryButton>
      </PaymentMessage>
    );
  }

  const reference = data?.appointmentId
    ? `#${data.appointmentId.slice(-6).toUpperCase()}`
    : "—";

  if (data?.status === "paid") {
    return (
      <div className="page-width max-w-3xl py-14 sm:py-20">
        <div className="overflow-hidden rounded-lg border border-[#b7ccb9] bg-card">
          <div className="bg-[#eef4ec] px-6 py-10 text-center sm:px-10">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#dce9da] text-[#456345]">
              <CheckCircle2 className="size-8" aria-hidden="true" />
            </div>
            <p className="mt-5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#456345]">
              Verified by the salon
            </p>
            <h1 className="mt-3 font-display text-4xl font-medium leading-tight tracking-[0.01em] text-foreground uppercase sm:text-5xl">
              Payment confirmed.
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
              The backend verified this checkout session. Your payment record is
              complete and your appointment is unchanged.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <dl className="grid gap-5 border-b border-border pb-6 sm:grid-cols-2">
              <div>
                <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Amount paid
                </dt>
                <dd className="mt-2 font-heading text-3xl text-foreground">
                  {formatCurrency(data.amount, data.currency)}
                </dd>
              </div>
              <div>
                <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Appointment
                </dt>
                <dd className="mt-2 text-sm leading-6 text-foreground">{reference}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Stripe session
                </dt>
                <dd className="mt-2 break-all font-mono text-[0.7rem] text-muted-foreground">
                  {sessionId}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 shrink-0 text-[#456345]" aria-hidden="true" />
              {data.transaction?.stripeEventId
                ? "A paid transaction was recorded by the Stripe webhook."
                : "The backend marked this session as paid."}
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <PrimaryButton
                href={`/dashboard/customer/appointments/${data.appointmentId}`}
                size="md"
              >
                View appointment
                <ArrowRight className="size-4" aria-hidden="true" />
              </PrimaryButton>
              <PrimaryButton
                href="/dashboard/customer/appointments"
                variant="outline"
                size="md"
              >
                All appointments
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (data?.status === "failed") {
    return (
      <PaymentMessage
        tone="danger"
        icon={AlertTriangle}
        eyebrow="Payment not completed"
        title="Stripe reported a failed payment"
        description="No successful transaction was recorded for this checkout session. Your appointment is still waiting for payment, so you can return to the appointment and try again."
      >
        <PrimaryButton href="/dashboard/customer/appointments" size="md">
          Return to my appointments
        </PrimaryButton>
        <PrimaryButton href="/contact" variant="outline" size="md">
          Contact the salon
        </PrimaryButton>
      </PaymentMessage>
    );
  }

  return (
    <PaymentMessage
      tone="pending"
      icon={Clock3}
      eyebrow="Still confirming"
      title="Payment is being verified."
      description="The backend has not finished processing this checkout session. If you just paid, wait a few seconds and refresh. Your appointment will update when the Stripe webhook records the payment."
    >
      <PrimaryButton size="md" onClick={reload}>
        <RefreshCw className="size-4" aria-hidden="true" />
        Refresh status
      </PrimaryButton>
      <PrimaryButton href="/dashboard/customer/appointments" variant="outline" size="md">
        View my appointments
      </PrimaryButton>
      <Link
        href="/contact"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Need help? Contact the salon
        <ArrowRight className="size-3" aria-hidden="true" />
      </Link>
    </PaymentMessage>
  );
}

type PaymentTone = "neutral" | "danger" | "pending";

interface PaymentMessageProps {
  tone: PaymentTone;
  icon: typeof CheckCircle2;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

function PaymentMessage({
  tone,
  icon: Icon,
  eyebrow,
  title,
  description,
  children,
}: PaymentMessageProps) {
  const toneClasses = {
    neutral: "bg-secondary text-primary",
    danger: "bg-destructive/10 text-destructive",
    pending: "bg-[#f6eddc] text-[#7c5c28]",
  }[tone];

  return (
    <div className="page-width flex justify-center py-14 sm:py-20">
      <div className="w-full max-w-xl rounded-lg border border-border bg-card p-6 sm:p-10">
        <div className={`flex size-14 items-center justify-center rounded-full ${toneClasses}`}>
          <Icon className="size-6" aria-hidden="true" />
        </div>
        <p className="eyebrow mt-6">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-medium leading-tight tracking-[0.01em] text-foreground uppercase">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">{description}</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
