"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { SALON } from "@/constants/salon";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "How can I book an appointment?",
    answer:
      "Browse the service menu, open the treatment you like and choose a date and time. You will be asked to sign in first — once your request is sent, the salon confirms it and the status appears in your dashboard.",
  },
  {
    question: "Can I cancel my appointment?",
    answer:
      "Yes. While your request is still pending, you can cancel it from My Appointments in your dashboard. Once it has been confirmed, please contact the salon directly to make a change.",
  },
  {
    question: "When can I make a payment?",
    answer:
      "Payment becomes available after the salon confirms your appointment. Open it in your dashboard and choose Pay now to continue to secure Stripe Checkout. We only mark it paid once Stripe verifies the payment.",
  },
  {
    question: "Can I reschedule my booking?",
    answer:
      "There is no direct reschedule option yet. Cancel a pending request and send a new one with your preferred time, or message the salon if the appointment is already confirmed.",
  },
  {
    question: "How can I view my booking history?",
    answer:
      "Sign in and open My Appointments from your dashboard. Every request, its current status and its payment state are listed there.",
  },
  {
    question: "How do I contact Stylevique?",
    answer: `Visit our Contact page, email ${SALON.email} or call ${SALON.phone}. We are happy to help with service questions and appointment changes.`,
  },
] as const;

/** Minimal FAQ accordion with smooth expand/collapse and subtle dividers. */
export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-space border-t border-border bg-background">
      <div className="page-width">
        <SectionHeading
          align="center"
          eyebrow="Good to know"
          title="Questions, answered."
          description="A few things guests ask us most often. If something is still unclear, we are only a message away."
        />

        <div className="mx-auto mt-12 max-w-3xl border-t border-border">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.question} className="border-b border-border">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span
                    className={cn(
                      "font-heading text-xl leading-snug transition-colors sm:text-2xl",
                      isOpen ? "text-primary" : "text-foreground",
                    )}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                      isOpen
                        ? "rotate-45 border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    <Plus className="size-4" aria-hidden="true" />
                  </span>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-6 pr-12 text-sm leading-7 text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
