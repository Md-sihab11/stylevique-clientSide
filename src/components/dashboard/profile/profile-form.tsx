"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  BadgeCheck,
  ImageIcon,
  Mail,
  Phone,
  ShieldAlert,
  Upload,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import {
  getApiErrorMessage,
  isApiError,
  updateMyProfile,
  uploadImage,
} from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { formatDate, getInitials } from "@/lib/format";
import { FormField } from "@/components/common/form-field";
import { PrimaryButton } from "@/components/common/primary-button";
import { Skeleton } from "@/components/common/skeleton-loader";
import { StatusBadge } from "@/components/common/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter your name.")
    .max(100, "Name must be 100 characters or fewer."),
  phone: z
    .string()
    .trim()
    .max(30, "Phone must be 30 characters or fewer.")
    .refine(
      (value) => value === "" || /^[0-9+\-()\s]+$/.test(value),
      "Use digits, spaces and + - ( ) only.",
    ),
  image: z
    .string()
    .trim()
    .max(2048, "Image URL is too long.")
    .refine(
      (value) => value === "" || /^https?:\/\/.+/i.test(value),
      "Enter a valid image URL starting with http:// or https://.",
    ),
});

type ProfileValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  role: "customer" | "admin";
}

/**
 * Shared profile editor for customers and administrators.
 *
 * Name, phone and image are the only editable fields, matching
 * PATCH /api/users/me. Email, role, verification and blocked status are
 * managed by Better Auth or the salon backend and are shown read-only.
 *
 * Saving calls PATCH /api/users/me through updateMyProfile(). The image can be
 * uploaded first with POST /api/uploads/image, or pasted as a URL.
 */
export function ProfileForm({ role }: ProfileFormProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", phone: "", image: "" },
  });

  const user = session?.user;
  const imageValue = useWatch({ control, name: "image" });

  // Fill the form as soon as the Better Auth session arrives.
  useEffect(() => {
    if (!user) return;

    reset({
      name: user.name ?? "",
      phone: (user.phone as string | undefined) ?? "",
      image: user.image ?? "",
    });
  }, [user, reset]);

  async function onSubmit(values: ProfileValues) {
    try {
      await updateMyProfile({
        name: values.name.trim(),
        phone: values.phone.trim(),
        image: values.image.trim(),
      });

      reset({
        name: values.name.trim(),
        phone: values.phone.trim(),
        image: values.image.trim(),
      });

      toast.success("Profile updated", {
        description: "Your latest details are now saved to your account.",
      });
      router.refresh();
    } catch (error) {
      // Show backend field errors next to the matching inputs.
      if (isApiError(error)) {
        for (const detail of error.details) {
          if (
            detail.field === "name" ||
            detail.field === "phone" ||
            detail.field === "image"
          ) {
            setError(detail.field, { message: detail.message });
          }
        }
      }

      toast.error("Could not update your profile", {
        description: getApiErrorMessage(error),
      });
    }
  }

  async function handleImageUpload(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!/^image\/(jpeg|png|webp|gif)$/i.test(file.type)) {
      toast.error("Choose a supported image", {
        description: "Use a JPEG, PNG, WebP or GIF file.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const uploaded = await uploadImage(file);
      setValue("image", uploaded.url, {
        shouldDirty: true,
        shouldValidate: true,
      });
      toast.success("Image uploaded", {
        description: "Save changes to attach the new picture to your profile.",
      });
    } catch (error) {
      toast.error("Image upload failed", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsUploading(false);
    }
  }

  if (isPending || !user) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5 rounded-lg border border-border bg-card p-6">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-40 rounded-full" />
        </div>
        <Skeleton className="h-80 rounded-lg" />
      </div>
    );
  }

  const createdAt =
    user.createdAt instanceof Date
      ? user.createdAt.toISOString()
      : typeof user.createdAt === "string"
        ? user.createdAt
        : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-lg border border-border bg-card p-5 sm:p-7"
        noValidate
      >
        <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-center">
          <div className="relative">
            <Avatar className="size-20 border border-border">
              <AvatarImage src={imageValue || user.image || undefined} alt={user.name} />
              <AvatarFallback className="bg-secondary font-heading text-2xl text-primary">
                {getInitials(user.name) || <UserRound className="size-6" />}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
              <ImageIcon className="size-3.5" aria-hidden="true" />
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-medium text-foreground">Personal details</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Keep your contact details current so the salon can reach you about
              appointments and payments.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <FormField
            label="Full name"
            htmlFor="profile-name"
            error={errors.name?.message}
            required
            className="sm:col-span-2"
          >
            <div className="relative">
              <UserRound
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="profile-name"
                autoComplete="name"
                className="h-11 bg-background pl-9 text-sm"
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
              />
            </div>
          </FormField>

          <FormField
            label="Phone number"
            htmlFor="profile-phone"
            error={errors.phone?.message}
            hint="Optional"
          >
            <div className="relative">
              <Phone
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="profile-phone"
                type="tel"
                autoComplete="tel"
                placeholder="+1 (555) 000-0000"
                className="h-11 bg-background pl-9 text-sm"
                aria-invalid={Boolean(errors.phone)}
                {...register("phone")}
              />
            </div>
          </FormField>

          <FormField label="Email address" htmlFor="profile-email" hint="Read-only">
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="profile-email"
                value={user.email}
                readOnly
                disabled
                className="h-11 bg-muted/60 pl-9 text-sm"
              />
            </div>
          </FormField>

          <FormField
            label="Profile image"
            htmlFor="profile-image"
            error={errors.image?.message}
            hint="Upload a file or paste a URL"
            className="sm:col-span-2"
          >
            <div className="space-y-2">
              <div className="relative">
                <ImageIcon
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="profile-image"
                  type="url"
                  placeholder="https://…"
                  className="h-11 bg-background pl-9 text-sm"
                  aria-invalid={Boolean(errors.image)}
                  {...register("image")}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  onChange={(event) => {
                    void handleImageUpload(event.target.files?.[0]);
                    // Allow choosing the same file again later.
                    event.target.value = "";
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="size-3.5" aria-hidden="true" />
                  {isUploading ? "Uploading…" : "Upload image"}
                </Button>
                <span className="text-xs text-muted-foreground">
                  JPEG, PNG, WebP or GIF
                </span>
              </div>
            </div>
          </FormField>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-sm text-xs leading-5 text-muted-foreground">
            Email, account type and blocked status cannot be changed here.
          </p>
          <PrimaryButton
            type="submit"
            isLoading={isSubmitting}
            disabled={!isDirty || isUploading}
            className="w-full sm:w-auto"
          >
            Save changes
          </PrimaryButton>
        </div>
      </form>

      <aside className="space-y-4">
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="eyebrow">Account</p>
          <div className="mt-4 flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback className="bg-secondary font-heading text-lg text-primary">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <dl className="mt-5 space-y-4 border-t border-border pt-4 text-xs">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Account type</dt>
              <dd className="font-medium text-foreground">
                {role === "admin" ? "Administrator" : "Customer"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Email</dt>
              <dd>
                {user.emailVerified ? (
                  <StatusBadge status="active" label="Verified" />
                ) : (
                  <StatusBadge status="pending" label="Not verified" />
                )}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Account status</dt>
              <dd>
                {user.isBlocked ? (
                  <StatusBadge status="blocked" />
                ) : (
                  <StatusBadge status="active" label="Active" />
                )}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Member since</dt>
              <dd className="font-medium text-foreground">{formatDate(createdAt)}</dd>
            </div>
          </dl>
        </div>

        {user.isBlocked ? (
          <div className="rounded-lg border border-destructive/25 bg-destructive/5 p-5">
            <div className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="size-4" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-[0.14em]">
                Account blocked
              </p>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              This account cannot book appointments or use protected salon
              features. Contact the salon administrator if you need help.
            </p>
          </div>
        ) : (
          <div className="rounded-lg bg-secondary/55 p-5">
            <div className="flex items-center gap-2">
              <BadgeCheck className="size-4 text-primary" aria-hidden="true" />
              <p className="eyebrow">Good to know</p>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Upload a JPEG, PNG, WebP or GIF through the salon backend, or paste a
              public image URL. If uploads are not enabled on the server, the URL
              field still works.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
