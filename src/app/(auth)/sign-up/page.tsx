import type { Metadata } from "next";
import { Suspense } from "react";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Create a Stylevique customer account, then browse services and request appointments.",
};

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-secondary/40" />}>
      <SignUpForm />
    </Suspense>
  );
}
