/**
 * Small formatting helpers shared across the UI.
 * They are intentionally simple so they are easy to follow and change.
 */

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr${hours > 1 ? "s" : ""}`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

/** Turns "2026-12-10" into a readable date such as "December 10, 2026". */
export function formatDate(dateValue: string | null | undefined) {
  if (!dateValue) return "—";

  const date = new Date(`${dateValue.slice(0, 10)}T12:00:00`);

  if (Number.isNaN(date.getTime())) return dateValue;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/** Used for request dates and transaction timestamps. */
export function formatDateTime(dateValue: string | null | undefined) {
  if (!dateValue) return "—";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return dateValue;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/** "10:00" becomes "10:00 AM" for customer-facing labels. */
export function formatTimeSlot(timeSlot: string) {
  const [hoursValue, minutesValue] = timeSlot.split(":");
  const hours = Number(hoursValue);

  if (Number.isNaN(hours)) return timeSlot;

  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${minutesValue ?? "00"} ${suffix}`;
}

/** "2026-12-10" + "10:00" -> "December 10, 2026 at 10:00 AM" */
export function formatAppointmentDateTime(dateValue: string, timeSlot: string) {
  return `${formatDate(dateValue)} at ${formatTimeSlot(timeSlot)}`;
}

/** Returns today's date as YYYY-MM-DD, useful for the date input minimum. */
export function getTodayInputValue() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/** Safe display name for appointment snapshots and customer records. */
export function getCustomerName(customer: { name?: string } | null | undefined) {
  return customer?.name?.trim() || "Stylevique customer";
}
