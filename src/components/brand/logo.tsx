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
 * Stylevique wordmark. Two purpose-made assets live in public/logo/:
 * the cream-backed navbar version and the dark-backed footer version.
 * Neither has transparency, so each is served on the surface it was
 * designed for — their backgrounds already match the page and footer.
 */
export function Logo({
  className,
  imageClassName,
  href = "/",
  invert = false,
}: LogoProps) {
  const image = (
    <Image
      src={invert ? "/logo/footer-logo.png.jpg" : "/logo/navbar-logo.png"}
      alt="Stylevique"
      width={1024}
      height={invert ? 236 : 233}
      priority
      className={cn("h-auto w-[158px] object-contain", imageClassName)}
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
