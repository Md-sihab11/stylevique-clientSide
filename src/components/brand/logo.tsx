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
 * Stylevique wordmark. Two assets live in public/logo/: navbar.png for light
 * surfaces (public navbar and dashboard sidebar) and the dark footer version.
 * The light asset has a white backdrop, so mix-blend-multiply makes it sit
 * cleanly on the cream surfaces without a visible box.
 */
export function Logo({
  className,
  imageClassName,
  href = "/",
  invert = false,
}: LogoProps) {
  const image = (
    <Image
      src={invert ? "/logo/footer-logo.png.jpg" : "/logo/navbar.png"}
      alt="Stylevique"
      width={1019}
      height={invert ? 236 : 274}
      priority
      className={cn(
        "h-auto w-[158px] object-contain",
        // The light logo has a white backdrop; multiply blends it into the
        // cream navbar and dashboard sidebar so it never shows a white box.
        !invert && "mix-blend-multiply",
        imageClassName,
      )}
    />
  );

  const content = image;

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
