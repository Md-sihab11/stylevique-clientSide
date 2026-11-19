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

const mongoClient = new MongoClient(mongoUri);
const databaseName = process.env.MONGODB_DB_NAME ?? "stylevique";
const database = mongoClient.db(databaseName);

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

  database: mongodbAdapter(database, {
    client: mongoClient,
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
