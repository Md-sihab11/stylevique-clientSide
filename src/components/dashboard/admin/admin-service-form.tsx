"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Clock3,
  DollarSign,
  ImageIcon,
  Layers3,
  Sparkles,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import type { SalonService } from "@/types";
import {
  createService,
  getApiErrorMessage,
  getServiceCategories,
  isApiError,
  updateService,
  uploadImage,
} from "@/lib/api";
import { useApiResource } from "@/hooks/use-api-resource";
import { FEATURED_CATEGORIES } from "@/constants/salon";
import { formatCurrency, formatDuration } from "@/lib/format";
import { PageHeader } from "@/components/common/page-header";
import { FormField } from "@/components/common/form-field";
import { PrimaryButton } from "@/components/common/primary-button";
import { SafeImage } from "@/components/common/safe-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const serviceSchema = z.object({
  serviceName: z
    .string()
    .trim()
    .min(2, "Service name must be at least 2 characters.")
    .max(120, "Service name must be 120 characters or fewer."),
  category: z
    .string()
    .trim()
    .min(2, "Category must be at least 2 characters.")
    .max(80, "Category must be 80 characters or fewer."),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(2000, "Description must be 2000 characters or fewer."),
  price: z
    .number({ error: "Enter a valid price." })
    .positive("Price must be greater than 0.")
    .max(1000000, "Price must be 1,000,000 or less."),
  duration: z
    .number({ error: "Enter a valid duration." })
    .min(1, "Duration must be at least 1 minute.")
    .max(1440, "Duration must be 1,440 minutes or fewer.")
    .refine(Number.isInteger, "Duration must be a whole number of minutes."),
  image: z
    .string()
    .trim()
    .min(1, "Add an image URL for this service.")
    .max(2048, "Image URL is too long.")
    .refine(
      (value) => /^https?:\/\/.+/i.test(value),
      "Enter a valid image URL starting with http:// or https://.",
    ),
  status: z.enum(["active", "inactive"]),
});

type ServiceValues = z.infer<typeof serviceSchema>;

interface AdminServiceFormProps {
  mode: "create" | "edit";
  service?: SalonService;
  serviceId?: string;
}

/**
 * Shared create/edit form for salon services.
 * Validation mirrors the Express endpoint exactly:
 * name 2–120, category 2–80, description 10–2000, price > 0 and ≤ 1,000,000,
 * duration a whole number from 1–1440, and a valid image URL.
 */
export function AdminServiceForm({ mode, service, serviceId }: AdminServiceFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServiceValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceName: service?.serviceName ?? "",
      category: service?.category ?? "",
      description: service?.description ?? "",
      price: service?.price ?? 0,
      duration: service?.duration ?? 60,
      image: service?.image ?? "",
      status: service?.status ?? "active",
    },
  });

  const watchedValues = useWatch({ control });
  const imageValue = watchedValues.image ?? "";
  const descriptionValue = watchedValues.description ?? "";
  const priceValue = watchedValues.price;
  const durationValue = watchedValues.duration;

  const previewDuration =
    typeof durationValue === "number" &&
    Number.isFinite(durationValue) &&
    durationValue > 0
      ? durationValue
      : null;
  const previewPrice =
    typeof priceValue === "number" && Number.isFinite(priceValue) && priceValue > 0
      ? priceValue
      : null;

  const { data: categoryData } = useApiResource(
    () => getServiceCategories(),
    "admin-service-form-categories",
  );

  const categorySuggestions = Array.from(
    new Set([
      ...FEATURED_CATEGORIES.map((item) => item.name),
      ...(categoryData?.categories ?? []),
    ]),
  ).sort((a, b) => a.localeCompare(b));

  async function onSubmit(values: ServiceValues) {
    try {
      if (isEdit) {
        if (!serviceId) {
          throw new Error("The service ID is missing from this page.");
        }

        await updateService(serviceId, {
          serviceName: values.serviceName.trim(),
          category: values.category.trim(),
          description: values.description.trim(),
          price: values.price,
          duration: values.duration,
          image: values.image.trim(),
        });

        toast.success("Service updated", {
          description: "The latest service details are now saved.",
        });
      } else {
        await createService({
          serviceName: values.serviceName.trim(),
          category: values.category.trim(),
          description: values.description.trim(),
          price: values.price,
          duration: values.duration,
          image: values.image.trim(),
          status: values.status,
        });

        toast.success("Service created", {
          description: "The new service is now part of the salon menu.",
        });
      }

      router.push("/dashboard/admin/services");
      router.refresh();
    } catch (error) {
      // Put backend validation messages directly under the matching fields.
      if (isApiError(error)) {
        for (const detail of error.details) {
          if (
            detail.field === "serviceName" ||
            detail.field === "category" ||
            detail.field === "description" ||
            detail.field === "price" ||
            detail.field === "duration" ||
            detail.field === "image" ||
            detail.field === "status"
          ) {
            setError(detail.field, { message: detail.message });
          }
        }
      }

      toast.error(
        isEdit ? "Could not update the service" : "Could not create the service",
        { description: getApiErrorMessage(error) },
      );
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
        description: "The service image URL has been filled in for you.",
      });
    } catch (error) {
      toast.error("Image upload failed", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Salon administration"
        title={isEdit ? "Edit service" : "Add a service"}
        description={
          isEdit
            ? "Update the details customers see on the service menu. Availability is controlled from the services list."
            : "Describe the treatment clearly, set a realistic duration and add an image customers will recognise."
        }
        action={
          <PrimaryButton href="/dashboard/admin/services" variant="outline" size="sm">
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to services
          </PrimaryButton>
        }
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-6 lg:grid-cols-[1fr_360px]"
        noValidate
      >
        <div className="space-y-6">
          <section className="rounded-lg border border-border bg-card p-5 sm:p-7">
            <div className="flex items-center gap-2 border-b border-border pb-5">
              <Sparkles className="size-4 text-primary" aria-hidden="true" />
              <h2 className="text-2xl font-medium text-foreground">Service details</h2>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <FormField
                label="Service name"
                htmlFor="service-name"
                error={errors.serviceName?.message}
                hint="2–120 characters"
                required
                className="sm:col-span-2"
              >
                <Input
                  id="service-name"
                  placeholder="Signature cut & finish"
                  maxLength={120}
                  className="h-11 bg-background text-sm"
                  aria-invalid={Boolean(errors.serviceName)}
                  {...register("serviceName")}
                />
              </FormField>

              <FormField
                label="Category"
                htmlFor="service-category"
                error={errors.category?.message}
                hint="Used for public filters"
                required
                className="sm:col-span-2"
              >
                <Input
                  id="service-category"
                  list="service-category-suggestions"
                  placeholder="Haircut & Styling"
                  maxLength={80}
                  className="h-11 bg-background text-sm"
                  aria-invalid={Boolean(errors.category)}
                  {...register("category")}
                />
                <datalist id="service-category-suggestions">
                  {categorySuggestions.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </FormField>

              <FormField
                label="Price"
                htmlFor="service-price"
                error={errors.price?.message}
                hint="Salon currency"
                required
              >
                <div className="relative">
                  <DollarSign
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="service-price"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0.01"
                    max="1000000"
                    className="h-11 bg-background pl-9 text-sm"
                    aria-invalid={Boolean(errors.price)}
                    {...register("price", { valueAsNumber: true })}
                  />
                </div>
              </FormField>

              <FormField
                label="Duration"
                htmlFor="service-duration"
                error={errors.duration?.message}
                hint="Minutes"
                required
              >
                <div className="relative">
                  <Clock3
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="service-duration"
                    type="number"
                    inputMode="numeric"
                    step="1"
                    min="1"
                    max="1440"
                    className="h-11 bg-background pl-9 text-sm"
                    aria-invalid={Boolean(errors.duration)}
                    {...register("duration", { valueAsNumber: true })}
                  />
                </div>
              </FormField>

              <FormField
                label="Description"
                htmlFor="service-description"
                error={errors.description?.message}
                hint={`${descriptionValue.length}/2000`}
                required
                className="sm:col-span-2"
              >
                <Textarea
                  id="service-description"
                  rows={6}
                  maxLength={2000}
                  placeholder="Describe the consultation, the treatment and the finish a customer can expect."
                  className="min-h-36 bg-background text-sm"
                  aria-invalid={Boolean(errors.description)}
                  {...register("description")}
                />
              </FormField>

              <FormField
                label="Service image"
                htmlFor="service-image"
                error={errors.image?.message}
                hint="Upload a file or paste a URL"
                required
                className="sm:col-span-2"
              >
                <div className="space-y-2">
                  <div className="relative">
                    <ImageIcon
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="service-image"
                      type="url"
                      placeholder="https://images.example.com/service.jpg"
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
          </section>

          {!isEdit && (
            <section className="rounded-lg border border-border bg-card p-5 sm:p-7">
              <div className="flex items-center gap-2 border-b border-border pb-5">
                <Layers3 className="size-4 text-primary" aria-hidden="true" />
                <h2 className="text-2xl font-medium text-foreground">Visibility</h2>
              </div>

              <fieldset className="mt-5">
                <legend className="sr-only">Service status</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      {
                        value: "active",
                        label: "Active",
                        description: "Visible on the public menu and open for bookings.",
                      },
                      {
                        value: "inactive",
                        label: "Inactive",
                        description: "Saved but hidden from customers for now.",
                      },
                    ] as const
                  ).map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-md border p-4 transition-colors",
                        "has-[:checked]:border-primary has-[:checked]:bg-primary/5",
                        "border-border hover:bg-muted/50",
                      )}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        className="mt-0.5 size-4 accent-primary"
                        {...register("status")}
                      />
                      <span>
                        <span className="block text-sm font-medium text-foreground">
                          {option.label}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                          {option.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </section>
          )}

          {isEdit && (
            <div className="rounded-md border border-border bg-muted/40 p-4 text-xs leading-5 text-muted-foreground">
              Status is changed with its own endpoint. Use the activate or deactivate
              control on the services list.
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <PrimaryButton
              href="/dashboard/admin/services"
              variant="outline"
              size="md"
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton
              type="submit"
              isLoading={isSubmitting}
              disabled={isUploading}
            >
              {isEdit ? "Save changes" : "Create service"}
            </PrimaryButton>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="eyebrow">Live preview</p>
            <div className="mt-4 overflow-hidden rounded-sm border border-border">
              <div className="relative aspect-[4/5] bg-secondary">
                <SafeImage src={imageValue} alt="Service preview" />
              </div>
              <div className="space-y-2 p-4">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {watchedValues.category || "Category"}
                </p>
                <p className="text-xl leading-tight font-medium text-foreground">
                  {watchedValues.serviceName || "Service name"}
                </p>
                <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
                  <span className="text-muted-foreground">
                    {previewDuration ? formatDuration(previewDuration) : "Duration"}
                  </span>
                  <span className="font-semibold text-primary">
                    {previewPrice ? formatCurrency(previewPrice) : "Price"}
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-[0.68rem] leading-5 text-muted-foreground">
              Upload a JPEG, PNG, WebP or GIF, or paste a public image URL. Broken
              URLs show a neutral placeholder instead of an empty card.
            </p>
          </div>

          <div className="rounded-lg bg-secondary/50 p-5">
            <p className="eyebrow">Before publishing</p>
            <ul className="mt-3 space-y-2 text-xs leading-5 text-muted-foreground">
              <li>· Use a clear, specific service name.</li>
              <li>· Match the price and duration to the salon&apos;s real menu.</li>
              <li>· Prefer a portrait image with the service in focus.</li>
              <li>· Activate only when the treatment is ready to book.</li>
            </ul>
          </div>
        </aside>
      </form>
    </div>
  );
}
