# StayZ Architecture

StayZ is a Next.js 16 App Router application for room discovery and owner listing management. The current codebase has authentication, route protection, a dashboard shell, placeholder listing pages, and a Prisma schema focused on users and Auth.js tables.

## Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16.2.9, App Router |
| UI | React 19, Tailwind CSS 4, shadcn/radix-vega components |
| Icons | lucide-react |
| Auth | Auth.js/NextAuth v5 beta |
| ORM | Prisma 6 |
| Database | PostgreSQL |
| Password Hashing | bcryptjs |
| Theme | next-themes, default dark mode |

## Application Layout

```text
app/
  layout.tsx                 Root layout, fonts, theme provider
  page.tsx                   Public home placeholder
  listings/                  Public listing routes
  (auth)/                    Login and signup route group
  (dashboard)/               Authenticated dashboard route group
  api/                       Route handlers
components/
  login-form.tsx             Client login form
  signup-form.tsx            Client signup form
  theme-provider.tsx         next-themes provider
  ui/                        shadcn-style primitives
lib/
  auth.ts                    Auth.js configuration
  prisma.ts                  Prisma singleton
  utils.ts                   Shared utilities
prisma/
  schema.prisma              Database schema
  seed.ts                    Empty seed placeholder
Docs/
  *.md                       Project documentation
```

## Routing Model

The project uses file-system routing from the Next.js App Router:

- `page.tsx` files define UI routes.
- `layout.tsx` files define shared UI shells.
- Parenthesized folders such as `(auth)` and `(dashboard)` are route groups and do not appear in URLs.
- `route.ts` files define API route handlers.
- `proxy.ts` is used for request-time auth redirects. In Next.js 16, Proxy is the renamed Middleware convention.

Current URL routes:

| URL | Source | Access |
| --- | --- | --- |
| `/` | `app/page.tsx` | Public |
| `/login` | `app/(auth)/login/page.tsx` | Public, redirects to dashboard if logged in |
| `/signup` | `app/(auth)/signup/page.tsx` | Public, redirects to dashboard if logged in |
| `/listings` | `app/listings/page.tsx` | Public |
| `/listings/[id]` | `app/listings/[id]/page.tsx` | Public |
| `/dashboard` | `app/(dashboard)/dashboard/page.tsx` | Protected |
| `/dashboard/listings/new` | `app/(dashboard)/dashboard/listings/new/page.tsx` | Protected |

## Authentication Flow

`lib/auth.ts` exports:

- `handlers` for the NextAuth route.
- `auth` for server-side session reads.
- `signIn` and `signOut` helpers.

Credentials login:

1. User submits `components/login-form.tsx`.
2. The form calls `signIn("credentials", { redirect: false })`.
3. Auth.js checks the user by email through Prisma.
4. bcrypt compares the submitted password with the stored hash.
5. On success, the user is sent to `/dashboard`.

Signup:

1. User submits `components/signup-form.tsx`.
2. The form posts to `/api/auth/register`.
3. The API rejects duplicate emails.
4. Password is hashed with bcrypt.
5. User is created with default `USER` role.
6. The user is redirected to `/login`.

Google login:

1. User clicks "Continue with Google".
2. Auth.js handles OAuth through `/api/auth/[...nextauth]`.
3. Auth.js Prisma adapter stores linked account data.

## Route Protection

`proxy.ts` checks the current session and route path before rendering.

Behavior:

- Allows public routes and auth APIs.
- Redirects logged-in users away from `/login` and `/signup` to `/dashboard`.
- Redirects unauthenticated users from protected routes to `/login?callbackUrl=<path>`.

Important note: Proxy should stay lightweight. Authorization that requires database ownership checks should happen inside pages, server actions, or route handlers.

## Data Layer

Prisma is initialized in `lib/prisma.ts` as a global singleton during development to avoid creating too many clients during hot reloads.

The current schema includes:

- `User`
- `Account`
- `Session`
- `VerificationToken`
- `Role`

Listing, review, saved listing, booking, and image models are not implemented yet.

## UI Architecture

The interface is component-driven:

- Reusable primitives live in `components/ui`.
- `Button`, `Card`, `Field`, `Input`, and related primitives follow shadcn-style composition.
- Page-specific forms live in `components/login-form.tsx` and `components/signup-form.tsx`.
- Dashboard UI is currently implemented directly in `app/(dashboard)/dashboard/page.tsx`.

Styling conventions:

- Tailwind CSS 4 via `app/globals.css`.
- CSS variables define color tokens and radii.
- `next-themes` toggles dark mode through the `class` attribute.
- Default theme is dark.

## Current Gaps

- Listing database models are missing.
- Listing APIs are empty.
- Upload API is empty.
- Profile/user API is empty.
- Server-side validation is minimal.
- README mentions several future features that are not yet implemented.
- Some pages are placeholders and should be replaced with production UI.
- Seed data is not populated.

## Recommended Direction

Build the product in thin vertical slices:

1. Add listing-related Prisma models and migrations.
2. Implement public listing list/detail APIs.
3. Replace listing placeholder pages with real data.
4. Implement owner listing creation.
5. Add image upload and listing image association.
6. Add profile and role upgrade flow.
7. Add reviews, bookmarks, and reporting.
