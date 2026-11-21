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
 * - dark mode / footer: darkmode-transparent.png, created from darkmode.png
 *   with its #1A1917 background removed so it sits on any surface cleanly.
 * Both assets share the same 158x40 footprint for consistent placement.
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
          "h-10 w-[158px] object-contain mix-blend-multiply",
          invert ? "hidden" : "dark:hidden",
          imageClassName,
        )}
      />
      <Image
        src="/logo/darkmode-transparent.png"
        alt="Stylevique"
        width={1024}
        height={235}
        priority
        className={cn(
          "h-10 w-[158px] object-contain",
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
