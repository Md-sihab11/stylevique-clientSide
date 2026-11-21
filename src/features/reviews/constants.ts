/**
 * Review vocabulary shared by the form, the carousel and validation hints.
 * These values must match `REVIEW_HIGHLIGHTS` on the server.
 */
export const REVIEW_HIGHLIGHTS = [
  "Calm & Unhurried",
  "Clear Pricing",
  "Attentive Specialist",
  "Clean & Peaceful",
  "Great Results",
  "On Time",
] as const;

export const REVIEW_RATING_MIN = 1;
export const REVIEW_RATING_MAX = 5;
export const REVIEW_NOTE_MAX_LENGTH = 500;

/** End labels from the review card reference. */
export const RATING_SCALE_LABELS = {
  low: "Rushed",
  high: "Calm & Restorative",
} as const;

export function ratingLabel(rating: number) {
  if (rating <= 2) return "Rushed";
  if (rating === 3) return "Mixed";
  if (rating === 4) return "Calm";
  return "Calm & Restorative";
}
