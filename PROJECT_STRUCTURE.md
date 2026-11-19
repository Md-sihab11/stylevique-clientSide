# Stylevique Frontend — Project Structure

> **Status: structure only.** This scaffold contains folders, placeholder `.gitkeep` files, and documentation. It does **not** contain feature implementation, authentication logic, API requests, database code, or working forms.

Last updated: 2026-11-18

## 1. Project at a glance

| Area | Choice |
| --- | --- |
| Framework | Next.js 16.4.6 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI kit | shadcn UI (`base-nova` style, neutral base color) |
| Auth | Better Auth (installed, not configured yet) |
| Forms | React Hook Form + Zod + `@hookform/resolvers` (installed, not wired yet) |
| Notifications | Sonner |
| Icons | Lucide React |
| Package manager | npm (`package-lock.json`) |
| Import alias | `@/*` → `src/*` |

## 2. Reading this document

| Marker | Meaning |
| --- | --- |
| **Existing** | Was already in the project and has been preserved. |
| **Created** | New directory or documentation added during this scaffold. |
| **Planned** | A future filename or feature. It does **not** exist on disk yet. |
| `.gitkeep` | Empty placeholder so Git can track an otherwise empty directory. It has no runtime effect. |

The **current tree** below shows only files that actually exist. The **planned route tree** is documentation for implementation time; those route files were intentionally not created as empty files.

## 3. Current folder tree

Generated folders and caches (`.next/`, `node_modules/`) are omitted.

```text
stylevique/
│
├── public/
│   ├── images/
│   │   ├── banners/
│   │   │   └── .gitkeep
│   │   ├── profiles/
│   │   │   └── .gitkeep
│   │   └── services/
│   │       └── .gitkeep
│   ├── icons/
│   │   └── .gitkeep
│   ├── logo/
│   │   └── .gitkeep
│   └── logo.png
│
├── src/
│   │
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   │   └── .gitkeep
│   │   │   └── sign-up/
│   │   │       └── .gitkeep
│   │   │
│   │   ├── (public)/
│   │   │   └── services/
│   │   │       └── [id]/
│   │   │           └── .gitkeep
│   │   │
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...all]/
│   │   │           └── .gitkeep
│   │   │
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   │   ├── appointments/
│   │   │   │   │   └── .gitkeep
│   │   │   │   ├── profile/
│   │   │   │   │   └── .gitkeep
│   │   │   │   ├── services/
│   │   │   │   │   ├── add/
│   │   │   │   │   │   └── .gitkeep
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── edit/
│   │   │   │   │           └── .gitkeep
│   │   │   │   ├── transactions/
│   │   │   │   │   └── .gitkeep
│   │   │   │   └── users/
│   │   │   │       └── .gitkeep
│   │   │   │
│   │   │   └── customer/
│   │   │       ├── appointments/
│   │   │       │   └── .gitkeep
│   │   │       └── profile/
│   │   │           └── .gitkeep
│   │   │
│   │   ├── payment/
│   │   │   ├── cancel/
│   │   │   │   └── .gitkeep
│   │   │   └── success/
│   │   │       └── .gitkeep
│   │   │
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── appointments/
│   │   │   └── .gitkeep
│   │   ├── auth/
│   │   │   └── .gitkeep
│   │   ├── dashboard/
│   │   │   └── .gitkeep
│   │   ├── forms/
│   │   │   └── .gitkeep
│   │   ├── home/
│   │   │   └── .gitkeep
│   │   ├── layout/
│   │   │   └── .gitkeep
│   │   ├── services/
│   │   │   └── .gitkeep
│   │   ├── shared/
│   │   │   └── .gitkeep
│   │   └── ui/
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── sheet.tsx
│   │       ├── table.tsx
│   │       └── tabs.tsx
│   │
│   ├── constants/
│   │   └── .gitkeep
│   ├── hooks/
│   │   └── .gitkeep
│   ├── lib/
│   │   └── utils.ts
│   ├── types/
│   │   └── .gitkeep
│   └── validators/
│       └── .gitkeep
│
├── .env.example
├── .gitignore
├── AGENTS.md
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── PROJECT_STRUCTURE.md
├── README.md
├── textCMD.txt
└── tsconfig.json
```

## 4. Planned route files

These files are **not created yet**. Add each one only when you start implementing that screen, with a real default export (or a real `route.ts` handler for APIs). Empty route files are invalid and can break the build.

```text
src/app/
│
├── (public)/
│   ├── page.tsx                    # planned: public homepage
│   └── services/
│       ├── page.tsx                # planned: services listing
│       └── [id]/
│           └── page.tsx            # planned: service detail / booking entry
│
├── (auth)/
│   ├── sign-in/
│   │   └── page.tsx                # planned: sign in
│   └── sign-up/
│       └── page.tsx                # planned: sign up
│
├── dashboard/
│   ├── layout.tsx                  # planned: dashboard shell
│   ├── page.tsx                    # planned: role-aware dashboard home
│   │
│   ├── customer/
│   │   ├── page.tsx                # planned: customer dashboard home
│   │   ├── appointments/
│   │   │   └── page.tsx            # planned: customer appointments
│   │   └── profile/
│   │       └── page.tsx            # planned: customer profile
│   │
│   └── admin/
│       ├── page.tsx                # planned: admin dashboard home
│       ├── services/
│       │   ├── page.tsx            # planned: manage services
│       │   ├── add/
│       │   │   └── page.tsx        # planned: add service
│       │   └── [id]/
│       │       └── edit/
│       │           └── page.tsx    # planned: edit service
│       ├── appointments/
│       │   └── page.tsx            # planned: all appointments
│       ├── users/
│       │   └── page.tsx            # planned: user management
│       ├── transactions/
│       │   └── page.tsx            # planned: transactions
│       └── profile/
│           └── page.tsx            # planned: admin profile
│
├── payment/
│   ├── success/
│   │   └── page.tsx                # planned: payment success
│   └── cancel/
│       └── page.tsx                # planned: payment cancelled
│
├── api/
│   └── auth/
│       └── [...all]/
│           └── route.ts            # planned: Better Auth route handler
│
├── layout.tsx                      # existing root layout
├── page.tsx                        # existing current homepage
├── loading.tsx                     # planned: global loading UI
├── error.tsx                       # planned: global error boundary
├── not-found.tsx                   # planned: custom 404
└── globals.css                     # existing global styles
```

### Route map

| URL | Planned file | Notes |
| --- | --- | --- |
| `/` | `src/app/(public)/page.tsx` | Move the existing root homepage here when the public layout is introduced. |
| `/services` | `src/app/(public)/services/page.tsx` | Public service catalog. |
| `/services/[id]` | `src/app/(public)/services/[id]/page.tsx` | Dynamic service detail page. |
| `/sign-in` | `src/app/(auth)/sign-in/page.tsx` | Route group name is not part of the URL. |
| `/sign-up` | `src/app/(auth)/sign-up/page.tsx` | Route group name is not part of the URL. |
| `/dashboard` | `src/app/dashboard/page.tsx` | Role-aware entry point. |
| `/dashboard/customer` | `src/app/dashboard/customer/page.tsx` | Customer home. |
| `/dashboard/customer/appointments` | `src/app/dashboard/customer/appointments/page.tsx` | Customer appointments. |
| `/dashboard/customer/profile` | `src/app/dashboard/customer/profile/page.tsx` | Customer profile. |
| `/dashboard/admin` | `src/app/dashboard/admin/page.tsx` | Admin home. |
| `/dashboard/admin/services` | `src/app/dashboard/admin/services/page.tsx` | Service management. |
| `/dashboard/admin/services/add` | `src/app/dashboard/admin/services/add/page.tsx` | Add a service. |
| `/dashboard/admin/services/[id]/edit` | `src/app/dashboard/admin/services/[id]/edit/page.tsx` | Edit a service. |
| `/dashboard/admin/appointments` | `src/app/dashboard/admin/appointments/page.tsx` | All appointments. |
| `/dashboard/admin/users` | `src/app/dashboard/admin/users/page.tsx` | User management. |
| `/dashboard/admin/transactions` | `src/app/dashboard/admin/transactions/page.tsx` | Transactions. |
| `/dashboard/admin/profile` | `src/app/dashboard/admin/profile/page.tsx` | Admin profile. |
| `/payment/success` | `src/app/payment/success/page.tsx` | Payment success result. |
| `/payment/cancel` | `src/app/payment/cancel/page.tsx` | Payment cancelled result. |
| `/api/auth/*` | `src/app/api/auth/[...all]/route.ts` | Better Auth catch-all API handler. |

> **Important route-group warning:** Do not create `src/app/(public)/page.tsx` while `src/app/page.tsx` still exists. Both resolve to `/`, and Next.js will report conflicting routes. Move the existing homepage into `(public)` in one change, then delete the old root file.

## 5. Folder responsibilities

### Root and static assets

| Path | Responsibility |
| --- | --- |
| `public/` | Files served from the site root. A file at `public/logo.png` is available as `/logo.png`. |
| `public/images/services/` | Service photos used by cards, listings, and detail pages. |
| `public/images/banners/` | Hero and promotional banners. |
| `public/images/profiles/` | Default avatars and profile imagery. |
| `public/icons/` | Small SVG/PNG icons that are not Lucide components. |
| `public/logo/` | Future brand/logo source files. The existing `public/logo.png` is preserved and is not moved. |
| `.env.example` | Safe template for local environment variables. Copy it to `.env.local`; never commit real secrets. |
| `.gitignore` | Keeps dependencies, build output, local env files, and generated files out of Git. |
| `next.config.ts` | Next.js configuration. Do not change without a concrete reason. |
| `components.json` | shadcn UI configuration and import aliases. |
| `tsconfig.json` | TypeScript configuration and the `@/*` path alias. |
| `package.json` / `package-lock.json` | Dependency manifest and lockfile. No packages were added, removed, or upgraded. |
| `README.md` | Current create-next-app starter README. Replace with project documentation later. |
| `textCMD.txt` | Existing command notes. Preserved as-is. |
| `AGENTS.md` | Existing project/agent instructions. Preserved as-is. |

### Application routes

| Path | Responsibility |
| --- | --- |
| `src/app/` | App Router entry point. Route folders and reserved files live here. |
| `src/app/layout.tsx` | Existing root layout with `<html>`, `<body>`, fonts, and global CSS. |
| `src/app/page.tsx` | Existing starter homepage at `/`. Kept temporarily to avoid a conflicting `(public)/page.tsx`. |
| `src/app/(public)/` | Public marketing/catalog routes. Parentheses mean the group name is omitted from the URL. |
| `src/app/(auth)/` | Sign-in and sign-up routes with their own future auth layout. Group name is omitted from the URL. |
| `src/app/dashboard/` | Authenticated customer/admin area. `dashboard` is a real URL segment. |
| `src/app/dashboard/customer/` | Customer-only screens. |
| `src/app/dashboard/admin/` | Admin-only screens. |
| `src/app/payment/` | Payment result screens after a checkout redirect. |
| `src/app/api/auth/[...all]/` | Catch-all API route for Better Auth future `route.ts`. |
| `src/app/loading.tsx` | Planned global loading fallback. Not created yet. |
| `src/app/error.tsx` | Planned global error boundary. Must be a Client Component with `error`/`reset` props when implemented. |
| `src/app/not-found.tsx` | Planned custom 404 page. |

### Components

| Path | Responsibility |
| --- | --- |
| `src/components/ui/` | Existing shadcn primitives (`button`, `card`, `dialog`, etc.). Keep these generic; avoid business logic here. |
| `src/components/shared/` | Cross-feature reusable pieces such as empty states, section headings, and confirmation dialogs. |
| `src/components/layout/` | Navbar, footer, sidebars, and page shells. |
| `src/components/home/` | Homepage-only sections such as hero, featured services, and testimonials. |
| `src/components/services/` | Service cards, lists, filters, and detail-page pieces. |
| `src/components/appointments/` | Appointment cards, tables, status badges, and booking UI. |
| `src/components/dashboard/` | Dashboard widgets such as stat cards, charts, and recent activity. |
| `src/components/auth/` | Sign-in/sign-up UI. Keep form validation in `validators/` and auth calls in `lib/`. |
| `src/components/forms/` | Reusable form field wrappers and submit controls. Page-specific forms can live with their feature instead. |

### Shared code

| Path | Responsibility |
| --- | --- |
| `src/lib/` | Third-party setup and shared helpers. Planned files: `auth.ts` (server Better Auth config), `auth-client.ts` (browser auth client), and `api-client.ts` (HTTP wrapper). `utils.ts` already exists and re-exports `cn`. |
| `src/hooks/` | Reusable client-side hooks, named `use-*.ts` (for example `use-debounce.ts`). Do not put API configuration here. |
| `src/types/` | Shared TypeScript types and interfaces (for example `service.ts`, `appointment.ts`, `user.ts`). Props used by one component can stay beside that component. |
| `src/validators/` | Zod schemas shared by forms and server actions/route handlers. One domain per file, such as `auth.ts`, `service.ts`, and `appointment.ts`. |
| `src/constants/` | Static configuration: navigation links, user roles, appointment statuses, and similar values. No secrets or environment-specific URLs. |

## 6. Naming and placement conventions

- Use **kebab-case** for component filenames: `service-card.tsx`, `appointment-table.tsx`.
- Use **PascalCase** for React component exports: `export function ServiceCard()`.
- Use **camelCase** for functions and variables, and **UPPER_SNAKE_CASE** for true constants.
- Keep route files at their reserved names: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, and `route.ts`.
- Use the `@/` alias instead of long relative paths: `@/components/ui/button`.
- Default to Server Components. Add `"use client"` only to files that need state, effects, event handlers, or browser APIs.
- Keep `auth.ts` server-only. Never import it into a Client Component; use `auth-client.ts` there instead.
- Put a schema in `validators/` when it is shared by more than one form/feature. Keep one-off schemas close to their form.
- Do not place business logic in `components/ui/`; those files should remain reusable primitives.

## 7. What already existed

### Configuration and root files

- `package.json`, `package-lock.json`
- `next.config.ts`, `tsconfig.json`, `next-env.d.ts`
- `components.json`, `eslint.config.mjs`
- `.gitignore`, `README.md`, `AGENTS.md`, `textCMD.txt`
- Generated folders: `node_modules/`, `.next/`

### Application and library files

- `src/app/layout.tsx`
- `src/app/page.tsx` (starter homepage)
- `src/app/globals.css`
- `src/app/favicon.ico`
- `src/lib/utils.ts`
- `public/logo.png`

### shadcn UI components

`avatar.tsx`, `badge.tsx`, `button.tsx`, `card.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `input.tsx`, `label.tsx`, `select.tsx`, `sheet.tsx`, `table.tsx`, `tabs.tsx` — all inside `src/components/ui/`.

All existing files were preserved. No existing source file was overwritten or deleted.

## 8. What was newly created

### Directories

- `public/images/`, `public/images/services/`, `public/images/banners/`, `public/images/profiles/`
- `public/icons/`, `public/logo/`
- `src/app/(public)/`, `src/app/(public)/services/`, `src/app/(public)/services/[id]/`
- `src/app/(auth)/`, `src/app/(auth)/sign-in/`, `src/app/(auth)/sign-up/`
- `src/app/dashboard/`, `src/app/dashboard/customer/`, `src/app/dashboard/customer/appointments/`, `src/app/dashboard/customer/profile/`
- `src/app/dashboard/admin/`, `src/app/dashboard/admin/services/`, `src/app/dashboard/admin/services/add/`, `src/app/dashboard/admin/services/[id]/`, `src/app/dashboard/admin/services/[id]/edit/`
- `src/app/dashboard/admin/appointments/`, `src/app/dashboard/admin/users/`, `src/app/dashboard/admin/transactions/`, `src/app/dashboard/admin/profile/`
- `src/app/payment/`, `src/app/payment/success/`, `src/app/payment/cancel/`
- `src/app/api/`, `src/app/api/auth/`, `src/app/api/auth/[...all]/`
- `src/components/shared/`, `src/components/layout/`, `src/components/home/`, `src/components/services/`
- `src/components/appointments/`, `src/components/dashboard/`, `src/components/auth/`, `src/components/forms/`
- `src/hooks/`, `src/types/`, `src/validators/`, `src/constants/`

### Placeholder and documentation files

- 31 `.gitkeep` files in empty leaf directories
- `.env.example`
- `PROJECT_STRUCTURE.md`
- One line added to `.gitignore`: `!.env.example` (so the env template can be committed while real env files stay ignored)

### Files intentionally not created

- No `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, or `route.ts` placeholders were added. Empty route files are invalid or create blank routes.
- No component implementation files, auth setup, API client, validators, types, or hooks were added.
- No packages were installed, removed, or upgraded.
- No working configuration file was changed beyond the `.gitignore` exception above.

## 9. Recommended next structural adjustments

1. **Move the homepage into the public group.** When you begin public UI work, move `src/app/page.tsx` to `src/app/(public)/page.tsx` and add `src/app/(public)/layout.tsx`. Do this in one change so `/` never has two competing pages.
2. **Add `src/app/dashboard/layout.tsx` before dashboard pages.** It should own the sidebar/header shell and auth-aware navigation. Keep customer/admin page files inside their existing folders.
3. **Add `(auth)/layout.tsx` only if auth screens need a different visual shell.** Otherwise, the root layout is enough.
4. **Create API auth with `route.ts`, not `page.tsx`.** The Better Auth catch-all belongs at `src/app/api/auth/[...all]/route.ts`.
5. **Add route files only with real implementations.** A `page.tsx` needs a default export; an `error.tsx` needs a Client Component with `error` and `reset`; a `route.ts` needs an HTTP handler.
6. **Check the payment dependency before building payment screens.** `textCMD.txt` mentions `@stripe/stripe-js`, but it is not currently listed in `package.json`. No installation was performed; confirm the payment approach first.
7. **Add form primitives when forms begin.** The current shadcn set has no `form.tsx`/field wrapper even though React Hook Form is installed. Add the appropriate shadcn form components then, not now.
8. **Resolve the starter homepage assets.** The existing starter `src/app/page.tsx` references `/next.svg` and `/vercel.svg`, which are not in `public/`. This does not block the structure, but replace the starter page when the public homepage begins.
9. **Decide what to do with the logo.** `public/logo.png` and the new `public/logo/` directory coexist. Later, you can move the file into the folder and update references; nothing was moved now.
10. **Update `README.md` later.** It is still the default create-next-app README; project-specific setup and architecture notes can replace it when implementation starts.
