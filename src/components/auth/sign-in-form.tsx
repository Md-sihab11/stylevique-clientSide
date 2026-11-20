"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import { getSafeCallbackUrl } from "@/lib/navigation";
import { FormField } from "@/components/common/form-field";
import { PrimaryButton } from "@/components/common/primary-button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "./google-icon";

const signInSchema = z.object({
  email: z.string().trim().min(1, "Enter your email.").email("Enter a valid email."),
  password: z.string().min(1, "Enter your password."),
});

type SignInValues = z.infer<typeof signInSchema>;

/** Sign-in form using the existing Better Auth client. */
export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));
  const { data: session } = useSession();

  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  // A signed-in visitor should not stay on the sign-in screen.
  useEffect(() => {
    if (session?.user) {
      router.replace(callbackUrl);
    }
  }, [session, router, callbackUrl]);

  async function onSubmit(values: SignInValues) {
    const result = await authClient.signIn.email({
      email: values.email.trim(),
      password: values.password,
    });

    if (result.error) {
      toast.error("Could not sign in", {
        description:
          result.error.message ?? "Check your email and password and try again.",
      });
      return;
    }

    toast.success("Welcome back.");
    router.push(callbackUrl);
    router.refresh();
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });

      if (result.error) {
        toast.error("Google sign-in failed", {
          description: result.error.message ?? "Please try again.",
        });
      }
    } catch (error) {
      toast.error("Google sign-in failed", {
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
        <p className="eyebrow">Welcome back</p>
      </div>
      <h1 className="mt-4 font-display text-4xl leading-none font-medium tracking-[0.01em] text-foreground uppercase sm:text-5xl">
        Sign in to Stylevique.
      </h1>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        Pick up where you left off: appointments, payment status and your saved
        profile details.
      </p>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
        className="mt-8 flex h-11 w-full items-center justify-center gap-3 rounded-full border border-border bg-card text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-muted disabled:opacity-50"
      >
        {isGoogleLoading ? (
          <span className="size-4 animate-spin rounded-full border-2 border-foreground/25 border-t-foreground" />
        ) : (
          <GoogleIcon className="size-4" />
        )}
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
          or use email
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Email" htmlFor="signin-email" error={errors.email?.message} required>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="signin-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="h-11 bg-card pl-9 text-sm"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </div>
        </FormField>

        <FormField
          label="Password"
          htmlFor="signin-password"
          error={errors.password?.message}
          required
        >
          <div className="relative">
            <LockKeyhole
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Your password"
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

        <PrimaryButton type="submit" className="mt-2 w-full" isLoading={isSubmitting}>
          Sign in
        </PrimaryButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Stylevique?{" "}
        <Link
          href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
