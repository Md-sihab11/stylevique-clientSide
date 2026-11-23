"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ImageIcon, LockKeyhole, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import { getSafeCallbackUrl } from "@/lib/navigation";
import { FormField } from "@/components/common/form-field";
import { PrimaryButton } from "@/components/common/primary-button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "./google-icon";
import { cn } from "@/lib/utils";

const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Enter your full name.")
      .max(100, "Name must be 100 characters or fewer."),
    email: z.string().trim().min(1, "Enter your email.").email("Enter a valid email."),
    password: z
      .string()
      .min(6, "Use at least 6 characters.")
      .regex(/[A-Z]/, "Include at least one uppercase letter.")
      .regex(/[a-z]/, "Include at least one lowercase letter."),
    confirmPassword: z.string().min(1, "Repeat your password."),
    profileImage: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) => !value || /^https?:\/\/.+/i.test(value),
        "Enter a valid image URL that starts with http:// or https://.",
      ),
    acceptedTerms: z.literal(true, {
      error: "Please accept the booking terms to continue.",
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type SignUpValues = z.infer<typeof signUpSchema>;

const passwordChecks = [
  { label: "At least 6 characters", test: (value: string) => value.length >= 6 },
  { label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
];

/** Customer registration form using Better Auth. */
export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"), "/");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      profileImage: "",
      acceptedTerms: undefined,
    },
  });

  const passwordValue = useWatch({ control, name: "password" }) ?? "";

  async function onSubmit(values: SignUpValues) {
    const result = await authClient.signUp.email({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      image: values.profileImage?.trim() || undefined,
    });

    if (result.error) {
      toast.error("Could not create your account", {
        description:
          result.error.message ?? "Please check your details and try again.",
      });
      return;
    }

    toast.success("Your Stylevique account is ready.", {
      description: "Sign in to explore services and book your first appointment.",
    });
    router.push("/sign-in");
    router.refresh();
  }

  async function handleGoogleSignUp() {
    setIsGoogleLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });

      if (result.error) {
        toast.error("Google sign-up failed", {
          description: result.error.message ?? "Please try again.",
        });
      }
    } catch (error) {
      toast.error("Google sign-up failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="editorial-rule" />
        <p className="eyebrow">Join the studio</p>
      </div>
      <h1 className="mt-4 font-display text-4xl leading-none font-medium tracking-[0.01em] text-foreground uppercase sm:text-5xl">
        Create your account.
      </h1>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        Every new account is a customer account. Appointment requests, payment
        status and your profile stay together.
      </p>

      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={isGoogleLoading}
        className="mt-7 flex h-11 w-full items-center justify-center gap-3 rounded-full border border-border bg-card text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-muted disabled:opacity-50"
      >
        {isGoogleLoading ? (
          <span className="size-4 animate-spin rounded-full border-2 border-foreground/25 border-t-foreground" />
        ) : (
          <GoogleIcon className="size-4" />
        )}
        Continue with Google
      </button>

      <div className="my-5 flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
          or create with email
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Full name" htmlFor="signup-name" error={errors.name?.message} required>
          <div className="relative">
            <UserRound
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="signup-name"
              autoComplete="name"
              placeholder="Your full name"
              className="h-11 bg-card pl-9 text-sm"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
          </div>
        </FormField>

        <FormField label="Email" htmlFor="signup-email" error={errors.email?.message} required>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="h-11 bg-card pl-9 text-sm"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </div>
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Password"
            htmlFor="signup-password"
            error={errors.password?.message}
            required
          >
            <div className="relative">
              <LockKeyhole
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a password"
                className="h-11 bg-card pl-9 pr-10 text-sm"
                aria-invalid={Boolean(errors.password)}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </FormField>

          <FormField
            label="Confirm password"
            htmlFor="signup-confirm-password"
            error={errors.confirmPassword?.message}
            required
          >
            <div className="relative">
              <LockKeyhole
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="signup-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat password"
                className="h-11 bg-card pl-9 pr-10 text-sm"
                aria-invalid={Boolean(errors.confirmPassword)}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </FormField>
        </div>

        <ul className="grid gap-1.5 sm:grid-cols-3" aria-label="Password requirements">
          {passwordChecks.map((check) => {
            const isMet = check.test(passwordValue);
            return (
              <li
                key={check.label}
                className={cn(
                  "flex items-center gap-1.5 text-[0.65rem]",
                  isMet
                    ? "text-[#456345] dark:text-[#a8d0a6]"
                    : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    isMet ? "bg-[#6b8a63]" : "bg-border",
                  )}
                  aria-hidden="true"
                />
                {check.label}
              </li>
            );
          })}
        </ul>

        <FormField
          label="Profile image URL"
          htmlFor="signup-image"
          error={errors.profileImage?.message}
          hint="Optional"
        >
          <div className="relative">
            <ImageIcon
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="signup-image"
              type="url"
              placeholder="https://…"
              className="h-11 bg-card pl-9 text-sm"
              aria-invalid={Boolean(errors.profileImage)}
              {...register("profileImage")}
            />
          </div>
        </FormField>

        <div>
          <label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground">
            <input
              type="checkbox"
              className="mt-0.5 size-4 rounded-sm border-border accent-primary"
              {...register("acceptedTerms")}
            />
            <span>
              I agree to the salon&apos;s booking terms: appointment requests are
              pending until the salon confirms them, and customers may cancel only
              pending appointments.
            </span>
          </label>
          {errors.acceptedTerms?.message && (
            <p className="mt-1.5 text-xs text-destructive" role="alert">
              {errors.acceptedTerms.message}
            </p>
          )}
        </div>

        <PrimaryButton type="submit" className="mt-2 w-full" isLoading={isSubmitting}>
          Create account
        </PrimaryButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
