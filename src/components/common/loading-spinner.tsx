import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  label?: string;
  className?: string;
}

/** Small accessible loading indicator used by buttons and page sections. */
export function LoadingSpinner({
  label = "Loading",
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 py-10 text-sm text-muted-foreground",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="size-5 animate-spin text-primary" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
