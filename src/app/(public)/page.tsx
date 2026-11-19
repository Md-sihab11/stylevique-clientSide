import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Heart,
  Search,
  Sparkles,
} from "lucide-react";
import { FEATURED_CATEGORIES, SALON } from "@/constants/salon";
import { SectionHeading } from "@/components/common/section-heading";
import { PrimaryButton } from "@/components/common/primary-button";
import { FeaturedServices } from "@/components/home/featured-services";

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
      <section className="relative overflow-hidden">
        <div className="page-width grid items-center gap-10 py-10 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-14">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-7 flex items-center gap-3">
              <span className="editorial-rule" />
              <p className="eyebrow">Salon & Beauty Studio</p>
            </div>

            <h1 className="text-[clamp(3.6rem,8.5vw,7.1rem)] leading-[0.88] font-medium tracking-[-0.03em] text-foreground">
              Your beauty,
              <span className="mt-1 block italic text-primary">your moment.</span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground sm:text-[1.05rem]">
              Discover exceptional salon experiences and make time for yourself.
              Thoughtful hair, skin and beauty rituals in a space designed to slow
              the world down.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/services" size="lg">
                Explore services
                <ArrowRight className="size-4" aria-hidden="true" />
              </PrimaryButton>
              <PrimaryButton href="/contact" variant="outline" size="lg">
                Visit the studio
              </PrimaryButton>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              <span>Hair</span>
              <span className="size-1 rounded-full bg-accent" aria-hidden="true" />
              <span>Skin</span>
              <span className="size-1 rounded-full bg-accent" aria-hidden="true" />
              <span>Makeup</span>
              <span className="size-1 rounded-full bg-accent" aria-hidden="true" />
              <span>Nails</span>
              <span className="size-1 rounded-full bg-accent" aria-hidden="true" />
              <span>Spa</span>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[10rem] bg-secondary sm:aspect-[5/5.4] lg:aspect-[4/5]">
              <Image
                src="/images/banners/hero-salon.jpg"
                alt="A calm, light-filled Stylevique salon interior"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-7 left-4 right-4 rounded-lg border border-background/30 bg-background/95 p-5 shadow-[0_20px_60px_-30px_rgba(48,43,43,0.45)] backdrop-blur-sm sm:left-8 sm:right-auto sm:max-w-xs">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary">
                  <Heart className="size-4" aria-hidden="true" />
                </span>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  The Stylevique standard
                </p>
              </div>
              <p className="mt-3 font-heading text-xl leading-snug text-foreground">
                Unhurried appointments. Genuine attention. A little room to breathe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          FEATURED SERVICES (API-DRIVEN)
      ---------------------------------------------------------------- */}
      <FeaturedServices />

      {/* ---------------------------------------------------------------
          CATEGORIES
      ---------------------------------------------------------------- */}
      <section className="section-space bg-secondary/45">
        <div className="page-width">
          <SectionHeading
            eyebrow="Find your ritual"
            title="A service for every version of you."
            description="Start with the area you would like to focus on. Each category opens a filtered view of the salon menu."
            action={
              <PrimaryButton href="/services" variant="outline" size="sm">
                Browse everything
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </PrimaryButton>
            }
          />

          <div className="mt-12 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_CATEGORIES.map((category) => (
              <Link
                key={category.name}
                href={`/services?category=${encodeURIComponent(category.name)}`}
                className="group flex items-start justify-between gap-6 border-t border-foreground/15 py-6 transition-colors hover:border-primary/60"
              >
                <div className="flex gap-5">
                  <span className="pt-0.5 text-xs tabular-nums text-muted-foreground/70">
                    {category.number}
                  </span>
                  <div>
                    <h3 className="text-[1.55rem] leading-tight font-medium text-foreground transition-colors group-hover:text-primary">
                      {category.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{category.blurb}</p>
                  </div>
                </div>
                <ArrowUpRight
                  className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                  aria-hidden="true"
                />
              </Link>
            ))}

            <Link
              href="/services"
              className="group flex items-start justify-between gap-6 border-t border-foreground/15 py-6 transition-colors hover:border-primary/60"
            >
              <div className="flex gap-5">
                <span className="pt-0.5 text-xs tabular-nums text-muted-foreground/70">08</span>
                <div>
                  <h3 className="text-[1.55rem] leading-tight font-medium text-foreground transition-colors group-hover:text-primary">
                    See the full menu
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Search, filter and compare every service.
                  </p>
                </div>
              </div>
              <ArrowUpRight
                className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>

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
                <h3 className="mt-6 text-2xl font-medium text-foreground">{step.title}</h3>
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
            <h2 className="mt-4 text-4xl leading-[1.05] font-medium sm:text-5xl">
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
                    <h3 className="text-lg font-medium text-background">{reason.title}</h3>
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
              <h2 className="mt-4 text-4xl leading-[1.02] font-medium sm:text-5xl lg:text-6xl">
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
