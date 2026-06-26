import { redirect } from "next/navigation";

// Detail pages moved to /listings-details/[id]
export default async function ListingDetailRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/listings-details/${id}`);
}
