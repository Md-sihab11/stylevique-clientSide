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
 * - light mode: navbar.png (white backdrop) blended with multiply
 * - dark mode: the dark-backed footer asset blended with screen, so only the
 *   tan/red artwork stays visible on charcoal surfaces
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
      <Image
        src="/logo/footer-logo.png.jpg"
        alt="Stylevique"
        width={1024}
        height={236}
        priority
        className={cn(
          "h-auto w-[158px] object-contain mix-blend-screen",
          invert ? "block" : "hidden dark:block",
          imageClassName,
        )}
      />
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
