import type { Furnishing, GenderPreference, RoomType } from "@prisma/client";

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  SINGLE: "Single",
  SHARED: "Shared",
  PG: "PG",
  FLAT: "Flat",
};

export const FURNISHING_LABELS: Record<Furnishing, string> = {
  FURNISHED: "Furnished",
  SEMI_FURNISHED: "Semi",
  UNFURNISHED: "Bare",
};

export const GENDER_LABELS: Record<GenderPreference, string> = {
  ANY: "Any",
  MALE: "Boys",
  FEMALE: "Girls",
};

export const ROOM_TYPE_COLORS: Record<RoomType, string> = {
  SINGLE: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  SHARED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  PG: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  FLAT: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

export const FURNISHING_COLORS: Record<Furnishing, string> = {
  FURNISHED: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  SEMI_FURNISHED: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  UNFURNISHED: "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

export const GENDER_COLORS: Record<GenderPreference, string> = {
  ANY: "bg-green-500/10 text-green-500 border-green-500/20",
  MALE: "bg-green-500/10 text-green-500 border-green-500/20",
  FEMALE: "bg-green-500/10 text-green-500 border-green-500/20",
};

export function formatRent(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
