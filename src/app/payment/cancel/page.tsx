import type { Metadata } from "next";
import { ArrowRight, CalendarDays, ReceiptText, ShieldCheck } from "lucide-react";
import { PrimaryButton } from "@/components/common/primary-button";

export const metadata: Metadata = {
  title: "Checkout not completed",
};

/**
 * Stripe redirects here when a customer leaves Checkout without paying.
 * The page deliberately makes no claim about payment state. Only the backend
 * verification / webhook can mark an appointment as paid.
 */
export default function PaymentCancelPage() {
  return (
    <div className="page-width py-14 sm:py-20">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-lg border border-border bg-card">
        <div className="border-b border-border bg-secondary/40 px-6 py-10 text-center sm:px-10">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-background text-primary">
            <ReceiptText className="size-6" aria-hidden="true" />
          </div>
          <p className="eyebrow mt-5">Checkout returned</p>
          <h1 className="mt-3 text-4xl font-medium leading-tight text-foreground sm:text-5xl">
            Checkout was not completed.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            You returned from Stripe without finishing the payment. This page does
            not mark your appointment as paid, and it has not been changed by the
            cancellation.
          </p>
        </div>

        <div className="px-6 py-8 sm:px-10">
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <CalendarDays className="size-4 text-primary" aria-hidden="true" />
              <h2 className="mt-3 text-lg font-medium text-foreground">
                Appointment unchanged
              </h2>
              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                A confirmed appointment stays confirmed and unpaid.
              </p>
            </div>
            <div>
              <ReceiptText className="size-4 text-primary" aria-hidden="true" />
              <h2 className="mt-3 text-lg font-medium text-foreground">
                No payment assumed
              </h2>
              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                If you completed a payment in another tab, check your appointment
                before paying again.
              </p>
            </div>
            <div>
              <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
              <h2 className="mt-3 text-lg font-medium text-foreground">
                Verified by webhook
              </h2>
              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                Only the backend&apos;s Stripe webhook can mark a payment as paid.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-border pt-7 sm:flex-row">
            <PrimaryButton href="/dashboard/customer/appointments" size="md">
              View my appointments
              <ArrowRight className="size-4" aria-hidden="true" />
            </PrimaryButton>
            <PrimaryButton href="/services" variant="outline" size="md">
              Browse services
            </PrimaryButton>
          </div>

          <p className="mt-6 text-xs leading-6 text-muted-foreground">
            To try the payment again, open the confirmed appointment from your
            dashboard and choose <strong className="text-foreground">Pay now</strong>.
            If something looks wrong, contact the salon with the appointment date
            and time.
          </p>
        </div>
      </div>
    </div>
  );
}
