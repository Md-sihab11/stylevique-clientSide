import Link from "next/link";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "dark" | "light" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface PrimaryButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-primary-foreground/20 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_8px_24px_-12px_rgba(141,83,96,0.55)]",
  outline:
    "border border-foreground/20 bg-transparent text-foreground hover:border-foreground/40 hover:bg-foreground/5",
  dark: "border border-on-dark-text/25 bg-on-dark text-on-dark-text hover:bg-on-dark/90",
  light: "border border-foreground/15 bg-background text-foreground hover:bg-background/90",
  ghost: "bg-transparent text-foreground hover:bg-foreground/5",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[0.65rem]",
  md: "h-11 px-6 text-[0.68rem]",
  lg: "h-12 px-8 text-[0.72rem]",
};

/**
 * The main call-to-action button. It can render as a Link when `href` is
 * provided, or as a normal button for forms and dialogs.
 */
export function PrimaryButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className,
  disabled,
  isLoading,
}: PrimaryButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={classes}
    >
      {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
