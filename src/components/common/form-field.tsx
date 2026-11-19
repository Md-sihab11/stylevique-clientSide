import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * A consistent label + input + message wrapper.
 * The input itself is passed as children so the same field works for inputs,
 * textareas, selects and custom controls.
 */
export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={htmlFor} className="text-xs font-medium tracking-wide text-foreground">
          {label}
          {required && <span className="text-primary">*</span>}
        </Label>
        {hint && <span className="text-[0.7rem] text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
