import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { ProfileForm } from "@/features/dashboard/components/profile/profile-form";

export const metadata: Metadata = {
  title: "Admin profile",
};

export default function AdminProfilePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Salon administration"
        title="My profile"
        description="Your administrator profile. Customer-facing contact information is managed in the public site constants, not here."
      />
      <ProfileForm role="admin" />
    </div>
  );
}
