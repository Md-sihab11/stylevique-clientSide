"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Pagination } from "@/types";

interface PaginationControlsProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  className?: string;
}

/** Simple, accessible pagination controls for API-backed lists. */
export function PaginationControls({
  pagination,
  onPageChange,
  className,
}: PaginationControlsProps) {
  const { page, totalPages, hasPreviousPage, hasNextPage } = pagination;

  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 ${className ?? ""}`}>
      <p className="text-xs text-muted-foreground">
        Page {page} of {Math.max(totalPages, 1)} · {pagination.totalItems} total
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPreviousPage}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
        >
          Next
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
