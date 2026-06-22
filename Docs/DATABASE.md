# StayZ Database Documentation

StayZ uses PostgreSQL with Prisma. The current schema supports authentication and users. Product models for listings, images, reviews, bookmarks, and booking/contact workflows are planned but not yet present.

## Configuration

`prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

Environment variables:

- `DATABASE_URL`: pooled or standard PostgreSQL connection string used by Prisma Client.
- `DIRECT_URL`: direct PostgreSQL connection string, commonly used for migrations with hosted providers.

## Current Models

### `User`

Stores application users and credential password hashes.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `String` | Primary key, generated with `cuid()`. |
| `name` | `String?` | Optional display name. |
| `email` | `String` | Unique login identity. |
| `emailVerified` | `DateTime?` | Used by Auth.js email/OAuth flows. |
| `password` | `String?` | bcrypt hash for credentials users; null for OAuth-only users. |
| `image` | `String?` | Avatar URL, often from OAuth profile. |
| `role` | `Role` | Defaults to `USER`. |
| `createdAt` | `DateTime` | Defaults to current time. |
| `updatedAt` | `DateTime` | Auto-updated by Prisma. |

Relations:

- `accounts Account[]`
- `sessions Session[]`

### `Account`

Required by the Auth.js Prisma adapter for OAuth provider account links.

Important constraints:

- `@@unique([provider, providerAccountId])`
- Cascades on user delete.

### `Session`

Required by the Auth.js Prisma adapter. The app currently uses JWT sessions, but this model remains part of the adapter schema.

Important constraints:

- `sessionToken` is unique.
- Cascades on user delete.

### `VerificationToken`

Required by the Auth.js Prisma adapter for verification flows.

Important constraints:

- `token` is unique.
- `@@unique([identifier, token])`

### `Role`

```prisma
enum Role {
  USER
  OWNER
  ADMIN
}
```

Current behavior:

- New users created through `/api/auth/register` receive the default `USER` role.
- Dashboard displays the current role.
- Owner/admin authorization rules are not implemented yet.

## Planned Product Schema

The README describes listings, amenities, photos, bookmarks, reviews, and owner workflows. A practical next schema direction is below.

### Suggested `Listing`

```prisma
model Listing {
  id               String      @id @default(cuid())
  ownerId          String
  title            String
  description      String
  city             String
  locality         String
  address          String?
  pincode          String?
  monthlyRent      Int
  deposit          Int?
  roomType         RoomType
  genderPreference GenderPreference @default(ANY)
  furnishing       Furnishing
  isAvailable      Boolean     @default(true)
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt

  owner            User        @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  images           ListingImage[]
  amenities        ListingAmenity[]
  reviews          Review[]
}
```

### Suggested Supporting Enums

```prisma
enum RoomType {
  SINGLE
  SHARED
  PG
  FLAT
}

enum GenderPreference {
  MALE
  FEMALE
  ANY
}

enum Furnishing {
  FURNISHED
  SEMI_FURNISHED
  UNFURNISHED
}
```

### Suggested Image and Amenity Models

```prisma
model ListingImage {
  id        String   @id @default(cuid())
  listingId String
  url       String
  publicId  String?
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())

  listing   Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
}

model Amenity {
  id       String @id @default(cuid())
  name     String @unique
  icon     String?
  listings ListingAmenity[]
}

model ListingAmenity {
  listingId String
  amenityId String

  listing   Listing @relation(fields: [listingId], references: [id], onDelete: Cascade)
  amenity   Amenity @relation(fields: [amenityId], references: [id], onDelete: Cascade)

  @@id([listingId, amenityId])
}
```

### Suggested Engagement Models

```prisma
model SavedListing {
  userId    String
  listingId String
  createdAt DateTime @default(now())

  @@id([userId, listingId])
}

model Review {
  id        String   @id @default(cuid())
  listingId String
  userId    String
  rating    Int
  comment   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  listing   Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
}
```

## Migration Workflow

Use this workflow when schema changes are added:

```bash
npx prisma migrate dev --name add_listings
npx prisma generate
```

For local seeding:

```bash
npx prisma db seed
```

`prisma/seed.ts` is currently empty, so seed data still needs to be written.

## Data Integrity Rules To Add

- Validate unique listing ownership before update/delete.
- Ensure review rating stays within an accepted range, such as `1` to `5`.
- Use database indexes for common listing filters: city, locality, rent, room type, availability.
- Avoid hard deletes for production listings if audit/moderation history is needed.
- Store Cloudinary public IDs alongside URLs for cleanup.
