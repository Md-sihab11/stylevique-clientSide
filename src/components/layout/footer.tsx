import Link from "next/link";
import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from "lucide-react";
import { SALON, MAIN_NAV_LINKS } from "@/constants/salon";
import { Logo } from "@/components/brand/logo";
import { CopyrightYear } from "@/components/common/copyright-year";

/**
 * Public footer. Edit salon details in src/constants/salon.ts.
 */
export function Footer() {
  const phoneHref = `tel:${SALON.phone.replace(/[^+\d]/g, "")}`;

  return (
    <footer className="mt-auto bg-on-dark text-on-dark-text">
      {/* Subtle top divider */}
      <div className="h-px w-full bg-on-dark-text/20" aria-hidden="true" />
      
      <div className="page-width py-16 lg:py-20">
        <div className="grid gap-12 border-b border-on-dark/15 pb-14 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo invert />
            <p className="mt-6 text-sm leading-7 text-on-dark-text/65">
              {SALON.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {SALON.socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md px-1 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-on-dark-text/65 transition-all duration-300 hover:-translate-y-0.5 hover:bg-on-dark-text/10 hover:text-on-dark-text"
                >
                  {social.label}
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-section text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-on-dark-text/45">
              Explore
            </h3>
            <nav aria-label="Footer navigation" className="mt-5 flex flex-col gap-3">
              {MAIN_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-block text-sm text-on-dark-text/70 transition-all duration-300 hover:translate-x-1 hover:text-on-dark-text"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/sign-in"
                className="text-sm text-on-dark-text/70 transition-colors hover:text-on-dark-text"
              >
                Sign in
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-section text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-on-dark-text/45">
              Visit us
            </h3>
            <div className="mt-5 space-y-4 text-sm text-on-dark-text/70">
              <p className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-on-dark-text/40" aria-hidden="true" />
                <span>
                  {SALON.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </p>
              <a href={phoneHref} className="flex items-center gap-3 rounded-md p-1 transition-all duration-300 hover:translate-x-1 hover:bg-on-dark-text/10 hover:text-on-dark-text">
                <Phone className="size-4 shrink-0 text-on-dark-text/40" aria-hidden="true" />
                {SALON.phone}
              </a>
              <a
                href={`mailto:${SALON.email}`}
                className="flex items-center gap-3 break-all rounded-md p-1 transition-all duration-300 hover:translate-x-1 hover:bg-on-dark-text/10 hover:text-on-dark-text"
              >
                <Mail className="size-4 shrink-0 text-on-dark-text/40" aria-hidden="true" />
                {SALON.email}
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-section text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-on-dark-text/45">
              Opening hours
            </h3>
            <dl className="mt-5 space-y-3 text-sm">
              {SALON.openingHours.map((entry) => (
                <div key={entry.days} className="flex items-start gap-3 text-on-dark-text/70">
                  <Clock3 className="mt-0.5 size-4 shrink-0 text-on-dark-text/40" aria-hidden="true" />
                  <div>
                    <dt>{entry.days}</dt>
                    <dd className="text-xs text-on-dark-text/45">{entry.hours}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-6 text-[0.7rem] text-on-dark-text/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© <CopyrightYear /> Stylevique. All rights reserved.</p>
          <p>Hair, skin and quiet moments, thoughtfully considered.</p>
        </div>
      </div>
    </footer>
  );
}
