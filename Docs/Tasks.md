# StayZ Task Plan

This task list reflects the current repository state. Items marked done are already present in code; remaining items are ordered for a practical MVP path.

## Done

- [x] Initialize Next.js app with App Router.
- [x] Add Tailwind CSS 4 and shadcn-style UI primitives.
- [x] Add root layout, global theme variables, and dark theme provider.
- [x] Configure Prisma client singleton.
- [x] Add Auth.js/NextAuth configuration.
- [x] Add Prisma auth models: `User`, `Account`, `Session`, `VerificationToken`.
- [x] Add roles enum: `USER`, `OWNER`, `ADMIN`.
- [x] Add credentials provider with bcrypt password comparison.
- [x] Add Google provider entry point.
- [x] Add `/api/auth/[...nextauth]` handler.
- [x] Add `/api/auth/register` endpoint.
- [x] Add login form.
- [x] Add signup form.
- [x] Add protected dashboard page.
- [x] Add `proxy.ts` auth redirects for protected routes.
- [x] Add placeholder public listing pages.
- [x] Add placeholder owner listing creation page.
- [x] Create project docs in `/Docs`.

## High Priority

- [ ] Add server-side validation to `/api/auth/register`.
- [ ] Normalize auth environment variable documentation.
- [ ] Fix text encoding artifacts in README and UI copy.
- [ ] Add listing Prisma models.
- [ ] Create and run listing migration.
- [ ] Add seed data for users and sample listings.
- [ ] Implement `GET /api/listings`.
- [ ] Implement `POST /api/listings`.
- [ ] Implement `GET /api/listings/[id]`.
- [ ] Implement `PATCH /api/listings/[id]`.
- [ ] Implement `DELETE /api/listings/[id]` or archive behavior.
- [ ] Replace public listings placeholder with a real listing browse page.
- [ ] Replace listing detail placeholder with real listing details.
- [ ] Replace owner new-listing placeholder with a real create form.
- [ ] Enforce owner/listing authorization on the server.

## Auth And Users

- [ ] Validate signup fields: name, email, password length, password strength.
- [ ] Return consistent API errors from auth endpoints.
- [ ] Add profile page route at `/dashboard/profile`.
- [ ] Implement `/api/user` for profile reads/updates.
- [ ] Add role upgrade path for first-time owners.
- [ ] Decide whether `OWNER` is manually assigned or automatic after listing creation.
- [ ] Add forgot-password flow or remove inactive link from login UI.

## Listings

- [ ] Define listing fields required for MVP.
- [ ] Add enums for room type, gender preference, and furnishing.
- [ ] Add amenities model and join table.
- [ ] Add listing image model.
- [ ] Add indexes for city, locality, rent, availability, and created date.
- [ ] Build listing card component.
- [ ] Build listing filters.
- [ ] Build listing sorting.
- [ ] Add empty state for no results.
- [ ] Add loading and error states.
- [ ] Add owner "my listings" page.
- [ ] Add edit listing page.
- [ ] Add mark rented/unavailable action.

## Uploads

- [ ] Choose final upload provider configuration.
- [ ] Implement `/api/upload`.
- [ ] Validate file size and MIME type.
- [ ] Store Cloudinary URL and public ID.
- [ ] Support multiple images per listing.
- [ ] Add image deletion cleanup.
- [ ] Add default image fallback for listings without photos.

## Dashboard

- [ ] Replace static dashboard stats with database counts.
- [ ] Add recent listing activity.
- [ ] Link all quick actions to implemented pages.
- [ ] Hide or disable unavailable dashboard actions until implemented.
- [ ] Add owner-specific dashboard states.
- [ ] Add renter-specific saved/search states later.

## Quality

- [ ] Add TypeScript types in `types/index.ts`.
- [ ] Remove or implement empty `lib/db.ts`.
- [ ] Add Prisma seed script.
- [ ] Add lint fixes for current UI text and formatting.
- [ ] Add API tests for auth registration and listing permissions.
- [ ] Add component tests or smoke tests for auth pages.
- [ ] Add end-to-end happy path: signup, login, create listing, browse listing.
- [ ] Confirm production build with `npm run build`.

## Phase 2

- [ ] Saved/bookmarked listings.
- [ ] Reviews and star ratings.
- [ ] Report listing flow.
- [ ] Admin moderation page.
- [ ] Email alerts for saved searches.
- [ ] Recently viewed listings.
- [ ] Listing expiry and auto-unpublish.
- [ ] WhatsApp/contact-owner redirect tracking.

## Documentation Maintenance

- [ ] Update `Docs/API.md` whenever an API route is implemented.
- [ ] Update `Docs/DATABASE.md` whenever Prisma schema changes.
- [ ] Update `Docs/ARCHITECTURE.md` when routing, auth, or major module boundaries change.
- [ ] Update `Docs/PRD.md` when product scope changes.
- [ ] Keep this task plan aligned with actual code, not only intended features.
