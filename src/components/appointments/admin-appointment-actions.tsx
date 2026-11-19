"use client";

import { useState } from "react";
import { CalendarCheck, XCircle } from "lucide-react";
import { toast } from "sonner";
import type { AdminAppointment } from "@/types";
import {
  isApiNotImplementedError,
  updateAdminAppointmentStatus,
} from "@/lib/api";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";

interface AdminAppointmentActionsProps {
  appointment: AdminAppointment;
  onChanged: () => void;
}

/**
 * Admin status actions with the backend's transition rules:
 * pending -> confirmed or cancelled; confirmed -> cancelled only.
 * Cancelling a paid appointment preserves the payment record and issues no
 * refund through this endpoint, so the dialog says that explicitly.
 */
export function AdminAppointmentActions({
  appointment,
  onChanged,
}: AdminAppointmentActionsProps) {
  const [targetStatus, setTargetStatus] = useState<"confirmed" | "cancelled" | null>(
    null,
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const canConfirm = appointment.status === "pending";
  const canCancel =
    appointment.status === "pending" || appointment.status === "confirmed";

  async function handleConfirm() {
    if (!targetStatus) return;

    setIsUpdating(true);

    try {
      await updateAdminAppointmentStatus(appointment.id, {
        status: targetStatus,
      });

      toast.success(
        targetStatus === "confirmed"
          ? "Appointment confirmed"
          : "Appointment cancelled",
        {
          description:
            targetStatus === "confirmed"
              ? "The customer can now pay for this appointment online."
              : appointment.paymentStatus === "paid"
                ? "The payment record was preserved. No refund was issued by this action."
                : "The time slot has been released.",
        },
      );

      setTargetStatus(null);
      onChanged();
    } catch (error) {
      if (isApiNotImplementedError(error)) {
        toast.info("API integration pending", {
          description:
            "Implement updateAdminAppointmentStatus() in src/lib/api/appointments.ts to change this appointment.",
        });
        setTargetStatus(null);
      } else {
        toast.error("Could not update the appointment", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    } finally {
      setIsUpdating(false);
    }
  }

  if (!canConfirm && !canCancel) {
    return <span className="text-xs text-muted-foreground">No actions</span>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canConfirm && (
        <Button
          size="sm"
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setTargetStatus("confirmed")}
        >
          <CalendarCheck className="size-3.5" aria-hidden="true" />
          Confirm
        </Button>
      )}

      {canCancel && (
        <Button
          variant="destructive"
          size="sm"
          className="rounded-full"
          onClick={() => setTargetStatus("cancelled")}
        >
          <XCircle className="size-3.5" aria-hidden="true" />
          Cancel
        </Button>
      )}

      <ConfirmDialog
        open={Boolean(targetStatus)}
        onOpenChange={(open) => {
          if (!open) setTargetStatus(null);
        }}
        title={
          targetStatus === "confirmed"
            ? "Confirm this appointment?"
            : "Cancel this appointment?"
        }
        description={
          targetStatus === "confirmed" ? (
            <>
              The customer will be able to pay for this appointment. Check the date,
              time and service before confirming.
            </>
          ) : appointment.paymentStatus === "paid" ? (
            <>
              This appointment has already been paid. Cancelling preserves the
              payment and transaction history, and{" "}
              <strong className="text-foreground">no refund is issued</strong> by this
              action.
            </>
          ) : (
            <>
              The time slot will be released and the customer will see the appointment
              as cancelled. This cannot be undone from the dashboard.
            </>
          )
        }
        confirmLabel={
          targetStatus === "confirmed" ? "Yes, confirm" : "Yes, cancel appointment"
        }
        cancelLabel="Go back"
        onConfirm={handleConfirm}
        isLoading={isUpdating}
        destructive={targetStatus === "cancelled"}
      />
    </div>
  );
}
