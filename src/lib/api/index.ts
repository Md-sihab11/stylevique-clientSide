/**
 * API barrel file.
 *
 * Components import from "@/lib/api" so their API dependency is obvious:
 *
 *   import { getServices } from "@/features/services/api";
 *
 * The shared fetch logic lives in src/lib/api-client.ts. Each module below only
 * defines endpoint paths, request bodies and response types.
 */
export * from "./config";
export * from "./errors";
export * from "./uploads";
