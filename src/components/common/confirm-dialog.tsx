"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "./primary-button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  destructive?: boolean;
}

/**
 * Reusable confirmation for cancel, delete, block and status changes.
 * The action is never performed until the user confirms here.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Keep it",
  onConfirm,
  isLoading,
  destructive,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-6 p-6 sm:max-w-md">
        <DialogHeader className="gap-3">
          <DialogTitle className="text-3xl leading-tight">{title}</DialogTitle>
          <DialogDescription className="text-sm leading-6">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mx-0 mb-0 gap-3 rounded-none border-0 bg-transparent p-0 sm:justify-end">
          <Button
            variant="outline"
            className="h-10 rounded-full px-5 text-xs uppercase tracking-[0.14em]"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <PrimaryButton
            size="sm"
            className={destructive ? "bg-destructive hover:bg-destructive/90" : ""}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </PrimaryButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
