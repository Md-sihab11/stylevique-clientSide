import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Heart, Leaf, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { PrimaryButton } from "@/components/common/primary-button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Stylevique's approach to thoughtful, unhurried salon care in a warm and considered studio.",
};

const VALUES = [
  {
    icon: Heart,
    title: "Care comes first",
    description:
      "A good appointment starts with listening. We keep the experience personal, calm and focused on what you need from your visit.",
  },
  {
    icon: Leaf,
    title: "Considered, not complicated",
    description:
      "Clear service descriptions, straightforward prices and a simple booking flow. No noise, no guesswork.",
  },
  {
    icon: Sparkles,
    title: "Beauty with intention",
    description:
      "From a polished finish to a quiet treatment room, every detail is designed to help you feel more like yourself.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="page-width grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="editorial-rule" />
              <p className="eyebrow">Our story</p>
            </div>
            <h1 className="mt-5 max-w-2xl font-display text-5xl leading-[0.92] font-medium tracking-[0.01em] text-foreground uppercase sm:text-6xl lg:text-7xl">
              A studio for the way you want to feel.
            </h1>
          </div>
          <p className="max-w-md text-sm leading-7 text-muted-foreground lg:justify-self-end">
            Stylevique is a salon and beauty studio built around a simple idea:
            looking after yourself should feel considered, not rushed. We bring
            hair, skin, makeup and spa services together in one warm, uncluttered
            space.
          </p>
        </div>
      </section>

      <section className="page-width grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:gap-20 lg:py-24">
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-[9rem]">
          <Image
            src="/images/banners/hero-salon.jpg"
            alt="A warm, quiet treatment space at Stylevique"
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="eyebrow">The approach</p>
          <h2 className="mt-4 font-section text-4xl leading-[1.05] font-medium tracking-[0.02em] text-foreground uppercase sm:text-5xl">
            Room to slow down, space to feel seen.
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
            <p>
              A salon visit is more than a list of services. It is an hour you
              have chosen to give yourself. Our role is to make that time feel
              easy — from the moment you browse the menu to the moment you leave
              the chair.
            </p>
            <p>
              That is why every service includes a clear duration and price, why
              appointment status is visible in your account, and why booking is
              designed to take only a few steps.
            </p>
          </div>

          <PrimaryButton href="/services" className="mt-8">
            Explore the menu
            <ArrowRight className="size-4" aria-hidden="true" />
          </PrimaryButton>
        </div>
      </section>

      <section className="section-space bg-foreground text-background">
        <div className="page-width">
          <SectionHeading
            eyebrow="What we value"
            title="The details that shape the experience."
            description="No invented awards or promises — just the principles that guide the studio."
          />

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {VALUES.map((value) => (
              <div key={value.title} className="border-t border-background/20 pt-6">
                <value.icon className="size-5 text-accent" aria-hidden="true" />
                <h3 className="mt-5 font-section text-2xl font-medium tracking-[0.02em] text-background uppercase">{value.title}</h3>
                <p className="mt-3 text-sm leading-6 text-background/55">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-width text-center">
          <p className="eyebrow">Come say hello</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-section text-4xl leading-[1.05] font-medium tracking-[0.02em] text-foreground uppercase sm:text-5xl">
            Your next moment is a few steps away.
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryButton href="/services">Browse services</PrimaryButton>
            <PrimaryButton href="/contact" variant="outline">
              Contact the studio
            </PrimaryButton>
          </div>
        </div>
      </section>
    </>
  );
}
