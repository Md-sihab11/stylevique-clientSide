import { Code2 } from "lucide-react";
import { API_PENDING_MESSAGE } from "@/lib/api";

interface PendingIntegrationProps {
  /** Example: "getServices" or "POST /api/appointments" */
  apiName?: string;
  /** Where the request should be written, e.g. "src/lib/api/services.ts" */
  filePath?: string;
  compact?: boolean;
}

/**
 * Honest placeholder for a screen whose API function is intentionally not
 * implemented yet. This is NOT a fake loading or success state.
 */
export function PendingIntegration({
  apiName = "the API request",
  filePath = "src/lib/api",
  compact = false,
}: PendingIntegrationProps) {
  return (
    <div
      className={`rounded-lg border border-accent/30 bg-accent/5 text-left ${
        compact ? "p-5" : "px-6 py-12 sm:px-10"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-foreground">
          <Code2 className="size-4" aria-hidden="true" />
        </div>
        <div>
          <p className="eyebrow">Frontend complete · API pending</p>
          <h3 className="mt-2 text-2xl font-medium text-foreground">
            {compact ? "API integration pending" : "This experience is ready to connect"}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            {API_PENDING_MESSAGE}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span>
              Function: <code className="rounded bg-background px-1.5 py-0.5 text-foreground">{apiName}</code>
            </span>
            <span>
              File: <code className="rounded bg-background px-1.5 py-0.5 text-foreground">{filePath}</code>
            </span>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Read <span className="font-semibold text-foreground">API_INTEGRATION.md</span> for
            the endpoint, request body and expected response. The component does not
            need to be rewritten.
          </p>
        </div>
      </div>
    </div>
  );
}
