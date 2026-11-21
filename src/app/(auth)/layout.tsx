import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { CopyrightYear } from "@/components/common/copyright-year";

/**
 * Split-screen layout for sign-in and sign-up.
 * The photography panel is hidden on small screens so the form stays the
 * focus on mobile.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-[1fr_1.05fr]">
      <div className="flex min-h-svh flex-col px-5 py-6 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to site
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <p className="text-center text-[0.68rem] text-muted-foreground">
          © <CopyrightYear /> Stylevique · Salon & Beauty Studio
        </p>
      </div>

      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/images/banners/hero-salon.jpg"
          alt="A serene beauty treatment at Stylevique"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/10 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-12 text-background">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-background/60" />
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-background/70">
              A quiet hour, entirely yours
            </p>
          </div>
          <p className="mt-5 max-w-lg font-heading text-4xl leading-[1.08]">
            “Beauty begins the moment you decide to be yourself.”
          </p>
          <p className="mt-4 text-xs text-background/55">
            — A Stylevique studio note
          </p>
        </div>
      </div>
    </div>
  );
}
