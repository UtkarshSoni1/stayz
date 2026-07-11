# 🏠 StayZ

> *Find your vibe. Find your place.*

StayZ is a modern room listing platform built for **bachelors and Gen Z renters** — people who care about location, vibe, and who they're living around, not just square footage. No bloated forms, no boomer UX. Just clean listings, honest reviews, and fast search.

---

## 🎨 Theme & Vision

StayZ is built for the generation that moves fast — students, young professionals, first-time renters. The aesthetic is **dark, minimal, and modern**. Think Airbnb meets Zomato but stripped down for people who just want a decent room near their college or office.

The product is unapologetically **Gen Z-first**:

- Mobile-first design
- Instant search, no page reloads
- Filters that match real living preferences (co-ed, furnished, PG, single room)
- No unnecessary steps between "find room" and "contact owner"

---

## ⚙️ Tech Stack

![Skills](https://skillicons.dev/icons?i=nextjs,ts,tailwindcss,postgres,prisma,vercel)

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.2.9 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + shadcn/radix-ui primitives |
| **Database** | PostgreSQL (hosted on Supabase) |
| **ORM** | Prisma 6 |
| **Auth** | Auth.js / NextAuth v5 (beta) — credentials + Google OAuth |
| **Image Storage** | Cloudinary |
| **Animations** | Framer Motion |
| **Icons** | Lucide React, React Icons |
| **Deployment** | Vercel |

---

## ✨ Features

### ✅ Shipped — 🚧 In Progress — 📋 Planned

#### 🔍 Discovery & Listings

| Feature | Status |
|---|---|
| Browse listings (city, locality, type) | ✅ |
| Price range, gender preference, furnishing filters | ✅ |
| Sort by newest / price asc / price desc | ✅ |
| Listing detail page with photo gallery | ✅ |
| Highlights section (Self check-in, Great location, etc.) | ✅ |
| Sleeping arrangements section | ✅ |
| Things to Know section | ✅ |
| Amenities display | ✅ |
| Map section (static image, lat/lng stored) | ✅ |
| Paginated results (default 12/page, max 50) | ✅ |

#### 🏘️ Listing Management

| Feature | Status |
|---|---|
| Create listing (owner form → API → DB) | ✅ |
| Multi-image upload via Cloudinary | ✅ |
| Set amenities (upserted by name) | ✅ |
| Draft / Active status toggle on create | ✅ |
| Edit listing (PATCH) | ✅ |
| Delete listing + Cloudinary cleanup | ✅ |
| Duplicate listing | ✅ |
| Mark listing RENTED / ACTIVE (status toggle) | ✅ |
| Auto-promote USER → OWNER role on first listing | ✅ |
| Owner "My Listings" page | ✅ |
| Owner dashboard with stats | ✅ |

#### 💬 Booking Requests *(newest system — commit 6bc6867)*

| Feature | Status |
|---|---|
| User submits booking request (move-in date, guests, message) | ✅ |
| Duplicate PENDING request blocked (409) | ✅ |
| Owner views all requests per listing with requester info | ✅ |
| Owner accepts request → listing auto-marked RENTED | ✅ |
| Owner accepts → all other PENDING requests auto-rejected | ✅ |
| Owner rejects individual request | ✅ |
| User views their own booking request history + status | ✅ |
| Cache revalidation on status change | ✅ |

#### ⭐ Reviews

| Feature | Status |
|---|---|
| Per-category ratings: Cleanliness, Accuracy, Check-in, Communication, Location, Value | ✅ |
| Overall rating computed as average of 6 categories | ✅ |
| Review eligibility gated by accepted booking request | ✅ |
| Review upsert (one review per user per listing) | ✅ |
| Denormalized rating aggregates on Listing (fast reads) | ✅ |
| Review form modal (frontend) | ✅ |
| Review eligibility check endpoint | ✅ |

#### 📞 Contact Owner

| Feature | Status |
|---|---|
| WhatsApp deep link (wa.me) | ✅ |
| Call CTA (tel: link) | ✅ |
| Contact-click analytics (fire-and-forget counter) | ✅ |
| `phone` and `whatsappNumber` fields on User | ✅ |

#### 👤 Profiles & Saves

| Feature | Status |
|---|---|
| Auth (email/password + Google OAuth) | ✅ |
| `GET /api/user` — read own profile | ✅ |
| `PATCH /api/user` — update name, image, phone, whatsappNumber | ✅ |
| User profile page (UI) | 🚧 |
| SavedListing model (schema) | ✅ |
| Saved listings page (UI + API) | 🚧 |
| User dashboard | 🚧 |

#### 📊 Admin

| Feature | Status |
|---|---|
| Admin route group `app/(admin)` | 📋 |
| Admin dashboard / moderation UI | 📋 |
| Report listings | 📋 |

---

## 🗂️ Project Structure

```
stayz/
├── app/
│   ├── (auth)/             # /login, /signup
│   ├── (public)/
│   │   ├── listings/       # /listings (browse) + /listings/[id] (detail)
│   │   └── developers/     # /developers (team portfolio)
│   ├── (owner)/
│   │   └── owner/
│   │       ├── dashboard/        # /owner/dashboard
│   │       ├── my-listings/      # /owner/my-listings
│   │       ├── add-listing/      # /owner/add-listing
│   │       └── booking-requests/ # /owner/booking-requests
│   ├── (user)/
│   │   └── user/
│   │       ├── dashboard/   # /user/dashboard
│   │       ├── saved/       # /user/saved (WIP)
│   │       ├── payments/    # /user/payments (WIP)
│   │       └── agreement/   # /user/agreement (WIP)
│   ├── (admin)/
│   │   └── admin/dashboard/ # /admin/dashboard (planned)
│   └── api/
│       ├── auth/            # NextAuth handler + /register
│       ├── listings/        # CRUD + /[id]/reviews, booking-requests,
│       │                    #   status, contact-click, review-eligibility,
│       │                    #   images, duplicate
│       ├── booking-requests/[requestId]/ # PATCH (accept/reject)
│       ├── upload/          # Cloudinary upload handler
│       └── user/            # GET/PATCH profile + /booking-requests
├── components/              # Reusable UI components
│   ├── listing-details/     # Detail-page section components
│   ├── home/                # Homepage-specific components
│   ├── navbar/              # AppNavBar
│   └── ui/                  # shadcn-style primitives
├── lib/
│   ├── auth.ts              # Auth.js configuration
│   ├── auth-helpers.ts      # requireAuth() helper
│   ├── prisma.ts            # Prisma client singleton
│   ├── listing-service.ts   # getListingById, updateListing, deleteListing,
│   │                        #   markListingRented, markListingAvailable
│   ├── cloudinary.ts        # Upload + delete helpers
│   └── validations/         # Server-side listing validation
├── prisma/
│   ├── schema.prisma        # Full DB schema
│   └── seed.ts              # Dev seed data
├── types/                   # Shared TypeScript types
└── proxy.ts                 # Auth middleware (Next.js Middleware)
```

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/UtkarshSoni1/stayz.git
cd stayz

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in the values — see .env.example for all required keys
```

**Required `.env` variables:**

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Pooled PostgreSQL connection (Neon recommended) |
| `DIRECT_URL` | Direct PostgreSQL connection (used by Prisma migrate) |
| `AUTH_SECRET` | 32-character secret for Auth.js JWT signing |
| `NEXTAUTH_URL` | Base URL, e.g. `http://localhost:3000` |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_APP_URL` | Public base URL (used in client code) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |


```bash
# 4. Run DB migrations
npx prisma migrate dev

# 5. Seed dev data
npx prisma db seed

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🌿 Git Workflow

```
main  →  production (protected)
feat/ →  feature branches
fix/  →  bug fix branches
db/   →  schema/migration branches
```

- All merges via Pull Request
- 1 peer review required
- No direct push to `main`

---

## 👥 Team

| Name | GitHub |
|---|---|
| Utkarsh Soni | [@UtkarshSoni1](https://github.com/UtkarshSoni1) |
| Raj Kewat | [@RAJ-TECH-11](https://github.com/RAJ-TECH-11) |

---

## 📄 License

MIT — build freely, credit kindly.