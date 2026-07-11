# StayZ Architecture

StayZ is a Next.js 16 App Router application for room discovery and owner listing management. The codebase has full authentication, route protection, listing CRUD, Cloudinary image uploads, a booking request system, reviews with per-category ratings, and contact-owner analytics.

---

## Stack

| Area | Technology |
|---|---|
| Framework | Next.js 16.2.9, App Router |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4, shadcn/radix-ui primitives |
| Icons | Lucide React, React Icons |
| Animations | Framer Motion |
| Auth | Auth.js / NextAuth v5 (beta) |
| ORM | Prisma 6 |
| Database | PostgreSQL (Neon hosted) |
| Password Hashing | bcryptjs |
| Image Storage | Cloudinary |
| Deployment | Vercel |

---

## Application Layout

```text
app/
  layout.tsx                     Root layout, fonts, providers
  page.tsx                       Public home page
  (auth)/
    login/page.tsx               Credentials + Google login
    signup/page.tsx              Email/password registration
  (public)/
    listings/page.tsx            Browse/filter listings
    listings/[id]/page.tsx       Listing detail page
    developers/                  Team portfolio pages
  (owner)/
    owner/dashboard/             Owner stats + quick actions
    owner/my-listings/           Owned listing list + management
    owner/add-listing/           Create listing form
    owner/booking-requests/      View and respond to booking requests
  (user)/
    user/dashboard/              Renter dashboard (WIP)
    user/saved/                  Saved listings (WIP)
    user/payments/               Payments (shell only)
    user/agreement/              Agreement (shell only)
  (admin)/
    admin/dashboard/             Admin panel (planned)
  api/
    auth/[...nextauth]/          Auth.js handler
    auth/register/               Email/password registration
    listings/                    GET (browse) + POST (create)
    listings/[id]/               GET, PATCH, DELETE
    listings/[id]/status/        PATCH (mark RENTED/ACTIVE)
    listings/[id]/images/        Image management
    listings/[id]/duplicate/     Duplicate listing
    listings/[id]/contact-click/ POST (analytics counter)
    listings/[id]/booking-requests/ GET (owner) + POST (user)
    listings/[id]/reviews/       POST (submit/update)
    listings/[id]/review-eligibility/ GET (eligibility check)
    booking-requests/[requestId]/ PATCH (accept/reject)
    upload/                      POST (Cloudinary upload)
    user/                        GET/PATCH (own profile)
    user/booking-requests/       GET (own request history)
    dashboard/                   Owner dashboard stats
components/
  listing-details/               Detail-page section components
  home/                          Homepage-specific components
  navbar/                        AppNavBar
  ui/                            shadcn-style primitives
lib/
  auth.ts                        Auth.js configuration
  auth-helpers.ts                requireAuth() helper
  prisma.ts                      Prisma singleton
  listing-service.ts             getListingById, updateListing,
                                 deleteListing, markListingRented,
                                 markListingAvailable
  cloudinary.ts                  Upload + deleteManyFromCloudinary
  validations/                   Server-side listing validation
prisma/
  schema.prisma                  Full database schema
  seed.ts                        Dev seed data
types/                           Shared TypeScript types
proxy.ts                         Next.js Middleware (auth redirects)
```

---

## Routing Model

- `page.tsx` files define UI routes
- `layout.tsx` files define shared shells
- Parenthesized folders (`(auth)`, `(owner)`, `(user)`, `(admin)`, `(public)`) are route groups — they do not appear in URLs
- `route.ts` files define API route handlers
- `proxy.ts` is Next.js Middleware (renamed from `middleware.ts` in Next.js 16)

### URL Map

| URL | Route Group | Access |
|---|---|---|
| `/` | `app/page.tsx` | Public |
| `/login` | `(auth)` | Public, redirects if logged in |
| `/signup` | `(auth)` | Public, redirects if logged in |
| `/listings` | `(public)` | Public |
| `/listings/[id]` | `(public)` | Public |
| `/developers` | `(public)` | Public |
| `/owner/dashboard` | `(owner)` | Protected |
| `/owner/my-listings` | `(owner)` | Protected |
| `/owner/add-listing` | `(owner)` | Protected |
| `/owner/booking-requests` | `(owner)` | Protected |
| `/user/dashboard` | `(user)` | Protected (WIP) |
| `/user/saved` | `(user)` | Protected (WIP) |
| `/admin/dashboard` | `(admin)` | Protected (planned) |

---

## Authentication Flow

`lib/auth.ts` exports:
- `handlers` — NextAuth route handler
- `auth` — server-side session read
- `signIn`, `signOut` — helpers

**Credentials login:**
1. User submits login form
2. Form calls `signIn("credentials", { redirect: false })`
3. Auth.js looks up user by email via Prisma
4. bcrypt compares password hash
5. On success → redirected to `/owner/dashboard` or `/user/dashboard` based on role

**Signup:**
1. Form posts to `/api/auth/register`
2. API rejects duplicate emails
3. Password hashed with bcrypt
4. User created with default `USER` role
5. Redirected to `/login`

**Google OAuth:**
1. User clicks "Continue with Google"
2. Auth.js handles via `/api/auth/[...nextauth]`
3. Prisma adapter stores linked account

**Role Promotion:**
- When a `USER` creates their first listing via `POST /api/listings`, the API automatically upgrades their role to `OWNER`

---

## Route Protection

`proxy.ts` (Next.js Middleware) checks session and route before rendering:
- Public routes: `/`, `/login`, `/signup`, `/listings`, `/listings/*`, `/api/auth/*`, `/developers/*`
- Logged-in users redirected away from `/login` and `/signup`
- Unauthenticated users redirected from protected routes to `/login?callbackUrl=<path>`

> Ownership authorization (e.g. "is this listing owned by the current user?") is enforced inside route handlers and server actions, not in Middleware.

---

## Data Layer

**Prisma singleton** in `lib/prisma.ts` — prevents connection pool exhaustion during hot reloads.

**`lib/listing-service.ts`** centralizes complex listing logic:
- `getListingById(id)` — full detail query including all sub-models
- `updateListing(id, ownerId, data)` — ownership-checked update
- `deleteListing(id, ownerId, role)` — deletes listing + Cloudinary images
- `markListingRented(listingId, ownerId, tx?)` — accepts an optional transaction context (used by the booking accept flow)
- `markListingAvailable(listingId, ownerId)` — reverses RENTED status

**Denormalized rating aggregates:**
- `Listing` stores `avgRating`, `avgCleanliness`, `avgAccuracy`, `avgCheckIn`, `avgCommunication`, `avgLocation`, `avgValue`, and `reviewCount`
- These are recomputed inside a `$transaction` every time a review is submitted or updated
- Avoids expensive aggregation queries on the detail page hot path

---

## Booking Request Flow

```
User → POST /api/listings/[id]/booking-requests
         → creates BookingRequest { status: PENDING }

Owner → GET /api/listings/[id]/booking-requests
         → returns all requests with user info

Owner → PATCH /api/booking-requests/[requestId]
         { status: "ACCEPTED" }
         → $transaction:
             1. Set request.status = ACCEPTED, respondedAt = now()
             2. markListingRented(listingId)
             3. Auto-reject all other PENDING requests for the same listing
         → revalidatePath for listing and owner pages

         { status: "REJECTED" }
         → Set request.status = REJECTED, respondedAt = now()
         → revalidatePath for listing page
```

---

## UI Architecture

- Reusable primitives in `components/ui/` (shadcn-style composition)
- Page-specific components in `components/listing-details/`, `components/home/`, `components/navbar/`
- Client forms use `"use client"` directive; data fetching happens in Server Components or route handlers

**Styling conventions:**
- Tailwind CSS 4 via `app/globals.css`
- CSS custom properties define color tokens and radii
- Default theme is dark
- `framer-motion` for animations

---

## Remaining Gaps

- User profile page UI not complete
- Saved listings API + UI not complete
- Admin moderation panel not started
- Server-side validation on `/api/auth/register` is minimal
- Seed data exists (`prisma/seed.ts`) but coverage may be partial
