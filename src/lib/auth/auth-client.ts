import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  jwtClient,
} from "better-auth/client/plugins";
import type { auth } from "@/lib/auth/auth";

/**
 * Browser-side Better Auth client.
 *
 * `jwtClient()` exposes `authClient.token()`. The API integration layer will
 * use that token later as `Authorization: Bearer <token>`.
 *
 * `inferAdditionalFields` teaches TypeScript about `role`, `isBlocked` and
 * `phone`, which are custom fields defined on the auth server.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  plugins: [jwtClient(), inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
