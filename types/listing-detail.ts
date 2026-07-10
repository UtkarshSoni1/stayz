export interface ListingPhoto {
  src: string;
  alt: string;
}

export interface HostPersonalDetail {
  icon: string;
  text: string;
}

export interface Host {
  id: string;
  name: string;
  avatarUrl: string;
  avatarAlt: string;
  joinedYear: number;
  responseRate: string;
  responseTime: string;
  isSuperhost: boolean;
  reviewCount: number;
  rating: number;
  yearsHosting: number;
  personalDetails: HostPersonalDetail[];
  superhostDescription: string;
  safetyDisclaimer: string;
  // Contact fields — set by owner from dashboard settings
  phone?: string;
  whatsappNumber?: string;
}

export interface Amenity {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Review {
  id: string;
  author: string;
  avatarUrl: string;
  avatarAlt: string;
  date: string;
  rating: number;
  comment: string;
}

export interface BookingInfo {
  monthlyRent: number;
  currency: string;
  rating: number;
  deposit?: number;
  maxGuests: number;
  reserveLabel: string;
  /** Passed through so BookingCard can build the WhatsApp message link */
  listingId: string;
  listingTitle: string;
}

export interface RatingBreakdown {
  overall: number;
  reviewCount: number;
  categories: RatingCategory[];
}

export interface RatingCategory {
  label: string;
  score: number;
}

export interface SleepingArrangement {
  id: string;
  icon: string;
  name: string;
  description: string;
}

export interface ThingToKnow {
  id: string;
  icon: string;
  title: string;
  content: string;
}

export interface Listing {
  id: string;
  title: string;
  propertyType: string;
  location: string;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  photos: ListingPhoto[];
  host: Host;
  highlights: Amenity[];
  amenities: Amenity[];
  description: string;
  descriptionExtended: string;
  booking: BookingInfo;
  reviews: Review[];
  ratingBreakdown: RatingBreakdown;
  sleepingArrangements: SleepingArrangement[];
  thingsToKnow: ThingToKnow[];
  mapLocation: string;
  mapImageUrl: string;
  mapImageAlt: string;
}

export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}
