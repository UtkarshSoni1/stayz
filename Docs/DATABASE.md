# StayZ Database Documentation

StayZ uses PostgreSQL with Prisma 6. All models are defined in `prisma/schema.prisma`.

---

## Configuration

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

- `DATABASE_URL` — pooled connection string (PgBouncer-compatible; used at runtime)
- `DIRECT_URL` — direct connection string (used by `prisma migrate dev`)

---

## Models

### `User`

Stores application users, credential hashes, and host profile fields.

| Field | Type | Notes |
|---|---|---|
| `id` | `String` | PK, `cuid()` |
| `name` | `String?` | Display name |
| `email` | `String` | Unique |
| `emailVerified` | `DateTime?` | Auth.js OAuth flow |
| `password` | `String?` | bcrypt hash; null for OAuth-only users |
| `image` | `String?` | Avatar URL |
| `role` | `Role` | Default `USER` |
| `phone` | `String?` | Shown as "Call Owner" CTA |
| `whatsappNumber` | `String?` | Shown as "Message on WhatsApp" CTA |
| `responseRate` | `String?` | Host profile display (e.g. "100%") |
| `responseTimeLabel` | `String?` | Host profile display (e.g. "within an hour") |
| `isSuperhost` | `Boolean` | Default `false` |
| `yearsHosting` | `Int?` | Host profile display |
| `joinedYear` | `Int?` | Account creation year (display only) |
| `createdAt` | `DateTime` | Default `now()` |
| `updatedAt` | `DateTime` | Auto-updated |

Relations: `accounts`, `sessions`, `listings`, `reviews`, `savedListings`, `hostPersonalDetails`, `bookingRequests`

---

### `HostPersonalDetail`

Fun facts shown on the host profile section (e.g. "🎂 My birthday is in March").

| Field | Type | Notes |
|---|---|---|
| `id` | `String` | PK |
| `userId` | `String` | FK → User |
| `icon` | `String` | Material Symbols icon name |
| `text` | `String` | Display text |

Index: `[userId]`

---

### `Account` / `Session` / `VerificationToken`

Required by the Auth.js Prisma adapter. Standard NextAuth v5 schema — do not modify column names.

- `Account` — OAuth provider account links. `@@unique([provider, providerAccountId])`. Cascades on user delete.
- `Session` — Session records (JWT strategy; table is present per adapter requirements). Cascades on user delete.
- `VerificationToken` — Email verification tokens. `@@unique([identifier, token])`.

---

### `Listing`

Core product model.

| Field | Type | Notes |
|---|---|---|
| `id` | `String` | PK, `cuid()` |
| `ownerId` | `String` | FK → User |
| `title` | `String` | |
| `description` | `String` | |
| `descriptionExtended` | `String?` | "Show more" expanded text |
| `propertyType` | `String` | Default `"Entire apartment"` |
| `city` | `String` | |
| `locality` | `String` | |
| `address` | `String?` | |
| `pincode` | `String?` | |
| `monthlyRent` | `Int` | Core rental field |
| `deposit` | `Int?` | Security deposit |
| `pricePerNight` | `Int?` | Airbnb-style nightly rate (detail page display) |
| `guests` | `Int` | Default `1` |
| `bedrooms` | `Int` | Default `1` |
| `beds` | `Int` | Default `1` |
| `bathrooms` | `Int` | Default `1` |
| `mapLat` | `Float?` | |
| `mapLng` | `Float?` | |
| `mapImageUrl` | `String?` | |
| `roomType` | `RoomType` | |
| `genderPreference` | `GenderPreference` | Default `ANY` |
| `furnishing` | `Furnishing` | |
| `isAvailable` | `Boolean` | Default `false` |
| `status` | `ListingStatus` | Default `DRAFT` |
| `contactClickCount` | `Int` | Default `0`; fire-and-forget analytics |
| `reviewCount` | `Int` | Default `0`; denormalized |
| `avgRating` | `Float` | Default `0`; denormalized |
| `avgCleanliness` | `Float` | Default `0`; denormalized |
| `avgAccuracy` | `Float` | Default `0`; denormalized |
| `avgCheckIn` | `Float` | Default `0`; denormalized |
| `avgCommunication` | `Float` | Default `0`; denormalized |
| `avgLocation` | `Float` | Default `0`; denormalized |
| `avgValue` | `Float` | Default `0`; denormalized |
| `createdAt` | `DateTime` | Default `now()` |
| `updatedAt` | `DateTime` | Auto-updated |

Indexes: `[city, locality]`, `[monthlyRent]`, `[roomType]`, `[isAvailable]`

Relations: `owner`, `amenities`, `images`, `reviews`, `saves`, `highlights`, `sleepingArrangements`, `thingsToKnow`, `bookingRequests`

---

### `ListingImage`

| Field | Type | Notes |
|---|---|---|
| `id` | `String` | PK |
| `listingId` | `String` | FK → Listing |
| `url` | `String` | Cloudinary secure URL |
| `alt` | `String?` | Accessibility / SEO alt text |
| `publicId` | `String?` | Cloudinary public ID (for deletion) |
| `sortOrder` | `Int` | Default `0` |
| `createdAt` | `DateTime` | |

Cascades on listing delete.

---

### `Highlight`

Curated highlight cards shown on the detail page (e.g. "Self check-in", "Great location").

| Field | Type | Notes |
|---|---|---|
| `id` | `String` | PK |
| `listingId` | `String` | FK → Listing |
| `icon` | `String` | Material Symbols icon name |
| `title` | `String` | |
| `description` | `String` | |
| `sortOrder` | `Int` | Default `0` |

Index: `[listingId]`

---

### `SleepingArrangement`

Entries shown in the "Where you'll sleep" section.

| Field | Type | Notes |
|---|---|---|
| `id` | `String` | PK |
| `listingId` | `String` | FK → Listing |
| `icon` | `String` | e.g. `"king_bed"` |
| `name` | `String` | e.g. `"Bedroom"` |
| `description` | `String` | e.g. `"1 king bed"` |
| `sortOrder` | `Int` | Default `0` |

Index: `[listingId]`

---

### `ThingToKnow`

House rules, cancellation policy, check-in instructions — shown in "Things to know".

| Field | Type | Notes |
|---|---|---|
| `id` | `String` | PK |
| `listingId` | `String` | FK → Listing |
| `icon` | `String` | Material Symbols icon name |
| `title` | `String` | |
| `content` | `String` | |
| `sortOrder` | `Int` | Default `0` |

Index: `[listingId]`

---

### `Amenity`

Global amenity catalogue. Amenities are upserted by name when a listing is created.

| Field | Type | Notes |
|---|---|---|
| `id` | `String` | PK |
| `name` | `String` | Unique |
| `icon` | `String?` | Material Symbols icon name |
| `description` | `String?` | Short display description |

---

### `ListingAmenity`

Junction table — `@@id([listingId, amenityId])`.

---

### `SavedListing`

Bookmarked listings. `@@id([userId, listingId])`.

| Field | Type | Notes |
|---|---|---|
| `userId` | `String` | FK → User |
| `listingId` | `String` | FK → Listing |
| `createdAt` | `DateTime` | |

Schema is fully implemented; the UI/API for saved listings is in progress.

---

### `Review`

Per-review category scores. Listing-level averages are denormalized onto `Listing.avg*`.

| Field | Type | Notes |
|---|---|---|
| `id` | `String` | PK |
| `listingId` | `String` | FK → Listing |
| `userId` | `String` | FK → User |
| `rating` | `Int` | Overall 1–5 (computed average of 6 categories) |
| `cleanliness` | `Int` | 1–5 |
| `accuracy` | `Int` | 1–5 |
| `checkIn` | `Int` | 1–5 |
| `communication` | `Int` | 1–5 |
| `location` | `Int` | 1–5 |
| `value` | `Int` | 1–5 |
| `comment` | `String?` | Optional text |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | Auto-updated |

Constraint: `@@unique([listingId, userId])` — one review per user per listing.

**Aggregate update flow:** Every review upsert triggers a Prisma `$transaction` that re-aggregates all category averages and `reviewCount`, then writes them back to `Listing`.

---

### `BookingRequest`

Represents a user's request to book/rent a listing.

| Field | Type | Notes |
|---|---|---|
| `id` | `String` | PK |
| `listingId` | `String` | FK → Listing |
| `userId` | `String` | FK → User (requester) |
| `status` | `RequestStatus` | Default `PENDING` |
| `moveInDate` | `DateTime?` | Requested move-in date |
| `guests` | `Int?` | Number of guests |
| `message` | `String?` | Optional message to owner |
| `createdAt` | `DateTime` | |
| `respondedAt` | `DateTime?` | Set when owner accepts/rejects |

Index: `[listingId, userId, status]`

**Business rules:**
- One user can have at most one PENDING request per listing at a time
- On ACCEPTED: listing is marked RENTED + all other PENDING requests for the same listing are auto-REJECTED (single `$transaction`)
- Owners cannot request their own listing

---

## Enums

```prisma
enum Role            { USER | OWNER | ADMIN }
enum ListingStatus   { ACTIVE | DRAFT | RENTED | SUSPENDED }
enum RoomType        { SINGLE | SHARED | PG | FLAT }
enum GenderPreference { MALE | FEMALE | ANY }
enum Furnishing      { FURNISHED | SEMI_FURNISHED | UNFURNISHED }
enum RequestStatus   { PENDING | ACCEPTED | REJECTED }
```

> **Note:** `SUSPENDED` is an admin-only status applied via `PATCH /api/admin/listings/[id]`. Suspended listings have `isAvailable = false` and do not appear in public browse results.

---

## Migration Workflow

```bash
# After schema changes:
npx prisma migrate dev --name describe_the_change
npx prisma generate

# Seed dev data:
npx prisma db seed
```

Seed script: `prisma/seed.ts`. Run command configured in `package.json` under `"prisma": { "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts" }`.

---

## Indexing Strategy

| Index | Purpose |
|---|---|
| `[city, locality]` | Primary listing filter — most searches include city |
| `[monthlyRent]` | Price range filter |
| `[roomType]` | Room type filter |
| `[isAvailable]` | Default browse query (only available listings) |
| `[listingId, userId, status]` on BookingRequest | Eligibility and duplicate-check queries |
| `[userId]` on HostPersonalDetail | Profile queries |
| `[listingId]` on Highlight, SleepingArrangement, ThingToKnow | Joined detail-page reads |

---

## Data Integrity Notes

- All listing sub-models (`ListingImage`, `Highlight`, `SleepingArrangement`, `ThingToKnow`, `ListingAmenity`, `BookingRequest`, `Review`) cascade-delete with the parent `Listing`
- Cloudinary `publicId` stored alongside `url` on `ListingImage` to enable cleanup on delete
- Review scores validated server-side (1–5); invalid values rejected with `400`
- Booking request uniqueness enforced at application level (check then create) — consider a database-level unique constraint on `(listingId, userId)` filtered to `PENDING` status for extra safety
