import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

/** Friendly empty state used whenever a list genuinely has no results. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/60 px-6 py-16 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </div>
      )}
      <h3 className="font-section text-2xl font-medium tracking-[0.02em] text-foreground uppercase">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
