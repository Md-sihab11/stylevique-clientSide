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
 * Stylevique wordmark with a theme-aware asset:
 * - light mode: navbar.png blended into cream surfaces
 * - dark mode / footer: image.png (dark, gold artwork) blended with screen.
 *   The source has wide empty padding, so a clipped wrapper frames the mark.
 */
export function Logo({
  className,
  imageClassName,
  href = "/",
  invert = false,
}: LogoProps) {
  const content = (
    <>
      <Image
        src="/logo/navbar.png"
        alt="Stylevique"
        width={1019}
        height={274}
        priority
        className={cn(
          "h-auto w-[158px] object-contain mix-blend-multiply",
          invert ? "hidden" : "dark:hidden",
          imageClassName,
        )}
      />
      <span
        className={cn(
          "relative block h-10 w-[158px] overflow-hidden",
          invert ? "block" : "hidden dark:block",
        )}
      >
        <Image
          src="/logo/image.png"
          alt="Stylevique"
          width={2172}
          height={724}
          priority
          className={cn(
            "absolute left-1/2 top-1/2 w-[280px] max-w-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen",
            imageClassName,
          )}
        />
      </span>
    </>
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
