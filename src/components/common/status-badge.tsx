import { cn } from "@/lib/utils";

type BadgeStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "paid"
  | "unpaid"
  | "failed"
  | "active"
  | "inactive"
  | "blocked"
  | string;

const toneClasses: Record<string, string> = {
  pending:
    "border-[#d9c39a] bg-[#f6eddc] text-[#7c5c28] dark:border-[#7c5c28] dark:bg-[#3a2c12] dark:text-[#e6c98a]",
  confirmed:
    "border-[#b7ccb9] bg-[#eef4ec] text-[#456345] dark:border-[#4f6e4d] dark:bg-[#1e3220] dark:text-[#a8d0a6]",
  cancelled:
    "border-[#e2c1c6] bg-[#f8ecee] text-primary dark:border-[#8d5360] dark:bg-[#3a2226] dark:text-[#e5aeb8]",
  paid: "border-[#b7ccb9] bg-[#eef4ec] text-[#456345] dark:border-[#4f6e4d] dark:bg-[#1e3220] dark:text-[#a8d0a6]",
  unpaid: "border-border bg-muted text-muted-foreground",
  failed:
    "border-destructive/25 bg-destructive/10 text-destructive dark:border-destructive/40 dark:text-[#ff9b93]",
  active:
    "border-[#b7ccb9] bg-[#eef4ec] text-[#456345] dark:border-[#4f6e4d] dark:bg-[#1e3220] dark:text-[#a8d0a6]",
  inactive: "border-border bg-muted text-muted-foreground",
  blocked: "border-destructive/25 bg-destructive/10 text-destructive",
};

const readableLabels: Record<string, string> = {
  paid: "Paid",
  unpaid: "Unpaid",
  failed: "Failed",
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  active: "Active",
  inactive: "Inactive",
  blocked: "Blocked",
};

interface StatusBadgeProps {
  status: BadgeStatus;
  label?: string;
  className?: string;
}

/** Warm, readable status pill used in dashboards and appointment cards. */
export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  const text = label ?? readableLabels[normalized] ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.13em]",
        toneClasses[normalized] ?? "border-border bg-muted text-muted-foreground",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {text}
    </span>
  );
}
