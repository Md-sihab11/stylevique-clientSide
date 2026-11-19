import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { ProfileForm } from "@/components/dashboard/profile/profile-form";

export const metadata: Metadata = {
  title: "My profile",
};

export default function CustomerProfilePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Customer dashboard"
        title="My profile"
        description="Keep your name, phone number and profile image up to date. These are the details the salon uses when preparing your appointment."
      />
      <ProfileForm role="customer" />
    </div>
  );
}
