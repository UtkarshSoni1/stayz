"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { AppNavBar } from "@/components/navbar/AppNavBar"
import { PropertyDetails } from "./property-details"
import { LocationSection } from "./location-section"
import { PricingSection } from "./pricing-section"
import { RoomDetails } from "./room-details"
import { AmenitiesSection } from "./amenities-section"
import { ImageUpload, type UploadedImage } from "./image-upload"
import { ListingStatus } from "./listing-status"
import { ActionBar } from "./action-bar"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/listing"

interface FormData {
  title: string
  description: string
  city: string
  locality: string
  address: string
  pincode: string
  monthlyRent: string
  securityDeposit: string
  roomType: string
  furnishing: string
  genderPreference: string
  status: "DRAFT" | "ACTIVE"
}

type FormErrors = Partial<Record<keyof FormData | "images", string>>

function validateForm(
  data: FormData,
  images: UploadedImage[]
): FormErrors {
  const errors: FormErrors = {}

  if (!data.title.trim()) errors.title = "Listing title is required"
  else if (data.title.trim().length < 10) errors.title = "Title must be at least 10 characters"

  if (!data.description.trim()) errors.description = "Description is required"
  else if (data.description.trim().length < 30) errors.description = "Description must be at least 30 characters"

  if (!data.city.trim()) errors.city = "City is required"
  if (!data.locality.trim()) errors.locality = "Locality is required"
  if (!data.pincode.trim()) errors.pincode = "Pincode is required"
  else if (!/^\d{6}$/.test(data.pincode)) errors.pincode = "Enter a valid 6-digit pincode"

  if (!data.monthlyRent) errors.monthlyRent = "Monthly rent is required"
  else if (Number(data.monthlyRent) <= 0) errors.monthlyRent = "Rent must be greater than 0"

  if (!data.roomType) errors.roomType = "Please select a room type"
  if (!data.furnishing) errors.furnishing = "Please select furnishing type"
  if (!data.genderPreference) errors.genderPreference = "Please select gender preference"

  const uploading = images.filter((img) => !img.url && !img.error)
  const failed = images.filter((img) => !!img.error)
  if (uploading.length > 0) {
    errors.images = `${uploading.length} image${uploading.length > 1 ? "s are" : " is"} still uploading. Please wait.`
  } else if (failed.length > 0) {
    errors.images = `${failed.length} image${failed.length > 1 ? "s" : ""} failed to upload. Remove or retry them before submitting.`
  }

  return errors
}

const FIELD_ID_MAP: Partial<Record<keyof FormData | "images", string>> = {
  title: "listing-title",
  description: "listing-description",
  city: "city",
  locality: "locality",
  pincode: "pincode",
  monthlyRent: "monthly-rent",
  images: "image-upload-dropzone",
}

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-24 left-1/2 z-[100] -translate-x-1/2 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-xl backdrop-blur-xl transition-all duration-300 ${
      type === "success"
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
        : "border-destructive/30 bg-destructive/10 text-destructive"
    }`}>
      {type === "success" && <CheckCircle2 className="h-4 w-4 shrink-0" />}
      {message}
    </div>
  )
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="h-px flex-1 bg-border/40" />
      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">
        {label}
      </span>
      <div className="h-px flex-1 bg-border/40" />
    </div>
  )
}

export interface ListingFormProps {
  initialListing?: {
    id: string
    title: string
    description: string
    city: string
    locality: string
    address?: string | null
    pincode: string | null
    monthlyRent: number
    deposit?: number | null
    roomType: string
    furnishing: string
    genderPreference: string
    status: string
    amenities: { amenity: { name: string } }[]
    images: { url: string; publicId: string | null }[]
  }
}

export function ListingForm({ initialListing }: ListingFormProps) {
  const router = useRouter()
  const isEditMode = !!initialListing

  const [formData, setFormData] = useState<FormData>({
    title: initialListing?.title ?? "",
    description: initialListing?.description ?? "",
    city: initialListing?.city ?? "",
    locality: initialListing?.locality ?? "",
    address: initialListing?.address ?? "",
    pincode: initialListing?.pincode ?? "",
    monthlyRent: initialListing?.monthlyRent ? String(initialListing.monthlyRent) : "",
    securityDeposit: initialListing?.deposit ? String(initialListing.deposit) : "",
    roomType: initialListing?.roomType ?? "",
    furnishing: initialListing?.furnishing ?? "",
    genderPreference: initialListing?.genderPreference ?? "",
    status: initialListing?.status === "RENTED" ? "DRAFT" : ((initialListing?.status as "DRAFT" | "ACTIVE") ?? "DRAFT"),
  })

  const [amenities, setAmenities] = useState<string[]>(
    initialListing?.amenities.map((a) => a.amenity.name) ?? []
  )
  const [images, setImages] = useState<UploadedImage[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }, [])

  const handleAmenityToggle = useCallback((amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    )
  }, [])

  const handleImagesChange = useCallback((updated: UploadedImage[]) => {
    setImages(updated)
    setErrors((prev) => ({ ...prev, images: undefined }))
  }, [])

  const handleSubmit = async (publishStatus: "DRAFT" | "ACTIVE") => {
    const submitData = { ...formData, status: publishStatus }

    const validationErrors = validateForm(submitData, images)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      const firstKey = Object.keys(validationErrors)[0] as keyof FormData | "images"
      const elId = FIELD_ID_MAP[firstKey] ?? String(firstKey)
      document.getElementById(elId)?.scrollIntoView({ behavior: "smooth", block: "center" })
      showToast("Please fix the highlighted fields before continuing.", "error")
      return
    }

    setIsLoading(true)
    try {
      const imagePayload = images
        .filter((img) => img.url && img.publicId)
        .map((img, index) => ({
          url: img.url!,
          publicId: img.publicId!,
          sortOrder: index,
        }))

      const payload = {
        title: submitData.title.trim(),
        description: submitData.description.trim(),
        city: submitData.city.trim(),
        locality: submitData.locality.trim(),
        address: submitData.address.trim() || null,
        pincode: submitData.pincode.trim(),
        monthlyRent: Number(submitData.monthlyRent),
        securityDeposit: submitData.securityDeposit ? Number(submitData.securityDeposit) : null,
        roomType: submitData.roomType,
        furnishing: submitData.furnishing,
        genderPreference: submitData.genderPreference,
        amenities,
        images: imagePayload,
        status: publishStatus,
      }

      const url = isEditMode ? `/api/listings/${initialListing.id}` : "/api/listings"
      const method = isEditMode ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const json = (await res.json()) as ApiErrorResponse | ApiSuccessResponse<{ id: string }>

      if (!res.ok || !json.success) {
        const errJson = json as ApiErrorResponse
        if (errJson.fieldErrors && Object.keys(errJson.fieldErrors).length > 0) {
          setErrors(errJson.fieldErrors as FormErrors)
          const firstKey = Object.keys(errJson.fieldErrors)[0] as keyof FormData
          const elId = FIELD_ID_MAP[firstKey] ?? firstKey
          document.getElementById(elId as string)?.scrollIntoView({ behavior: "smooth", block: "center" })
        }
        showToast(errJson.error ?? "Something went wrong. Please try again.", "error")
        return
      }

      const successJson = json as ApiSuccessResponse<{ id: string; roleUpdated?: boolean }>
      showToast(
        publishStatus === "ACTIVE"
          ? isEditMode ? "🎉 Listing updated successfully!" : "🎉 Listing published successfully!"
          : "📝 Draft saved.",
        "success"
      )

      if (!isEditMode && successJson.data.roleUpdated) {
        showToast("🚀 You're now an Owner! Redirecting to your dashboard…", "success")
        setTimeout(() => {
          router.push("/owner/dashboard")
        }, 1500)
      } else {
        setTimeout(() => {
          const redirectId = isEditMode ? initialListing.id : successJson.data.id
          router.push(`/listings/${redirectId}`)
          router.refresh()
        }, 1200)
      }
    } catch {
      showToast("Network error. Please check your connection and try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const propertyData = { title: formData.title, description: formData.description }
  const locationData = {
    city: formData.city,
    locality: formData.locality,
    address: formData.address,
    pincode: formData.pincode,
  }
  const pricingData = { monthlyRent: formData.monthlyRent, securityDeposit: formData.securityDeposit }
  const roomData = {
    roomType: formData.roomType,
    furnishing: formData.furnishing,
    genderPreference: formData.genderPreference,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/3 blur-[120px]" />
        <div className="absolute top-1/2 -left-60 h-[500px] w-[500px] rounded-full bg-blue-500/3 blur-[100px]" />
      </div>

      <AppNavBar />

      <main className="mx-auto max-w-3xl px-4 pb-32 pt-8 sm:px-6 sm:pt-10">
        <div className="mb-8">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-border/40 bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            {isEditMode ? "Edit Listing" : "New Listing"}
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {isEditMode ? "Edit Listing" : "Add New Listing"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {isEditMode ? "Modify details of your room listing." : "Create a room listing in a few minutes."}{" "}
            <span className="text-destructive">*</span> Required fields.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} noValidate className="space-y-4">
          <PropertyDetails data={propertyData} onChange={handleChange} errors={errors} />

          <SectionDivider label="Location" />
          <LocationSection data={locationData} onChange={handleChange} errors={errors} />

          <SectionDivider label="Pricing" />
          <PricingSection data={pricingData} onChange={handleChange} errors={errors} />

          <SectionDivider label="Room Details" />
          <RoomDetails data={roomData} onChange={handleChange} errors={errors} />

          <SectionDivider label="Amenities" />
          <AmenitiesSection selected={amenities} onToggle={handleAmenityToggle} />

          <SectionDivider label="Photos" />
          <ImageUpload
            images={images}
            onChange={handleImagesChange}
            errors={errors}
            initialImages={initialListing?.images}
          />

          <SectionDivider label="Status" />
          <ListingStatus
            status={formData.status}
            onChange={(s) => handleChange("status", s)}
          />
        </form>
      </main>

      <ActionBar
        isLoading={isLoading}
        onSaveDraft={() => handleSubmit("DRAFT")}
        onPublish={() => handleSubmit("ACTIVE")}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
