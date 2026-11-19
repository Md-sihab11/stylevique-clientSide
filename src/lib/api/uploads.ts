import { apiRequest } from "@/lib/api-client";
import type { UploadedImage } from "@/types";

/**
 * IMAGE UPLOAD
 * ------------
 * The frontend is ready for POST /api/uploads/image, but the supplied backend
 * index.js does not register that route yet. Until it is added, this call will
 * return a 404 and the UI will show the backend's error message.
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
