"use client";

/* eslint-disable @next/next/no-img-element */
// Service images are URLs supplied by the salon admin, so they can come from
// any image host. A plain <img> avoids having to whitelist every possible host.

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function SafeImage({ src, alt, className, priority }: SafeImageProps) {
  // Remember which URL failed, not just that a failure happened. If the admin
  // pastes a new URL, the image should be allowed to load again.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasFailed = Boolean(src) && failedSrc === src;

  if (!src || hasFailed) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-secondary text-accent",
          className,
        )}
        role="img"
        aria-label={`${alt} placeholder`}
      >
        <ImageIcon className="size-8" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      onError={() => setFailedSrc(src ?? null)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
