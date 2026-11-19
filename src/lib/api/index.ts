/**
 * API barrel file.
 *
 * Components import from "@/lib/api" so their API dependency is obvious:
 *
 *   import { getServices } from "@/lib/api";
 *
 * Every function in these modules currently throws ApiNotImplementedError.
 * That is intentional: the UI is finished, but the HTTP requests are yours to
 * write. Read API_INTEGRATION.md for the full contract.
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
