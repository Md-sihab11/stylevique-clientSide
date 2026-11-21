import { apiRequest } from "@/lib/api-client";
import type { UploadedImage } from "@/features/payments/types";

/**
 * IMAGE UPLOAD
 * ------------
 * POST /api/uploads/image stores the file on ImgBB and returns its URL.
 * The backend requires a valid JWT, so the caller must be signed in.
 *
 * The multipart field name must be "image". We never set Content-Type
 * manually, because the browser must add the multipart boundary.
 */
export async function uploadImage(file: File): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append("image", file);

  return apiRequest<UploadedImage>("/api/uploads/image", {
    method: "POST",
    auth: true,
    body: formData,
  });
}
