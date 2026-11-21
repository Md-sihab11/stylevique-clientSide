"use client";

import { useState } from "react";
import { Check, PenLine } from "lucide-react";
import { toast } from "sonner";
import type { Appointment } from "@/features/appointments/types";
import type { Review } from "@/features/reviews/types";
import {
  createReview,
  updateReview,
} from "@/features/reviews/api";
import {
  REVIEW_HIGHLIGHTS,
  REVIEW_NOTE_MAX_LENGTH,
  RATING_SCALE_LABELS,
} from "@/features/reviews/constants";
import { getApiErrorMessage, isApiError } from "@/lib/api";
import { formatAppointmentDateTime } from "@/lib/format";
import { SafeImage } from "@/components/common/safe-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  appointment: Appointment;
  /** Present when a rejected review is being edited and resubmitted. */
  existing?: Review | null;
  onSubmitted: () => void;
}

/**
 * Customer review form.
 * The appointment and its completion are validated again on the server; this
 * component only shapes the request and reports the backend's response.
 */
export function ReviewForm({ appointment, existing, onSubmitted }: ReviewFormProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [highlights, setHighlights] = useState<string[]>(existing?.highlights ?? []);
  const [note, setNote] = useState(existing?.note ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceName = appointment.serviceSnapshot?.serviceName ?? "Salon service";

  function toggleHighlight(value: string) {
    setHighlights((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value].slice(0, 4),
    );
  }

  async function handleSubmit() {
    if (isSubmitting) return;

    if (rating < 1 || rating > 5) {
      toast.error("Choose a rating from 1 to 5.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (existing) {
        await updateReview(existing.id, { rating, highlights, note: note.trim() });
        toast.success("Review resubmitted", {
          description: "Our team will review it again shortly.",
        });
      } else {
        await createReview({
          appointmentId: appointment.id,
          rating,
          highlights,
          note: note.trim(),
        });
        toast.success("Review submitted", {
          description: "Thank you — it will appear once our team approves it.",
        });
      }

      setOpen(false);
      onSubmitted();
    } catch (error) {
      const isConflict = isApiError(error) && error.isConflict;
      toast.error(
        isConflict ? "This visit has already been reviewed" : "Could not submit your review",
        { description: getApiErrorMessage(error) },
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        variant={existing ? "outline" : "default"}
        size="sm"
        className="rounded-full"
      >
        <PenLine className="size-3.5" aria-hidden="true" />
        {existing ? "Edit review" : "Leave a review"}
      </Button>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{existing ? "Edit your review" : "How was your ritual?"}</DialogTitle>
          <DialogDescription>
            {serviceName} · {formatAppointmentDateTime(
              appointment.appointmentDate,
              appointment.timeSlot,
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex items-center gap-3 rounded-lg bg-secondary/60 p-3">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-secondary">
            <SafeImage src={appointment.serviceSnapshot?.image} alt={serviceName} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{serviceName}</p>
            <p className="text-xs text-muted-foreground">Completed visit</p>
          </div>
          <span className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-full bg-[#6b8a63]/15 text-[#4f6e4d]">
            <Check className="size-3.5" aria-hidden="true" />
          </span>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-foreground">How was your ritual?</p>
          <div className="mt-2 flex items-center justify-between text-[0.65rem] text-muted-foreground">
            <span>{RATING_SCALE_LABELS.low}</span>
            <span>{RATING_SCALE_LABELS.high}</span>
          </div>
          <div className="mt-3 flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                aria-label={`Rate ${value} out of 5`}
                aria-pressed={rating === value}
                className={cn(
                  "flex size-11 items-center justify-center rounded-full border text-sm font-semibold transition-all sm:size-12",
                  rating === value
                    ? "border-[#c2a678] bg-[#b49162] text-white shadow-md"
                    : "border-[#d8cbb9] bg-card text-muted-foreground hover:border-[#c2a678] hover:text-foreground",
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-foreground">Quick highlights (optional)</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {REVIEW_HIGHLIGHTS.map((highlight) => {
              const active = highlights.includes(highlight);
              return (
                <button
                  key={highlight}
                  type="button"
                  onClick={() => toggleHighlight(highlight)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition-colors",
                    active
                      ? "border-[#c2a678] bg-[#b49162] text-white"
                      : "border-border bg-card text-muted-foreground hover:border-[#c2a678] hover:text-foreground",
                  )}
                >
                  {highlight}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <label
            htmlFor="review-note"
            className="text-sm font-medium text-foreground"
          >
            Share a quiet note about your visit
          </label>
          <textarea
            id="review-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={REVIEW_NOTE_MAX_LENGTH}
            rows={4}
            placeholder="Share a quiet note about your visit..."
            className="mt-2 w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
          <p className="mt-1 text-right text-[0.65rem] text-muted-foreground">
            {note.length}/{REVIEW_NOTE_MAX_LENGTH}
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="mt-6 h-11 w-full rounded-md bg-[#b49162] text-sm font-semibold text-white hover:bg-[#9d7a51]"
        >
          {isSubmitting ? "Submitting…" : existing ? "Resubmit review" : "Submit review"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
