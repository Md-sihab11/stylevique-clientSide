"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { PrimaryButton } from "./primary-button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

/**
 * Shown when an implemented API request fails. It never hides the real error
 * behind a fake success message.
 */
export function ErrorState({
  title = "Something went wrong",
  description = "We could not load this information right now. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 px-6 py-14 text-center"
      role="alert"
    >
      <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="size-5" aria-hidden="true" />
      </div>
      <h3 className="text-2xl font-medium text-foreground">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {onRetry && (
        <PrimaryButton
          variant="outline"
          size="sm"
          className="mt-6"
          onClick={onRetry}
        >
          <RefreshCw className="size-3.5" aria-hidden="true" />
          Try again
        </PrimaryButton>
      )}
    </div>
  );
}
