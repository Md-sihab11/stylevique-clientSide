import Link from "next/link";
import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from "lucide-react";
import { SALON, MAIN_NAV_LINKS } from "@/constants/salon";
import { Logo } from "@/components/brand/logo";
import { CopyrightYear } from "@/components/common/copyright-year";

/**
 * Public footer. Edit salon details in src/constants/salon.ts.
 * The phone, address and social URLs there are placeholders, not real data.
 */
export function Footer() {
  const phoneHref = `tel:${SALON.phone.replace(/[^+\d]/g, "")}`;

  return (
    <footer className="mt-auto bg-foreground text-background">
      <div className="page-width py-16 lg:py-20">
        <div className="grid gap-12 border-b border-background/15 pb-14 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo invert />
            <p className="mt-6 text-sm leading-7 text-background/65">
              {SALON.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {SALON.socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-background/65 transition-colors hover:text-background"
                >
                  {social.label}
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-section text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-background/45">
              Explore
            </h3>
            <nav aria-label="Footer navigation" className="mt-5 flex flex-col gap-3">
              {MAIN_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-background/70 transition-colors hover:text-background"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/sign-in"
                className="text-sm text-background/70 transition-colors hover:text-background"
              >
                Sign in
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-section text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-background/45">
              Visit us
            </h3>
            <div className="mt-5 space-y-4 text-sm text-background/70">
              <p className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-background/40" aria-hidden="true" />
                <span>
                  {SALON.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </p>
              <a href={phoneHref} className="flex items-center gap-3 transition-colors hover:text-background">
                <Phone className="size-4 shrink-0 text-background/40" aria-hidden="true" />
                {SALON.phone}
              </a>
              <a
                href={`mailto:${SALON.email}`}
                className="flex items-center gap-3 break-all transition-colors hover:text-background"
              >
                <Mail className="size-4 shrink-0 text-background/40" aria-hidden="true" />
                {SALON.email}
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-section text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-background/45">
              Opening hours
            </h3>
            <dl className="mt-5 space-y-3 text-sm">
              {SALON.openingHours.map((entry) => (
                <div key={entry.days} className="flex items-start gap-3 text-background/70">
                  <Clock3 className="mt-0.5 size-4 shrink-0 text-background/40" aria-hidden="true" />
                  <div>
                    <dt>{entry.days}</dt>
                    <dd className="text-xs text-background/45">{entry.hours}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-6 text-[0.7rem] text-background/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© <CopyrightYear /> Stylevique. All rights reserved.</p>
          <p>Salon details are editable placeholders in src/constants/salon.ts.</p>
        </div>
      </div>
    </footer>
  );
}
