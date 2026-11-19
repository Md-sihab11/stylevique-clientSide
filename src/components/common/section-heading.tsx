import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

/** Shared editorial heading used by every public page section. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "center" && "items-center text-center",
        action && "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <div
            className={cn(
              "mb-4 flex items-center gap-3",
              align === "center" && "justify-center",
            )}
          >
            <span className="editorial-rule" />
            <span className="eyebrow">{eyebrow}</span>
            {align === "center" && <span className="editorial-rule" />}
          </div>
        )}

        <h2 className="text-4xl leading-[1.05] font-medium text-foreground sm:text-5xl lg:text-[3.4rem]">
          {title}
        </h2>

        {description && (
          <p className="mt-5 max-w-xl text-[0.98rem] leading-7 text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
