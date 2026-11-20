import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

/**
 * Reads the Better Auth session on the server.
 * Use this in layouts/pages that must redirect before rendering protected UI.
 */
export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}
