# Stylevique — Salon & Beauty Studio

A full-stack salon platform: customers can browse services, request appointments, manage their bookings, and pay with Stripe Checkout. Administrators manage services, appointments, customers, and transactions.

---

## Important features

- Public homepage with featured services, categories, and a booking call to action
- Service browsing with search, category filter, sorting, and pagination
- Protected service details page with an appointment booking form
- Better Auth sign-in/sign-up with Google OAuth and email/password
- Customer dashboard: appointment overview, my appointments, payment history, reviews, profile
- Admin dashboard: service management, appointment management, customer management, transactions, review moderation
- Customer reviews: submit after a completed visit, admin-approved, shown in a public carousel
- Stripe Checkout for confirmed appointments, verified by a backend webhook
- Role-based dashboard access on the client and server
- Responsive design for phones, tablets, and desktops

---

## Technology stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, React Compiler) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 with design tokens |
| UI primitives | shadcn-style components built on Base UI |
| Forms | React Hook Form + Zod |
| Auth | Better Auth with JWT plugin and MongoDB adapter |
| Database | MongoDB (shared with the Express API) |
| HTTP | `fetch` via `src/lib/api-client.ts` |
| Payments | Stripe-hosted Checkout (redirect only) |
| Notifications | Sonner |
| Icons | Lucide React |
| Fonts | Cormorant Garamond, Josefin Sans |

---

## Installation instructions

```bash
npm install
```

---

## How to run the project locally

1. Copy the frontend environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Start the Express API from the server repository.
3. Start the Next.js frontend from this repository:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

See [Environment variables](#environment-variables) for required values.

---

## Required environment variables (names only)

Copy [`.env.example`](./.env.example) to `.env.local` and set:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`
- `BETTER_AUTH_URL`
- `BETTER_AUTH_SECRET`
- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

Stripe secret keys and webhook secrets are required on the server only and must never be committed to GitHub.

---

## Live website link

_TBD — add the deployed frontend URL here after deployment._

---

## Client and server repository links

| Repo | Link |
| --- | --- |
| Client | https://github.com/Md-sihab11/stylevique-clientSide |
| Server | https://github.com/Md-sihab11/stylevique-server |

Both repositories must stay separate.

---

## Environment variables

- `NEXT_PUBLIC_APP_URL` — browser origin
- `NEXT_PUBLIC_API_URL` — Express API origin, no trailing slash
- `BETTER_AUTH_URL` — server origin used by Better Auth
- `BETTER_AUTH_SECRET` — long random signing secret
- `MONGODB_URI` — MongoDB connection string
- `MONGODB_DB_NAME` — defaults to `stylevique`; must match the server `DB_NAME`
- `GOOGLE_CLIENT_ID` — Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` — Google OAuth client secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key (redirect only)
- `NEXT_PUBLIC_HERO_IMAGE_URL` — optional public image URL for the homepage hero

Never put real secrets or credential values in the README.

---

## Deployment guideline

1. Deploy the Express API first.
2. Deploy the Next.js client.
3. Make sure the live API is reachable from the client origin.
4. Verify the live site returns the same data with no CORS, 404, or 504 issues.
5. Verify private routes still work after a browser refresh and logged-in users remain authenticated.
6. Configure Stripe on the live site:
   - Set the webhook URL to `https://<server-host>/api/payments/webhook`.
   - Verify the Stripe Checkout and webhook flow update payment status.
7. Verify admin credentials work on the live site.
8. Add the deployed frontend URL to [Live website link](#live-website-link).

---

## Live site should work perfectly

- No CORS, 404, or 504 issues.
- Private routes work after a browser refresh.
- Logged-in users remain authenticated.
- Stripe Checkout and the webhook update payment status on the live site.
- Admin credentials work on the live site.
