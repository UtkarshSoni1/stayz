# 🏠 StayZ

> *Find your vibe. Find your place.*

StayZ is a modern room listing platform built for **bachelors and Gen Z renters** — people who care about location, vibe, and who they're living around, not just square footage. No bloated forms, no boomer UX. Just clean listings, honest reviews, and fast search.

---

## 🎨 Theme & Vision

StayZ is built for the generation that moves fast — students, young professionals, first-time renters. The aesthetic is **dark, minimal, and modern**. Think Airbnb meets Zomato but stripped down for people who just want a decent room near their college or office.

The product is unapologetically **Gen Z-first**:

- Mobile-first design
- Instant search, no page reloads
- Gen Z filters (co-ed friendly, pet-friendly, work-from-home ready)
- No unnecessary steps between "find room" and "contact owner"

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Styling** | Tailwind CSS |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Auth** | NextAuth.js |
| **Image Storage** | Cloudinary |
| **Validation** | Zod |
| **Deployment** | Vercel + Neon (DB) |

---

## ✨ Features

### 🔍 Discovery & Listings

- Browse rooms with city, price, and type filters
- Search by locality, pincode, or landmark
- Listing detail page with photo gallery, amenities, and map
- Gender preference filter (Male / Female / Any)
- Furnishing filter (Furnished / Semi / Bare)
- Sort by: Price, Newest, Top Rated

### 🏘️ Listing Management

- Owners can create, edit, and delete listings
- Upload multiple photos per listing
- Set amenities (WiFi, AC, Parking, Laundry, etc.)
- Mark listing as available / rented

### 👤 Users & Profiles

- Sign up / Login (Email + Google OAuth)
- Renter profile with saved searches
- Owner profile with all active listings
- Edit profile, avatar, contact info

### 🔖 Engagement

- Bookmark / save listings
- Leave reviews and star ratings (renters only)
- Contact owner via in-app message or WhatsApp redirect
- Report a listing

### 🔔 Extras (Phase 2)

- Email alerts for new listings in saved city
- "Recently Viewed" listing history
- Listing expiry & auto-unpublish after 30 days
- Admin panel for moderation

---

## 🗂️ Project Structure

```
stayz/
├── app/
│   ├── (auth)/           # Login, Signup pages
│   ├── (dashboard)/      # Owner dashboard
│   ├── listings/         # Browse + Detail pages
│   └── api/              # All API routes
├── components/           # Reusable UI components
├── lib/
│   ├── db.ts             # Prisma client
│   ├── auth.ts           # NextAuth config
│   └── utils.ts          # Shared helpers
├── prisma/
│   ├── schema.prisma     # DB schema
│   └── seed.ts           # Dev seed data
└── types/                # Shared TypeScript types
```

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/yourteam/stayz.git
cd stayz

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in: DATABASE_URL, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, CLOUDINARY keys

# Run DB migrations
npx prisma migrate dev

# Seed dev data
npx prisma db seed

# Start dev server
npm run dev
```

---

## 🌿 Git Workflow

```
main  →  production only
dev   →  merge target for all features

Branch naming:
feat/listing-search
feat/auth-google
fix/image-upload-bug
db/add-review-table
```

- All merges via Pull Request
- 1 peer review required
- No direct push to `main` or `dev`

---

## 👥 Team

| Name | Feature Ownership |
|------|-------------------|
| [Utkarsh Soni](https://github.com/UtkarshSoni1)| To be updated... |
| [Raj Kewat](https://github.com/RAJ-TECH-11)| To be updated... |

---

## 📄 License

MIT — build freely, credit kindly.