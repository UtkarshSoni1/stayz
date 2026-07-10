import type { Metadata } from "next";
import { getListingById } from "@/data/listing-detail";
import {
  ListingNavBar,
  ListingHeader,
  PhotoGallery,
  PropertyInfo,
  HostCard,
  AmenitiesList,
  Description,
  BookingCard,
  SleepingArrangements,
  RatingsBreakdown,
  ReviewsSection,
  MapSection,
  ThingsToKnow,
} from "@/components/listing-details";
import { EditorialFooter } from "@/components/home/EditorialFooter";
import { BottomNavBar } from "@/components/home/BottomNavBar";

interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ListingDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(id);

  return {
    title: listing ? `${listing.title} | STAYZ` : "Listing | STAYZ",
    description: listing?.description,
  };
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-on-surface flex items-center justify-center">
        <p className="text-on-surface-variant">Listing not found.</p>
      </div>
    );
  }

  return (
    <div className="font-body-md bg-[#0a0a0a] text-on-surface min-h-screen">
      <ListingNavBar booking={listing.booking} />
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-12">
        <ListingHeader title={listing.title} />
        <PhotoGallery photos={listing.photos} />
        <div id="booking-card-sentinel" aria-hidden="true" />
        <section className="grid grid-cols-1 md:grid-cols-3 gap-16 pb-section-gap">
          <div className="md:col-span-2 ">
            <PropertyInfo listing={listing} host={listing.host} />
            <AmenitiesList highlights={listing.highlights} amenities={listing.amenities} />
            <Description
              description={listing.description}
              extended={listing.descriptionExtended}
            />
            <SleepingArrangements arrangements={listing.sleepingArrangements} />
            <RatingsBreakdown breakdown={listing.ratingBreakdown} />
            <ReviewsSection reviews={listing.reviews} listingId={listing.id} />
            <MapSection
              location={listing.mapLocation}
              imageUrl={listing.mapImageUrl}
              imageAlt={listing.mapImageAlt}
            />
            <HostCard host={listing.host} />
            <ThingsToKnow items={listing.thingsToKnow} />
          </div>
          <BookingCard booking={listing.booking} host={listing.host}/>
        </section>
      </main>
      <footer className="bg-surface-container-lowest border-t border-outline-variant">
        <EditorialFooter/>
        <BottomNavBar/>
      </footer>
    </div>
  );
}
