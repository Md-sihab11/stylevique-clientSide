import type { Metadata } from "next";
import Link from "next/link";
import { PrimaryButton } from "@/components/common/primary-button";

export const metadata: Metadata = {
  title: "Account blocked",
};

export default function BlockedPage() {
  return (
    <div className="page-width py-16 text-center sm:py-24">
      <p className="eyebrow">Account status</p>
      <h1 className="mt-4 font-display text-4xl font-medium tracking-[0.01em] text-foreground uppercase sm:text-5xl">
        Your account is blocked
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
        Blocked accounts cannot use protected platform features such as booking
        or managing appointments. Please contact the salon administrator if you
        believe this is a mistake.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <PrimaryButton href="/">Back to Stylevique</PrimaryButton>
      </div>
      <div className="mt-4">
        <Link
          href="/sign-in"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign out and try again
        </Link>
      </div>
    </div>
  );
}
