# Stylevique API Integration Guide

This frontend is **complete at the UI layer**. Every HTTP request is deliberately
left as a typed TODO inside `src/lib/api/`. That is not a bug and not missing
data: the app never pretends a request succeeded.

This guide maps each screen to the exact Express endpoint it needs. When you
replace a TODO with a working request, the existing page will start showing real
data without a redesign.

---

## 1. Current status

| Layer | Status |
| --- | --- |
| Pages, layouts, navigation, forms, dialogs, filters, dashboards | Implemented |
| Validation and loading / error / empty / pending states | Implemented |
| Better Auth sign-in, sign-up, Google OAuth, sign-out | Implemented |
| Server-side customer / admin route guards | Implemented |
| `fetch` / Axios requests to the Express API | **TODO on purpose** |
| Fake data, fake auth success, fake payments | **Not present** |
| Image upload route | **Not available in the supplied backend** |

Every API placeholder throws `ApiNotImplementedError`. Pages catch it and render
the `PendingIntegration` component or an honest Sonner toast. When you implement
a function, remove nothing in the page: the same component will receive real
data automatically.

---

## 2. How the two apps fit together

```text
Browser
  │
  ├── Better Auth (Next.js)  ──  MongoDB (users, sessions)
  │        │
  │        └── issues JWT via authClient.token()
  │
  └── Express API (port 5000)
           ├── verifies JWT with Better Auth JWKS
           ├── reads/writes the same MongoDB database
           ├── talks to Stripe Checkout + webhook
           └── talks to ImgBB (upload route is not registered yet)
```

Key points:

- Express does **not** handle login or registration. Better Auth does.
- Express accepts `Authorization: Bearer <jwt>`, not the Better Auth cookie.
- The MongoDB database name must match between Better Auth and Express.
- Stripe success is **only** written by the Express webhook. The browser must
  never mark an appointment or transaction as paid on its own.

---

## 3. Environment variables

### Frontend (`.env.local`)

See [`.env.example`](./.env.example). The important ones:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Browser origin of this app, e.g. `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Express origin, e.g. `http://localhost:5000` |
| `BETTER_AUTH_URL` | Server origin used by Better Auth |
| `BETTER_AUTH_SECRET` | Long random secret used to sign auth data |
| `MONGODB_URI` | MongoDB connection string shared with the backend |
| `MONGODB_DB_NAME` | Optional; defaults to `stylevique` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Unused today; keep only if you add Stripe.js |

Google redirect URI:

```text
http://localhost:3000/api/auth/callback/google
```

### Backend (`Server-side - Copy/stylevique-server/.env`)

The Express app needs these to accept this frontend's requests:

| Variable | Example / note |
| --- | --- |
| `MONGODB_URI` | Same cluster as the frontend |
| `DB_NAME` | Must equal `MONGODB_DB_NAME` (normally `stylevique`) |
| `CLIENT_URL` | `http://localhost:3000` (comma-separated origins supported) |
| `BETTER_AUTH_JWKS_URL` | `http://localhost:3000/api/auth/jwks` |
| `BETTER_AUTH_ISSUER` | Normally `http://localhost:3000` |
| `BETTER_AUTH_AUDIENCE` | Normally `http://localhost:3000` |
| `STRIPE_SECRET_KEY` | Required for checkout and webhook verification |
| `STRIPE_WEBHOOK_SECRET` | Required by the Stripe webhook |
| `STRIPE_CURRENCY` | Optional, default `usd` |
| `ADMIN_EMAIL` | Used by the backend's admin bootstrap flow |

The frontend never needs the Stripe secret key.

---

## 4. Golden rules

1. **Never fake a success.** Do not return invented arrays, objects or "ok"
   values from `src/lib/api/`. A page may only show data the backend returned.
2. **Never mark payments paid in the browser.** Call `verifyPayment()` and trust
   only its `status`. The webhook is the source of truth.
3. **Get a fresh JWT per protected request.** Better Auth JWTs are short-lived
   (about 15 minutes).
4. **Send the token as a Bearer header.** The Express API does not read the
   Better Auth cookie.
5. **Respect backend transitions.** Customers cancel only pending appointments;
   admins confirm/cancel pending and cancel confirmed. There is no reschedule
   endpoint.
6. **Use backend error messages.** Show `message` and optional `errors[]` from
   the envelope instead of generic guesses.

---

## 5. Response envelope

Every endpoint uses one of these shapes:

```json
{
  "success": true,
  "message": "Services retrieved successfully.",
  "data": { }
}
```

```json
{
  "success": false,
  "message": "Validation failed. Please check the submitted fields.",
  "errors": [{ "field": "price", "message": "Price must be greater than 0." }]
}
```

Pagination, whenever a list is paginated:

```json
{
  "page": 1,
  "limit": 12,
  "totalItems": 42,
  "totalPages": 4,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

Status codes you should expect:

| Code | Meaning |
| --- | --- |
| `200` | Success |
| `201` | Created (service, appointment, checkout) |
| `400` | Malformed ID or verification input |
| `401` | Missing / expired Bearer token |
| `403` | Signed in but wrong role, blocked account, or not the owner |
| `404` | Record not found (including inactive public services) |
| `409` | Rule conflict (slot taken, wrong status, already paid) |
| `422` | Validation failed; read `errors[]` |
| `429` | Booking / checkout rate limit |
| `502` / `503` | Stripe or a required service is unavailable |

---

## 6. Suggested request helper

The repository deliberately does not include a working HTTP helper. Add one
inside `src/lib/api/` when you are ready, for example `client.ts`:

```ts
import { authClient } from "@/lib/auth-client";
import { API_BASE_URL } from "./config";

export class ApiRequestError extends Error {
  status: number;
  fields: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    status: number,
    fields: Array<{ field: string; message: string }> = [],
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.fields = fields;
  }
}

export async function getAccessToken() {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  return data.token;
}

export async function apiRequest<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
    auth?: boolean;
    query?: Record<string, string | number | boolean | undefined>;
  } = {},
) {
  const url = new URL(path, API_BASE_URL);

  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const headers: Record<string, string> = { Accept: "application/json" };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (options.auth !== false) {
    headers.Authorization = `Bearer ${await getAccessToken()}`;
  }

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    throw new ApiRequestError(
      payload?.message ?? "The request could not be completed.",
      response.status,
      payload?.errors ?? [],
    );
  }

  return payload.data as T;
}
```

Then a TODO becomes:

```ts
export async function getServices(
  params: ServiceListParams = {},
): Promise<ServiceListResponse> {
  return apiRequest<ServiceListResponse>("/api/services", {
    auth: false,
    query: {
      search: params.search,
      category: params.category,
      sort: params.sort,
      page: params.page,
      limit: params.limit,
    },
  });
}
```

For `verifyPayment`, put `session_id` in `query` instead of the path.

---

## 7. Function → endpoint map

All paths below are appended to `NEXT_PUBLIC_API_URL`.

### Public services — `src/lib/api/services.ts`

| Function | Endpoint | Auth | Query / body | Response `data` |
| --- | --- | --- | --- | --- |
| `getServices` | `GET /api/services` | none | `search`, `category`, `sort`, `page`, `limit` | `{ services, pagination }` |
| `getServiceCategories` | `GET /api/services/categories` | none | — | `{ categories }` |
| `getServiceById` | `GET /api/services/:id` | none | — | `{ service }` |

Notes:

- `sort` is `newest` (default), `oldest`, `price_asc` or `price_desc`.
- `page` ≥ 1; `limit` 1–100.
- Public results only include `status: "active"`.
- `GET /api/services/:id` returns **404 for inactive services**.
- Prices are major currency units (e.g. `65.00`, not cents).

### Admin services — `src/lib/api/services.ts`

| Function | Endpoint | Auth | Query / body | Response `data` |
| --- | --- | --- | --- | --- |
| `getAdminServices` | `GET /api/admin/services` | admin | `search`, `category`, `status`, `sort`, `page`, `limit` | `{ services, pagination }` |
| `createService` | `POST /api/services` | admin | `CreateServiceInput` | `{ service }` (201) |
| `updateService` | `PATCH /api/services/:id` | admin | name, category, description, price, duration, image | `{ service }` |
| `updateServiceStatus` | `PATCH /api/services/:id/status` | admin | `{ status: "active" \| "inactive" }` | `{ service }` |
| `deleteService` | `DELETE /api/services/:id` | admin | — | `{ deletedServiceId }` |

Service validation mirrors the backend:

| Field | Rule |
| --- | --- |
| `serviceName` | 2–120 characters |
| `category` | 2–80 characters |
| `description` | 10–2000 characters |
| `price` | > 0 and ≤ 1,000,000 |
| `duration` | whole number, 1–1440 minutes |
| `image` | valid URL, ≤ 2048 characters |
| `status` | `active` or `inactive` |

`PATCH /api/services/:id` rejects `status`; use the status endpoint.

> **Admin edit limitation:** the supplied backend has no
> `GET /api/admin/services/:id`. `getServiceById()` is the only detail route and
> it only returns **active** services. The edit page therefore cannot load an
> inactive service until it is activated from the list (or the backend adds an
> admin detail endpoint). This is documented in the edit page UI too.

### Customer appointments — `src/lib/api/appointments.ts`

| Function | Endpoint | Auth | Query / body | Response `data` |
| --- | --- | --- | --- | --- |
| `createAppointment` | `POST /api/appointments` | customer | `serviceId`, `appointmentDate` (`YYYY-MM-DD`), `timeSlot`, optional `message` | `{ appointment }` (201) |
| `getMyAppointments` | `GET /api/appointments/my` | customer | `status`, `page`, `limit` | `{ appointments, pagination }` |
| `getAppointmentById` | `GET /api/appointments/:id` | any signed-in | — | `{ appointment }` |
| `cancelAppointment` | `PATCH /api/appointments/:id/cancel` | customer | — | `{ appointment }` |

Booking rules:

- Time slots run from `09:00` to `18:30` in 30-minute steps.
- New appointments start as `pending` / `unpaid`.
- One active appointment per slot is enforced by the backend; a `409` means the
  slot was taken while the customer was choosing.
- Customers may cancel **pending** appointments only.
- `getAppointmentById` allows the owner or an admin; other customers get `403`.

### Admin appointments — `src/lib/api/appointments.ts`

| Function | Endpoint | Auth | Query / body | Response `data` |
| --- | --- | --- | --- | --- |
| `getAdminAppointments` | `GET /api/admin/appointments` | admin | `status`, `date` (`YYYY-MM-DD`), `page`, `limit` | `{ appointments, pagination }`; each row has `customer` |
| `updateAdminAppointmentStatus` | `PATCH /api/admin/appointments/:id/status` | admin | `{ status: "confirmed" \| "cancelled" }` | `{ appointment }` |

Allowed transitions:

```text
pending   -> confirmed | cancelled
confirmed -> cancelled
cancelled -> (no admin action)
```

Cancelling a paid appointment keeps the payment and transaction history and does
**not** issue a refund.

### Users — `src/lib/api/users.ts`

| Function | Endpoint | Auth | Query / body | Response `data` |
| --- | --- | --- | --- | --- |
| `getMyProfile` | `GET /api/users/me` | any signed-in | — | `{ user }` |
| `updateMyProfile` | `PATCH /api/users/me` | any signed-in | `name`, `image`, `phone` | `{ user }` |
| `getCustomers` | `GET /api/admin/users` | admin | `search`, `page`, `limit` | `{ users, pagination }` |
| `getCustomerById` | `GET /api/admin/users/:id` | admin | — | `{ user }` |
| `blockCustomer` | `PATCH /api/admin/users/:id/block` | admin | — | `{ user }` |
| `unblockCustomer` | `PATCH /api/admin/users/:id/unblock` | admin | — | `{ user }` |

Profile validation:

| Field | Rule |
| --- | --- |
| `name` | 1–100 characters |
| `image` | valid URL (≤ 2048) or an empty string |
| `phone` | ≤ 30 characters; digits, spaces, `+ - ( )` only |

Email, role, `isBlocked` and verification are **not** editable through
`/api/users/me`.

Admin customer notes:

- `GET /api/admin/users` excludes administrator accounts.
- Administrator accounts cannot be blocked through the customer API.
- Blocking prevents the customer from using protected APIs, including booking
  and checkout. Existing records are preserved.

### Dashboards — `src/lib/api/dashboard.ts`

| Function | Endpoint | Auth | Response `data` |
| --- | --- | --- | --- |
| `getCustomerDashboard` | `GET /api/dashboard/customer` | customer | `totalAppointments`, `pendingAppointments`, `confirmedAppointments`, `cancelledAppointments` |
| `getAdminDashboard` | `GET /api/dashboard/admin` | admin | `totalRegisteredCustomers`, `totalActiveServices`, `totalAppointments`, pending/confirmed/cancelled counts, `totalSuccessfulPayments`, `totalRevenue`, `currency` |

### Payments — `src/lib/api/payments.ts`

| Function | Endpoint | Auth | Query / body | Response `data` |
| --- | --- | --- | --- | --- |
| `createCheckoutSession` | `POST /api/payments/checkout` | customer | `{ appointmentId }` only | `{ checkoutUrl, sessionId, appointmentId, amount, currency }` |
| `verifyPayment` | `GET /api/payments/verify?session_id=...` | customer | `session_id` | `{ status, appointmentId, paymentStatus, amount, currency, verifiedByWebhook, transaction }` |

Checkout rules:

- Only **confirmed + unpaid** appointments can be paid.
- The request body must contain exactly one field: `appointmentId`.
- If an open Stripe session already exists, the backend reuses it.
- Redirect the browser to `data.checkoutUrl`. Never mark anything paid locally.
- Stripe returns to `/payment/success?session_id={CHECKOUT_SESSION_ID}` or
  `/payment/cancel`.

Verification rules:

- `status` is `"pending"`, `"paid"` or `"failed"`.
- Show success **only** when `status === "paid"`.
- `pending` means the webhook has not recorded the payment yet; the UI offers a
  refresh.
- `failed` means no successful transaction was recorded.
- `verifyPayment` requires a customer account. Administrator accounts get a
  clear message on the success page and should use the transactions screen.

### Transactions — `src/lib/api/transactions.ts`

| Function | Endpoint | Auth | Query | Response `data` |
| --- | --- | --- | --- | --- |
| `getMyTransactions` | `GET /api/transactions/my` | customer | `status`, `page`, `limit` | `{ transactions, pagination }` |
| `getAdminTransactions` | `GET /api/admin/transactions` | admin | `status`, `page`, `limit` | `{ transactions, pagination }` |

`status` is `paid` or `failed`. Admin rows include `customer`; customer rows do
not. Transaction `amount` is in major units and `currency` comes from the
backend's `STRIPE_CURRENCY`.

### Uploads — `src/lib/api/uploads.ts`

```text
POST /api/uploads/image
Content-Type: multipart/form-data
Authorization: Bearer <jwt>
Field: image
```

The backend **README** documents this route and an ImgBB response of
`{ url }`, but the supplied `index.js` does not register it. Until that route
exists, `uploadImage()` must remain a TODO and the UI uses image URL fields
instead. Do not point the form at a route that returns 404.

---

## 8. Page → API map

| Page / component | API function(s) |
| --- | --- |
| Home featured services | `getServices` |
| Services browse | `getServices`, `getServiceCategories` |
| Service details + booking | `getServiceById`, `createAppointment` |
| Customer overview | `getCustomerDashboard` |
| Customer appointments list | `getMyAppointments` |
| Customer appointment detail | `getAppointmentById` |
| Customer cancel action | `cancelAppointment` |
| Customer pay action | `createCheckoutSession` |
| Customer profile | `updateMyProfile` (session supplies initial values) |
| Admin overview | `getAdminDashboard` |
| Admin services list | `getAdminServices`, `getServiceCategories`, `updateServiceStatus`, `deleteService` |
| Admin add service | `createService`, `getServiceCategories` |
| Admin edit service | `getServiceById`, `updateService`, `getServiceCategories` |
| Admin appointments | `getAdminAppointments`, `updateAdminAppointmentStatus` |
| Admin customers | `getCustomers`, `blockCustomer`, `unblockCustomer` |
| Admin transactions | `getAdminTransactions` |
| Admin profile | `updateMyProfile` |
| Payment success | `verifyPayment` |
| Payment cancel | none (informational only) |
| Navbar / dashboard guards | Better Auth session (already implemented) |

`getMyProfile`, `getCustomerById`, `getMyTransactions` and `uploadImage` are
ready for future screens; the current pages do not require them.

---

## 9. Implementation order that works well

1. Add the request helper from section 6.
2. Implement `getMyProfile` and verify a Bearer token reaches Express.
3. Implement public services and categories; confirm the homepage cards appear.
4. Implement customer appointments, then the customer dashboard counts.
5. Implement admin services and the service form.
6. Implement admin appointments and the status actions.
7. Implement admin customers and block/unblock.
8. Implement dashboards and transactions.
9. Implement checkout and verification last, with Stripe test keys and a
   webhook forwarding command:

   ```bash
   stripe listen --forward-to localhost:5000/api/payments/webhook
   ```

10. Only then implement `uploadImage` if the backend route is added.

---

## 10. Testing checklist

- [ ] Backend and frontend both run against the same MongoDB database.
- [ ] Sign-up creates a user visible to Express.
- [ ] `authClient.token()` returns a JWT and `/api/users/me` accepts it.
- [ ] Expired token shows a sign-in message, not a fake empty state.
- [ ] Customer cannot open `/dashboard/admin` (server redirect).
- [ ] Admin cannot create an appointment (UI hide + backend 403).
- [ ] Service filters survive refresh (URL state on the browse page).
- [ ] Cancelling a confirmed appointment is not offered to customers.
- [ ] Cancelling a paid appointment from admin preserves transactions and warns
      about no refund.
- [ ] Payment success page shows success only when `status === "paid"`.
- [ ] `payment/cancel` never claims a payment failed or succeeded.
- [ ] Blocked customer sees a clear error.
- [ ] Empty, loading, error and pending-integration views each work.
- [ ] Responsive checks at 375 px, 768 px and 1440 px.

---

## 11. Known backend gaps to fix before launch

| Gap | Impact | Suggested fix |
| --- | --- | --- |
| No admin service-detail endpoint | Inactive services cannot be edited | Add `GET /api/admin/services/:id` and update `getServiceById`/page loader |
| Upload route documented but not registered | Image upload cannot be wired | Register `POST /api/uploads/image` with ImgBB or use URLs |
| No reschedule endpoint | Confirmed appointments need salon contact | Add a reschedule endpoint or keep the contact flow |
| No refund endpoint | Admin cancellation keeps the payment | Handle refunds in Stripe separately and link the record |
| No customer search over appointments | Admin filters only status/date | Add a customer query if needed |
| Public service has no currency field | Cards display `USD` by default | Expose `currency` or set the frontend constant |

The frontend already labels these limitations where a customer or admin would
encounter them. Do not hide them behind optimistic UI.

---

## 12. Security reminders

- Keep `BETTER_AUTH_SECRET`, `MONGODB_URI`, Stripe secrets and Google secrets
  out of Git and out of `NEXT_PUBLIC_*`.
- Never trust a `?callbackUrl=` without the existing `getSafeCallbackUrl()` check.
- Do not put the JWT in `localStorage`; `authClient.token()` retrieves it from
  the authenticated Better Auth session.
- Do not render HTML from API messages. React escapes text by default.
- Keep the Stripe webhook as the only writer of `paid` transaction state.
- Validate uploaded file type and size on the backend, not only in the browser.
