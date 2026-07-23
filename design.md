# StayZ Design System — Dark Theme

> Scanned from codebase on July 22, 2026. Documents colors as they currently exist in code, not aspirational values. Light theme: TBD.

This document presents the complete audit of dark-theme design tokens, hardcoded hex values, opacity utilities, and typography used across the StayZ application.

---

## Color Tokens (repeated 2+ times)

### 1. Backgrounds & Surfaces

Page backgrounds, card surfaces, modal containers, and elevated dark surfaces:

- **`--backgrounds-bg-green-500-10`**: `bg-green-500/10` (used 14 times)
  - Locations: `app/(owner)/owner/booking-requests/page.tsx:371`, `app/(owner)/owner/booking-requests/page.tsx:406`, `app/(owner)/owner/dashboard/DashboardClient.tsx:60`, `app/(user)/user/dashboard/page.tsx:283`, `app/(user)/user/dashboard/page.tsx:302`, `components/add-listing/amenities-section.tsx:18`, `components/add-listing/contact-section.tsx:21`, `components/listing-details/BookingCard.tsx:358`, `components/listings/listingConfig.ts:36`, `components/listings/listingConfig.ts:37`, `components/listings/listingConfig.ts:38`, `components/owner/EditProfileModal.tsx:114`, `components/owner-profile/PrivateOwnerProfileView.tsx:26`, `components/user-profile/EditProfileModal.tsx:115`
- **`--bg-surface-hover`**: `bg-white/10` (used 12 times)
  - Locations: `app/(admin)/admin/reports/reports-client.tsx:191`, `app/(public)/developers/raj/page.tsx:103`, `app/(public)/developers/raj/page.tsx:291`, `app/(public)/developers/raj/page.tsx:698`, `app/(public)/developers/raj/page.tsx:713`, `app/(public)/developers/utkarsh/page.tsx:103`, `app/(public)/developers/utkarsh/page.tsx:300`, `components/admin/AdminListingDrawer.tsx:246`, `components/admin/pagination-bar.tsx:81`, `components/listing-details/HostCard.tsx:104`, `components/owner-profile/PrivateOwnerProfileView.tsx:220`, `components/user-profile/PrivateProfileView.tsx:179`
- **`--backgrounds-bg-rose-500-10`**: `bg-rose-500/10` (used 9 times)
  - Locations: `app/(user)/user/dashboard/page.tsx:396`, `components/admin/AdminListingsClient.tsx:79`, `components/admin/AdminListingsClient.tsx:389`, `components/admin/AdminListingsClient.tsx:487`, `components/admin/AdminListingsClient.tsx:600`, `components/admin/AdminListingsClient.tsx:692`, `components/saved-listings/saved-empty-state.tsx:22`, `components/saved-listings/saved-listing-card.tsx:202`, `components/saved-listings/saved-listings-client.tsx:206`
- **`--backgrounds-bg-neutral-800-40`**: `bg-neutral-800/40` (used 8 times)
  - Locations: `app/(public)/developers/raj/page.tsx:242`, `app/(public)/developers/raj/page.tsx:249`, `app/(public)/developers/raj/page.tsx:256`, `app/(public)/developers/raj/page.tsx:263`, `app/(public)/developers/utkarsh/page.tsx:251`, `app/(public)/developers/utkarsh/page.tsx:258`, `app/(public)/developers/utkarsh/page.tsx:265`, `app/(public)/developers/utkarsh/page.tsx:272`
- **`--backgrounds-bg-zinc-500-10`**: `bg-zinc-500/10` (used 6 times)
  - Locations: `components/admin/AdminListingsClient.tsx:74`, `components/admin/AdminListingsClient.tsx:388`, `components/my-listings/listing-card.tsx:144`, `components/my-listings/summary-cards.tsx:45`, `components/owner-profile/PrivateOwnerProfileView.tsx:28`, `components/saved-listings/saved-listing-card.tsx:75`
- **`--backgrounds-bg-purple-500-10`**: `bg-purple-500/10` (used 5 times)
  - Locations: `app/(owner)/owner/dashboard/DashboardClient.tsx:74`, `components/add-listing/amenities-section.tsx:23`, `components/listings/listingConfig.ts:30`, `components/listings/listingConfig.ts:31`, `components/listings/listingConfig.ts:32`
- **`--backgrounds-bg-slate-500-10`**: `bg-slate-500/10` (used 5 times)
  - Locations: `components/add-listing/amenities-section.tsx:22`, `components/add-listing/listing-status.tsx:40`, `components/admin/AdminNavBar.tsx:130`, `components/admin/SettingsDialog.tsx:182`, `components/admin/SettingsDialog.tsx:284`
- **`--bg-overlay-light`**: `bg-white/90` (used 4 times)
  - Locations: `app/(auth)/auth/verify/page.tsx:30`, `app/(user)/user/dashboard/page.tsx:357`, `components/my-listings/empty-state.tsx:38`, `components/saved-listings/saved-empty-state.tsx:71`
- **`--backgrounds-bg-red-500-20`**: `bg-red-500/20` (used 4 times)
  - Locations: `app/(owner)/owner/booking-requests/page.tsx:379`, `components/admin/AdminListingsClient.tsx:495`, `components/admin/confirm-dialog.tsx:82`, `components/my-listings/listing-actions.tsx:186`
- **`--backgrounds-bg-yellow-500-10`**: `bg-yellow-500/10` (used 4 times)
  - Locations: `app/(owner)/owner/dashboard/DashboardClient.tsx:67`, `app/(user)/user/dashboard/page.tsx:266`, `app/(user)/user/dashboard/page.tsx:284`, `components/add-listing/amenities-section.tsx:15`
- **`--backgrounds-bg-neutral-800-30`**: `bg-neutral-800/30` (used 4 times)
  - Locations: `app/(public)/developers/raj/page.tsx:696`, `app/(public)/developers/raj/page.tsx:711`, `app/(public)/developers/utkarsh/page.tsx:705`, `app/(public)/developers/utkarsh/page.tsx:720`
- **`--backgrounds-bg-teal-500-10`**: `bg-teal-500/10` (used 4 times)
  - Locations: `components/add-listing/amenities-section.tsx:24`, `components/user-profile/PrivateProfileView.tsx:194`, `components/user-profile/PrivateProfileView.tsx:214`, `components/user-profile/PublicProfileView.tsx:64`
- **`--backgrounds-shadow-black-40`**: `shadow-black/40` (used 3 times)
  - Locations: `app/(admin)/admin/owners/owners-client.tsx:70`, `app/(admin)/admin/reports/reports-client.tsx:80`, `app/(admin)/admin/users/users-client.tsx:89`
- **`--backgrounds-bg-violet-500-20`**: `bg-violet-500/20` (used 3 times)
  - Locations: `app/(admin)/admin/users/users-client.tsx:301`, `app/(user)/user/dashboard/page.tsx:255`, `components/my-listings/empty-state.tsx:19`
- **`--backgrounds-bg-pink-500-10`**: `bg-pink-500/10` (used 3 times)
  - Locations: `components/add-listing/image-upload.tsx:235`, `components/my-listings/listing-card.tsx:139`, `components/saved-listings/saved-listing-card.tsx:74`
- **`--backgrounds-bg-black-20`**: `bg-black/20` (used 3 times)
  - Locations: `components/add-listing/image-upload.tsx:386`, `components/home/TopNavBar.tsx:20`, `components/home/TopNavBar.tsx:42`
- **`--bg-accent-subtle`**: `bg-white/30` (used 3 times)
  - Locations: `components/admin/SettingsDialog.tsx:87`, `components/home/Hero.tsx:45`, `components/home/TopNavBar.tsx:20`
- **`--backgrounds-bg-emerald-500-20`**: `bg-emerald-500/20` (used 2 times)
  - Locations: `app/(admin)/admin/reports/reports-client.tsx:205`, `app/(user)/user/dashboard/page.tsx:231`
- **`--backgrounds-bg-blue-500-20`**: `bg-blue-500/20` (used 2 times)
  - Locations: `app/(admin)/admin/users/users-client.tsx:234`, `app/(user)/user/dashboard/page.tsx:239`
- **`--backgrounds-bg-green-500-20`**: `bg-green-500/20` (used 2 times)
  - Locations: `app/(owner)/owner/booking-requests/page.tsx:371`, `app/(user)/user/dashboard/page.tsx:247`
- **`--backgrounds-bg-white-20`**: `bg-white/20` (used 2 times)
  - Locations: `components/add-listing/image-upload.tsx:351`, `components/home/TopNavBar.tsx:77`
- **`--backgrounds-bg-black-60`**: `bg-black/60` (used 2 times)
  - Locations: `components/add-listing/image-upload.tsx:391`, `components/listings/ListingCard.tsx:98`
- **`--backgrounds-bg-amber-500-8`**: `bg-amber-500/8` (used 2 times)
  - Locations: `components/add-listing/listing-status.tsx:21`, `components/login-form.tsx:104`
- **`--backgrounds-bg-emerald-500-5`**: `bg-emerald-500/5` (used 2 times)
  - Locations: `components/add-listing/pricing-section.tsx:93`, `components/admin/AdminListingDrawer.tsx:224`
- **`--backgrounds-bg-red-500-30`**: `bg-red-500/30` (used 2 times)
  - Locations: `components/admin/AdminListingsClient.tsx:495`, `components/my-listings/listing-actions.tsx:186`
- **`--backgrounds-d099d4`**: `#d099d4` (used 2 times)
  - Locations: `components/home/BackgroundShapes.tsx:31`, `components/home/BackgroundShapes.tsx:32`
- **`--backgrounds-rgba-0-0-0-1`**: `rgba(0,0,0,1)` (used 2 times)
  - Locations: `components/home/ThumbnailGalleries.tsx:50`, `components/home/ThumbnailGalleries.tsx:51`
- **`--backgrounds-rgba-0-0-0-0-3`**: `rgba(0,0,0,0.3)` (used 2 times)
  - Locations: `components/home/ThumbnailGalleries.tsx:50`, `components/home/ThumbnailGalleries.tsx:51`
- **`--backgrounds-bg-black-10`**: `bg-black/10` (used 2 times)
  - Locations: `components/home/TopNavBar.tsx:76`, `components/ui/dialog.tsx:42`
- **`--backgrounds-rgba-0-0-0-0-5`**: `rgba(0,0,0,0.5)` (used 2 times)
  - Locations: `components/my-listings/listing-card.tsx:79`, `components/saved-listings/saved-listing-card.tsx:82`
- **`--backgrounds-rgba-0-0-0-0-7`**: `rgba(0,0,0,0.7)` (used 2 times)
  - Locations: `components/my-listings/listing-card.tsx:81`, `components/saved-listings/saved-listing-card.tsx:84`
- **`--backgrounds-from-black-60`**: `from-black/60` (used 2 times)
  - Locations: `components/my-listings/listing-card.tsx:95`, `components/saved-listings/saved-listing-card.tsx:98`
- **`--backgrounds-shadow-amber-500-10`**: `shadow-amber-500/10` (used 2 times)
  - Locations: `components/my-listings/listing-status-badge.tsx:19`, `components/my-listings/summary-cards.tsx:38`
- **`--backgrounds-shadow-zinc-500-10`**: `shadow-zinc-500/10` (used 2 times)
  - Locations: `components/my-listings/listing-status-badge.tsx:24`, `components/my-listings/summary-cards.tsx:47`

### 2. Borders & Dividers

Border lines, card dividers, ring highlights, and separator outlines:

- **`--color-outline-variant`**: `#434655` (used 118 times)
  - Locations: `app/(public)/developers/raj/page.tsx:100`, `app/(public)/developers/raj/page.tsx:103`, `app/(public)/developers/raj/page.tsx:110`, `app/(public)/developers/raj/page.tsx:130`, `app/(public)/developers/raj/page.tsx:141`, `app/(public)/developers/raj/page.tsx:150`, `app/(public)/developers/raj/page.tsx:158`, `app/(public)/developers/raj/page.tsx:176`, `app/(public)/developers/raj/page.tsx:193`, `app/(public)/developers/raj/page.tsx:204`, `app/(public)/developers/raj/page.tsx:230`, `app/(public)/developers/raj/page.tsx:231`, `app/(public)/developers/raj/page.tsx:242`, `app/(public)/developers/raj/page.tsx:249`, `app/(public)/developers/raj/page.tsx:256`, `app/(public)/developers/raj/page.tsx:263`, `app/(public)/developers/raj/page.tsx:276`, `app/(public)/developers/raj/page.tsx:277`, `app/(public)/developers/raj/page.tsx:281`, `app/(public)/developers/raj/page.tsx:285`, `app/(public)/developers/raj/page.tsx:286`, `app/(public)/developers/raj/page.tsx:291`, `app/(public)/developers/raj/page.tsx:298`, `app/(public)/developers/raj/page.tsx:299`, `app/(public)/developers/raj/page.tsx:303`, `app/(public)/developers/raj/page.tsx:327`, `app/(public)/developers/raj/page.tsx:328`, `app/(public)/developers/raj/page.tsx:347`, `app/(public)/developers/raj/page.tsx:362`, `app/(public)/developers/raj/page.tsx:363`, `app/(public)/developers/raj/page.tsx:383`, `app/(public)/developers/raj/page.tsx:398`, `app/(public)/developers/raj/page.tsx:399`, `app/(public)/developers/raj/page.tsx:413`, `app/(public)/developers/raj/page.tsx:428`, `app/(public)/developers/raj/page.tsx:429`, `app/(public)/developers/raj/page.tsx:448`, `app/(public)/developers/raj/page.tsx:465`, `app/(public)/developers/raj/page.tsx:487`, `app/(public)/developers/raj/page.tsx:488`, `app/(public)/developers/raj/page.tsx:521`, `app/(public)/developers/raj/page.tsx:535`, `app/(public)/developers/raj/page.tsx:536`, `app/(public)/developers/raj/page.tsx:569`, `app/(public)/developers/raj/page.tsx:585`, `app/(public)/developers/raj/page.tsx:586`, `app/(public)/developers/raj/page.tsx:615`, `app/(public)/developers/raj/page.tsx:629`, `app/(public)/developers/raj/page.tsx:630`, `app/(public)/developers/raj/page.tsx:659`, `app/(public)/developers/raj/page.tsx:688`, `app/(public)/developers/raj/page.tsx:689`, `app/(public)/developers/raj/page.tsx:696`, `app/(public)/developers/raj/page.tsx:698`, `app/(public)/developers/raj/page.tsx:705`, `app/(public)/developers/raj/page.tsx:711`, `app/(public)/developers/raj/page.tsx:713`, `app/(public)/developers/raj/page.tsx:720`, `app/(public)/developers/raj/page.tsx:740`, `app/(public)/developers/utkarsh/page.tsx:100`, `app/(public)/developers/utkarsh/page.tsx:103`, `app/(public)/developers/utkarsh/page.tsx:110`, `app/(public)/developers/utkarsh/page.tsx:130`, `app/(public)/developers/utkarsh/page.tsx:141`, `app/(public)/developers/utkarsh/page.tsx:150`, `app/(public)/developers/utkarsh/page.tsx:158`, `app/(public)/developers/utkarsh/page.tsx:176`, `app/(public)/developers/utkarsh/page.tsx:193`, `app/(public)/developers/utkarsh/page.tsx:204`, `app/(public)/developers/utkarsh/page.tsx:230`, `app/(public)/developers/utkarsh/page.tsx:231`, `app/(public)/developers/utkarsh/page.tsx:241`, `app/(public)/developers/utkarsh/page.tsx:251`, `app/(public)/developers/utkarsh/page.tsx:258`, `app/(public)/developers/utkarsh/page.tsx:265`, `app/(public)/developers/utkarsh/page.tsx:272`, `app/(public)/developers/utkarsh/page.tsx:285`, `app/(public)/developers/utkarsh/page.tsx:286`, `app/(public)/developers/utkarsh/page.tsx:290`, `app/(public)/developers/utkarsh/page.tsx:294`, `app/(public)/developers/utkarsh/page.tsx:295`, `app/(public)/developers/utkarsh/page.tsx:300`, `app/(public)/developers/utkarsh/page.tsx:307`, `app/(public)/developers/utkarsh/page.tsx:308`, `app/(public)/developers/utkarsh/page.tsx:312`, `app/(public)/developers/utkarsh/page.tsx:336`, `app/(public)/developers/utkarsh/page.tsx:337`, `app/(public)/developers/utkarsh/page.tsx:356`, `app/(public)/developers/utkarsh/page.tsx:371`, `app/(public)/developers/utkarsh/page.tsx:372`, `app/(public)/developers/utkarsh/page.tsx:392`, `app/(public)/developers/utkarsh/page.tsx:407`, `app/(public)/developers/utkarsh/page.tsx:408`, `app/(public)/developers/utkarsh/page.tsx:422`, `app/(public)/developers/utkarsh/page.tsx:437`, `app/(public)/developers/utkarsh/page.tsx:438`, `app/(public)/developers/utkarsh/page.tsx:457`, `app/(public)/developers/utkarsh/page.tsx:474`, `app/(public)/developers/utkarsh/page.tsx:496`, `app/(public)/developers/utkarsh/page.tsx:497`, `app/(public)/developers/utkarsh/page.tsx:530`, `app/(public)/developers/utkarsh/page.tsx:544`, `app/(public)/developers/utkarsh/page.tsx:545`, `app/(public)/developers/utkarsh/page.tsx:578`, `app/(public)/developers/utkarsh/page.tsx:594`, `app/(public)/developers/utkarsh/page.tsx:595`, `app/(public)/developers/utkarsh/page.tsx:624`, `app/(public)/developers/utkarsh/page.tsx:638`, `app/(public)/developers/utkarsh/page.tsx:639`, `app/(public)/developers/utkarsh/page.tsx:668`, `app/(public)/developers/utkarsh/page.tsx:697`, `app/(public)/developers/utkarsh/page.tsx:698`, `app/(public)/developers/utkarsh/page.tsx:705`, `app/(public)/developers/utkarsh/page.tsx:714`, `app/(public)/developers/utkarsh/page.tsx:720`, `app/(public)/developers/utkarsh/page.tsx:729`, `app/(public)/developers/utkarsh/page.tsx:749`, `app/globals.css:136`
- **`--brand-primary-blue`**: `#346ef6` (used 80 times)
  - Locations: `app/(public)/developers/raj/page.tsx:100`, `app/(public)/developers/raj/page.tsx:103`, `app/(public)/developers/raj/page.tsx:110`, `app/(public)/developers/raj/page.tsx:130`, `app/(public)/developers/raj/page.tsx:141`, `app/(public)/developers/raj/page.tsx:150`, `app/(public)/developers/raj/page.tsx:158`, `app/(public)/developers/raj/page.tsx:176`, `app/(public)/developers/raj/page.tsx:203`, `app/(public)/developers/raj/page.tsx:204`, `app/(public)/developers/raj/page.tsx:230`, `app/(public)/developers/raj/page.tsx:242`, `app/(public)/developers/raj/page.tsx:249`, `app/(public)/developers/raj/page.tsx:256`, `app/(public)/developers/raj/page.tsx:263`, `app/(public)/developers/raj/page.tsx:276`, `app/(public)/developers/raj/page.tsx:327`, `app/(public)/developers/raj/page.tsx:347`, `app/(public)/developers/raj/page.tsx:362`, `app/(public)/developers/raj/page.tsx:383`, `app/(public)/developers/raj/page.tsx:398`, `app/(public)/developers/raj/page.tsx:413`, `app/(public)/developers/raj/page.tsx:428`, `app/(public)/developers/raj/page.tsx:448`, `app/(public)/developers/raj/page.tsx:465`, `app/(public)/developers/raj/page.tsx:487`, `app/(public)/developers/raj/page.tsx:521`, `app/(public)/developers/raj/page.tsx:527`, `app/(public)/developers/raj/page.tsx:535`, `app/(public)/developers/raj/page.tsx:569`, `app/(public)/developers/raj/page.tsx:577`, `app/(public)/developers/raj/page.tsx:585`, `app/(public)/developers/raj/page.tsx:615`, `app/(public)/developers/raj/page.tsx:621`, `app/(public)/developers/raj/page.tsx:629`, `app/(public)/developers/raj/page.tsx:667`, `app/(public)/developers/raj/page.tsx:688`, `app/(public)/developers/raj/page.tsx:696`, `app/(public)/developers/raj/page.tsx:711`, `app/(public)/developers/raj/page.tsx:740`, `app/(public)/developers/utkarsh/page.tsx:100`, `app/(public)/developers/utkarsh/page.tsx:103`, `app/(public)/developers/utkarsh/page.tsx:110`, `app/(public)/developers/utkarsh/page.tsx:130`, `app/(public)/developers/utkarsh/page.tsx:141`, `app/(public)/developers/utkarsh/page.tsx:150`, `app/(public)/developers/utkarsh/page.tsx:158`, `app/(public)/developers/utkarsh/page.tsx:176`, `app/(public)/developers/utkarsh/page.tsx:203`, `app/(public)/developers/utkarsh/page.tsx:204`, `app/(public)/developers/utkarsh/page.tsx:230`, `app/(public)/developers/utkarsh/page.tsx:251`, `app/(public)/developers/utkarsh/page.tsx:258`, `app/(public)/developers/utkarsh/page.tsx:265`, `app/(public)/developers/utkarsh/page.tsx:272`, `app/(public)/developers/utkarsh/page.tsx:285`, `app/(public)/developers/utkarsh/page.tsx:336`, `app/(public)/developers/utkarsh/page.tsx:356`, `app/(public)/developers/utkarsh/page.tsx:371`, `app/(public)/developers/utkarsh/page.tsx:392`, `app/(public)/developers/utkarsh/page.tsx:407`, `app/(public)/developers/utkarsh/page.tsx:422`, `app/(public)/developers/utkarsh/page.tsx:437`, `app/(public)/developers/utkarsh/page.tsx:457`, `app/(public)/developers/utkarsh/page.tsx:474`, `app/(public)/developers/utkarsh/page.tsx:496`, `app/(public)/developers/utkarsh/page.tsx:530`, `app/(public)/developers/utkarsh/page.tsx:536`, `app/(public)/developers/utkarsh/page.tsx:544`, `app/(public)/developers/utkarsh/page.tsx:578`, `app/(public)/developers/utkarsh/page.tsx:586`, `app/(public)/developers/utkarsh/page.tsx:594`, `app/(public)/developers/utkarsh/page.tsx:624`, `app/(public)/developers/utkarsh/page.tsx:630`, `app/(public)/developers/utkarsh/page.tsx:638`, `app/(public)/developers/utkarsh/page.tsx:676`, `app/(public)/developers/utkarsh/page.tsx:697`, `app/(public)/developers/utkarsh/page.tsx:705`, `app/(public)/developers/utkarsh/page.tsx:720`, `app/(public)/developers/utkarsh/page.tsx:749`
- **`--bg-surface-container`**: `#1d1f28` (used 44 times)
  - Locations: `app/(public)/developers/raj/page.tsx:100`, `app/(public)/developers/raj/page.tsx:176`, `app/(public)/developers/raj/page.tsx:204`, `app/(public)/developers/raj/page.tsx:230`, `app/(public)/developers/raj/page.tsx:276`, `app/(public)/developers/raj/page.tsx:298`, `app/(public)/developers/raj/page.tsx:327`, `app/(public)/developers/raj/page.tsx:347`, `app/(public)/developers/raj/page.tsx:362`, `app/(public)/developers/raj/page.tsx:383`, `app/(public)/developers/raj/page.tsx:398`, `app/(public)/developers/raj/page.tsx:413`, `app/(public)/developers/raj/page.tsx:428`, `app/(public)/developers/raj/page.tsx:448`, `app/(public)/developers/raj/page.tsx:465`, `app/(public)/developers/raj/page.tsx:487`, `app/(public)/developers/raj/page.tsx:535`, `app/(public)/developers/raj/page.tsx:585`, `app/(public)/developers/raj/page.tsx:629`, `app/(public)/developers/raj/page.tsx:688`, `app/(public)/developers/raj/page.tsx:740`, `app/(public)/developers/utkarsh/page.tsx:100`, `app/(public)/developers/utkarsh/page.tsx:176`, `app/(public)/developers/utkarsh/page.tsx:204`, `app/(public)/developers/utkarsh/page.tsx:230`, `app/(public)/developers/utkarsh/page.tsx:241`, `app/(public)/developers/utkarsh/page.tsx:285`, `app/(public)/developers/utkarsh/page.tsx:307`, `app/(public)/developers/utkarsh/page.tsx:336`, `app/(public)/developers/utkarsh/page.tsx:356`, `app/(public)/developers/utkarsh/page.tsx:371`, `app/(public)/developers/utkarsh/page.tsx:392`, `app/(public)/developers/utkarsh/page.tsx:407`, `app/(public)/developers/utkarsh/page.tsx:422`, `app/(public)/developers/utkarsh/page.tsx:437`, `app/(public)/developers/utkarsh/page.tsx:457`, `app/(public)/developers/utkarsh/page.tsx:474`, `app/(public)/developers/utkarsh/page.tsx:496`, `app/(public)/developers/utkarsh/page.tsx:544`, `app/(public)/developers/utkarsh/page.tsx:594`, `app/(public)/developers/utkarsh/page.tsx:638`, `app/(public)/developers/utkarsh/page.tsx:697`, `app/(public)/developers/utkarsh/page.tsx:749`, `app/globals.css:138`
- **`--overlay-backdrop-dark`**: `#00000040` (used 26 times)
  - Locations: `app/(public)/developers/raj/page.tsx:103`, `app/(public)/developers/raj/page.tsx:130`, `app/(public)/developers/raj/page.tsx:141`, `app/(public)/developers/raj/page.tsx:150`, `app/(public)/developers/raj/page.tsx:158`, `app/(public)/developers/raj/page.tsx:204`, `app/(public)/developers/raj/page.tsx:521`, `app/(public)/developers/raj/page.tsx:527`, `app/(public)/developers/raj/page.tsx:569`, `app/(public)/developers/raj/page.tsx:577`, `app/(public)/developers/raj/page.tsx:615`, `app/(public)/developers/raj/page.tsx:621`, `app/(public)/developers/raj/page.tsx:667`, `app/(public)/developers/utkarsh/page.tsx:103`, `app/(public)/developers/utkarsh/page.tsx:130`, `app/(public)/developers/utkarsh/page.tsx:141`, `app/(public)/developers/utkarsh/page.tsx:150`, `app/(public)/developers/utkarsh/page.tsx:158`, `app/(public)/developers/utkarsh/page.tsx:204`, `app/(public)/developers/utkarsh/page.tsx:530`, `app/(public)/developers/utkarsh/page.tsx:536`, `app/(public)/developers/utkarsh/page.tsx:578`, `app/(public)/developers/utkarsh/page.tsx:586`, `app/(public)/developers/utkarsh/page.tsx:624`, `app/(public)/developers/utkarsh/page.tsx:630`, `app/(public)/developers/utkarsh/page.tsx:676`
- **`--bg-elevated-surface`**: `#1a1a1a` (used 13 times)
  - Locations: `app/(admin)/admin/owners/owners-client.tsx:70`, `app/(admin)/admin/owners/owners-client.tsx:260`, `app/(admin)/admin/reports/reports-client.tsx:80`, `app/(admin)/admin/reports/reports-client.tsx:441`, `app/(admin)/admin/reports/reports-client.tsx:455`, `app/(admin)/admin/users/users-client.tsx:89`, `app/(admin)/admin/users/users-client.tsx:284`, `app/(admin)/admin/users/users-client.tsx:504`, `app/(admin)/admin/users/users-client.tsx:517`, `components/listing-details/BookingCard.tsx:314`, `components/listing-details/ReviewFormModal.tsx:197`, `components/my-listings/empty-state.tsx:15`, `components/saved-listings/saved-empty-state.tsx:24`
- **`--border-medium`**: `border-white/20` (used 12 times)
  - Locations: `app/(user)/user/dashboard/page.tsx:291`, `app/(user)/user/dashboard/page.tsx:311`, `components/admin/AdminListingsClient.tsx:529`, `components/admin/AdminListingsClient.tsx:556`, `components/admin/AdminListingsClient.tsx:657`, `components/listing-details/HostCard.tsx:104`, `components/my-listings/filters-bar.tsx:33`, `components/my-listings/filters-bar.tsx:55`, `components/saved-listings/saved-filters-bar.tsx:45`, `components/saved-listings/saved-filters-bar.tsx:80`, `components/saved-listings/saved-filters-bar.tsx:131`, `components/user-profile/ReviewsList.tsx:83`
- **`--borders-border-green-500-20`**: `border-green-500/20` (used 10 times)
  - Locations: `app/(owner)/owner/booking-requests/page.tsx:371`, `app/(owner)/owner/booking-requests/page.tsx:406`, `app/(owner)/owner/dashboard/DashboardClient.tsx:245`, `components/listing-details/BookingCard.tsx:358`, `components/listings/listingConfig.ts:36`, `components/listings/listingConfig.ts:37`, `components/listings/listingConfig.ts:38`, `components/owner/EditProfileModal.tsx:114`, `components/owner-profile/PrivateOwnerProfileView.tsx:26`, `components/user-profile/EditProfileModal.tsx:115`
- **`--borders-ffffff`**: `#ffffff` (used 9 times)
  - Locations: `app/(public)/developers/raj/page.tsx:347`, `app/(public)/developers/raj/page.tsx:383`, `app/(public)/developers/raj/page.tsx:413`, `app/(public)/developers/raj/page.tsx:448`, `app/(public)/developers/utkarsh/page.tsx:356`, `app/(public)/developers/utkarsh/page.tsx:392`, `app/(public)/developers/utkarsh/page.tsx:422`, `app/(public)/developers/utkarsh/page.tsx:457`, `app/global-error.tsx:21`
- **`--border-faint`**: `border-white/5` (used 7 times)
  - Locations: `app/(public)/owners/[id]/page.tsx:44`, `app/(public)/users/[id]/page.tsx:44`, `components/admin/AdminListingsClient.tsx:357`, `components/admin/AdminListingsClient.tsx:370`, `components/owner/EditProfileModal.tsx:137`, `components/user-profile/PrivateProfileView.tsx:59`, `components/user-profile/PrivateProfileView.tsx:188`
- **`--borders-ring-white-10`**: `ring-white/10` (used 6 times)
  - Locations: `app/(owner)/owner/dashboard/DashboardClient.tsx:91`, `app/(owner)/owner/dashboard/DashboardClient.tsx:94`, `app/(user)/user/dashboard/page.tsx:164`, `app/(user)/user/dashboard/page.tsx:167`, `components/user-profile/PrivateProfileView.tsx:133`, `components/user-profile/PublicProfileView.tsx:30`
- **`--bg-input-surface`**: `#181818` (used 6 times)
  - Locations: `components/owner/EditProfileModal.tsx:155`, `components/owner/EditProfileModal.tsx:171`, `components/owner/EditProfileModal.tsx:188`, `components/owner/EditProfileModal.tsx:209`, `components/user-profile/EditProfileModal.tsx:146`, `components/user-profile/EditProfileModal.tsx:168`
- **`--borders-border-orange-500-20`**: `border-orange-500/20` (used 5 times)
  - Locations: `app/(admin)/admin/dashboard/page.tsx:77`, `components/admin/AdminNavBar.tsx:59`, `components/admin/confirm-dialog.tsx:83`, `components/admin/status-badge.tsx:48`, `components/admin/status-badge.tsx:99`
- **`--bg-navbar-dark`**: `#0d0d0d` (used 5 times)
  - Locations: `app/(owner)/owner/booking-requests/page.tsx:269`, `components/admin/AdminListingDrawer.tsx:119`, `components/admin/AdminListingsClient.tsx:770`, `components/admin/AdminListingsClient.tsx:794`, `components/admin/AdminNavBar.tsx:102`
- **`--color-google-blue`**: `#4285f4` (used 5 times)
  - Locations: `app/(public)/developers/page.tsx:31`, `app/(public)/developers/raj/page.tsx:158`, `app/(public)/developers/utkarsh/page.tsx:158`, `app/(public)/developers/utkarsh/page.tsx:707`, `app/(public)/developers/utkarsh/page.tsx:722`
- **`--borders-border-blue-400-50`**: `border-blue-400/50` (used 4 times)
  - Locations: `components/add-listing/location-section.tsx:50`, `components/add-listing/location-section.tsx:70`, `components/add-listing/location-section.tsx:92`, `components/add-listing/location-section.tsx:108`
- **`--borders-ring-blue-400-20`**: `ring-blue-400/20` (used 4 times)
  - Locations: `components/add-listing/location-section.tsx:50`, `components/add-listing/location-section.tsx:70`, `components/add-listing/location-section.tsx:92`, `components/add-listing/location-section.tsx:108`
- **`--borders-border-zinc-500-20`**: `border-zinc-500/20` (used 4 times)
  - Locations: `components/admin/AdminListingsClient.tsx:74`, `components/admin/AdminListingsClient.tsx:388`, `components/my-listings/summary-cards.tsx:46`, `components/owner-profile/PrivateOwnerProfileView.tsx:28`
- **`--borders-000000`**: `#000000` (used 3 times)
  - Locations: `app/(public)/developers/page.tsx:116`, `app/(public)/developers/page.tsx:175`, `app/(public)/developers/page.tsx:190`
- **`--borders-border-rose-500-20`**: `border-rose-500/20` (used 3 times)
  - Locations: `components/admin/AdminListingsClient.tsx:79`, `components/admin/AdminListingsClient.tsx:389`, `components/admin/AdminListingsClient.tsx:487`
- **`--borders-ring-white-20`**: `ring-white/20` (used 3 times)
  - Locations: `components/admin/AdminListingsClient.tsx:408`, `components/saved-listings/saved-listing-card.tsx:187`, `components/saved-listings/saved-listings-client.tsx:261`
- **`--borders-border-slate-500-40`**: `border-slate-500/40` (used 3 times)
  - Locations: `components/admin/SettingsDialog.tsx:86`, `components/admin/SettingsDialog.tsx:248`, `components/admin/SettingsDialog.tsx:266`
- **`--borders-divide-white-10`**: `divide-white/10` (used 3 times)
  - Locations: `components/listing-details/HostCard.tsx:58`, `components/owner-profile/PrivateOwnerProfileView.tsx:136`, `components/owner-profile/PublicOwnerProfileView.tsx:77`
- **`--borders-border-red-500-30`**: `border-red-500/30` (used 3 times)
  - Locations: `components/listing-details/ReviewsSection.tsx:165`, `components/my-listings/listing-actions.tsx:186`, `components/ui/toast.tsx:97`
- **`--borders-border-purple-500-20`**: `border-purple-500/20` (used 3 times)
  - Locations: `components/listings/listingConfig.ts:30`, `components/listings/listingConfig.ts:31`, `components/listings/listingConfig.ts:32`
- **`--border-divider`**: `border-white/8` (used 2 times)
  - Locations: `app/(auth)/auth/verify/page.tsx:91`, `app/(auth)/auth/verify-email-sent/page.tsx:18`
- **`--borders-0a66c2`**: `#0a66c2` (used 2 times)
  - Locations: `app/(public)/developers/raj/page.tsx:130`, `app/(public)/developers/utkarsh/page.tsx:130`
- **`--borders-181717`**: `#181717` (used 2 times)
  - Locations: `app/(public)/developers/raj/page.tsx:141`, `app/(public)/developers/utkarsh/page.tsx:141`
- **`--borders-ea4335`**: `#ea4335` (used 2 times)
  - Locations: `app/(public)/developers/raj/page.tsx:150`, `app/(public)/developers/utkarsh/page.tsx:150`
- **`--borders-ring-white-25`**: `ring-white/25` (used 2 times)
  - Locations: `app/(user)/user/dashboard/page.tsx:164`, `app/(user)/user/dashboard/page.tsx:167`
- **`--borders-border-emerald-400-50`**: `border-emerald-400/50` (used 2 times)
  - Locations: `components/add-listing/pricing-section.tsx:54`, `components/add-listing/pricing-section.tsx:84`
- **`--borders-ring-emerald-400-20`**: `ring-emerald-400/20` (used 2 times)
  - Locations: `components/add-listing/pricing-section.tsx:54`, `components/add-listing/pricing-section.tsx:84`
- **`--borders-border-slate-500-20`**: `border-slate-500/20` (used 2 times)
  - Locations: `components/admin/AdminNavBar.tsx:130`, `components/admin/SettingsDialog.tsx:284`
- **`--borders-ring-slate-500-20`**: `ring-slate-500/20` (used 2 times)
  - Locations: `components/admin/SettingsDialog.tsx:248`, `components/admin/SettingsDialog.tsx:266`
- **`--borders-ffede7`**: `#ffede7` (used 2 times)
  - Locations: `components/home/EditorialCollage.tsx:68`, `components/home/Mission.tsx:40`
- **`--borders-1a4fd1`**: `#1a4fd1` (used 2 times)
  - Locations: `components/home/EditorialCollage.tsx:68`, `components/home/Mission.tsx:40`
- **`--color-airbnb-pink`**: `#ff385c` (used 2 times)
  - Locations: `components/listing-details/HostCard.tsx:37`, `components/owner-profile/PublicOwnerProfileView.tsx:55`
- **`--borders-ring-white-30`**: `ring-white/30` (used 2 times)
  - Locations: `components/listings/ListingCard.tsx:98`, `components/ui/toast.tsx:149`
- **`--borders-border-amber-500-30`**: `border-amber-500/30` (used 2 times)
  - Locations: `components/login-form.tsx:104`, `components/my-listings/listing-status-badge.tsx:19`
- **`--borders-border-blue-500-25`**: `border-blue-500/25` (used 2 times)
  - Locations: `components/my-listings/listing-card.tsx:130`, `components/saved-listings/saved-listing-card.tsx:133`
- **`--borders-border-violet-500-25`**: `border-violet-500/25` (used 2 times)
  - Locations: `components/my-listings/listing-card.tsx:134`, `components/saved-listings/saved-listing-card.tsx:137`
- **`--borders-border-pink-500-25`**: `border-pink-500/25` (used 2 times)
  - Locations: `components/my-listings/listing-card.tsx:139`, `components/saved-listings/saved-listing-card.tsx:74`
- **`--borders-border-zinc-500-25`**: `border-zinc-500/25` (used 2 times)
  - Locations: `components/my-listings/listing-card.tsx:144`, `components/saved-listings/saved-listing-card.tsx:75`
- **`--bg-card-base`**: `#111111` (used 2 times)
  - Locations: `components/owner/EditProfileModal.tsx:102`, `components/user-profile/EditProfileModal.tsx:101`
- **`--borders-divide-white-5`**: `divide-white/5` (used 2 times)
  - Locations: `components/owner-profile/PrivateOwnerProfileView.tsx:304`, `components/user-profile/PrivateProfileView.tsx:313`

### 3. Text & Content Colors

Primary, secondary, muted, disabled, and placeholder text opacities:

- **`--text-secondary`**: `text-white/60` (used 39 times)
  - Locations: `app/(admin)/admin/dashboard/page.tsx:160`, `app/(admin)/admin/reports/reports-client.tsx:184`, `app/(admin)/admin/reports/reports-client.tsx:191`, `app/(admin)/admin/reports/reports-client.tsx:604`, `app/(admin)/admin/users/users-client.tsx:127`, `app/(admin)/admin/users/users-client.tsx:158`, `app/(admin)/admin/users/users-client.tsx:227`, `app/(admin)/admin/users/users-client.tsx:294`, `app/(auth)/auth/verify/page.tsx:144`, `app/(auth)/auth/verify-email-sent/page.tsx:62`, `app/(public)/owners/[id]/page.tsx:48`, `app/(public)/users/[id]/page.tsx:48`, `app/(user)/user/dashboard/page.tsx:87`, `app/(user)/user/dashboard/page.tsx:181`, `app/(user)/user/dashboard/page.tsx:291`, `app/(user)/user/dashboard/page.tsx:311`, `components/admin/admin-page-header.tsx:42`, `components/admin/AdminListingDrawer.tsx:167`, `components/admin/AdminListingDrawer.tsx:170`, `components/admin/AdminListingDrawer.tsx:173`, `components/admin/AdminListingDrawer.tsx:316`, `components/admin/AdminListingDrawer.tsx:328`, `components/admin/AdminListingsClient.tsx:86`, `components/admin/AdminListingsClient.tsx:516`, `components/admin/AdminListingsClient.tsx:608`, `components/admin/AdminListingsClient.tsx:699`, `components/admin/confirm-dialog.tsx:72`, `components/admin/pagination-bar.tsx:38`, `components/admin/pagination-bar.tsx:94`, `components/admin/SettingsDialog.tsx:276`, `components/owner-profile/PrivateOwnerProfileView.tsx:179`, `components/owner-profile/PrivateOwnerProfileView.tsx:187`, `components/owner-profile/PrivateOwnerProfileView.tsx:199`, `components/owner-profile/PublicOwnerProfileView.tsx:112`, `components/owner-profile/PublicOwnerProfileView.tsx:120`, `components/owner-profile/PublicOwnerProfileView.tsx:127`, `components/user-profile/PrivateProfileView.tsx:170`, `components/user-profile/PublicProfileView.tsx:56`, `components/user-profile/ReviewsList.tsx:127`
- **`--text-heading-muted`**: `text-white/80` (used 10 times)
  - Locations: `app/(admin)/admin/dashboard/page.tsx:162`, `app/(admin)/admin/reports/reports-client.tsx:518`, `app/(user)/user/dashboard/page.tsx:89`, `components/add-listing/image-upload.tsx:357`, `components/admin/AdminListingDrawer.tsx:187`, `components/admin/AdminListingsClient.tsx:479`, `components/admin/AdminListingsClient.tsx:487`, `components/admin/AdminListingsClient.tsx:574`, `components/admin/AdminListingsClient.tsx:667`, `components/admin/SettingsDialog.tsx:68`
- **`--text-placeholder`**: `text-white/25` (used 9 times)
  - Locations: `app/(admin)/admin/reports/reports-client.tsx:261`, `components/owner-profile/PrivateOwnerProfileView.tsx:172`, `components/owner-profile/PrivateOwnerProfileView.tsx:202`, `components/owner-profile/PrivateOwnerProfileView.tsx:208`, `components/owner-profile/PublicOwnerProfileView.tsx:135`, `components/user-profile/PrivateProfileView.tsx:155`, `components/user-profile/PrivateProfileView.tsx:162`, `components/user-profile/PublicProfileView.tsx:41`, `components/user-profile/PublicProfileView.tsx:48`
- **`--text-faint`**: `text-white/15` (used 3 times)
  - Locations: `components/user-profile/PrivateProfileView.tsx:160`, `components/user-profile/PublicProfileView.tsx:46`, `components/user-profile/ReviewsList.tsx:109`
- **`--text-text-white-45`**: `text-white/45` (used 2 times)
  - Locations: `app/(auth)/auth/verify-email-sent/page.tsx:49`, `components/login-form.tsx:108`
- **`--bg-app-alt`**: `#131313` (used 2 times)
  - Locations: `app/(public)/developers/page.tsx:53`, `app/page.tsx:15`
- **`--text-11131b`**: `#11131b` (used 2 times)
  - Locations: `app/(public)/developers/raj/page.tsx:86`, `app/(public)/developers/utkarsh/page.tsx:86`
- **`--bg-button-secondary`**: `#222` (used 2 times)
  - Locations: `components/owner/EditProfileModal.tsx:221`, `components/user-profile/EditProfileModal.tsx:180`
- **`--bg-button-secondary-hover`**: `#333` (used 2 times)
  - Locations: `components/owner/EditProfileModal.tsx:221`, `components/user-profile/EditProfileModal.tsx:180`
- **`--text-text-teal-400-80`**: `text-teal-400/80` (used 2 times)
  - Locations: `components/owner-profile/PrivateOwnerProfileView.tsx:64`, `components/user-profile/PrivateProfileView.tsx:97`

### 4. Status & Badge Colors

Colors mapped to domain status states cross-referenced from `status-badge.tsx`, `listing-status-badge.tsx`, `AdminListingsClient.tsx`, and `PrivateOwnerProfileView.tsx`:

#### Status Mappings Overview
- **Active Listing / Active User**: Emerald theme (`bg-emerald-500/10`, `text-emerald-400`, `border-emerald-500/20`, `bg-emerald-400` dot)
- **Pending Report / Draft Listing**: Amber / Orange theme (`bg-amber-500/10`, `text-amber-400`, `border-amber-500/20` / `bg-orange-500/10`, `text-orange-400`)
- **Suspended Account / Suspended Listing**: Rose / Red theme (`bg-rose-500/15`, `text-rose-400`, `border-rose-500/30`)
- **Rented Listing**: Zinc / Neutral theme (`bg-zinc-500/10`, `text-zinc-400`, `border-zinc-500/20`, `bg-zinc-400` dot)
- **Admin Role**: Red theme (`bg-red-500/10`, `text-red-400`, `border-red-500/20`)
- **Owner Role**: Violet theme (`bg-violet-500/10`, `text-violet-400`, `border-violet-500/20`)
- **User Role / Booking Request**: Blue theme (`bg-blue-500/10`, `text-blue-400`, `border-blue-500/20`)

#### Token Details

- **`--status-badge-bg-blue-500-10`**: `bg-blue-500/10` (used 23 times)
  - Locations: `app/(admin)/admin/dashboard/page.tsx:49`, `app/(admin)/admin/dashboard/page.tsx:88`, `app/(admin)/admin/users/page.tsx:92`, `app/(admin)/admin/users/users-client.tsx:234`, `app/(owner)/owner/dashboard/DashboardClient.tsx:53`, `app/(user)/user/dashboard/page.tsx:267`, `app/(user)/user/dashboard/page.tsx:322`, `components/add-listing/amenities-section.tsx:16`, `components/add-listing/location-section.tsx:24`, `components/admin/AdminAnalyticsClient.tsx:365`, `components/admin/AdminListingsClient.tsx:385`, `components/admin/AdminNavBar.tsx:42`, `components/admin/status-badge.tsx:9`, `components/admin/status-badge.tsx:129`, `components/listings/listingConfig.ts:23`, `components/listings/listingConfig.ts:24`, `components/listings/listingConfig.ts:25`, `components/listings/listingConfig.ts:26`, `components/login-form.tsx:87`, `components/my-listings/listing-actions.tsx:132`, `components/my-listings/listing-card.tsx:130`, `components/owner-profile/PrivateOwnerProfileView.tsx:27`, `components/saved-listings/saved-listing-card.tsx:133`
- **`--status-badge-bg-emerald-500-10`**: `bg-emerald-500/10` (used 20 times)
  - Locations: `app/(admin)/admin/dashboard/page.tsx:67`, `app/(admin)/admin/dashboard/page.tsx:104`, `app/(admin)/admin/reports/reports-client.tsx:205`, `components/add-listing/listing-form.tsx:83`, `components/add-listing/listing-status.tsx:29`, `components/add-listing/pricing-section.tsx:22`, `components/admin/AdminAnalyticsClient.tsx:220`, `components/admin/AdminAnalyticsClient.tsx:356`, `components/admin/AdminListingsClient.tsx:64`, `components/admin/AdminListingsClient.tsx:340`, `components/admin/AdminListingsClient.tsx:386`, `components/admin/AdminListingsClient.tsx:479`, `components/admin/AdminListingsClient.tsx:589`, `components/admin/AdminListingsClient.tsx:682`, `components/admin/AdminNavBar.tsx:34`, `components/admin/status-badge.tsx:43`, `components/admin/status-badge.tsx:81`, `components/admin/status-badge.tsx:103`, `components/my-listings/listing-actions.tsx:117`, `components/my-listings/summary-cards.tsx:27`
- **`--status-badge-bg-red-500-10`**: `bg-red-500/10` (used 19 times)
  - Locations: `app/(admin)/admin/owners/owners-client.tsx:80`, `app/(admin)/admin/reports/reports-client.tsx:90`, `app/(admin)/admin/users/users-client.tsx:99`, `app/(owner)/owner/booking-requests/page.tsx:379`, `app/(owner)/owner/booking-requests/page.tsx:410`, `app/(user)/user/dashboard/page.tsx:321`, `components/add-listing/amenities-section.tsx:21`, `components/admin/AdminAnalyticsClient.tsx:221`, `components/admin/AdminListingsClient.tsx:615`, `components/admin/AdminListingsClient.tsx:706`, `components/admin/AdminNavBar.tsx:111`, `components/admin/AdminNavBar.tsx:117`, `components/admin/confirm-dialog.tsx:50`, `components/admin/confirm-dialog.tsx:82`, `components/admin/status-badge.tsx:17`, `components/admin/status-badge.tsx:53`, `components/listing-details/BookingCard.tsx:368`, `components/listing-details/ReviewFormModal.tsx:142`, `components/my-listings/listing-actions.tsx:151`
- **`--status-badge-bg-violet-500-10`**: `bg-violet-500/10` (used 16 times)
  - Locations: `app/(admin)/admin/dashboard/page.tsx:58`, `app/(admin)/admin/dashboard/page.tsx:96`, `app/(admin)/admin/owners/owners-client.tsx:314`, `app/(admin)/admin/owners/owners-client.tsx:376`, `app/(admin)/admin/owners/page.tsx:92`, `app/(admin)/admin/users/users-client.tsx:301`, `app/(user)/user/dashboard/page.tsx:389`, `components/add-listing/room-details.tsx:76`, `components/admin/AdminAnalyticsClient.tsx:374`, `components/admin/AdminNavBar.tsx:50`, `components/admin/status-badge.tsx:13`, `components/admin/status-badge.tsx:133`, `components/my-listings/empty-state.tsx:13`, `components/my-listings/listing-card.tsx:134`, `components/my-listings/summary-cards.tsx:18`, `components/saved-listings/saved-listing-card.tsx:137`
- **`--status-badge-border-emerald-500-20`**: `border-emerald-500/20` (used 14 times)
  - Locations: `app/(admin)/admin/dashboard/page.tsx:68`, `app/(admin)/admin/reports/reports-client.tsx:205`, `components/add-listing/pricing-section.tsx:93`, `components/admin/AdminAnalyticsClient.tsx:220`, `components/admin/AdminAnalyticsClient.tsx:357`, `components/admin/AdminListingDrawer.tsx:224`, `components/admin/AdminListingsClient.tsx:64`, `components/admin/AdminListingsClient.tsx:386`, `components/admin/AdminListingsClient.tsx:479`, `components/admin/AdminNavBar.tsx:35`, `components/admin/status-badge.tsx:43`, `components/admin/status-badge.tsx:81`, `components/admin/status-badge.tsx:103`, `components/my-listings/summary-cards.tsx:28`
- **`--status-badge-bg-orange-500-10`**: `bg-orange-500/10` (used 11 times)
  - Locations: `app/(admin)/admin/dashboard/page.tsx:76`, `app/(admin)/admin/dashboard/page.tsx:112`, `app/(admin)/admin/reports/page.tsx:104`, `app/(user)/user/dashboard/page.tsx:268`, `app/(user)/user/dashboard/page.tsx:323`, `components/add-listing/amenities-section.tsx:17`, `components/admin/AdminNavBar.tsx:58`, `components/admin/confirm-dialog.tsx:51`, `components/admin/confirm-dialog.tsx:83`, `components/admin/status-badge.tsx:48`, `components/admin/status-badge.tsx:99`
- **`--status-badge-border-emerald-500-30`**: `border-emerald-500/30` (used 4 times)
  - Locations: `components/add-listing/image-upload.tsx:324`, `components/add-listing/listing-form.tsx:83`, `components/my-listings/listing-status-badge.tsx:14`, `components/ui/toast.tsx:92`
- **`--status-badge-shadow-emerald-500-10`**: `shadow-emerald-500/10` (used 2 times)
  - Locations: `components/my-listings/listing-status-badge.tsx:14`, `components/my-listings/summary-cards.tsx:29`

### 5. Chart & Data Visualization Colors

Hardcoded fill, stroke, gradient stops, and HSL tokens extracted from `chart.tsx` and `AdminAnalyticsClient.tsx`:

- **`--text-tertiary`**: `text-white/40` (used 104 times)
  - Locations: `app/(admin)/admin/dashboard/page.tsx:131`, `app/(admin)/admin/dashboard/page.tsx:179`, `app/(admin)/admin/dashboard/page.tsx:181`, `app/(admin)/admin/owners/owners-client.tsx:62`, `app/(admin)/admin/owners/owners-client.tsx:114`, `app/(admin)/admin/owners/owners-client.tsx:321`, `app/(admin)/admin/owners/owners-client.tsx:383`, `app/(admin)/admin/reports/reports-client.tsx:72`, `app/(admin)/admin/reports/reports-client.tsx:143`, `app/(admin)/admin/reports/reports-client.tsx:174`, `app/(admin)/admin/reports/reports-client.tsx:234`, `app/(admin)/admin/reports/reports-client.tsx:241`, `app/(admin)/admin/reports/reports-client.tsx:258`, `app/(admin)/admin/reports/reports-client.tsx:521`, `app/(admin)/admin/reports/reports-client.tsx:589`, `app/(admin)/admin/users/users-client.tsx:78`, `app/(admin)/admin/users/users-client.tsx:150`, `app/(admin)/admin/users/users-client.tsx:579`, `app/(admin)/admin/users/users-client.tsx:638`, `app/(public)/owners/[id]/page.tsx:57`, `app/(public)/owners/[id]/page.tsx:64`, `app/(public)/users/[id]/page.tsx:57`, `app/(public)/users/[id]/page.tsx:64`, `app/(user)/user/dashboard/page.tsx:75`, `app/(user)/user/dashboard/page.tsx:77`, `app/(user)/user/dashboard/page.tsx:125`, `app/(user)/user/dashboard/page.tsx:127`, `app/(user)/user/dashboard/page.tsx:173`, `app/(user)/user/dashboard/page.tsx:177`, `app/(user)/user/dashboard/page.tsx:203`, `app/(user)/user/dashboard/page.tsx:211`, `app/(user)/user/dashboard/page.tsx:215`, `app/(user)/user/dashboard/page.tsx:278`, `app/(user)/user/dashboard/page.tsx:352`, `app/(user)/user/dashboard/page.tsx:372`, `components/admin/admin-page-header.tsx:64`, `components/admin/AdminAnalyticsClient.tsx:201`, `components/admin/AdminAnalyticsClient.tsx:662`, `components/admin/AdminAnalyticsClient.tsx:663`, `components/admin/AdminAnalyticsClient.tsx:664`, `components/admin/AdminAnalyticsClient.tsx:665`, `components/admin/AdminAnalyticsClient.tsx:668`, `components/admin/AdminAnalyticsClient.tsx:671`, `components/admin/AdminAnalyticsClient.tsx:674`, `components/admin/AdminAnalyticsClient.tsx:735`, `components/admin/AdminAnalyticsClient.tsx:736`, `components/admin/AdminAnalyticsClient.tsx:737`, `components/admin/AdminAnalyticsClient.tsx:740`, `components/admin/AdminAnalyticsClient.tsx:762`, `components/admin/AdminListingDrawer.tsx:182`, `components/admin/AdminListingDrawer.tsx:186`, `components/admin/AdminListingDrawer.tsx:195`, `components/admin/AdminListingDrawer.tsx:206`, `components/admin/AdminListingDrawer.tsx:212`, `components/admin/AdminListingDrawer.tsx:218`, `components/admin/AdminListingDrawer.tsx:237`, `components/admin/AdminListingDrawer.tsx:259`, `components/admin/AdminListingDrawer.tsx:265`, `components/admin/AdminListingDrawer.tsx:269`, `components/admin/AdminListingDrawer.tsx:278`, `components/admin/AdminListingDrawer.tsx:292`, `components/admin/AdminListingDrawer.tsx:308`, `components/admin/AdminListingsClient.tsx:354`, `components/admin/AdminListingsClient.tsx:367`, `components/admin/AdminListingsClient.tsx:392`, `components/admin/AdminListingsClient.tsx:456`, `components/admin/AdminListingsClient.tsx:572`, `components/admin/AdminListingsClient.tsx:577`, `components/admin/AdminListingsClient.tsx:651`, `components/admin/AdminListingsClient.tsx:666`, `components/admin/AdminListingsClient.tsx:670`, `components/admin/AdminListingsClient.tsx:720`, `components/admin/AdminListingsClient.tsx:773`, `components/admin/AdminListingsClient.tsx:797`, `components/admin/AdminNavBar.tsx:148`, `components/admin/AdminNavBar.tsx:154`, `components/admin/pagination-bar.tsx:28`, `components/admin/pagination-bar.tsx:82`, `components/admin/SettingsDialog.tsx:70`, `components/admin/SettingsDialog.tsx:187`, `components/admin/SettingsDialog.tsx:240`, `components/admin/SettingsDialog.tsx:257`, `components/admin/status-badge.tsx:85`, `components/admin/status-badge.tsx:107`, `components/listing-details/ReviewsSection.tsx:225`, `components/owner-profile/PrivateOwnerProfileView.tsx:31`, `components/owner-profile/PrivateOwnerProfileView.tsx:67`, `components/owner-profile/PrivateOwnerProfileView.tsx:170`, `components/owner-profile/PrivateOwnerProfileView.tsx:264`, `components/owner-profile/PrivateOwnerProfileView.tsx:269`, `components/owner-profile/PrivateOwnerProfileView.tsx:290`, `components/owner-profile/PublicOwnerProfileView.tsx:167`, `components/owner-profile/PublicOwnerProfileView.tsx:172`, `components/owner-profile/PublicOwnerProfileView.tsx:179`, `components/user-profile/PrivateProfileView.tsx:49`, `components/user-profile/PrivateProfileView.tsx:56`, `components/user-profile/PrivateProfileView.tsx:102`, `components/user-profile/PrivateProfileView.tsx:153`, `components/user-profile/PrivateProfileView.tsx:274`, `components/user-profile/PrivateProfileView.tsx:302`, `components/user-profile/PublicProfileView.tsx:39`, `components/user-profile/ReviewsList.tsx:72`, `components/user-profile/ReviewsList.tsx:121`, `components/user-profile/ReviewsList.tsx:138`
- **`--border-subtle`**: `border-white/10` (used 68 times)
  - Locations: `app/(admin)/admin/owners/owners-client.tsx:397`, `app/(admin)/admin/reports/reports-client.tsx:191`, `app/(user)/user/dashboard/page.tsx:181`, `app/(user)/user/dashboard/page.tsx:348`, `components/admin/AdminAnalyticsClient.tsx:225`, `components/admin/AdminAnalyticsClient.tsx:325`, `components/admin/AdminAnalyticsClient.tsx:328`, `components/admin/AdminListingDrawer.tsx:158`, `components/admin/AdminListingDrawer.tsx:243`, `components/admin/AdminListingsClient.tsx:86`, `components/admin/AdminListingsClient.tsx:354`, `components/admin/AdminListingsClient.tsx:360`, `components/admin/AdminListingsClient.tsx:367`, `components/admin/AdminListingsClient.tsx:373`, `components/admin/AdminListingsClient.tsx:408`, `components/admin/AdminListingsClient.tsx:417`, `components/admin/AdminListingsClient.tsx:420`, `components/admin/AdminListingsClient.tsx:431`, `components/admin/AdminListingsClient.tsx:434`, `components/admin/AdminListingsClient.tsx:447`, `components/admin/AdminListingsClient.tsx:479`, `components/admin/AdminListingsClient.tsx:487`, `components/admin/AdminListingsClient.tsx:514`, `components/admin/AdminListingsClient.tsx:727`, `components/admin/AdminListingsClient.tsx:741`, `components/admin/AdminListingsClient.tsx:752`, `components/admin/AdminListingsClient.tsx:778`, `components/admin/AdminListingsClient.tsx:802`, `components/admin/AdminNavBar.tsx:109`, `components/admin/pagination-bar.tsx:38`, `components/admin/pagination-bar.tsx:94`, `components/admin/SettingsDialog.tsx:86`, `components/admin/SettingsDialog.tsx:248`, `components/admin/SettingsDialog.tsx:266`, `components/admin/status-badge.tsx:85`, `components/admin/status-badge.tsx:107`, `components/home/TestimonialCard.tsx:13`, `components/home/TrendingCard.tsx:10`, `components/home/TrendingCard.tsx:35`, `components/listing-details/AmenitiesList.tsx:10`, `components/listing-details/BookingCard.tsx:187`, `components/listing-details/BookingCard.tsx:385`, `components/listing-details/HostCard.tsx:22`, `components/listing-details/HostCard.tsx:28`, `components/listing-details/HostCard.tsx:111`, `components/listing-details/PropertyInfo.tsx:14`, `components/listing-details/SleepingArrangements.tsx:17`, `components/listings/ListingCard.tsx:85`, `components/my-listings/empty-state.tsx:15`, `components/my-listings/empty-state.tsx:19`, `components/my-listings/listing-actions.tsx:161`, `components/my-listings/listing-actions.tsx:178`, `components/my-listings/summary-cards.tsx:66`, `components/owner/EditProfileModal.tsx:102`, `components/owner/EditProfileModal.tsx:155`, `components/owner/EditProfileModal.tsx:171`, `components/owner/EditProfileModal.tsx:188`, `components/owner/EditProfileModal.tsx:209`, `components/owner-profile/PrivateOwnerProfileView.tsx:31`, `components/owner-profile/PrivateOwnerProfileView.tsx:220`, `components/saved-listings/saved-empty-state.tsx:24`, `components/saved-listings/saved-empty-state.tsx:31`, `components/saved-listings/saved-empty-state.tsx:64`, `components/ui/toast.tsx:102`, `components/user-profile/EditProfileModal.tsx:101`, `components/user-profile/EditProfileModal.tsx:146`, `components/user-profile/EditProfileModal.tsx:168`, `components/user-profile/PrivateProfileView.tsx:179`
- **`--bg-surface-subtle`**: `bg-white/5` (used 62 times)
  - Locations: `app/(admin)/admin/dashboard/page.tsx:159`, `app/(admin)/admin/owners/owners-client.tsx:397`, `app/(admin)/admin/reports/reports-client.tsx:184`, `app/(admin)/admin/reports/reports-client.tsx:191`, `app/(admin)/admin/users/users-client.tsx:158`, `app/(admin)/admin/users/users-client.tsx:227`, `app/(admin)/admin/users/users-client.tsx:294`, `app/(public)/developers/page.tsx:111`, `app/(user)/user/dashboard/page.tsx:86`, `app/(user)/user/dashboard/page.tsx:181`, `app/(user)/user/dashboard/page.tsx:195`, `app/(user)/user/dashboard/page.tsx:348`, `app/(user)/user/dashboard/page.tsx:369`, `components/admin/AdminAnalyticsClient.tsx:225`, `components/admin/AdminListingDrawer.tsx:129`, `components/admin/AdminListingDrawer.tsx:130`, `components/admin/AdminListingDrawer.tsx:131`, `components/admin/AdminListingDrawer.tsx:132`, `components/admin/AdminListingDrawer.tsx:158`, `components/admin/AdminListingDrawer.tsx:167`, `components/admin/AdminListingDrawer.tsx:170`, `components/admin/AdminListingDrawer.tsx:173`, `components/admin/AdminListingsClient.tsx:86`, `components/admin/AdminListingsClient.tsx:354`, `components/admin/AdminListingsClient.tsx:357`, `components/admin/AdminListingsClient.tsx:367`, `components/admin/AdminListingsClient.tsx:370`, `components/admin/AdminListingsClient.tsx:456`, `components/admin/AdminListingsClient.tsx:507`, `components/admin/AdminListingsClient.tsx:508`, `components/admin/AdminListingsClient.tsx:509`, `components/admin/AdminListingsClient.tsx:562`, `components/admin/AdminListingsClient.tsx:608`, `components/admin/AdminListingsClient.tsx:642`, `components/admin/AdminNavBar.tsx:88`, `components/admin/AdminNavBar.tsx:131`, `components/admin/AdminNavBar.tsx:154`, `components/admin/confirm-dialog.tsx:72`, `components/admin/SettingsDialog.tsx:276`, `components/admin/status-badge.tsx:85`, `components/admin/status-badge.tsx:107`, `components/listing-details/HostCard.tsx:104`, `components/listing-details/MapSection.tsx:21`, `components/listing-details/ReviewsSection.tsx:225`, `components/my-listings/listing-actions.tsx:68`, `components/my-listings/listing-actions.tsx:84`, `components/my-listings/listing-actions.tsx:100`, `components/owner-profile/PrivateOwnerProfileView.tsx:31`, `components/owner-profile/PrivateOwnerProfileView.tsx:61`, `components/owner-profile/PrivateOwnerProfileView.tsx:70`, `components/owner-profile/PrivateOwnerProfileView.tsx:220`, `components/owner-profile/PrivateOwnerProfileView.tsx:250`, `components/owner-profile/PrivateOwnerProfileView.tsx:275`, `components/owner-profile/PublicOwnerProfileView.tsx:156`, `components/user-profile/PrivateProfileView.tsx:37`, `components/user-profile/PrivateProfileView.tsx:59`, `components/user-profile/PrivateProfileView.tsx:94`, `components/user-profile/PrivateProfileView.tsx:105`, `components/user-profile/PrivateProfileView.tsx:179`, `components/user-profile/PrivateProfileView.tsx:207`, `components/user-profile/PrivateProfileView.tsx:227`, `components/user-profile/ReviewsList.tsx:138`
- **`--text-quaternary`**: `text-white/30` (used 58 times)
  - Locations: `app/(admin)/admin/dashboard/page.tsx:150`, `app/(admin)/admin/owners/owners-client.tsx:132`, `app/(admin)/admin/owners/owners-client.tsx:248`, `app/(admin)/admin/owners/owners-client.tsx:253`, `app/(admin)/admin/owners/owners-client.tsx:298`, `app/(admin)/admin/owners/owners-client.tsx:319`, `app/(admin)/admin/owners/owners-client.tsx:341`, `app/(admin)/admin/owners/owners-client.tsx:381`, `app/(admin)/admin/owners/owners-client.tsx:400`, `app/(admin)/admin/reports/reports-client.tsx:426`, `app/(admin)/admin/reports/reports-client.tsx:431`, `app/(admin)/admin/reports/reports-client.tsx:492`, `app/(admin)/admin/reports/reports-client.tsx:533`, `app/(admin)/admin/reports/reports-client.tsx:540`, `app/(admin)/admin/reports/reports-client.tsx:603`, `app/(admin)/admin/reports/reports-client.tsx:611`, `app/(admin)/admin/users/users-client.tsx:128`, `app/(admin)/admin/users/users-client.tsx:329`, `app/(admin)/admin/users/users-client.tsx:490`, `app/(admin)/admin/users/users-client.tsx:495`, `app/(admin)/admin/users/users-client.tsx:556`, `app/(admin)/admin/users/users-client.tsx:577`, `app/(admin)/admin/users/users-client.tsx:636`, `app/(admin)/admin/users/users-client.tsx:655`, `app/(auth)/auth/verify/page.tsx:144`, `app/(auth)/auth/verify-email-sent/page.tsx:46`, `app/(auth)/auth/verify-email-sent/page.tsx:62`, `app/(user)/user/dashboard/page.tsx:207`, `app/(user)/user/dashboard/page.tsx:349`, `components/admin/admin-page-header.tsx:35`, `components/admin/AdminAnalyticsClient.tsx:208`, `components/admin/AdminAnalyticsClient.tsx:655`, `components/admin/AdminAnalyticsClient.tsx:685`, `components/admin/AdminAnalyticsClient.tsx:730`, `components/admin/AdminListingDrawer.tsx:159`, `components/admin/AdminListingsClient.tsx:357`, `components/admin/AdminListingsClient.tsx:370`, `components/admin/AdminListingsClient.tsx:404`, `components/admin/AdminListingsClient.tsx:517`, `components/admin/pagination-bar.tsx:69`, `components/listing-details/PropertyInfo.tsx:20`, `components/listing-details/PropertyInfo.tsx:22`, `components/listing-details/PropertyInfo.tsx:24`, `components/owner-profile/PrivateOwnerProfileView.tsx:184`, `components/owner-profile/PrivateOwnerProfileView.tsx:196`, `components/owner-profile/PrivateOwnerProfileView.tsx:232`, `components/owner-profile/PrivateOwnerProfileView.tsx:301`, `components/owner-profile/PublicOwnerProfileView.tsx:124`, `components/owner-profile/PublicOwnerProfileView.tsx:134`, `components/owner-profile/PublicOwnerProfileView.tsx:145`, `components/user-profile/PrivateProfileView.tsx:189`, `components/user-profile/PrivateProfileView.tsx:207`, `components/user-profile/PrivateProfileView.tsx:227`, `components/user-profile/PrivateProfileView.tsx:239`, `components/user-profile/PrivateProfileView.tsx:248`, `components/user-profile/PrivateProfileView.tsx:285`, `components/user-profile/PrivateProfileView.tsx:310`, `components/user-profile/PublicProfileView.tsx:84`
- **`--bg-card-base`**: `#111` (used 55 times)
  - Locations: `app/(admin)/admin/dashboard/page.tsx:141`, `app/(admin)/admin/dashboard/page.tsx:157`, `app/(admin)/admin/owners/owners-client.tsx:111`, `app/(admin)/admin/owners/owners-client.tsx:245`, `app/(admin)/admin/owners/owners-client.tsx:271`, `app/(admin)/admin/reports/reports-client.tsx:126`, `app/(admin)/admin/reports/reports-client.tsx:238`, `app/(admin)/admin/reports/reports-client.tsx:423`, `app/(admin)/admin/reports/reports-client.tsx:465`, `app/(admin)/admin/users/users-client.tsx:140`, `app/(admin)/admin/users/users-client.tsx:199`, `app/(admin)/admin/users/users-client.tsx:271`, `app/(admin)/admin/users/users-client.tsx:486`, `app/(admin)/admin/users/users-client.tsx:528`, `app/(owner)/owner/booking-requests/page.tsx:218`, `app/(owner)/owner/booking-requests/page.tsx:236`, `app/(owner)/owner/booking-requests/page.tsx:266`, `app/(owner)/owner/my-listings/page.tsx:239`, `app/(user)/user/dashboard/page.tsx:69`, `app/(user)/user/dashboard/page.tsx:96`, `app/(user)/user/dashboard/page.tsx:345`, `components/admin/AdminAnalyticsClient.tsx:190`, `components/admin/AdminAnalyticsClient.tsx:240`, `components/admin/AdminAnalyticsClient.tsx:254`, `components/admin/AdminAnalyticsClient.tsx:264`, `components/admin/AdminAnalyticsClient.tsx:328`, `components/admin/AdminAnalyticsClient.tsx:398`, `components/admin/AdminAnalyticsClient.tsx:478`, `components/admin/AdminAnalyticsClient.tsx:545`, `components/admin/AdminAnalyticsClient.tsx:586`, `components/admin/AdminAnalyticsClient.tsx:649`, `components/admin/AdminAnalyticsClient.tsx:724`, `components/admin/AdminListingsClient.tsx:391`, `components/admin/AdminListingsClient.tsx:402`, `components/admin/AdminListingsClient.tsx:420`, `components/admin/AdminListingsClient.tsx:434`, `components/admin/AdminListingsClient.tsx:514`, `components/admin/AdminListingsClient.tsx:522`, `components/admin/AdminListingsClient.tsx:634`, `components/admin/confirm-dialog.tsx:44`, `components/admin/SettingsDialog.tsx:178`, `components/admin/table-skeleton.tsx:12`, `components/listing-details/BookingCard.tsx:187`, `components/listing-details/HostCard.tsx:28`, `components/listing-details/HostCard.tsx:37`, `components/listing-details/SleepingArrangements.tsx:17`, `components/my-listings/empty-state.tsx:9`, `components/my-listings/listing-actions.tsx:161`, `components/my-listings/listing-card.tsx:78`, `components/my-listings/listing-skeleton.tsx:7`, `components/my-listings/summary-cards.tsx:63`, `components/owner-profile/PublicOwnerProfileView.tsx:55`, `components/saved-listings/saved-empty-state.tsx:18`, `components/saved-listings/saved-listing-card.tsx:81`, `components/saved-listings/saved-skeleton.tsx:7`
- **`--text-subheading`**: `text-white/70` (used 32 times)
  - Locations: `app/(admin)/admin/dashboard/page.tsx:149`, `app/(admin)/admin/owners/owners-client.tsx:81`, `app/(admin)/admin/reports/reports-client.tsx:91`, `app/(admin)/admin/reports/reports-client.tsx:530`, `app/(admin)/admin/reports/reports-client.tsx:537`, `app/(admin)/admin/users/users-client.tsx:100`, `app/(admin)/admin/users/users-client.tsx:572`, `app/(admin)/admin/users/users-client.tsx:631`, `app/(auth)/auth/verify-email-sent/page.tsx:41`, `components/add-listing/image-upload.tsx:398`, `components/admin/AdminAnalyticsClient.tsx:693`, `components/admin/AdminAnalyticsClient.tsx:756`, `components/admin/AdminListingDrawer.tsx:196`, `components/admin/AdminListingDrawer.tsx:281`, `components/admin/AdminListingsClient.tsx:474`, `components/admin/AdminListingsClient.tsx:727`, `components/admin/AdminListingsClient.tsx:741`, `components/admin/AdminListingsClient.tsx:752`, `components/admin/SettingsDialog.tsx:237`, `components/admin/SettingsDialog.tsx:254`, `components/listing-details/HostCard.tsx:15`, `components/listing-details/HostCard.tsx:73`, `components/listing-details/HostCard.tsx:90`, `components/listing-details/HostCard.tsx:96`, `components/listing-details/PropertyInfo.tsx:19`, `components/login-form.tsx:110`, `components/my-listings/listing-card.tsx:106`, `components/owner-profile/PrivateOwnerProfileView.tsx:18`, `components/owner-profile/PrivateOwnerProfileView.tsx:153`, `components/owner-profile/PublicOwnerProfileView.tsx:27`, `components/owner-profile/PublicOwnerProfileView.tsx:94`, `components/saved-listings/saved-listing-card.tsx:109`
- **`--text-muted`**: `text-white/50` (used 27 times)
  - Locations: `app/(admin)/admin/owners/owners-client.tsx:129`, `app/(admin)/admin/owners/owners-client.tsx:346`, `app/(admin)/admin/owners/owners-client.tsx:397`, `app/(admin)/admin/reports/reports-client.tsx:146`, `app/(admin)/admin/reports/reports-client.tsx:552`, `app/(admin)/admin/users/users-client.tsx:205`, `app/(admin)/admin/users/users-client.tsx:214`, `app/(admin)/admin/users/users-client.tsx:276`, `app/(admin)/admin/users/users-client.tsx:326`, `app/(admin)/admin/users/users-client.tsx:599`, `app/(auth)/auth/verify/page.tsx:121`, `app/(auth)/auth/verify-email-sent/page.tsx:38`, `components/admin/admin-page-header.tsx:47`, `components/admin/AdminAnalyticsClient.tsx:225`, `components/admin/AdminAnalyticsClient.tsx:710`, `components/admin/AdminListingDrawer.tsx:198`, `components/admin/AdminListingDrawer.tsx:293`, `components/admin/AdminNavBar.tsx:88`, `components/admin/AdminNavBar.tsx:131`, `components/admin/confirm-dialog.tsx:64`, `components/listing-details/HostCard.tsx:74`, `components/listing-details/HostCard.tsx:112`, `components/listing-details/HostCard.tsx:115`, `components/owner-profile/PrivateOwnerProfileView.tsx:154`, `components/owner-profile/PrivateOwnerProfileView.tsx:275`, `components/owner-profile/PublicOwnerProfileView.tsx:95`, `components/user-profile/PrivateProfileView.tsx:59`
- **`--text-disabled`**: `text-white/20` (used 23 times)
  - Locations: `app/(admin)/admin/dashboard/page.tsx:181`, `app/(admin)/admin/owners/owners-client.tsx:127`, `app/(admin)/admin/reports/reports-client.tsx:543`, `app/(admin)/admin/users/users-client.tsx:209`, `app/(admin)/admin/users/users-client.tsx:218`, `app/(admin)/admin/users/users-client.tsx:324`, `app/(user)/user/dashboard/page.tsx:127`, `app/(user)/user/dashboard/page.tsx:197`, `app/(user)/user/dashboard/page.tsx:333`, `app/(user)/user/dashboard/page.tsx:370`, `app/(user)/user/dashboard/page.tsx:373`, `components/admin/AdminAnalyticsClient.tsx:471`, `components/admin/AdminAnalyticsClient.tsx:528`, `components/admin/AdminAnalyticsClient.tsx:579`, `components/admin/AdminAnalyticsClient.tsx:637`, `components/admin/AdminListingsClient.tsx:515`, `components/admin/SettingsDialog.tsx:248`, `components/admin/SettingsDialog.tsx:266`, `components/owner-profile/PrivateOwnerProfileView.tsx:70`, `components/owner-profile/PrivateOwnerProfileView.tsx:75`, `components/user-profile/PrivateProfileView.tsx:105`, `components/user-profile/PrivateProfileView.tsx:110`, `components/user-profile/ReviewsList.tsx:69`
- **`--bg-app-base`**: `#0a0a0a` (used 22 times)
  - Locations: `app/(admin)/admin/dashboard/page.tsx:125`, `app/(admin)/admin/owners/page.tsx:87`, `app/(admin)/admin/reports/page.tsx:99`, `app/(admin)/admin/users/page.tsx:88`, `app/(owner)/owner/booking-requests/page.tsx:162`, `app/(owner)/owner/my-listings/page.tsx:215`, `app/(public)/listings/[id]/page.tsx:43`, `app/(public)/listings/[id]/page.tsx:50`, `app/(public)/owners/[id]/page.tsx:42`, `app/(public)/owners/[id]/page.tsx:44`, `app/(public)/users/[id]/page.tsx:42`, `app/(public)/users/[id]/page.tsx:44`, `app/(user)/user/dashboard/page.tsx:151`, `app/(user)/user/saved/page.tsx:23`, `app/global-error.tsx:20`, `components/admin/AdminAnalyticsClient.tsx:311`, `components/admin/AdminListingsClient.tsx:336`, `components/home/FAQPanels.tsx:43`, `components/listing-details/ListingNavBar.tsx:50`, `components/listing-details/ReviewFormModal.tsx:130`, `components/owner-profile/PrivateOwnerProfileView.tsx:114`, `components/user-profile/PrivateProfileView.tsx:135`
- **`--chart-border-red-500-20`**: `border-red-500/20` (used 14 times)
  - Locations: `app/(owner)/owner/booking-requests/page.tsx:244`, `app/(owner)/owner/booking-requests/page.tsx:379`, `app/(owner)/owner/booking-requests/page.tsx:410`, `app/(owner)/owner/my-listings/page.tsx:254`, `components/admin/AdminAnalyticsClient.tsx:221`, `components/admin/AdminAnalyticsClient.tsx:340`, `components/admin/AdminListingDrawer.tsx:137`, `components/admin/AdminListingDrawer.tsx:228`, `components/admin/AdminListingsClient.tsx:512`, `components/admin/confirm-dialog.tsx:82`, `components/admin/status-badge.tsx:17`, `components/admin/status-badge.tsx:53`, `components/listing-details/BookingCard.tsx:368`, `components/listing-details/ReviewFormModal.tsx:142`
- **`--chart-border-blue-500-20`**: `border-blue-500/20` (used 12 times)
  - Locations: `app/(admin)/admin/dashboard/page.tsx:50`, `app/(admin)/admin/users/users-client.tsx:234`, `components/admin/AdminAnalyticsClient.tsx:366`, `components/admin/AdminListingsClient.tsx:385`, `components/admin/AdminNavBar.tsx:43`, `components/admin/status-badge.tsx:9`, `components/admin/status-badge.tsx:129`, `components/listings/listingConfig.ts:23`, `components/listings/listingConfig.ts:24`, `components/listings/listingConfig.ts:25`, `components/listings/listingConfig.ts:26`, `components/owner-profile/PrivateOwnerProfileView.tsx:27`
- **`--chart-bg-amber-500-10`**: `bg-amber-500/10` (used 10 times)
  - Locations: `app/(owner)/owner/booking-requests/page.tsx:402`, `components/add-listing/amenities-section.tsx:19`, `components/add-listing/amenities-section.tsx:32`, `components/add-listing/listing-status.tsx:19`, `components/admin/AdminAnalyticsClient.tsx:219`, `components/admin/AdminListingsClient.tsx:69`, `components/admin/AdminListingsClient.tsx:387`, `components/listing-details/BookingCard.tsx:349`, `components/my-listings/summary-cards.tsx:36`, `components/owner-profile/PrivateOwnerProfileView.tsx:29`
- **`--overlay-backdrop-dark`**: `bg-black/40` (used 10 times)
  - Locations: `components/add-listing/image-upload.tsx:349`, `components/admin/AdminAnalyticsClient.tsx:325`, `components/admin/AdminListingsClient.tsx:408`, `components/admin/AdminListingsClient.tsx:417`, `components/admin/AdminListingsClient.tsx:431`, `components/admin/AdminListingsClient.tsx:447`, `components/admin/AdminListingsClient.tsx:529`, `components/admin/AdminListingsClient.tsx:556`, `components/admin/AdminListingsClient.tsx:657`, `components/listings/ListingCard.tsx:98`
- **`--text-heading-light`**: `text-white/90` (used 10 times)
  - Locations: `components/admin/AdminAnalyticsClient.tsx:696`, `components/admin/AdminListingsClient.tsx:579`, `components/home/FAQPanels.tsx:61`, `components/home/FAQPanels.tsx:78`, `components/home/FAQPanels.tsx:95`, `components/home/FAQPanels.tsx:112`, `components/listing-details/HostCard.tsx:51`, `components/owner-profile/PrivateOwnerProfileView.tsx:127`, `components/owner-profile/PublicOwnerProfileView.tsx:68`, `components/saved-listings/saved-listing-card.tsx:117`
- **`--chart-border-violet-500-20`**: `border-violet-500/20` (used 7 times)
  - Locations: `app/(admin)/admin/dashboard/page.tsx:59`, `app/(admin)/admin/users/users-client.tsx:301`, `components/admin/AdminAnalyticsClient.tsx:375`, `components/admin/AdminNavBar.tsx:51`, `components/admin/status-badge.tsx:13`, `components/admin/status-badge.tsx:133`, `components/my-listings/summary-cards.tsx:19`
- **`--chart-border-amber-500-20`**: `border-amber-500/20` (used 7 times)
  - Locations: `app/(owner)/owner/booking-requests/page.tsx:402`, `components/admin/AdminAnalyticsClient.tsx:219`, `components/admin/AdminListingsClient.tsx:69`, `components/admin/AdminListingsClient.tsx:387`, `components/listing-details/BookingCard.tsx:349`, `components/my-listings/summary-cards.tsx:37`, `components/owner-profile/PrivateOwnerProfileView.tsx:29`
- **`--chart-hsl-152-60-52`**: `hsl(152, 60%, 52%)` (used 7 times)
  - Locations: `components/admin/AdminAnalyticsClient.tsx:114`, `components/admin/AdminAnalyticsClient.tsx:123`, `components/admin/AdminAnalyticsClient.tsx:133`, `components/admin/AdminAnalyticsClient.tsx:139`, `components/admin/AdminAnalyticsClient.tsx:424`, `components/admin/AdminAnalyticsClient.tsx:429`, `components/admin/AdminAnalyticsClient.tsx:464`
- **`--chart-bg-red-500-5`**: `bg-red-500/5` (used 6 times)
  - Locations: `app/(owner)/owner/booking-requests/page.tsx:244`, `app/(owner)/owner/my-listings/page.tsx:254`, `components/admin/AdminAnalyticsClient.tsx:340`, `components/admin/AdminListingDrawer.tsx:137`, `components/admin/AdminListingDrawer.tsx:228`, `components/admin/AdminListingsClient.tsx:512`
- **`--chart-rgba-255-255-255-0-15`**: `rgba(255,255,255,0.15)` (used 6 times)
  - Locations: `components/admin/AdminAnalyticsClient.tsx:441`, `components/admin/AdminAnalyticsClient.tsx:446`, `components/admin/AdminAnalyticsClient.tsx:501`, `components/admin/AdminAnalyticsClient.tsx:505`, `components/admin/AdminAnalyticsClient.tsx:608`, `components/admin/AdminAnalyticsClient.tsx:614`
- **`--chart-bg-cyan-500-10`**: `bg-cyan-500/10` (used 5 times)
  - Locations: `app/(admin)/admin/dashboard/page.tsx:120`, `components/add-listing/amenities-section.tsx:14`, `components/admin/AdminAnalyticsClient.tsx:315`, `components/admin/AdminAnalyticsClient.tsx:383`, `components/admin/AdminNavBar.tsx:66`
- **`--chart-rgba-255-255-255-0-35`**: `rgba(255,255,255,0.35)` (used 5 times)
  - Locations: `components/admin/AdminAnalyticsClient.tsx:442`, `components/admin/AdminAnalyticsClient.tsx:447`, `components/admin/AdminAnalyticsClient.tsx:502`, `components/admin/AdminAnalyticsClient.tsx:506`, `components/admin/AdminAnalyticsClient.tsx:609`
- **`--chart-hsl-217-91-65`**: `hsl(217, 91%, 65%)` (used 3 times)
  - Locations: `components/admin/AdminAnalyticsClient.tsx:118`, `components/admin/AdminAnalyticsClient.tsx:520`, `components/admin/AdminAnalyticsClient.tsx:522`
- **`--chart-hsl-38-92-60`**: `hsl(38, 92%, 60%)` (used 3 times)
  - Locations: `components/admin/AdminAnalyticsClient.tsx:122`, `components/admin/AdminAnalyticsClient.tsx:132`, `components/admin/AdminAnalyticsClient.tsx:138`
- **`--chart-hsl-0-72-60`**: `hsl(0, 72%, 60%)` (used 3 times)
  - Locations: `components/admin/AdminAnalyticsClient.tsx:124`, `components/admin/AdminAnalyticsClient.tsx:134`, `components/admin/AdminAnalyticsClient.tsx:140`
- **`--chart-rgba-255-255-255-0-05`**: `rgba(255,255,255,0.05)` (used 3 times)
  - Locations: `components/admin/AdminAnalyticsClient.tsx:436`, `components/admin/AdminAnalyticsClient.tsx:496`, `components/admin/AdminAnalyticsClient.tsx:602`
- **`--chart-rgba-255-255-255-0-5`**: `rgba(255,255,255,0.5)` (used 2 times)
  - Locations: `app/global-error.tsx:29`, `components/admin/AdminAnalyticsClient.tsx:615`
- **`--chart-fff`**: `#fff` (used 2 times)
  - Locations: `app/global-error.tsx:36`, `components/ui/chart.tsx:68`
- **`--chart-hsl-262-83-65`**: `hsl(262, 83%, 65%)` (used 2 times)
  - Locations: `components/admin/AdminAnalyticsClient.tsx:128`, `components/admin/AdminAnalyticsClient.tsx:630`
- **`--chart-border-cyan-500-20`**: `border-cyan-500/20` (used 2 times)
  - Locations: `components/admin/AdminAnalyticsClient.tsx:384`, `components/admin/AdminNavBar.tsx:67`

### 6. Interactive & State Colors

Hover states, shadow drops, and active indicators:


---

## One-off Colors (not tokenized)

The following 100 values appear exactly **once** in the scanned codebase. They represent candidates for either standardization into existing design tokens or intentional single-use exceptions:

- `bg-orange-500/5` — Used in `app/(admin)/admin/reports/reports-client.tsx:254` (Context: `<div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/5 border border`)
- `border-orange-500/10` — Used in `app/(admin)/admin/reports/reports-client.tsx:254` (Context: `<div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/5 border border`)
- `text-orange-400/30` — Used in `app/(admin)/admin/reports/reports-client.tsx:255` (Context: `<AlertTriangle className="h-8 w-8 text-orange-400/30" />`)
- `rgba(34,197,94,0.12)` — Used in `app/(auth)/auth/verify/page.tsx:99` (Context: `? "rgba(34,197,94,0.12)"`)
- `rgba(234,179,8,0.12)` — Used in `app/(auth)/auth/verify/page.tsx:101` (Context: `? "rgba(234,179,8,0.12)"`)
- `rgba(59,130,246,0.12)` — Used in `app/(auth)/auth/verify/page.tsx:103` (Context: `? "rgba(59,130,246,0.12)"`)
- `rgba(239,68,68,0.12)` — Used in `app/(auth)/auth/verify/page.tsx:104` (Context: `: "rgba(239,68,68,0.12)",`)
- `border-white/50` — Used in `app/(auth)/auth/verify/page.tsx:108` (Context: `<div className="h-6 w-6 animate-spin rounded-full border-2 border-white/50 border-t-white" />`)
- `rgba(96,165,250,0.12)` — Used in `app/(auth)/auth/verify-email-sent/page.tsx:22` (Context: `style={{ background: "rgba(96,165,250,0.12)" }}>`)
- `border-white/6` — Used in `app/(auth)/auth/verify-email-sent/page.tsx:45` (Context: `<div className="mb-6 rounded-xl border border-white/6 bg-white/4 px-4 py-3 text-left">`)
- `bg-white/4` — Used in `app/(auth)/auth/verify-email-sent/page.tsx:45` (Context: `<div className="mb-6 rounded-xl border border-white/6 bg-white/4 px-4 py-3 text-left">`)
- `bg-green-500/5` — Used in `app/(owner)/owner/dashboard/DashboardClient.tsx:245` (Context: `item.done ? "bg-green-500/5 border-green-500/20" : "bg-muted/30"`)
- `#34a853` — Used in `app/(public)/developers/page.tsx:48` (Context: `color: "border-[#34A853]",`)
- `from-violet-950/40` — Used in `app/(user)/user/dashboard/page.tsx:345` (Context: `<div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br fr`)
- `from-violet-500/5` — Used in `app/(user)/user/dashboard/page.tsx:346` (Context: `<div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-indigo-500/5" />`)
- `#000` — Used in `app/global-error.tsx:37` (Context: `color: "#000",`)
- `#e2e1ee` — Used in `app/globals.css:134` (Context: `--color-on-surface: #e2e1ee;`)
- `#c3c6d7` — Used in `app/globals.css:135` (Context: `--color-on-surface-variant: #c3c6d7;`)
- `#8d90a0` — Used in `app/globals.css:137` (Context: `--color-outline: #8d90a0;`)
- `#0c0e16` — Used in `app/globals.css:139` (Context: `--color-surface-container-lowest: #0c0e16;`)
- `#2463eb` — Used in `app/globals.css:140` (Context: `--color-primary-container: #2463eb;`)
- `#eeefff` — Used in `app/globals.css:141` (Context: `--color-on-primary-container: #eeefff;`)
- `rgba(17, 17, 17, 0.7)` — Used in `app/globals.css:154` (Context: `background: rgba(17, 17, 17, 0.7);`)
- `rgba(255, 255, 255, 0.1)` — Used in `app/globals.css:156` (Context: `border: 1px solid rgba(255, 255, 255, 0.1);`)
- `border-green-400/50` — Used in `components/add-listing/contact-section.tsx:55` (Context: `className="h-10 pl-11 bg-background/50 border-border/60 focus-visible:border-green-400/50 focus-visi`)
- `ring-green-400/20` — Used in `components/add-listing/contact-section.tsx:55` (Context: `className="h-10 pl-11 bg-background/50 border-border/60 focus-visible:border-green-400/50 focus-visi`)
- `border-pink-400/60` — Used in `components/add-listing/image-upload.tsx:270` (Context: `? "border-pink-400/60 bg-pink-500/8 scale-[1.01]"`)
- `bg-pink-500/8` — Used in `components/add-listing/image-upload.tsx:270` (Context: `? "border-pink-400/60 bg-pink-500/8 scale-[1.01]"`)
- `bg-pink-500/20` — Used in `components/add-listing/image-upload.tsx:286` (Context: `isDragging ? "bg-pink-500/20 scale-110" : "bg-muted/60 group-hover:bg-muted"`)
- `bg-black/70` — Used in `components/add-listing/image-upload.tsx:330` (Context: `<span className="absolute left-1.5 top-1.5 z-10 rounded-full bg-black/70 px-2 py-0.5 text-[10px] fon`)
- `bg-black/0` — Used in `components/add-listing/image-upload.tsx:386` (Context: `<div className="absolute inset-0 flex items-start justify-end bg-black/0 p-1.5 transition-all durati`)
- `bg-black/80` — Used in `components/add-listing/image-upload.tsx:391` (Context: `className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 ba`)
- `bg-blue-500/3` — Used in `components/add-listing/listing-form.tsx:280` (Context: `<div className="absolute top-1/2 -left-60 h-[500px] w-[500px] rounded-full bg-blue-500/3 blur-[100px`)
- `border-amber-400/30` — Used in `components/add-listing/listing-status.tsx:20` (Context: `border: "border-amber-400/30",`)
- `border-emerald-400/30` — Used in `components/add-listing/listing-status.tsx:30` (Context: `border: "border-emerald-400/30",`)
- `bg-emerald-500/8` — Used in `components/add-listing/listing-status.tsx:31` (Context: `activeBg: "bg-emerald-500/8",`)
- `bg-amber-400/10` — Used in `components/admin/AdminListingDrawer.tsx:208` (Context: `<div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 border border-amber-400/20 px`)
- `border-amber-400/20` — Used in `components/admin/AdminListingDrawer.tsx:208` (Context: `<div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 border border-amber-400/20 px`)
- `border-yellow-500/20` — Used in `components/admin/AdminListingDrawer.tsx:220` (Context: `<div className="p-2.5 rounded-lg border border-yellow-500/20 bg-yellow-500/5 text-center">`)
- `bg-yellow-500/5` — Used in `components/admin/AdminListingDrawer.tsx:220` (Context: `<div className="p-2.5 rounded-lg border border-yellow-500/20 bg-yellow-500/5 text-center">`)
- `text-yellow-400/60` — Used in `components/admin/AdminListingDrawer.tsx:221` (Context: `<p className="text-xs text-yellow-400/60">Pending</p>`)
- `text-emerald-400/60` — Used in `components/admin/AdminListingDrawer.tsx:225` (Context: `<p className="text-xs text-emerald-400/60">Accepted</p>`)
- `text-red-400/60` — Used in `components/admin/AdminListingDrawer.tsx:229` (Context: `<p className="text-xs text-red-400/60">Rejected</p>`)
- `shadow-rose-500/5` — Used in `components/admin/AdminListingsClient.tsx:79` (Context: `className: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/5",`)
- `bg-white/40` — Used in `components/admin/AdminListingsClient.tsx:87` (Context: `dot: "bg-white/40",`)
- `border-red-500/35` — Used in `components/admin/AdminListingsClient.tsx:495` (Context: `className="text-xs h-8 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/35"`)
- `border-white/15` — Used in `components/admin/AdminNavBar.tsx:154` (Context: `className="text-white/40 hover:text-white transition-colors py-1.5 px-2.5 rounded-lg border border-w`)
- `bg-orange-500/20` — Used in `components/admin/confirm-dialog.tsx:83` (Context: `: "bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20"`)
- `bg-slate-600/60` — Used in `components/admin/SettingsDialog.tsx:86` (Context: `<span className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.06] transition-col`)
- `bg-slate-500/20` — Used in `components/admin/SettingsDialog.tsx:284` (Context: `className="bg-slate-500/10 text-slate-300 border-slate-500/20 hover:bg-slate-500/20 hover:text-white`)
- `#e36d4a` — Used in `components/home/BackgroundShapes.tsx:28` (Context: `<div className="floating-shape absolute bottom-[-40px] left-[5%] w-32 h-40 bg-[#e36d4a] rounded-t-fu`)
- `#8b8b6e` — Used in `components/home/BackgroundShapes.tsx:29` (Context: `<div className="floating-shape absolute top-10 left-[40%] w-24 h-24 bg-[#8b8b6e] rounded-full opacit`)
- `#689bb3` — Used in `components/home/BackgroundShapes.tsx:34` (Context: `<div className="floating-shape absolute bottom-10 left-[55%] w-16 h-16 bg-[#689bb3] rotate-45 opacit`)
- `#d9af59` — Used in `components/home/BackgroundShapes.tsx:35` (Context: `<div className="floating-shape absolute bottom-[5%] right-[5%] w-24 h-24 bg-[#d9af59] flex items-cen`)
- `rgba(0,0,0,0.15)` — Used in `components/home/EditorialCollage.tsx:59` (Context: `className={'absolute scattered-image rounded-xl object-cover z-1 shadow-[0_40px_100px_-20px_rgba(0,0`)
- `#609ab1` — Used in `components/home/FAQPanels.tsx:55` (Context: `className="group relative flex-none w-[340px] h-[340px] md:w-[460px] md:h-[460px] bg-[#609ab1] flex `)
- `#d6a94d` — Used in `components/home/FAQPanels.tsx:72` (Context: `className="group relative flex-none w-[340px] h-[340px] md:w-[520px] md:h-[520px] bg-[#d6a94d] round`)
- `#a35e5a` — Used in `components/home/FAQPanels.tsx:89` (Context: `className="group relative flex-none w-[300px] h-[340px] md:w-[450px] md:h-[460px] bg-[#a35e5a] flex `)
- `#3fa887` — Used in `components/home/FAQPanels.tsx:106` (Context: `className="group relative flex-none w-[340px] h-[340px] md:w-[400px] md:h-[460px] bg-[#3fa887] flex `)
- `rgba(19,19,19,0.4)` — Used in `components/home/Hero.tsx:23` (Context: `<div className="absolute inset-0 bg-gradient-to-b from-[rgba(19,19,19,0.4)] via-[rgba(19,19,19,0.2)]`)
- `rgba(19,19,19,0.2)` — Used in `components/home/Hero.tsx:23` (Context: `<div className="absolute inset-0 bg-gradient-to-b from-[rgba(19,19,19,0.4)] via-[rgba(19,19,19,0.2)]`)
- `rgba(19,19,19,0.9)` — Used in `components/home/Hero.tsx:23` (Context: `<div className="absolute inset-0 bg-gradient-to-b from-[rgba(19,19,19,0.4)] via-[rgba(19,19,19,0.2)]`)
- `#1a1a2e` — Used in `components/home/TestimonialCard.tsx:13` (Context: `<div className="flex-shrink-0 w-[320px] p-6 rounded-lg bg-[#1a1a2e] border border-white/10 transitio`)
- `#ffd700` — Used in `components/home/TestimonialCard.tsx:14` (Context: `<div className="flex gap-1 mb-4 text-[#FFD700]">`)
- `rgba(25,25,25,0.6)` — Used in `components/home/TrendingCard.tsx:10` (Context: `<div className="bg-[rgba(25,25,25,0.6)] backdrop-blur-[40px] border border-white/10 p-6 rounded-xl t`)
- `rgba(52, 110, 246, 0.4)` — Used in `components/home/Voices.tsx:64` (Context: `style={{ background: "radial-gradient(circle at bottom center, rgba(52, 110, 246, 0.4) 0%, rgba(17, `)
- `rgba(17, 19, 27, 0)` — Used in `components/home/Voices.tsx:64` (Context: `style={{ background: "radial-gradient(circle at bottom center, rgba(52, 110, 246, 0.4) 0%, rgba(17, `)
- `#25d366` — Used in `components/listing-details/BookingCard.tsx:258` (Context: `className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-whit`)
- `#1ebe5d` — Used in `components/listing-details/BookingCard.tsx:258` (Context: `className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-whit`)
- `bg-zinc-800/80` — Used in `components/listing-details/BookingCard.tsx:385` (Context: `<div className="w-full flex items-center justify-center gap-2 bg-zinc-800/80 border border-white/10 `)
- `#13151b` — Used in `components/listing-details/PhotoGallery.tsx:73` (Context: `className={'bg-[#13151b] border border-outline-variant/10 flex flex-col items-center justify-center `)
- `bg-red-600/20` — Used in `components/listing-details/ReviewsSection.tsx:165` (Context: `className="flex items-center gap-2 bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 text-r`)
- `bg-red-600/30` — Used in `components/listing-details/ReviewsSection.tsx:165` (Context: `className="flex items-center gap-2 bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 text-r`)
- `bg-zinc-800/90` — Used in `components/listings/ListingCard.tsx:85` (Context: `<span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-zinc-800/90 px-2.5 p`)
- `ring-violet-500/30` — Used in `components/listings/ListingFilters.tsx:64` (Context: `className="w-48 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-white placeho`)
- `border-blue-500/30` — Used in `components/login-form.tsx:87` (Context: `<div className="rounded-md border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-center text-sm te`)
- `text-rose-400/70` — Used in `components/my-listings/listing-stats.tsx:40` (Context: `<Heart className="h-3.5 w-3.5 text-rose-400/70" />`)
- `bg-emerald-500/15` — Used in `components/my-listings/listing-status-badge.tsx:14` (Context: `"bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10",`)
- `bg-amber-500/15` — Used in `components/my-listings/listing-status-badge.tsx:19` (Context: `"bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-amber-500/10",`)
- `bg-zinc-500/15` — Used in `components/my-listings/listing-status-badge.tsx:24` (Context: `"bg-zinc-500/15 text-zinc-400 border-zinc-500/30 shadow-zinc-500/10",`)
- `border-zinc-500/30` — Used in `components/my-listings/listing-status-badge.tsx:24` (Context: `"bg-zinc-500/15 text-zinc-400 border-zinc-500/30 shadow-zinc-500/10",`)
- `bg-rose-500/15` — Used in `components/my-listings/listing-status-badge.tsx:29` (Context: `"bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-rose-500/10",`)
- `border-rose-500/30` — Used in `components/my-listings/listing-status-badge.tsx:29` (Context: `"bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-rose-500/10",`)
- `shadow-rose-500/10` — Used in `components/my-listings/listing-status-badge.tsx:29` (Context: `"bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-rose-500/10",`)
- `shadow-violet-500/10` — Used in `components/my-listings/summary-cards.tsx:20` (Context: `glow: "shadow-violet-500/10",`)
- `#1c1c1c` — Used in `components/owner/EditProfileModal.tsx:137` (Context: `className="w-full bg-[#1c1c1c] border border-white/5 text-muted-foreground px-4 py-3 rounded-xl text`)
- `text-teal-400/70` — Used in `components/owner-profile/PrivateOwnerProfileView.tsx:281` (Context: `className="flex-1 py-2.5 text-center text-xs font-semibold text-teal-400/70 hover:text-teal-400 hove`)
- `bg-teal-500/5` — Used in `components/owner-profile/PrivateOwnerProfileView.tsx:281` (Context: `className="flex-1 py-2.5 text-center text-xs font-semibold text-teal-400/70 hover:text-teal-400 hove`)
- `text-rose-400/50` — Used in `components/saved-listings/saved-empty-state.tsx:26` (Context: `className="h-8 w-8 text-rose-400/50"`)
- `bg-rose-500/20` — Used in `components/saved-listings/saved-empty-state.tsx:31` (Context: `<span className="absolute -top-1 -right-1 h-4 w-4 rounded-full border border-white/10 bg-rose-500/20`)
- `text-rose-400/60` — Used in `components/saved-listings/saved-listing-card.tsx:201` (Context: `"text-rose-400/60 transition-colors",`)
- `ring-rose-500/30` — Used in `components/saved-listings/saved-listing-card.tsx:203` (Context: `"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500/30",`)
- `#ccc` — Used in `components/ui/chart.tsx:68` (Context: `"flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foregrou`)
- `bg-black/50` — Used in `components/ui/sheet.tsx:42` (Context: `"fixed inset-0 z-50 bg-black/50 data-open:animate-in data-open:fade-in-0 data-closed:animate-out dat`)
- `bg-emerald-950/90` — Used in `components/ui/toast.tsx:92` (Context: `"bg-emerald-950/90 border-emerald-500/30 text-emerald-100 shadow-emerald-900/30",`)
- `shadow-emerald-900/30` — Used in `components/ui/toast.tsx:92` (Context: `"bg-emerald-950/90 border-emerald-500/30 text-emerald-100 shadow-emerald-900/30",`)
- `bg-red-950/90` — Used in `components/ui/toast.tsx:97` (Context: `"bg-red-950/90 border-red-500/30 text-red-100 shadow-red-900/30",`)
- `shadow-red-900/30` — Used in `components/ui/toast.tsx:97` (Context: `"bg-red-950/90 border-red-500/30 text-red-100 shadow-red-900/30",`)
- `bg-zinc-900/90` — Used in `components/ui/toast.tsx:102` (Context: `"bg-zinc-900/90 border-white/10 text-zinc-100 shadow-zinc-900/30",`)
- `shadow-zinc-900/30` — Used in `components/ui/toast.tsx:102` (Context: `"bg-zinc-900/90 border-white/10 text-zinc-100 shadow-zinc-900/30",`)

---

## Typography

### Font Families
- **Primary Body Font (`--font-sans`)**: **Inter** (`next/font/google`) configured in `app/layout.tsx` and mapped via CSS variable `--font-sans`.
- **Secondary / Interface Font (`--font-geist-sans`)**: **Geist** (`next/font/google`) configured in `app/layout.tsx`.
- **Monospace Font (`--font-geist-mono` / `--font-mono`)**: **Geist Mono** (`next/font/google`) configured in `app/layout.tsx`.
- **Heading Font (`--font-heading`)**: References `var(--font-sans)` (Inter) in `app/globals.css`.
- **Icon Font**: **Material Symbols Outlined** loaded via Google Fonts link tag in `app/layout.tsx` with variation settings `"FILL" 0, "wght" 300, "GRAD" 0, "opsz" 24`.

### Font Weights in Use
- **Normal (400)**: Default body text, form input text.
- **Medium (500)**: Buttons, badges, field labels (`font-medium`).
- **Semibold (600)**: Navigation links, card headers, table headers (`font-semibold`).
- **Bold (700)**: Page titles, primary metric numbers (`font-bold`).
- **Extrabold (800)**: Brand marks and display headlines (`font-extrabold`).

### Observed Size Scale
- `text-[9px]` / `text-[11px]` (Micro badges & back button text)
- `text-xs` (12px - Badges, table subtext, nav items)
- `text-sm` (14px - Default input text, table cells, descriptions)
- `text-base` (16px - Primary paragraph text)
- `text-lg` (18px - Section headers)
- `text-xl` (20px - Modal titles)
- `text-2xl` / `text-3xl` (24px-30px - Dashboard KPI counts, main page headings)
- `text-4xl` / `text-5xl` (36px-48px - Hero display headlines)

---

## Notes & Architecture Discrepancies

1. **Read-only Audit**: This document records the codebase as it exists today. No component source files were edited or refactored.
2. **Defined but Underused Theme Tokens**:
   - `app/globals.css` defines standard shadcn CSS variables under `:root` and `.dark` (`--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--border`, `--input`, `--ring`, `--chart-1`..`5`).
   - However, the vast majority of dark-theme pages (e.g. `AdminNavBar.tsx`, `AdminDashboard`, `AdminListingsClient`, `PrivateProfileView`, `EditProfileModal`) directly apply hardcoded arbitrary Tailwind classes such as `bg-[#0a0a0a]`, `bg-[#111]`, `border-white/[0.08]`, and `text-white/40`.
   - This creates a structural discrepancy between the official oklch theme scaffold in `globals.css` and the actual implemented visual design layer.

---

## Phase 1 — Tokens Defined (not yet consumed)

The following table summarizes the Phase 1 canonical CSS custom properties defined in `app/globals.css` (registered under `.dark` and `@theme inline`). These tokens are defined and ready for consumption in future refactoring phases, but are currently **unconsumed** across application components.

| Token Name | Value | Source (design.md Section) | Status | Notes / Existing Variants |
|---|---|---|---|---|
| `--stayz-surface-base` | `#0a0a0a` | Backgrounds & Surfaces (`bg-[#0a0a0a]`) | defined, unconsumed | Base app dark background (22x) |
| `--stayz-surface-card` | `#111111` | Backgrounds & Surfaces (`bg-[#111]`) | defined, unconsumed | Card & modal background (55x) |
| `--stayz-surface-elevated` | `#1a1a1a` | Backgrounds & Surfaces (`bg-[#1a1a1a]`) | defined, unconsumed | Elevated surface background (13x) |
| `--stayz-surface-hover` | `rgba(255, 255, 255, 0.05)` | Backgrounds & Surfaces (`bg-white/5`) | defined, unconsumed | Subtle hover & container surface (62x) |
| `--stayz-border-default` | `rgba(255, 255, 255, 0.1)` | Borders & Dividers (`border-white/10`) | defined, unconsumed | Standard container border (68x) |
| `--stayz-border-subtle` | `rgba(255, 255, 255, 0.05)` | Borders & Dividers (`border-white/5`) | defined, unconsumed | Subtle separator border (7x) |
| `--stayz-border-divider` | `rgba(255, 255, 255, 0.2)` | Borders & Dividers (`border-white/20`) | defined, unconsumed | Prominent card divider (12x) |
| `--stayz-status-success` | `rgba(16, 185, 129, 0.1)` | Status & Badge Colors (`bg-emerald-500/10`) | defined, unconsumed | Canonical success background; unmigrated variants: `bg-green-500/10` (14x), `bg-emerald-500/15` (1x) |
| `--stayz-status-success-fg` | `#34d399` | Status & Badge Colors (`text-emerald-400`) | defined, unconsumed | Canonical success text |
| `--stayz-status-warning` | `rgba(245, 158, 11, 0.1)` | Status & Badge Colors (`bg-amber-500/10`) | defined, unconsumed | Canonical warning background; unmigrated variants: `bg-orange-500/10` (11x), `bg-yellow-500/10` (4x) |
| `--stayz-status-warning-fg` | `#fbbf24` | Status & Badge Colors (`text-amber-400`) | defined, unconsumed | Canonical warning text; unmigrated variants: `text-orange-400` (5x) |
| `--stayz-status-error` | `rgba(244, 63, 94, 0.15)` | Status & Badge Colors (`bg-rose-500/15`) | defined, unconsumed | Canonical error background; unmigrated variants: `bg-red-500/10` (19x), `bg-red-500/20` (4x) |
| `--stayz-status-error-fg` | `#fb7185` | Status & Badge Colors (`text-rose-400`) | defined, unconsumed | Canonical error text; unmigrated variants: `text-red-400` (17x) |
| `--stayz-status-info` | `rgba(59, 130, 246, 0.1)` | Status & Badge Colors (`bg-blue-500/10`) | defined, unconsumed | Canonical info/user role background (23x) |
| `--stayz-status-info-fg` | `#60a5fa` | Status & Badge Colors (`text-blue-400`) | defined, unconsumed | Canonical info/user role text |
| `--stayz-status-neutral` | `rgba(113, 113, 122, 0.1)` | Status & Badge Colors (`bg-zinc-500/10`) | defined, unconsumed | Canonical rented/neutral background (6x) |
| `--stayz-status-neutral-fg` | `#a1a1aa` | Status & Badge Colors (`text-zinc-400`) | defined, unconsumed | Canonical rented/neutral text |
| `--stayz-text-primary` | `#ffffff` | Text & Content Colors (`#ffffff`) | defined, unconsumed | Primary bright white text (9x) |
| `--stayz-text-secondary` | `rgba(255, 255, 255, 0.6)` | Text & Content Colors (`text-white/60`) | defined, unconsumed | Secondary body/description text (39x) |
| `--stayz-text-muted` | `rgba(255, 255, 255, 0.4)` | Text & Content Colors (`text-white/40`) | defined, unconsumed | Muted subtext & labels (104x) |
| `--stayz-text-disabled` | `rgba(255, 255, 255, 0.2)` | Text & Content Colors (`text-white/20`) | defined, unconsumed | Disabled / placeholder text (23x) |
| `--stayz-overlay-backdrop` | `rgba(0, 0, 0, 0.4)` | Backgrounds & Surfaces (`bg-black/40`) | defined, unconsumed | Modal & drawer backdrop overlay (34x) |

---

## Phase 2 — Status Tokens Consumed

The status and badge-meaning colors across 7 scoped components and pages have been migrated to consume the canonical StayZ status tokens defined in Phase 1:

| Token Utility Name | Consuming Files & Components | Migrated Hardcoded Classes (Before → After) |
|---|---|---|
| `bg-stayz-status-success`<br>`text-stayz-status-success-fg` | `components/my-listings/listing-status-badge.tsx`<br>`app/(admin)/admin/reports/reports-client.tsx`<br>`app/(owner)/owner/booking-requests/page.tsx`<br>`app/(user)/user/dashboard/page.tsx`<br>`components/add-listing/listing-status.tsx`<br>`components/admin/AdminListingsClient.tsx` | `bg-emerald-500/15`, `bg-emerald-500/10`, `bg-green-500/10`, `bg-green-500/20`, `bg-emerald-500/20` → `bg-stayz-status-success`<br>`text-emerald-400`, `text-green-400` → `text-stayz-status-success-fg`<br>`bg-emerald-400` → `bg-stayz-status-success-fg` |
| `bg-stayz-status-neutral`<br>`text-stayz-status-neutral-fg` | `components/my-listings/listing-status-badge.tsx`<br>`app/(owner)/owner/booking-requests/page.tsx`<br>`components/add-listing/listing-status.tsx`<br>`components/admin/AdminListingsClient.tsx` | `bg-amber-500/15`, `bg-zinc-500/15`, `bg-amber-500/10`, `bg-zinc-500/10`, `bg-slate-500/10` → `bg-stayz-status-neutral`<br>`text-amber-400`, `text-zinc-400` → `text-stayz-status-neutral-fg` |
| `bg-stayz-status-error`<br>`text-stayz-status-error-fg` | `components/my-listings/listing-status-badge.tsx`<br>`app/(owner)/owner/booking-requests/page.tsx`<br>`components/admin/AdminListingsClient.tsx` | `bg-rose-500/15`, `bg-red-500/10`, `bg-rose-500/10` → `bg-stayz-status-error`<br>`text-rose-400`, `text-red-400` → `text-stayz-status-error-fg` |
| `bg-stayz-status-warning`<br>`text-stayz-status-warning-fg` | `app/(user)/user/dashboard/page.tsx` | `bg-yellow-500/10` → `bg-stayz-status-warning`<br>`text-yellow-400` → `text-stayz-status-warning-fg` |
| `bg-stayz-status-info`<br>`text-stayz-status-info-fg` | `app/(admin)/admin/users/users-client.tsx`<br>`app/(user)/user/dashboard/page.tsx`<br>`components/admin/AdminListingsClient.tsx` | `bg-blue-500/10`, `bg-blue-500/20`, `bg-violet-500/10` → `bg-stayz-status-info`<br>`text-blue-400` → `text-stayz-status-info-fg` |

---

## Phase 3 — Surface & Border Tokens Consumed

Structural background, container surface, hover state, border, and overlay backdrop classNames across the shared shell, primitives, and all admin pages/components have been migrated to consume the Phase 1 surface and border tokens.

| Token Utility | Migrated Hardcoded Value(s) | Consuming Files |
|---|---|---|
| `bg-stayz-surface-base` | `bg-[#0a0a0a]`, `bg-[#0d0d0d]` | `AdminNavBar.tsx`, `AdminListingsClient.tsx`, `AdminAnalyticsClient.tsx`, `admin/dashboard/page.tsx` |
| `bg-stayz-surface-card` | `bg-[#111]`, `bg-[#111]/80`, `bg-[#111]/60` | `SettingsDialog.tsx`, `users-client.tsx`, `owners-client.tsx`, `AdminListingsClient.tsx`, `AdminAnalyticsClient.tsx`, `admin/dashboard/page.tsx`, `toast.tsx` |
| `bg-stayz-surface-elevated` | `bg-[#1a1a1a]` | `users-client.tsx` (SelectContent dropdowns), `owners-client.tsx` (SelectContent + ActionMenu) |
| `bg-stayz-surface-hover` | `bg-white/5`, `bg-white/[0.02]`, `bg-white/[0.03]`, `bg-white/[0.04]`, `bg-white/[0.05]`, `bg-white/[0.06]` | `AdminNavBar.tsx`, `SettingsDialog.tsx`, `users-client.tsx`, `owners-client.tsx`, `AdminListingsClient.tsx`, `AdminAnalyticsClient.tsx`, `admin/dashboard/page.tsx` |
| `border-stayz-border-subtle` | `border-white/[0.05]`, `border-white/[0.06]`, `border-white/[0.07]`, `border-white/[0.08]` | `AdminNavBar.tsx`, `AdminListingDrawer.tsx`, `SettingsDialog.tsx`, `sheet.tsx`, `users-client.tsx`, `owners-client.tsx`, `AdminListingsClient.tsx`, `AdminAnalyticsClient.tsx`, `admin/dashboard/page.tsx` |
| `border-stayz-border-default` | `border-white/10`, `border-white/15` | `AdminNavBar.tsx`, `SettingsDialog.tsx`, `users-client.tsx`, `owners-client.tsx`, `AdminListingsClient.tsx`, `admin/dashboard/page.tsx`, `toast.tsx` |
| `bg-stayz-overlay-backdrop` | `bg-black/50` | `sheet.tsx` |

