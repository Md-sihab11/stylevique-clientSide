import type { Metadata } from "next";
import {
  ArrowUpRight,
  CalendarCheck,
  Clock3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { SALON } from "@/constants/salon";
import { SectionHeading } from "@/components/common/section-heading";
import { PrimaryButton } from "@/components/common/primary-button";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Find Stylevique's contact details, opening hours and appointment guidance.",
};

const VISIT_NOTES = [
  {
    icon: CalendarCheck,
    title: "Appointment requests",
    description:
      "Requests start as pending. The salon reviews and confirms each time before it is reserved.",
  },
  {
    icon: Clock3,
    title: "Arrive a little early",
    description:
      "Give yourself ten minutes to settle in. If you are running late, contact the salon so the team can help.",
  },
  {
    icon: ShieldCheck,
    title: "Payment after confirmation",
    description:
      "Online payment becomes available once an appointment is confirmed. Nothing is charged when you send a request.",
  },
];

export default function ContactPage() {
  const phoneHref = `tel:${SALON.phone.replace(/[^+\d]/g, "")}`;

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="page-width py-14 sm:py-20">
          <div className="flex items-center gap-3">
            <span className="editorial-rule" />
            <p className="eyebrow">Contact & visits</p>
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[0.94] font-medium tracking-[0.01em] text-foreground uppercase sm:text-6xl lg:text-7xl">
            We would love to see you.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
            Questions about a service, a booking or a visit? Reach the studio
            directly and the team will help you find the right appointment.
          </p>
        </div>
      </section>

      <section className="page-width grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">
        <div>
          <SectionHeading
            eyebrow="Find us"
            title="The studio details."
            description="Call, email or stop by. We are happy to help with service questions and appointment changes."
          />

          <div className="mt-8 space-y-6">
            <div className="flex gap-4 border-t border-border pt-5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Address
                </p>
                <address className="mt-2 not-italic text-sm leading-6 text-foreground">
                  {SALON.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>
            </div>

            <div className="flex gap-4 border-t border-border pt-5">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Phone
                </p>
                <a
                  href={phoneHref}
                  className="mt-2 block text-sm text-foreground underline-offset-4 hover:underline"
                >
                  {SALON.phone}
                </a>
              </div>
            </div>

            <div className="flex gap-4 border-t border-border pt-5">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Email
                </p>
                <a
                  href={`mailto:${SALON.email}`}
                  className="mt-2 block break-all text-sm text-foreground underline-offset-4 hover:underline"
                >
                  {SALON.email}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <PrimaryButton href={`mailto:${SALON.email}`} size="md">
              Email the studio
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </PrimaryButton>
          </div>
        </div>

        <aside className="rounded-lg border border-border bg-card p-6 sm:p-8">
          <p className="eyebrow">Opening hours</p>
          <dl className="mt-6 divide-y divide-border">
            {SALON.openingHours.map((entry) => (
              <div key={entry.days} className="flex items-center justify-between gap-6 py-4">
                <dt className="text-sm text-foreground">{entry.days}</dt>
                <dd className="text-right text-xs text-muted-foreground">{entry.hours}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 rounded-md bg-secondary/60 p-4">
            <p className="text-xs leading-6 text-muted-foreground">
              Appointments are reviewed during opening hours. If you need to change
              a confirmed booking, contact the studio directly.
            </p>
          </div>

          <div className="mt-8">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Follow Stylevique
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {SALON.socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  {social.label}
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="bg-secondary/45">
        <div className="page-width section-space">
          <SectionHeading
            eyebrow="Before your visit"
            title="A few useful things to know."
            align="center"
          />
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {VISIT_NOTES.map((note) => (
              <div key={note.title} className="text-center">
                <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-background text-primary">
                  <note.icon className="size-4" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-section text-xl font-medium tracking-[0.03em] text-foreground uppercase">{note.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                  {note.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
