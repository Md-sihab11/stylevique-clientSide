import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Search,
  Sparkles,
} from "lucide-react";
import { SALON } from "@/constants/salon";
import { SectionHeading } from "@/components/common/section-heading";
import { PrimaryButton } from "@/components/common/primary-button";
import { FeaturedServices } from "@/features/home/components/featured-services";
import { ServiceCategories } from "@/features/home/components/service-categories";

export const metadata: Metadata = {
  title: "Your Beauty, Your Moment",
  description:
    "Discover Stylevique's hair, skin, makeup and spa services. Browse the menu and request your appointment online.",
};

const STEPS = [
  {
    number: "01",
    title: "Explore the menu",
    description:
      "Browse services by category, compare prices and read what each appointment includes.",
    icon: Search,
  },
  {
    number: "02",
    title: "Choose your moment",
    description:
      "Pick a date and time that fits your day, then send your appointment request to the salon.",
    icon: CalendarDays,
  },
  {
    number: "03",
    title: "Enjoy the experience",
    description:
      "Once the salon confirms, your visit is set. Arrive, exhale and let us take care of the rest.",
    icon: Sparkles,
  },
];

const REASONS = [
  {
    title: "A menu with intention",
    description:
      "Every service is presented with a clear duration, price and description, so there are no surprises.",
  },
  {
    title: "A calmer way to book",
    description:
      "Request a time in a few considered steps and follow your appointment status from your dashboard.",
  },
  {
    title: "Your details, together",
    description:
      "Appointments, payment status and profile details live in one uncluttered space.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------------
          HERO
      ---------------------------------------------------------------- */}
      <section>
        <div className="relative overflow-hidden bg-foreground">
          {/* Full-bleed backdrop with layered gradients so the copy stays
              readable on every crop of the image. */}
          <Image
            src="/images/banners/hero-section.png"
            alt="A warmly lit Stylevique salon with backlit mirrors and leather chairs"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/80 to-foreground/35"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-foreground/45"
            aria-hidden="true"
          />

          <div className="page-width relative flex min-h-[calc(100svh-5.5rem)] flex-col justify-center py-16 lg:min-h-[calc(100svh-6.5rem)] lg:py-20">
            <div className="max-w-2xl">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-secondary/85">
                The art of modern beauty
              </p>

              <h1 className="mt-6 font-display text-[clamp(3.1rem,7vw,6rem)] leading-[0.95] font-medium tracking-[0.01em] text-background uppercase">
                Your beauty,
                <span className="block">Your moment.</span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-background/75 sm:text-[1.05rem]">
                Discover exceptional salon experiences, explore premium hair and
                beauty services, and make time for the best version of yourself.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/services"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-background px-8 text-[0.72rem] font-semibold tracking-[0.18em] text-foreground uppercase transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Explore our services
                </Link>
                <Link
                  href="/services"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-background/40 px-8 text-[0.72rem] font-semibold tracking-[0.18em] text-background uppercase transition-colors hover:border-background/70 hover:bg-background/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Book an appointment
                </Link>
              </div>

              <p className="mt-12 flex flex-wrap items-center gap-x-3 text-[0.75rem] font-semibold tracking-[0.24em] text-background/70 uppercase">
                <span>Style</span>
                <span aria-hidden="true">·</span>
                <span>Beauty</span>
                <span aria-hidden="true">·</span>
                <span>Confidence</span>
              </p>
            </div>
          </div>

          <ChevronDown
            className="absolute bottom-5 left-1/2 size-6 -translate-x-1/2 text-background/70"
            aria-hidden="true"
          />
        </div>
      </section>

      {/* ---------------------------------------------------------------
          FEATURED SERVICES (API-DRIVEN)
      ---------------------------------------------------------------- */}
      <FeaturedServices />

      {/* ---------------------------------------------------------------
          CATEGORIES (API-DRIVEN)
      ---------------------------------------------------------------- */}
      <ServiceCategories />

      {/* ---------------------------------------------------------------
          HOW IT WORKS
      ---------------------------------------------------------------- */}
      <section className="section-space">
        <div className="page-width">
          <SectionHeading
            align="center"
            eyebrow="How it works"
            title="Three simple steps to your appointment."
            description="A clear, calm booking experience from the first look to the final confirmation."
          />

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, index) => (
              <div
                key={step.number}
                className="relative border-t border-border pt-7 md:px-4 md:first:pl-0 md:last:pr-0"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-5xl text-accent/45">{step.number}</span>
                  <step.icon className="size-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="mt-6 font-section text-2xl font-medium tracking-[0.02em] text-foreground uppercase">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>

                {index < STEPS.length - 1 && (
                  <ArrowRight
                    className="absolute -right-6 top-8 hidden size-4 text-border md:block"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          WHY STYLEVIQUE
      ---------------------------------------------------------------- */}
      <section className="section-space bg-foreground text-background">
        <div className="page-width grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[5/6] overflow-hidden rounded-t-[8rem]">
              <Image
                src="/images/banners/auth-salon.jpg"
                alt="A quiet facial treatment room at Stylevique"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-3 hidden rounded-full bg-primary px-6 py-6 text-center text-primary-foreground sm:block">
              <p className="font-heading text-3xl leading-none">Slow</p>
              <p className="mt-1 text-[0.6rem] uppercase tracking-[0.2em]">beauty</p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="eyebrow text-accent">Why Stylevique</p>
            <h2 className="mt-4 font-section text-4xl leading-[1.05] font-medium tracking-[0.02em] uppercase sm:text-5xl">
              Beauty without the rush.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-background/65">
              We believe a salon visit should feel like a pause, not another task.
              Stylevique brings the service menu, appointment details and your
              account into one considered experience.
            </p>

            <div className="mt-9 space-y-6">
              {REASONS.map((reason) => (
                <div key={reason.title} className="flex gap-4 border-t border-background/15 pt-5">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-background/25 text-background/70">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-section text-lg font-medium tracking-[0.03em] text-background uppercase">{reason.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-background/55">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          FINAL CTA
      ---------------------------------------------------------------- */}
      <section className="section-space">
        <div className="page-width">
          <div className="relative overflow-hidden rounded-sm bg-primary px-6 py-16 text-primary-foreground sm:px-12 lg:px-20 lg:py-20">
            <div
              className="absolute -right-24 -top-24 size-72 rounded-full border border-primary-foreground/15"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-32 -left-16 size-80 rounded-full bg-primary-foreground/5"
              aria-hidden="true"
            />

            <div className="relative max-w-3xl">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-primary-foreground/65">
                Your chair is waiting
              </p>
              <h2 className="mt-4 font-section text-4xl leading-[1.02] font-medium tracking-[0.02em] uppercase sm:text-5xl lg:text-6xl">
                Make a little time for yourself.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-primary-foreground/75">
                Browse the full Stylevique menu, find the service that feels right
                and request your preferred appointment time.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton href="/services" variant="light" size="lg">
                  Explore services
                  <ArrowRight className="size-4" aria-hidden="true" />
                </PrimaryButton>
                <PrimaryButton
                  href="/sign-up"
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/35 text-primary-foreground hover:border-primary-foreground/60 hover:bg-primary-foreground/10"
                >
                  Create an account
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A small static detail from the editable salon constants. */}
      <div className="page-width pb-12">
        <p className="text-center text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
          {SALON.name} · {SALON.tagline}
        </p>
      </div>
    </>
  );
}
