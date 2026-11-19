/**
 * Only allow internal paths as post-login destinations.
 * This prevents a crafted ?callbackUrl=https://evil.example link from being
 * used as an open redirect.
 */
export function getSafeCallbackUrl(
  value: string | null | undefined,
  fallback = "/dashboard",
) {
  if (!value) return fallback;

  const trimmed = value.trim();

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }

  return trimmed;
}
