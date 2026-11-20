"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Eye, XCircle } from "lucide-react";
import { toast } from "sonner";
import type { Appointment } from "@/features/appointments/types";
import { cancelAppointment } from "@/features/appointments/api";
import { createCheckoutSession } from "@/features/payments/api";
import { getApiErrorMessage, isApiError } from "@/lib/api";
import { canCustomerCancel, canCustomerPay } from "@/features/appointments/rules";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";

interface CustomerAppointmentActionsProps {
  appointment: Appointment;
  onChanged?: () => void;
  showDetailsLink?: boolean;
}

/**
 * Customer actions shared by the appointments list and detail page.
 * The UI respects backend rules:
 * - cancel appears only while pending
 * - pay appears only when confirmed and unpaid
 */
export function CustomerAppointmentActions({
  appointment,
  onChanged,
  showDetailsLink = true,
}: CustomerAppointmentActionsProps) {
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const canCancel = canCustomerCancel(appointment);
  const canPay = canCustomerPay(appointment);

  async function handleCancel() {
    if (isCancelling) {
      return;
    }

    setIsCancelling(true);

    try {
      await cancelAppointment(appointment.id);
      toast.success("Appointment cancelled", {
        description: "The time slot has been released for another customer.",
      });
      setIsCancelOpen(false);
      onChanged?.();
    } catch (error) {
      toast.error(
        isApiError(error) && error.isConflict
          ? "This appointment cannot be cancelled"
          : "Could not cancel the appointment",
        {
          description: getApiErrorMessage(error),
        },
      );
    } finally {
      setIsCancelling(false);
    }
  }

  async function handlePay() {
    if (isPaying) {
      return;
    }

    setIsPaying(true);

    try {
      const checkout = await createCheckoutSession(appointment.id);

      if (!checkout.checkoutUrl) {
        throw new Error("The checkout response did not include a checkout URL.");
      }

      // Stripe Checkout is an external page. Payment is still verified by the
      // backend on /payment/success; we never mark anything paid here.
      window.location.assign(checkout.checkoutUrl);
    } catch (error) {
      toast.error(
        isApiError(error) && error.isConflict
          ? "Payment cannot be started"
          : "Could not start payment",
        {
          description: getApiErrorMessage(error),
        },
      );
      setIsPaying(false);
    }
  }

  if (!showDetailsLink && !canCancel && !canPay) {
    return <span className="text-xs text-muted-foreground">No actions</span>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showDetailsLink && (
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          render={<Link href={`/dashboard/customer/appointments/${appointment.id}`} />}
        >
          <Eye className="size-3.5" aria-hidden="true" />
          View
        </Button>
      )}

      {canCancel && (
        <Button
          variant="destructive"
          size="sm"
          className="rounded-full"
          onClick={() => setIsCancelOpen(true)}
          disabled={isPaying || isCancelling}
        >
          <XCircle className="size-3.5" aria-hidden="true" />
          Cancel
        </Button>
      )}

      {canPay && (
        <Button
          size="sm"
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handlePay}
          disabled={isPaying || isCancelling}
        >
          <CreditCard className="size-3.5" aria-hidden="true" />
          {isPaying ? "Opening…" : "Pay now"}
        </Button>
      )}

      <ConfirmDialog
        open={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        title="Cancel this appointment?"
        description="This is only available while the appointment is pending. Once the salon confirms it, please contact the studio to make a change."
        confirmLabel="Yes, cancel"
        cancelLabel="Keep appointment"
        onConfirm={handleCancel}
        isLoading={isCancelling}
        destructive
      />
    </div>
  );
}
