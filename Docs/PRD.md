# StayZ Product Requirements Document

## Product Summary

StayZ is a room discovery and listing platform for students, bachelors, and Gen Z renters who care about affordability, locality, lifestyle fit, and fast contact with owners.

Tagline: `Find your vibe. Find your place.`

---

## Target Users

### Renters

Students, young professionals, and first-time movers looking for rooms, PGs, shared flats, or affordable stays near college, office, or popular localities.

Core needs:
- Fast room discovery
- Search by city, locality, pincode, or landmark
- Filters that match real living preferences
- Trust signals: photos, reviews, amenities, owner identity
- Quick contact path (WhatsApp, call)

### Owners

Landlords, flat owners, PG operators, and existing tenants looking for roommates.

Core needs:
- Create listings quickly
- Upload clear photos
- Manage availability and booking requests
- Receive renter interest
- Accept or reject tenants

### Admins

Moderate listings, handle reports, and manage spam.

---

## ✅ Shipped (as of 2026-07-20)

### Authentication
- Email/password signup and login
- Google OAuth via Auth.js v5
- JWT sessions; session includes `id` and `role`
- Route protection via `proxy.ts` middleware
- Auto-promote USER → OWNER on first listing creation

### Public Listing Discovery
- Real listing browse page with city, locality, roomType, genderPreference, furnishing, and price-range filters
- Sort by newest, price ascending, price descending
- Paginated results (12/page default)
- Listing detail page: photo gallery, highlights, sleeping arrangements, amenities, things to know, map section

### Owner Listing Management
- Full CRUD: create, edit, delete
- Multi-image upload via Cloudinary
- Draft / Active status on create
- Mark listing RENTED or back to ACTIVE
- Duplicate listing shortcut
- Owner dashboard with stats and quick actions
- "My Listings" page

### Booking Requests *(newest system)*
- Any signed-in user can submit a booking request (move-in date, guests, optional message)
- One PENDING request per user per listing enforced (409 on duplicate)
- Owners see all requests per listing with requester profile
- Owner **accepts** → listing auto-marks RENTED + all other PENDING requests auto-rejected, in a single `$transaction`
- Owner **rejects** → individual request rejected; listing status unchanged
- Users can view their own request history and current status
- Cache revalidated via `revalidatePath` on all status changes

### Reviews
- Six rating categories: Cleanliness, Accuracy, Check-in, Communication, Location, Value (each 1–5)
- Overall rating = computed average of the six
- Review eligibility gated: user must have an ACCEPTED BookingRequest for the listing
- One review per user per listing (upsert)
- Denormalized `avg*` fields on `Listing` recomputed inside `$transaction` on every review write
- Review form modal with per-category sliders
- `/api/listings/[id]/review-eligibility` endpoint to check before showing form

### Contact Owner
- WhatsApp deep link (`wa.me/...`) if owner has `whatsappNumber`
- Call CTA (`tel:...`) if owner has `phone`
- Fire-and-forget contact-click counter (`Listing.contactClickCount`)

### User Profile API
- `GET /api/user` — read own profile (name, email, image, role, phone, whatsappNumber)
- `PATCH /api/user` — update name, image, phone, whatsappNumber

### Owner Listing Edit
- Reusable `ListingForm` component handles both create and edit
- Edit pre-populates all fields including existing Cloudinary images
- `PATCH /api/listings/[id]` validates partial updates and handles image sync

### Admin Moderation
- Dedicated admin route group `(admin)` with ADMIN-role enforcement via `requireAdminApi()`
- `/admin/dashboard` — summary KPI cards
- `/admin/listings` — full paginated listing table with search, status filter, bulk SUSPEND / ACTIVATE / DELETE
- `/admin/analytics` — interactive analytics dashboard with date-range selector (7d / 30d / 90d / 1y), charts, and data tables
- `SUSPENDED` listing status — admin-only; hides listing from public browse without hard delete

### Email Infrastructure
- `lib/email.ts` — Nodemailer transport with SMTP env config and dev console fallback
- `sendVerificationEmail(to, rawToken)` — branded dark-theme HTML email template
- `GET /api/cron/cleanup-tokens` — scheduled expired token cleanup

---

## 🚧 In Progress

- User profile page UI (`/user/dashboard`)
- Saved listings UI + `GET /api/saved` (schema is ready: `SavedListing` model exists)
- User agreement and payment pages (route shells exist, no implementation)
- Email verification flow (infra ready in `lib/email.ts`; `/auth/verify` route not yet wired up)

---

## 📋 Planned / Roadmap

### Phase 1 Completion
- Design consistency pass across all owner/user pages
- Framer Motion page transitions

### Phase 2: Engagement
- Saved/bookmarked listings (full UI + API)
- Report listing flow
- Email alerts for saved searches

### Phase 3: Growth
- Recently viewed listings
- Listing expiry and auto-unpublish
- Better recommendations and ranking

---

## Non-Functional Requirements

- Mobile-first responsive UI
- Fast listing browsing; paginated server-fetched results
- Server-side validation for every mutation
- Passwords hashed with bcrypt
- Secrets stay server-side only
- Authorization enforced server-side (not just hidden in UI)
- Database queries indexed on common filters (city, locality, rent, roomType, isAvailable)
- File uploads validated for type and size
- Denormalized aggregates for performance-critical reads (rating averages)

---

## UX Direction

StayZ should feel modern, direct, and lightweight:
- Dark-first interface
- Clear listing cards with real photos
- Minimal form friction for booking requests
- Fast route transitions
- Strong empty states for sparse inventory

Avoid:
- Long listing forms with unnecessary fields
- Hiding contact intent behind too many steps
- Marketing pages before the actual product experience

---

## Success Metrics

Current:
- Owners can create and manage listings without developer help
- Renters can find listings by city and budget
- Booking requests flow end-to-end without intervention
- Review submission is gated correctly by accepted booking status
- No unauthenticated access to protected routes

Post-launch:
- Listing creation completion rate
- Search-to-detail click rate
- Contact owner click rate (tracked via `contactClickCount`)
- Booking request accept/reject ratio
- Review submission rate
