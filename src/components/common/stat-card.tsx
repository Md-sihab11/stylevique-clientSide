import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  helper?: string;
  icon: LucideIcon;
  className?: string;
}

/** Dashboard statistic card. Values are passed in from verified API data. */
export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-colors hover:border-accent/50",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
        <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-5 font-heading text-4xl font-medium leading-none text-foreground">
        {value}
      </p>
      {helper && <p className="mt-3 text-xs text-muted-foreground">{helper}</p>}
    </div>
  );
}
