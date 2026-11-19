/**
 * API barrel file.
 *
 * Components import from "@/lib/api" so their API dependency is obvious:
 *
 *   import { getServices } from "@/lib/api";
 *
 * The shared fetch logic lives in src/lib/api-client.ts. Each module below only
 * defines endpoint paths, request bodies and response types.
 */
export * from "./config";
export * from "./errors";
export * from "./services";
export * from "./appointments";
export * from "./users";
export * from "./dashboard";
export * from "./payments";
export * from "./uploads";
export * from "./transactions";
