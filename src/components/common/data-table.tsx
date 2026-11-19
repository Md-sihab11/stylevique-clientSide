import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  caption?: string;
  emptyState?: ReactNode;
  className?: string;
}

/**
 * Generic read-only table used by the admin pages.
 * Column renderers stay inside each page so the table remains easy to read.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  caption,
  emptyState,
  className,
}: DataTableProps<T>) {
  if (rows.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card",
        className,
      )}
    >
      <Table>
        {caption && <caption className="sr-only">{caption}</caption>}
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  "h-11 px-4 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground",
                  column.className,
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={getRowKey(row)} className="align-middle">
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  className={cn("px-4 py-4 text-sm", column.className)}
                >
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
