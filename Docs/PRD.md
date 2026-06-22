# StayZ Product Requirements Document

## Product Summary

StayZ is a room discovery and listing platform for students, bachelors, and Gen Z renters who care about affordability, locality, lifestyle fit, and fast contact with owners. The current application establishes authentication, protected dashboard access, and early page shells. The next product work should turn these shells into a usable listing marketplace.

Tagline: `Find your vibe. Find your place.`

## Target Users

### Renters

Renters are students, young professionals, and first-time movers looking for rooms, PGs, shared flats, or affordable stays near college, office, transit, or popular localities.

Core needs:

- Fast room discovery.
- Search by city, locality, pincode, or landmark.
- Filters that match real living preferences.
- Trust signals like photos, reviews, amenities, and owner identity.
- Quick contact path.

### Owners

Owners are landlords, flat owners, PG operators, and existing tenants looking for roommates.

Core needs:

- Create listings quickly.
- Upload clear photos.
- Manage availability.
- Receive renter interest.
- Keep profile and contact details current.

### Admins

Admins moderate listings, reports, spam, and abusive content.

## Current Implemented Scope

Implemented:

- Public home placeholder.
- Public listings placeholder.
- Public listing detail placeholder.
- Signup form.
- Credentials registration endpoint.
- Credentials login.
- Google login entry point through Auth.js.
- Protected dashboard.
- Dashboard sign out.
- Route protection through `proxy.ts`.
- Prisma user/auth schema.

Not yet implemented:

- Real listing data model.
- Listing browse/search/filter behavior.
- Listing creation form.
- Image upload.
- Owner listing management.
- Reviews.
- Bookmarks.
- Profile editing.
- Reports/moderation.
- Seed data.

## MVP Goals

The MVP should let a renter find real rooms and let an owner publish a listing.

### MVP Features

1. Authentication

- Email/password signup and login.
- Google OAuth login.
- Protected dashboard.
- Role-aware UI for users and owners.

2. Public Listing Discovery

- Listing grid/list page.
- Search by city or locality.
- Filters for budget, room type, gender preference, furnishing, and availability.
- Sort by newest and rent.
- Empty, loading, and error states.

3. Listing Details

- Photo gallery.
- Rent, deposit, city/locality, room type, furnishing, gender preference.
- Amenities.
- Owner/contact section.
- Availability status.

4. Owner Listing Creation

- Authenticated create-listing form.
- Required listing fields.
- Multiple image uploads.
- Amenity selection.
- Draft or publish status.

5. Owner Dashboard

- Count of active listings.
- List of owned listings.
- Edit, mark rented, and delete/archive actions.

## Functional Requirements

### Authentication

- Users can create accounts with name, email, and password.
- Users can sign in with credentials.
- Users can sign in with Google.
- Authenticated users can sign out.
- Logged-in users should not see login/signup pages.
- Unauthenticated users should be redirected from protected pages.

### Listing Search

- Renters can browse available listings without logging in.
- Renters can filter by:
  - City.
  - Locality.
  - Monthly rent range.
  - Room type.
  - Gender preference.
  - Furnishing.
  - Amenities.
- Renters can open a listing detail page.

### Listing Management

- Authenticated users can create a listing.
- A first-time lister should become an owner or be guided through owner setup.
- Owners can view their own listings.
- Owners can update only their own listings.
- Owners can mark listings unavailable or rented.
- Owners can delete or archive listings.

### Uploads

- Owners can upload multiple listing images.
- Only image files should be accepted.
- Images should be size-limited.
- Uploaded images should be stored through Cloudinary or the chosen provider.

### Reviews and Trust

Phase 2:

- Renters can leave ratings and reviews.
- Users can report suspicious listings.
- Admins can review reports.

## Non-Functional Requirements

- Mobile-first responsive UI.
- Fast listing browsing with no unnecessary full page reloads.
- Server-side validation for every mutation.
- Passwords must be hashed.
- Secrets must remain server-side only.
- Authorization must be enforced on the server, not just hidden in UI.
- Database queries should be indexed around common filters.
- Uploads must validate file type and size.

## UX Direction

StayZ should feel modern, direct, and lightweight:

- Dark-first interface.
- Clear listing cards with real photos.
- Minimal form friction.
- Plain language.
- Fast route transitions.
- Strong empty states for early inventory.

Avoid:

- Overly long listing forms.
- Marketing pages before the actual product experience.
- Hiding contact intent behind too many steps.

## Success Metrics

MVP metrics:

- Users can register and log in successfully.
- Owners can create listings without developer help.
- Renters can find listings by city and budget.
- Listing detail pages contain enough information to contact or shortlist.
- No unauthenticated access to dashboard routes.

Product metrics after launch:

- Listing creation completion rate.
- Search-to-detail click rate.
- Contact owner click rate.
- Saved listing count.
- Report rate per listing.

## Risks

- The README lists several features that are not represented in the current database yet.
- Signup currently has minimal server-side validation.
- Listing pages are placeholders, so discovery is not functional.
- Upload route is empty, so image-based listing UX is blocked.
- Role handling exists in the schema but not in business rules.

## Release Plan

### Phase 1: Auth and Listing MVP

- Harden auth validation.
- Add listing schema.
- Add listing seed data.
- Implement public listing browse and detail pages.
- Implement create listing.

### Phase 2: Owner Tools

- Owner listing management.
- Edit listing.
- Availability controls.
- Image management.

### Phase 3: Trust and Engagement

- Saved listings.
- Reviews.
- Reports.
- Basic admin moderation.

### Phase 4: Growth Features

- Email alerts.
- Recently viewed listings.
- Listing expiry.
- Better recommendations and ranking.
