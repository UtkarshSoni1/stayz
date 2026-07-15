export const dynamic = "force-dynamic"

import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { getListingById } from "@/lib/listing-service"
import { ListingForm } from "@/components/add-listing/listing-form"

export const metadata = {
  title: "Edit Listing | StayZ",
  description: "Modify your room listing details.",
}

interface EditListingPageProps {
  params: Promise<{ id: string }>
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const { id } = await params
  const listing = await getListingById(id)

  if (!listing) {
    notFound()
  }

  // Guard ownership: only owner can edit listing
  if (listing.ownerId !== session.user.id) {
    redirect("/owner/my-listings")
  }

  // Map database types safely to component initialListing prop
  const formattedListing = {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    city: listing.city,
    locality: listing.locality,
    address: listing.address,
    pincode: listing.pincode,
    monthlyRent: listing.monthlyRent,
    deposit: listing.deposit,
    roomType: listing.roomType,
    furnishing: listing.furnishing,
    genderPreference: listing.genderPreference,
    status: listing.status,
    amenities: listing.amenities,
    images: listing.images.map((img) => ({
      url: img.url,
      publicId: img.publicId,
    })),
  }

  return <ListingForm initialListing={formattedListing} />
}
