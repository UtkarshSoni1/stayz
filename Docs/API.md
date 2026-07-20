# StayZ API Documentation

> **Last synced:** Admin dashboard + analytics system (2026-07-20)

StayZ uses Next.js 16 App Router route handlers under `app/api`. All handlers return `NextResponse` with a consistent envelope:

```ts
{ success: true,  data: <T> }        // 2xx
{ success: false, error: string }    // 4xx / 5xx
```

---

## Authentication

Configured in `lib/auth.ts` with Auth.js v5 and the Prisma adapter.

**Providers:** Credentials (email + bcrypt password), Google OAuth

**Session:** JWT strategy. Session user object includes `id` and `role`.

**`requireAuth()` helper** (`lib/auth-helpers.ts`): used by protected route handlers. Returns `{ user, error }` — if `error` is set, the caller returns it directly.

**Public routes (no session required):**
- `/`
- `/login`, `/signup`
- `/listings`, `/listings/*`
- `/developers/*`
- `/api/auth/*`
- `GET /api/listings`, `GET /api/listings/[id]`
- `POST /api/listings/[id]/contact-click`
- `GET /api/listings/[id]/review-eligibility`

---

## Auth Routes

### `POST /api/auth/register`

Creates a new email/password user.

**Request body:**
```json
{ "name": "Raj Kewat", "email": "raj@example.com", "password": "password123" }
```

**Success `201`:**
```json
{ "success": true, "user": { "id": "clx...", "email": "raj@example.com" } }
```

**Errors:** `400` duplicate email · `500` server error

> ⚠️ Server-side validation (email format, password length) is minimal and should be hardened before production.

### `GET /api/auth/[...nextauth]`, `POST /api/auth/[...nextauth]`

Auth.js handler for all OAuth and session flows.

---

## Listing Routes

### `GET /api/listings`

Browse available listings with optional filters and pagination.

**Query parameters:**

| Param | Type | Notes |
|---|---|---|
| `city` | string | Case-insensitive contains match |
| `locality` | string | Case-insensitive contains match |
| `roomType` | `SINGLE\|SHARED\|PG\|FLAT` | Exact enum match |
| `genderPreference` | `MALE\|FEMALE\|ANY` | Exact enum match |
| `furnishing` | `FURNISHED\|SEMI_FURNISHED\|UNFURNISHED` | Exact enum match |
| `minPrice` | number | `monthlyRent >= minPrice` |
| `maxPrice` | number | `monthlyRent <= maxPrice` |
| `sort` | `newest\|price_asc\|price_desc` | Default: `newest` |
| `page` | number | Default: 1 |
| `limit` | number | Default: 12, max: 50 |

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "listings": [ { "id", "title", "city", "locality", "monthlyRent", "images", "amenities", "owner", ... } ],
    "total": 42,
    "page": 1,
    "limit": 12
  }
}
```

Only listings with `isAvailable: true` are returned.

---

### `POST /api/listings`

Creates a new listing. Requires authentication. Auto-promotes `USER` → `OWNER` on first listing.

**Request body (validated via `lib/validations/listing`):**
```json
{
  "title": "Bright single room in Koramangala",
  "description": "...",
  "city": "Bangalore",
  "locality": "Koramangala",
  "monthlyRent": 12000,
  "roomType": "SINGLE",
  "furnishing": "FURNISHED",
  "genderPreference": "ANY",
  "status": "ACTIVE",
  "amenities": ["WiFi", "AC", "Parking"],
  "images": [{ "url": "https://...", "publicId": "stayz/abc", "sortOrder": 0 }]
}
```

**Success `201`:**
```json
{ "success": true, "data": { "id": "...", "title": "...", "roleUpdated": true } }
```

**Errors:** `401` unauthenticated · `422` validation failure · `500` server error

---

### `GET /api/listings/[id]`

Returns full listing detail via `getListingById` (includes images, amenities, highlights, sleeping arrangements, things to know, reviews, owner profile).

**Success `200`:** Full listing object. **`404`** if not found.

---

### `PATCH /api/listings/[id]`

Updates a listing. Requires authentication + ownership.

**Request body:** Any subset of listing fields.

**Success `200`:** Updated listing. **`403`** if not owner. **`422`** validation failure.

---

### `DELETE /api/listings/[id]`

Deletes listing and associated Cloudinary images. Requires authentication + ownership (or `ADMIN` role).

**Success `200`:** `{ "success": true, "data": null }`

---

### `PATCH /api/listings/[id]/status`

Toggle listing status. Owner-only.

**Request body:** `{ "status": "RENTED" | "ACTIVE" }`

> `SUSPENDED` status is reserved for admin use via `PATCH /api/admin/listings/[id]`.

**Success `200`:** `{ "success": true, "data": null }`

Delegates to `markListingRented` or `markListingAvailable` from `lib/listing-service.ts`.

---

### `POST /api/listings/[id]/contact-click`

Fire-and-forget analytics. No auth required. Increments `Listing.contactClickCount`.

**Success `200`:** `{ "success": true, "data": null }`

---

### `GET /api/listings/[id]/booking-requests`

Owner-only. Returns all booking requests for a listing with requester info.

**Success `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "status": "PENDING",
      "moveInDate": "2026-08-01T00:00:00Z",
      "guests": 1,
      "message": "Looking for a quiet room.",
      "createdAt": "...",
      "respondedAt": null,
      "user": { "id": "...", "name": "Raj", "image": "...", "email": "raj@example.com" }
    }
  ]
}
```

**Errors:** `403` not the listing owner · `404` listing not found

---

### `POST /api/listings/[id]/booking-requests`

Submits a booking request. Auth required. Owner cannot request own listing.

**Request body (all optional):**
```json
{ "moveInDate": "2026-08-01", "guests": 1, "message": "Interested in the room." }
```

**Success `201`:**
```json
{ "success": true, "data": { "id": "...", "status": "PENDING", "createdAt": "..." } }
```

**Errors:** `400` own listing · `404` listing not found · `409` existing PENDING request

---

### `POST /api/listings/[id]/reviews`

Submits or updates a review. Auth required. User must have an ACCEPTED BookingRequest for the listing.

**Request body:**
```json
{
  "cleanliness": 5,
  "accuracy": 4,
  "checkIn": 5,
  "communication": 4,
  "location": 5,
  "value": 4,
  "comment": "Great stay!"
}
```

All six category scores must be integers 1–5. Overall rating is computed server-side as their average.

**Success `200`:** `{ "success": true, "data": null }`

**Errors:** `400` invalid scores · `403` not an accepted tenant

---

### `GET /api/listings/[id]/review-eligibility`

Checks whether the current user can leave a review. No auth required — unauthenticated users get `eligible: false, reason: "sign_in_required"`.

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "eligible": true,
    "alreadyReviewed": false,
    "existingReview": null
  }
}
```

Possible `reason` values when `eligible: false`: `"sign_in_required"`, `"not_a_tenant"`

---

## Booking Request Routes

### `PATCH /api/booking-requests/[requestId]`

Owner-only. Accepts or rejects a specific booking request.

**Request body:** `{ "status": "ACCEPTED" | "REJECTED" }`

**On ACCEPTED** (runs in `$transaction`):
1. Sets `BookingRequest.status = ACCEPTED`, `respondedAt = now()`
2. Calls `markListingRented` → sets `Listing.status = RENTED`, `isAvailable = false`
3. Auto-rejects all other PENDING requests for the same listing
4. Revalidates `/listings`, `/listings/[id]`, `/owner/dashboard`, `/owner/my-listings`

**On REJECTED:**
- Sets `BookingRequest.status = REJECTED`, `respondedAt = now()`
- Revalidates `/listings/[id]`

**Success `200`:**
```json
{ "success": true, "data": { "id": "...", "status": "ACCEPTED", "respondedAt": "...", "listingId": "..." } }
```

**Errors:** `403` not owner · `404` not found · `409` already responded · `422` invalid status

---

## Upload Routes

### `POST /api/upload`

Authenticated. Uploads an image to Cloudinary and returns the URL and public ID.

**Request:** `multipart/form-data` with an image file.

**Success `200`:**
```json
{ "success": true, "data": { "url": "https://res.cloudinary.com/...", "publicId": "stayz/..." } }
```

---

## User Routes

### `GET /api/user`

Returns the current authenticated user's profile.

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Utkarsh",
    "email": "utkarsh@example.com",
    "image": "...",
    "role": "OWNER",
    "phone": "+91...",
    "whatsappNumber": "+91...",
    "createdAt": "..."
  }
}
```

---

### `PATCH /api/user`

Updates the current user's mutable profile fields.

**Request body (all optional):**
```json
{ "name": "...", "image": "...", "phone": "+91...", "whatsappNumber": "+91..." }
```

**Success `200`:** Updated user object.

---

### `GET /api/user/booking-requests`

Returns all booking requests submitted by the current user, with associated listing info.

**Success `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "listingId": "...",
      "status": "PENDING",
      "moveInDate": "...",
      "guests": 1,
      "message": "...",
      "createdAt": "...",
      "respondedAt": null,
      "listing": { "id": "...", "title": "...", "status": "ACTIVE", "images": [...] }
    }
  ]
}
```

---

## Dashboard Routes

### `GET /api/dashboard`

Owner-only. Returns aggregated stats for the owner dashboard (total listings, active count, etc.).

---

## Owner Listing List

### `GET /api/listings/my`

Authenticated. Returns listings owned by the current user.

---

## Admin Routes

All admin routes require the `ADMIN` role. Authorization is enforced via `requireAdminApi()` from `lib/auth-helpers.ts`.

### `GET /api/admin/listings`

Paginated listing index with admin-level filters.

**Query parameters:**

| Param | Type | Notes |
|---|---|---|
| `search` | string | Searches title, city, owner name, owner email |
| `status` | `ACTIVE\|DRAFT\|RENTED\|SUSPENDED\|ALL` | Filter by listing status |
| `propertyType` | string | Exact match on `propertyType` field |
| `city` | string | Case-insensitive contains match |
| `page` | number | Default: 1 |
| `limit` | number | Default: 20, max: 100 |

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "...", "title": "...", "city": "...", "locality": "...",
        "monthlyRent": 12000, "status": "ACTIVE", "propertyType": "...",
        "createdAt": "...", "reviewCount": 3, "avgRating": 4.5,
        "images": [{ "url": "..." }],
        "owner": { "id": "...", "name": "...", "email": "..." },
        "_count": { "bookingRequests": 2 }
      }
    ],
    "total": 42,
    "page": 1,
    "limit": 20
  }
}
```

---

### `GET /api/admin/listings/stats`

Returns listing counts grouped by status.

**Success `200`:**
```json
{
  "success": true,
  "data": { "total": 100, "active": 60, "draft": 20, "rented": 15, "suspended": 5 }
}
```

---

### `GET /api/admin/listings/[id]`

Returns full listing detail plus booking request counts grouped by status (PENDING / ACCEPTED / REJECTED).

**Success `200`:** Full listing object with `bookingRequestsByStatus: { PENDING, ACCEPTED, REJECTED }`. **`404`** if not found.

---

### `PATCH /api/admin/listings/[id]`

Admin-only status override. Supports `SUSPENDED` status that owner routes cannot set.

**Request body:** `{ "status": "ACTIVE" | "DRAFT" | "RENTED" | "SUSPENDED" }`

Setting `ACTIVE` also sets `isAvailable = true`; any other status sets `isAvailable = false`.

**Success `200`:** `{ "success": true, "data": { "id": "...", "status": "SUSPENDED", "isAvailable": false, "updatedAt": "..." } }`

**Errors:** `400` invalid JSON · `404` not found · `422` invalid status

---

### `DELETE /api/admin/listings/[id]`

Admin-only hard delete. Reuses `deleteListing` from `lib/listing-service.ts` with `role = "ADMIN"` to bypass owner check.

**Success `200`:** `{ "success": true, "data": null }`

---

### `PATCH /api/admin/listings/bulk`

Apply a bulk action to multiple listings at once.

**Request body:**
```json
{ "ids": ["id1", "id2"], "action": "SUSPEND" }
```

| Action | Effect |
|---|---|
| `SUSPEND` | Sets `status = SUSPENDED`, `isAvailable = false` |
| `ACTIVATE` | Sets `status = ACTIVE`, `isAvailable = true` |
| `DELETE` | Hard-deletes each listing (with Cloudinary cleanup) inside a `$transaction` |

**Success `200`:** `{ "success": true, "data": { "affected": 2 } }`

**Errors:** `422` empty ids or invalid action

---

### `GET /api/admin/analytics`

Returns aggregated business intelligence data for the admin analytics dashboard.

**Query parameters:**

| Param | Values | Default |
|---|---|---|
| `range` | `7d \| 30d \| 90d \| 1y` | `30d` |

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "kpis": {
      "estimatedRevenue": 480000,
      "totalBookings": 42,
      "activeListings": 61,
      "activeUsers": 18
    },
    "revenueByDay": [{ "date": "2026-07-01", "revenue": 24000 }],
    "bookingsByDay": [{ "date": "2026-07-01", "count": 3 }],
    "bookingsByStatus": [
      { "status": "Pending", "count": 10 },
      { "status": "Confirmed", "count": 28 },
      { "status": "Cancelled", "count": 4 }
    ],
    "revenueByCity": [{ "city": "Bangalore", "revenue": 180000 }],
    "topListings": [
      {
        "id": "...", "title": "...", "city": "...",
        "monthlyRent": 12000, "reviewCount": 5,
        "avgRating": 4.8, "confirmedBookings": 3
      }
    ],
    "recentBookings": [
      {
        "id": "...", "listingTitle": "...", "userName": "Raj",
        "status": "Confirmed", "createdAt": "..."
      }
    ]
  }
}
```

**KPI definitions:**
- `estimatedRevenue` — Sum of `monthlyRent` for all ACCEPTED bookings in range
- `totalBookings` — Count of all booking requests in range
- `activeListings` — Current total with `status = ACTIVE` (not range-scoped)
- `activeUsers` — Distinct users with ≥1 booking or saved listing in range

**Errors:** `401` unauthenticated · `403` non-admin · `500` server error

---

## Cron Routes

### `GET /api/cron/cleanup-tokens`

Deletes expired `VerificationToken` rows from the database. Intended to be called by a scheduled job (e.g. Vercel Cron). Protected by a `CRON_SECRET` header check.

**Success `200`:** `{ "success": true, "data": { "deleted": 12 } }`

---

## Environment Variables

| Variable | Used By |
|---|---|
| `DATABASE_URL` | Prisma Client (pooled connection) |
| `DIRECT_URL` | Prisma Migrate (direct connection) |
| `AUTH_SECRET` | Auth.js JWT signing |
| `NEXTAUTH_URL` | Auth.js callback URLs |
| `AUTH_GOOGLE_ID` | Google OAuth |
| `AUTH_GOOGLE_SECRET` | Google OAuth |
| `NEXT_PUBLIC_APP_URL` | Client-side base URL |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary SDK |
| `CLOUDINARY_API_KEY` | Cloudinary SDK |
| `CLOUDINARY_API_SECRET` | Cloudinary SDK |
| `EMAIL_HOST` | Nodemailer SMTP host |
| `EMAIL_PORT` | Nodemailer SMTP port (default `587`) |
| `EMAIL_USER` | SMTP username |
| `EMAIL_PASS` | SMTP password |
| `EMAIL_FROM` | Sender address (default `StayZ <noreply@stayz.in>`) |
| `CRON_SECRET` | Cron route authorization token |

Do not expose `CLOUDINARY_API_SECRET`, `AUTH_SECRET`, `EMAIL_PASS`, or `CRON_SECRET` to client components.

> **Email dev fallback:** When `EMAIL_HOST` / `EMAIL_USER` / `EMAIL_PASS` are not set, `lib/email.ts` logs verification links to the console instead of sending real emails.
