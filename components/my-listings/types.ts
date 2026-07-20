// Shared types for my-listings components

export type ListingStatus = "ACTIVE" | "DRAFT" | "RENTED" | "SUSPENDED";
export type RoomType = "SINGLE" | "SHARED" | "PG" | "FLAT";
export type Furnishing = "FURNISHED" | "SEMI_FURNISHED" | "UNFURNISHED";
export type GenderPreference = "ANY" | "MALE" | "FEMALE";

export interface MyListing {
  id: string;
  title: string;
  city: string;
  locality: string;
  rent: number;
  roomType: RoomType;
  furnishing: Furnishing;
  genderPreference: GenderPreference;
  status: ListingStatus;
  coverImage: string;
  rating: number | null;
  reviews: number;
  saves: number;
  createdAt: string; // ISO date string
}
