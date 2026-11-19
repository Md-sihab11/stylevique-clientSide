"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarDays, Clock3, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import type { SalonService } from "@/types";
import { createAppointment, isApiNotImplementedError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { TIME_SLOTS } from "@/constants/salon";
import { formatCurrency, formatDuration, formatTimeSlot, getTodayInputValue } from "@/lib/format";
import { FormField } from "@/components/common/form-field";
import { PrimaryButton } from "@/components/common/primary-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/common/skeleton-loader";

const bookingSchema = z.object({
  appointmentDate: z
    .string()
    .min(1, "Choose an appointment date.")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the date picker to choose a date.")
    .refine(
      (value) => value >= getTodayInputValue(),
      "The appointment date cannot be in the past.",
    ),
  timeSlot: z
    .string()
    .refine(
      (value) => TIME_SLOTS.includes(value as (typeof TIME_SLOTS)[number]),
      "Choose an available time slot.",
    ),
  message: z
    .string()
    .max(1000, "Please keep your message under 1000 characters.")
    .optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  service: SalonService;
}

/**
 * Appointment booking form.
 *
 * The form validates first, then calls createAppointment() from src/lib/api.
 * That function is intentionally TODO, so submitting currently shows an
 * honest "integration pending" toast rather than a fake success.
 */
export function BookingForm({ service }: BookingFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [isPendingIntegration, setIsPendingIntegration] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      appointmentDate: "",
      timeSlot: TIME_SLOTS[0],
      message: "",
    },
  });

  if (isPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-11 w-44 rounded-full" />
      </div>
    );
  }

  // Booking requires a signed-in customer account.
  if (!session?.user) {
    return (
      <div>
        <div className="flex items-start gap-3">
          <LockKeyhole className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm leading-6 text-muted-foreground">
            Sign in before choosing a time. You will come straight back to this
            service, and your appointment will live in your dashboard.
          </p>
        </div>
        <PrimaryButton
          href={`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`}
          className="mt-5 w-full"
        >
          Sign in to book
        </PrimaryButton>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          New here?{" "}
          <Link
            href={`/sign-up?callbackUrl=${encodeURIComponent(pathname)}`}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Create a customer account
          </Link>
        </p>
      </div>
    );
  }

  // Admins manage the salon; they cannot create customer appointments.
  if (session.user.role === "admin") {
    return (
      <div className="rounded-md bg-secondary/70 p-4 text-sm leading-6 text-foreground">
        Administrator accounts cannot create customer appointments.
        <Link
          href="/dashboard/admin/appointments"
          className="mt-3 block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary hover:text-primary/80"
        >
          Manage appointments instead
        </Link>
      </div>
    );
  }

  if (session.user.isBlocked) {
    return (
      <p className="rounded-md bg-destructive/10 p-4 text-sm leading-6 text-destructive">
        This account cannot book appointments. Please contact the salon for help.
      </p>
    );
  }

  async function onSubmit(values: BookingFormValues) {
    setIsSubmitting(true);
    setIsPendingIntegration(false);

    try {
      await createAppointment({
        serviceId: service.id,
        appointmentDate: values.appointmentDate,
        timeSlot: values.timeSlot,
        message: values.message?.trim() || undefined,
      });

      toast.success("Appointment request submitted", {
        description: "The salon will review your requested time and confirm it.",
      });
      router.push("/dashboard/customer/appointments");
    } catch (error) {
      if (isApiNotImplementedError(error)) {
        setIsPendingIntegration(true);
        toast.info("API integration pending", {
          description:
            "The booking form is complete. Implement createAppointment() in src/lib/api/appointments.ts to send this request.",
        });
      } else {
        toast.error("Could not submit the appointment", {
          description:
            error instanceof Error
              ? error.message
              : "Please check your connection and try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormField
        label="Appointment date"
        htmlFor="appointmentDate"
        error={errors.appointmentDate?.message}
        required
        hint="Salon timezone"
      >
        <div className="relative">
          <CalendarDays
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="appointmentDate"
            type="date"
            min={getTodayInputValue()}
            className="h-10 bg-background pl-9 text-sm"
            aria-invalid={Boolean(errors.appointmentDate)}
            {...register("appointmentDate")}
          />
        </div>
      </FormField>

      <FormField
        label="Preferred time"
        htmlFor="timeSlot"
        error={errors.timeSlot?.message}
        required
        hint="09:00 – 18:30"
      >
        <div className="relative">
          <Clock3
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <select
            id="timeSlot"
            className="h-10 w-full appearance-none rounded-md border border-input bg-background pl-9 pr-9 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            aria-invalid={Boolean(errors.timeSlot)}
            {...register("timeSlot")}
          >
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {formatTimeSlot(slot)}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            ▾
          </span>
        </div>
      </FormField>

      <FormField
        label="Anything we should know?"
        htmlFor="message"
        error={errors.message?.message}
        hint="Optional"
      >
        <Textarea
          id="message"
          placeholder="Sensitivities, inspiration or a note for your stylist…"
          maxLength={1000}
          rows={3}
          className="min-h-20 bg-background text-sm"
          aria-invalid={Boolean(errors.message)}
          {...register("message")}
        />
      </FormField>

      <div className="rounded-md bg-muted/60 p-3.5 text-xs leading-5 text-muted-foreground">
        <div className="flex justify-between gap-4">
          <span>{service.serviceName}</span>
          <span className="shrink-0 font-semibold text-foreground">
            {formatCurrency(service.price)}
          </span>
        </div>
        <p className="mt-1">Estimated appointment length: {formatDuration(service.duration)}</p>
      </div>

      <p className="text-[0.7rem] leading-5 text-muted-foreground">
        Your request is not confirmed until the salon accepts it. If your chosen
        slot has just been taken, you will be asked to select another time.
      </p>

      <PrimaryButton type="submit" className="w-full" isLoading={isSubmitting}>
        Request appointment
      </PrimaryButton>

      {isPendingIntegration && (
        <p className="rounded-md border border-accent/30 bg-accent/10 p-3 text-xs leading-5 text-foreground">
          Integration pending: implement{" "}
          <code className="font-semibold">createAppointment()</code> in{" "}
          <code className="font-semibold">src/lib/api/appointments.ts</code>. See
          API_INTEGRATION.md for the exact request and response.
        </p>
      )}
    </form>
  );
}
