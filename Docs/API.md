# StayZ API Documentation

StayZ uses Next.js 16 App Router route handlers under `app/api`. Route handlers export HTTP method functions such as `GET` and `POST`, and return `NextResponse` or standard Web responses.

## Current API Status

| Route | Methods | Status | Purpose |
| --- | --- | --- | --- |
| `/api/auth/[...nextauth]` | `GET`, `POST` | Implemented | Auth.js/NextAuth handler for credentials and Google OAuth flows. |
| `/api/auth/register` | `POST` | Implemented | Creates a new email/password user. |
| `/api/user` | TBD | Placeholder | Reserved for user profile APIs. |
| `/api/listings` | TBD | Placeholder | Reserved for listing collection APIs. |
| `/api/listings/[id]` | TBD | Placeholder | Reserved for single-listing APIs. |
| `/api/upload` | TBD | Placeholder | Reserved for image upload APIs. |

## Authentication

Authentication is configured in `lib/auth.ts` with Auth.js v5 and the Prisma adapter.

Supported providers:

- Credentials provider using email and password.
- Google provider, reading provider credentials from environment variables expected by Auth.js.

Session strategy:

- JWT sessions are enabled.
- Session user objects include `id` and `role`.
- Unauthenticated users are redirected to `/login` by `proxy.ts` for protected routes.

Public routes:

- `/`
- `/login`
- `/signup`
- `/listings`
- `/listings/*`
- `/api/auth/*`

All other routes require an authenticated session.

## POST `/api/auth/register`

Creates a new user account with a hashed password.

### Request Body

```json
{
  "name": "Raj Kewat",
  "email": "raj@example.com",
  "password": "password123"
}
```

### Success Response

Status: `201 Created`

```json
{
  "success": true,
  "user": {
    "id": "clx...",
    "email": "raj@example.com"
  }
}
```

### Error Responses

Status: `400 Bad Request`

```json
{
  "error": "User already exists"
}
```

Status: `500 Internal Server Error`

```json
{
  "error": "Internal Server Error"
}
```

### Current Validation Notes

The signup form checks password confirmation on the client, but the API currently does not validate:

- Required fields.
- Email format.
- Minimum password length.
- Role assignment.

Add server-side validation before using this endpoint in production.

## Planned Listing APIs

The product direction in `README.md` expects browse, create, edit, delete, search, filter, and media upload flows. The following API shape matches the current app structure and Prisma direction, but is not implemented yet.

### GET `/api/listings`

Returns listings with optional filters.

Suggested query parameters:

- `city`
- `locality`
- `minPrice`
- `maxPrice`
- `roomType`
- `genderPreference`
- `furnishing`
- `amenities`
- `sort`

### POST `/api/listings`

Creates a listing for the authenticated owner.

Suggested requirements:

- User must be logged in.
- User should have `OWNER` or `ADMIN` role, or be upgraded to owner during first listing creation.
- Request body should be validated server-side.

### GET `/api/listings/[id]`

Returns one public listing by id.

### PATCH `/api/listings/[id]`

Updates a listing owned by the current user.

### DELETE `/api/listings/[id]`

Deletes or archives a listing owned by the current user.

## Planned Upload API

`/api/upload` is currently empty. The README names Cloudinary as the intended image storage provider.

Expected behavior:

- Accept authenticated image uploads.
- Validate file type and size.
- Upload to Cloudinary.
- Return a secure image URL and provider metadata.
- Associate uploaded images with listing records once listing models exist.

## Environment Variables

Known variables used or expected by the project:

- `DATABASE_URL`
- `DIRECT_URL`
- `AUTH_SECRET` or equivalent Auth.js secret.
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- Cloudinary variables when upload support is implemented.

Do not expose secrets to client components.
