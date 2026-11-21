import type { Transaction } from "@/features/transactions/types";
import { formatDate, formatTimeSlot } from "@/lib/format";

/**
 * The appointment summary attached to a transaction. Stripe can outlive an
 * appointment snapshot, so the fallback keeps old records readable.
 */
export function TransactionService({ transaction }: { transaction: Transaction }) {
  const appointment = transaction.appointment;

  if (!appointment) {
    return (
      <span className="text-xs text-muted-foreground">Appointment unavailable</span>
    );
  }

  return (
    <div className="min-w-0">
      <p className="truncate text-sm text-foreground">
        {appointment.serviceSnapshot?.serviceName ?? "Salon service"}
      </p>
      <p className="mt-0.5 text-[0.68rem] text-muted-foreground">
        {formatDate(appointment.appointmentDate)} · {formatTimeSlot(appointment.timeSlot)}
      </p>
    </div>
  );
}

/** Stripe session IDs are long; show a short, copyable reference in tables. */
export function formatStripeReference(sessionId: string) {
  if (!sessionId) return "—";

  return sessionId.length > 22
    ? `${sessionId.slice(0, 18)}…${sessionId.slice(-3)}`
    : sessionId;
}
