# Stylevique — Salon & Beauty Studio

A complete, responsive frontend for a premium salon booking experience. Customers
can explore treatments, request appointments, manage their bookings and pay for
confirmed visits. Administrators get a full back office for services,
appointments, customers and transactions.

The interface is finished. **HTTP integration with the Express API is
intentionally left as documented TODOs in `src/lib/api/`.** Nothing in this app
invents data, fakes a login, or pretends a payment succeeded. Implement the API
functions and the existing screens come alive without a redesign.

- [`API_INTEGRATION.md`](./API_INTEGRATION.md) — endpoint-by-endpoint handoff guide
- [`.env.example`](./.env.example) — every environment variable the frontend needs

---

## Table of contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech stack](#tech-stack)
4. [Getting started](#getting-started)
5. [Environment variables](#environment-variables)
6. [Scripts](#scripts)
7. [Project structure](#project-structure)
8. [Routes](#routes)
9. [API integration status](#api-integration-status)
10. [Design system](#design-system)
11. [Responsive behaviour](#responsive-behaviour)
12. [Quality checks](#quality-checks)
13. [Known limitations](#known-limitations)

---

## Overview

Stylevique is a two-sided salon product:

- **Customers** browse the service menu, open a treatment, pick a date and a
  30-minute time slot, and send a booking request. After the salon confirms it,
  the customer can pay through Stripe-hosted Checkout. They can track
  appointments and update their profile from a personal dashboard.
- **Administrators** manage the service catalogue (create, edit, activate,
  deactivate, delete), confirm or cancel appointment requests, search customers,
  block or unblock accounts, and review payment transactions.

Authentication is handled by **Better Auth** inside this Next.js app. The Express
API verifies the JWTs Better Auth issues. Express never handles a login form.

The supplied backend lives outside this repository:

```text
../Server-side - Copy/stylevique-server/index.js
```

Do not modify it from here. This README treats its routes and rules as the
source of truth.

---

## Features

### Public site

- Editorial homepage with hero, featured services, philosophy and booking call
  to action
- Service menu with search, category filter, sorting, pagination and URL-backed
  state (filters survive refresh and can be shared)
- Service detail page with price, duration, description and a booking form
- About and contact pages with salon information and editable placeholders
- Sticky responsive navigation with a mobile sheet, auth menu and sign-out
- Accessible skip link, focus states and semantic landmarks

### Authentication

- Email/password sign-in and sign-up through Better Auth
- Google OAuth sign-in
- Inline validation with React Hook Form and Zod
- Safe `callbackUrl` handling (no open redirects)
- Role-aware navigation and server-side dashboard guards

### Customer dashboard

- Overview with real dashboard counts (appointments by status)
- Appointment list with status filter, pagination and mobile cards
- Appointment detail with service snapshot, schedule, payment state and actions
- Cancel action only for appointments the backend allows cancelling
- Pay action only for confirmed, unpaid appointments
- Profile editor backed by the live Better Auth session; email and role are
  read-only

### Admin dashboard

- Overview with revenue, successful payments, customers, active services and
  appointment mix
- Service management with search, category/status filters, sorting, pagination
  and mobile cards
- Add/edit service form with backend-matching validation and a live preview
- Activate/deactivate and delete confirmations with clear consequences
- Appointment management with status/date filters and backend transition rules
- Customer directory with search, details dialog, block/unblock confirmations
- Transaction list with paid/failed filter, customer, appointment and Stripe
  references

### Payment return pages

- Focused layout with no public navigation
- Success page asks the backend to verify the Stripe session and renders success
  **only** when the verified status is `paid`
- Explicit pending-integration, unsigned-in, wrong-role, missing-session, failed
  and still-processing states
- Cancel page explains that returning from Checkout changes nothing and no
  payment is assumed

### Cross-cutting UX

- Loading skeletons, empty states, error states with retry, and honest
  "API integration pending" panels
- Sonner toasts for every action outcome
- Dialog and destructive-action confirmations
- Responsive tables that become readable cards on small screens
- Design tokens for colours, typography, radius and spacing
- No fake data, no simulated success, no optimistic payment state

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, React Compiler) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 with design tokens |
| UI primitives | shadcn-style components built on Base UI |
| Forms | React Hook Form + Zod |
| Auth | Better Auth with JWT plugin and MongoDB adapter |
| Database (auth) | MongoDB (shared with the Express API) |
| HTTP | `fetch` once implemented in `src/lib/api/` |
| Payments | Stripe-hosted Checkout (redirect only) |
| Notifications | Sonner |
| Icons | Lucide React |
| Fonts | Cormorant Garamond (headings), Josefin Sans (body) |

---

## Getting started

### Prerequisites

- Node.js 20+ and npm
- A MongoDB database both apps can reach
- The Stylevique Express API running (default `http://localhost:5000`)
- Optional: Google OAuth credentials, Stripe test keys on the backend

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the frontend

```bash
cp .env.example .env.local
```

Fill in the values described in [Environment variables](#environment-variables).
The minimum to boot is `MONGODB_URI`, `BETTER_AUTH_SECRET`,
`NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_API_URL`.

### 3. Configure the backend

The Express `.env` needs to know about this frontend:

```dotenv
CLIENT_URL=http://localhost:3000
BETTER_AUTH_JWKS_URL=http://localhost:3000/api/auth/jwks
BETTER_AUTH_ISSUER=http://localhost:3000
BETTER_AUTH_AUDIENCE=http://localhost:3000
DB_NAME=stylevique
```

`DB_NAME` and the frontend's `MONGODB_DB_NAME` must point at the same database.

### 4. Run both apps

```bash
# Terminal 1 — Express API
cd "../Server-side - Copy/stylevique-server"
npm run dev

# Terminal 2 — Next.js
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Google OAuth (optional)

In Google Cloud Console add this authorised redirect URI:

```text
http://localhost:3000/api/auth/callback/google
```

Then set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`.

---

## Environment variables

Copy [`.env.example`](./.env.example) to `.env.local`. Never commit real secrets.

### Frontend

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Yes | Browser origin, e.g. `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Yes | Express API origin, no trailing slash |
| `BETTER_AUTH_URL` | Yes | Server origin used by Better Auth |
| `BETTER_AUTH_SECRET` | Yes | Long random signing secret |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `MONGODB_DB_NAME` | No | Defaults to `stylevique`; must match backend `DB_NAME` |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Only needed if you add Stripe.js; checkout is a redirect today |

Stripe **secret** keys and webhook secrets belong to the Express backend, never
to this app.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

Type-checking is done with `npx tsc --noEmit` because the scaffold has no
dedicated `typecheck` script.

---

## Project structure

```text
src/
├── app/
│   ├── (auth)/                 # Sign-in / sign-up split-screen routes
│   ├── (public)/               # Home, services, about, contact
│   ├── api/auth/[...all]/      # Better Auth route handler
│   ├── dashboard/
│   │   ├── admin/              # Admin pages and role-guarded layout
│   │   └── customer/           # Customer pages and role-guarded layout
│   ├── payment/                # Stripe return screens
│   ├── globals.css             # Design tokens and utilities
│   └── layout.tsx              # Fonts, metadata, Toaster
├── components/
│   ├── appointments/           # Booking form, shared appointment pieces
│   ├── auth/                   # Sign-in / sign-up forms
│   ├── brand/                  # Logo
│   ├── common/                 # Buttons, states, tables, dialogs, skeletons
│   ├── dashboard/              # Admin, customer and profile views
│   ├── home/                   # Homepage sections
│   ├── layout/                 # Navbar and footer
│   ├── payment/                # Payment verification UI
│   ├── services/               # Service card, grid, details
│   └── ui/                     # Base UI primitives
├── constants/                  # Salon details, nav, slots, sort options
├── hooks/                      # useApiResource
├── lib/
│   ├── api/                    # Typed API TODOs — the integration layer
│   ├── auth.ts                 # Better Auth server config
│   ├── auth-client.ts          # Better Auth browser client
│   ├── server-session.ts       # Server-side session helper
│   ├── appointment-rules.ts    # Slot/date rules shared by UI
│   ├── format.ts               # Currency, date and text formatters
│   └── utils.ts                # Class name helper
└── types/                      # Backend response models
```

---

## Routes

### Public

| Route | Description |
| --- | --- |
| `/` | Homepage |
| `/services` | Service menu with filters, sorting and pagination |
| `/services/[id]` | Service details and booking form |
| `/about` | Salon story and values |
| `/contact` | Contact details and salon information |

### Auth

| Route | Description |
| --- | --- |
| `/sign-in` | Email/password and Google sign-in |
| `/sign-up` | Account registration |

### Customer dashboard

| Route | Description |
| --- | --- |
| `/dashboard` | Redirects to the dashboard for the signed-in role |
| `/dashboard/customer` | Appointment summary |
| `/dashboard/customer/appointments` | Appointment list and status filter |
| `/dashboard/customer/appointments/[id]` | Appointment details and actions |
| `/dashboard/customer/profile` | Profile editor |

### Admin dashboard

| Route | Description |
| --- | --- |
| `/dashboard/admin` | Salon overview |
| `/dashboard/admin/services` | Service management |
| `/dashboard/admin/services/add` | Create a service |
| `/dashboard/admin/services/[id]/edit` | Edit a service |
| `/dashboard/admin/appointments` | Appointment management |
| `/dashboard/admin/users` | Customer directory |
| `/dashboard/admin/transactions` | Payment records |
| `/dashboard/admin/profile` | Administrator profile |

### Payment

| Route | Description |
| --- | --- |
| `/payment/success?session_id=...` | Verifies a Stripe checkout session |
| `/payment/cancel` | Customer returned without completing checkout |

Server-side layouts redirect unauthenticated visitors to sign-in, and a customer
cannot open the admin area (the API enforces this too).

---

## API integration status

**The UI is complete. The HTTP layer is deliberate homework.**

Every function in `src/lib/api/` is typed and throws `ApiNotImplementedError`.
Pages use `useApiResource`, detect that error and render a clear
"API integration pending" panel or toast. There is:

- no fake service list
- no fake appointment
- no fake dashboard number
- no fake auth success
- no client-side payment confirmation

When you implement a function, the page that calls it starts rendering real data
with no component changes. Start with the request helper and endpoint map in
[`API_INTEGRATION.md`](./API_INTEGRATION.md).

Protected requests must send a fresh Better Auth JWT:

```ts
const { data } = await authClient.token();
// Authorization: Bearer <data.token>
```

The Express API does not read Better Auth cookies. JWTs expire in roughly 15
minutes, so request a token per call.

Payment truth lives on the server: the Stripe webhook writes the transaction and
the browser may only trust the `verifyPayment()` response. The success page shows
"Payment confirmed" only when the backend returns `status: "paid"`.

---

## Design system

The palette and typography are defined once in `src/app/globals.css`:

| Token | Value | Use |
| --- | --- | --- |
| Background | `#f8f5f0` | Warm ivory page surface |
| Foreground | `#302b2b` | Soft charcoal text |
| Primary | `#8d5360` | Dusty rose actions and accents |
| Secondary | `#e8dcd0` | Soft beige panels |
| Accent | `#b68c70` | Muted bronze highlights |
| Border | `#e3d8cc` | Warm hairline borders |

- Headings use **Cormorant Garamond** for an editorial salon feel.
- Body copy uses **Josefin Sans** for clean, geometric readability.
- Buttons are pill-shaped; cards use restrained radii and warm borders.
- The `.page-width` utility keeps content aligned across every page.
- Utility classes such as `.eyebrow` keep small labels consistent.

Reusable components live in `src/components/common/` and are shared by the
public site and both dashboards.

---

## Responsive behaviour

The layout is designed mobile-first and checked at three widths:

| Width | Behaviour |
| --- | --- |
| **375 px** | Single column, mobile nav sheet, stacked filters, tables become cards, full-width primary actions |
| **768 px** | Two-column forms and cards, tablet-friendly spacing, filters begin to sit inline |
| **1440 px** | Full page width, multi-column dashboards, complete data tables, sidebar navigation |

Details that make small screens usable:

- Admin data tables have dedicated card layouts below `md`
- Filter grids stack and keep 40 px tap targets
- Long values (emails, Stripe session IDs) wrap or truncate deliberately
- Dialogs use near-full width on phones
- The dashboard sidebar becomes a sheet with the same destinations

---

## Quality checks

Run before shipping:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Manual checks worth repeating:

- Sign in, sign up and Google OAuth
- Customer cannot reach admin routes
- Booking form validates date, slot and message
- Admin transitions respect `pending → confirmed/cancelled` and
  `confirmed → cancelled`
- Payment success never says "paid" without a verified backend response
- Empty, loading, error and pending-integration states at 375 / 768 / 1440 px

---

## Known limitations

These come from the supplied backend, not the UI:

| Limitation | Effect |
| --- | --- |
| No `GET /api/admin/services/:id` | Inactive services cannot be loaded in the edit form until activated from the list |
| `POST /api/uploads/image` is documented but not registered | The UI uses image URL fields; upload must wait for the route |
| No reschedule endpoint | Customers contact the salon to change a confirmed time |
| No refund endpoint | Admin cancellation preserves payment and issues no refund |
| Admin appointment filters cover status and date only | No customer-name search on that list |
| Public services carry no currency | The UI formats using the salon's default currency constant |

Each limitation is also described where a customer or admin would meet it. See
[`API_INTEGRATION.md`](./API_INTEGRATION.md) for suggested backend fixes.

---

## Notes for reviewers

- The Better Auth setup writes to the same MongoDB database the Express API
  reads, which is why both apps must share `DB_NAME` / `MONGODB_DB_NAME`.
- `src/lib/api/` is the only place that should ever perform network requests to
  Express. Components call those functions and handle their results.
- Do not convert pending-integration panels into optimistic success states.
  Honest placeholders are a feature of this handoff.
