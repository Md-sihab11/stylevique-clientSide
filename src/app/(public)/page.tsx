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
import { HERO_IMAGE_SRC, SALON } from "@/constants/salon";
import { SectionHeading } from "@/components/common/section-heading";
import { PrimaryButton } from "@/components/common/primary-button";
import { SafeImage } from "@/components/common/safe-image";
import { FeaturedServices } from "@/features/home/components/featured-services";
import { ServiceCategories } from "@/features/home/components/service-categories";
import { ReviewCarousel } from "@/features/reviews/components/review-carousel";

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
    number: "01",
    title: "A menu with intention",
    description:
      "Every service is presented with a clear duration, price and description, so there are no surprises.",
  },
  {
    number: "02",
    title: "A calmer way to book",
    description:
      "Request a time in a few considered steps and follow your appointment status from your dashboard.",
  },
  {
    number: "03",
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
        <div className="relative overflow-hidden bg-on-dark">
          {/* Full-bleed backdrop with layered gradients so the copy stays
              readable on every crop of the image. */}
          <div className="absolute inset-0">
            <SafeImage
              src={HERO_IMAGE_SRC}
              alt="A warmly lit Stylevique salon with backlit mirrors and leather chairs"
              priority
              className="object-center dark:brightness-110"
            />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-r from-on-dark/95 via-on-dark/80 to-on-dark/35 dark:from-on-dark/70 dark:via-on-dark/45 dark:to-on-dark/15"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-on-dark/80 via-on-dark/10 to-on-dark/45 dark:from-on-dark/55 dark:via-on-dark/5 dark:to-on-dark/20"
            aria-hidden="true"
          />

          <div className="page-width relative flex min-h-[calc(100svh-5.5rem)] flex-col justify-center py-16 lg:min-h-[calc(100svh-6.5rem)] lg:py-20">
            <div className="max-w-2xl">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-on-dark-text/85">
                The Art of Modern Style
              </p>

              <h1 className="mt-6 font-display text-[clamp(3.1rem,7vw,6rem)] leading-[0.95] font-medium tracking-[0.01em] text-on-dark-text uppercase">


                Your Style.
                <span className="block">Your moment.</span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-on-dark-text/75 sm:text-[1.05rem]">
                Discover premium hair, beauty, and grooming services. Explore your favorite treatments and book an experience that brings out your best.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/services"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-[#F5F1EA] bg-[#F5F1EA] px-8 text-[0.72rem] font-semibold tracking-[0.18em] text-[#302B2B] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-black hover:bg-black hover:text-white hover:shadow-[0_10px_24px_-10px_rgba(0,0,0,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                Explore Services
                </Link>
                <Link
                  href="/services"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-on-dark-text/50 px-8 text-[0.72rem] font-semibold tracking-[0.18em] text-on-dark-text uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F5F1EA] hover:bg-[#F5F1EA] hover:text-[#302B2B] hover:shadow-[0_10px_24px_-10px_rgba(0,0,0,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Book Appointment
                </Link>
              </div>

              <p className="mt-12 flex flex-wrap items-center gap-x-3 text-[0.75rem] font-semibold tracking-[0.24em] text-on-dark-text/70 uppercase">
                <span>Style</span>
                <span aria-hidden="true">·</span>
                <span>Care</span>
                <span aria-hidden="true">·</span>
                <span>Confidence</span>
              </p>
            </div>
          </div>

          <ChevronDown
            className="absolute bottom-5 left-1/2 size-6 -translate-x-1/2 text-on-dark-text/70"
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
      <section className="section-space relative overflow-hidden bg-on-dark text-on-dark-text">
        {/* A soft, blurred echo of the salon photo keeps the dark panel warm. */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-[0.12] lg:block" aria-hidden="true">
          <Image
            src="/images/banners/hero-salon.jpg"
            alt=""
            fill
            sizes="50vw"
            className="object-cover blur-3xl grayscale"
          />
        </div>

        <div className="page-width relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[5/6] overflow-hidden rounded-t-[9rem]">
              <Image
                src="/images/banners/hero-salon.jpg"
                alt="A quiet, light-filled Stylevique salon"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover grayscale dark:brightness-110"
              />
            </div>
            <div className="absolute -bottom-6 -right-3 hidden size-32 flex-col items-center justify-center rounded-full bg-accent-gold text-center text-on-dark shadow-xl sm:flex">
              <p className="font-heading text-4xl leading-none">Slow</p>
              <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em]">care</p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-3">
              <span className="editorial-rule bg-accent-gold" />
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent-gold">
                Why Stylevique
              </p>
            </div>

            <h2 className="mt-5 font-heading text-4xl leading-[1.05] sm:text-5xl lg:text-[3.6rem]">
              <span className="uppercase">Beauty</span>{" "}
              <em className="font-normal italic">Without</em>
              <br />
              <span className="uppercase">The Rush.</span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-on-dark-text/65">
              We believe a salon visit should feel like a pause, not another task.
              Stylevique brings the service menu, appointment details and your
              account into one considered experience.
            </p>

            <div className="mt-9">
              {REASONS.map((reason) => (
                <div
                  key={reason.title}
                  className="flex gap-4 border-t border-on-dark/15 py-5"
                >
                  <span className="pt-0.5 text-[0.68rem] tabular-nums text-accent-gold">
                    {reason.number}
                  </span>
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-accent-gold/60 text-accent-gold">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-semibold tracking-[0.04em] text-on-dark-text uppercase">
                      {reason.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-on-dark-text/60">
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
          REVIEWS (APPROVED ONLY, API-DRIVEN)
      ---------------------------------------------------------------- */}
      <ReviewCarousel />

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
