import type { Host, Listing } from "@/types/listing-detail";
import { Avatar } from "./Avatar";

interface PropertyInfoProps {
  listing: Pick<
    Listing,
    "propertyType" | "location" | "guests" | "bedrooms" | "beds" | "bathrooms"
  >;
  host: Host;
}

export function PropertyInfo({ listing, host }: PropertyInfoProps) {
  return (
    <div className="flex justify-between items-start border-b border-white/10 pb-10 mb-10">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-white mb-2">
          {listing.propertyType} in {listing.location}
        </h2>
        <p className="font-body-lg text-white/70 flex flex-wrap items-center gap-2">
          {listing.guests} guests <span className="text-white/30">•</span>
          {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? "s" : ""}{" "}
          <span className="text-white/30">•</span>
          {listing.beds} bed{listing.beds !== 1 ? "s" : ""}{" "}
          <span className="text-white/30">•</span>
          {listing.bathrooms} bathroom{listing.bathrooms !== 1 ? "s" : ""}
        </p>
      </div>
      <Avatar src={host.avatarUrl} alt={host.avatarAlt} bordered />
    </div>
  );
}
