# StayZ Task Plan

Last synced: **Admin dashboard + analytics system (2026-07-20)**

---

## ✅ Shipped

### Foundation
- [x] Initialize Next.js 16 app with App Router
- [x] Tailwind CSS 4 + shadcn/radix-ui primitives
- [x] Root layout, global theme variables, dark theme provider
- [x] Prisma client singleton (`lib/prisma.ts`)
- [x] Auth.js / NextAuth v5 configuration (`lib/auth.ts`)
- [x] Credentials provider with bcrypt password comparison
- [x] Google OAuth provider
- [x] `/api/auth/[...nextauth]` handler
- [x] `/api/auth/register` endpoint
- [x] Login form + signup form
- [x] `proxy.ts` auth redirects for protected routes

### Listing Schema & Models
- [x] `Listing` model with full field set (pricing, capacity, map, status, denormalized ratings)
- [x] `ListingImage`, `ListingAmenity`, `Amenity` models
- [x] `Highlight`, `SleepingArrangement`, `ThingToKnow` sub-models
- [x] `SavedListing` model
- [x] `Review` model with 6 category scores
- [x] `BookingRequest` model with `RequestStatus` enum
- [x] `HostPersonalDetail` model
- [x] `ListingStatus` enum (`ACTIVE`, `DRAFT`, `RENTED`)
- [x] `RoomType`, `GenderPreference`, `Furnishing` enums
- [x] DB indexes on city/locality, rent, roomType, isAvailable

### Listing APIs
- [x] `GET /api/listings` — browse with filters and pagination
- [x] `POST /api/listings` — create listing (validates, upserts amenities, uploads images)
- [x] `GET /api/listings/[id]` — full listing detail via `getListingById`
- [x] `PATCH /api/listings/[id]` — update listing (owner-guarded)
- [x] `DELETE /api/listings/[id]` — delete listing + Cloudinary cleanup
- [x] `PATCH /api/listings/[id]/status` — mark RENTED or ACTIVE
- [x] `POST /api/listings/[id]/contact-click` — fire-and-forget analytics
- [x] `GET /api/listings/[id]/booking-requests` — owner: list all requests
- [x] `POST /api/listings/[id]/booking-requests` — user: submit new request
- [x] `PATCH /api/booking-requests/[requestId]` — owner: accept or reject
- [x] `POST /api/listings/[id]/reviews` — submit/update review (eligibility-gated)
- [x] `GET /api/listings/[id]/review-eligibility` — check review gate
- [x] `GET /api/listings/my` — owner: own listings list
- [x] `POST /api/upload` — Cloudinary image upload

### Booking Request System
- [x] User can submit a booking request with optional move-in date, guests, message
- [x] 409 returned if user already has a PENDING request for the same listing
- [x] Owner sees all requests per listing with requester info
- [x] Accept in `$transaction`: mark request ACCEPTED + listing RENTED + auto-reject competing requests
- [x] Reject: set status REJECTED, respondedAt timestamp
- [x] Cache revalidated via `revalidatePath` on accept/reject
- [x] `GET /api/user/booking-requests` — user views own request history

### Reviews
- [x] Six-category rating form (Cleanliness, Accuracy, Check-in, Communication, Location, Value)
- [x] Overall rating = average of 6 categories
- [x] Eligibility gate: must have ACCEPTED BookingRequest
- [x] One review per user per listing (upsert with `@@unique([listingId, userId])`)
- [x] Denormalized `avg*` aggregates on `Listing`, recomputed in `$transaction`
- [x] Review form modal (`components/listing-details/ReviewFormModal.tsx`)

### Contact Owner
- [x] WhatsApp deep link (wa.me) from `User.whatsappNumber`
- [x] Call CTA from `User.phone`
- [x] `contactClickCount` incremented server-side on contact CTA click

### User Profile
- [x] `GET /api/user` — read own profile (includes phone, whatsappNumber)
- [x] `PATCH /api/user` — update name, image, phone, whatsappNumber
- [x] Host profile fields on schema: `responseRate`, `responseTimeLabel`, `isSuperhost`, `yearsHosting`, `joinedYear`

### Owner Pages
- [x] Owner dashboard
- [x] Owner "My Listings" page
- [x] Add listing form
- [x] Edit listing form (`owner/add-listing?edit=<id>` via reusable `ListingForm`)
- [x] Owner booking-requests page

### Admin Panel
- [x] Admin dashboard (`/admin/dashboard`) with summary KPIs
- [x] Admin listings management (`/admin/listings`) — paginated table with search, status filter, bulk actions
- [x] Admin analytics dashboard (`/admin/analytics`) — area, line, donut, bar charts + data tables
- [x] `GET /api/admin/listings` — paginated listing index with admin filters
- [x] `GET /api/admin/listings/stats` — status-grouped counts
- [x] `GET /api/admin/listings/[id]` — full listing detail with booking counts
- [x] `PATCH /api/admin/listings/[id]` — admin status override (including `SUSPENDED`)
- [x] `DELETE /api/admin/listings/[id]` — admin hard delete
- [x] `PATCH /api/admin/listings/bulk` — bulk SUSPEND / ACTIVATE / DELETE
- [x] `GET /api/admin/analytics` — BI aggregation with `range` param (`7d/30d/90d/1y`)
- [x] `requireAdminApi()` helper in `lib/auth-helpers.ts`
- [x] `SUSPENDED` added to `ListingStatus` enum

### Email & Infrastructure
- [x] `lib/email.ts` — Nodemailer transport with dev fallback (console logging)
- [x] `sendVerificationEmail(to, rawToken)` — branded HTML email template
- [x] `GET /api/cron/cleanup-tokens` — expired VerificationToken purge endpoint
- [x] `components/session-provider.tsx` — SSR-safe dynamic SessionProvider import

### Public Pages
- [x] Home page
- [x] Listings browse page
- [x] Listing detail page
- [x] Developers portfolio page

---

## 🚧 In Progress

- [ ] User profile page UI (`/user/dashboard`)
- [ ] Saved listings UI + `GET /api/saved` (schema ready, API + page not done)

---

## 📋 Planned / Roadmap

### Short Term
- [ ] Design consistency pass across owner/user pages
- [ ] Framer Motion page transitions
- [ ] Server-side validation hardening on `/api/auth/register`
- [ ] Email verification flow integration with `/auth/verify` route

### Phase 2: Engagement
- [ ] Saved/bookmarked listings (full API + UI)
- [ ] Report listing flow
- [ ] Admin listing moderation actions (hide from browse without delete)

### Phase 3: Growth
- [ ] Email alerts for saved searches / cities
- [ ] Recently viewed listings history
- [ ] Listing expiry and auto-unpublish after N days
- [ ] Better ranking / recommendations

---

## Documentation Maintenance

- [ ] Update `Docs/API.md` whenever an API route is added or changed
- [ ] Update `Docs/DATABASE.md` whenever Prisma schema changes
- [ ] Update `Docs/ARCHITECTURE.md` when routing or module boundaries change
- [ ] Update `Docs/PRD.md` when product scope changes
- [ ] Keep this task plan aligned with actual code, not only intended features
