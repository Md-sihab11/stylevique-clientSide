import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  href?: string | null;
  invert?: boolean;
}

/**
 * Stylevique wordmark. The source image is public/logo.png (600 x 108).
 * The PNG has no transparency, so `invert` places the wordmark on a small
 * ivory plate instead of filtering the whole rectangle to white.
 */
export function Logo({
  className,
  imageClassName,
  href = "/",
  invert = false,
}: LogoProps) {
  const image = (
    <Image
      src="/logo.png"
      alt="Stylevique"
      width={600}
      height={108}
      priority
      className={cn(
        "h-auto w-[158px] object-contain mix-blend-multiply",
        imageClassName,
      )}
    />
  );

  const content = invert ? (
    <span className="inline-flex w-fit rounded-md bg-white px-3 py-2">
      {image}
    </span>
  ) : (
    image
  );

  if (!href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link
      href={href}
      aria-label="Stylevique home"
      className={cn("inline-flex items-center", className)}
    >
      {content}
    </Link>
  );
}
