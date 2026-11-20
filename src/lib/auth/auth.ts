import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

/**
 * Better Auth runs inside this Next.js app and owns login, registration and
 * Google OAuth. The Express API verifies the JWTs this server issues.
 *
 * The MongoDB database name must match the backend's DB_NAME (normally
 * "stylevique") so both applications read the same user collection.
 */
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error(
    "MONGODB_URI is missing. Add it to .env.local before using authentication.",
  );
}

declare global {
  var _styleviqueMongoClient: MongoClient | undefined;
}

function isClientAlive(client?: MongoClient): boolean {
  if (!client) return false;
  // @ts-expect-error topology is an internal driver property
  const topology = client.topology;
  if (!topology) return false;
  if (typeof topology.isClosed === "function" && topology.isClosed()) return false;
  if (topology.s && topology.s.state === "closed") return false;
  return true;
}

function getMongoClient(): MongoClient {
  if (!isClientAlive(globalThis._styleviqueMongoClient)) {
    globalThis._styleviqueMongoClient = new MongoClient(mongoUri!, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
  }
  return globalThis._styleviqueMongoClient!;
}

const databaseName = process.env.MONGODB_DB_NAME ?? "stylevique";

/**
 * Proxy the database instance so every collection operation automatically
 * uses an alive, active MongoClient. If a serverless container woke up after
 * idle timeout and the connection topology closed, it transparently recreates
 * the client without throwing MongoTopologyClosedError.
 */
const databaseProxy = new Proxy({} as ReturnType<MongoClient["db"]>, {
  get(target, prop, receiver) {
    const activeClient = getMongoClient();
    const activeDb = activeClient.db(databaseName);
    const value = Reflect.get(activeDb, prop, receiver);
    if (typeof value === "function") {
      return value.bind(activeDb);
    }
    return value;
  },
});

const clientProxy = new Proxy({} as MongoClient, {
  get(target, prop, receiver) {
    const activeClient = getMongoClient();
    const value = Reflect.get(activeClient, prop, receiver);
    if (typeof value === "function") {
      return value.bind(activeClient);
    }
    return value;
  },
});

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  database: mongodbAdapter(databaseProxy, {
    client: clientProxy,
  }),

  /**
   * These fields extend Better Auth's default user record.
   * `input: false` is important: public sign-up cannot choose its own role or
   * blocked status. Only the trusted backend/CLI may change those values.
   */
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  plugins: [jwt()],

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60,
    },
  },
});
