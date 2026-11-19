import type { UploadedImage } from "@/types";
import { ApiNotImplementedError } from "./errors";

/**
 * IMAGE UPLOAD
 * ------------
 * The backend README documents POST /api/uploads/image, but the supplied
 * backend source (index.js) does not register that route yet. Confirm the
 * route exists before wiring this function. Multipart field name: "image".
 */

// TODO: Implement POST /api/uploads/image.
// Auth: any signed-in user (service images are uploaded by admins).
// Body: FormData with the file under the "image" field.
// Response: { success, message, data: { url } } according to the README.
// Used by: AdminServiceForm and profile image fields.
export async function uploadImage(file: File): Promise<UploadedImage> {
  void file;
  throw new ApiNotImplementedError("uploadImage");
}
