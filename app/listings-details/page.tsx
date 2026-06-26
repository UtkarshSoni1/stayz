import { redirect } from "next/navigation";

// /listings-details without an ID — redirect to the main listings page
export default function ListingsDetailsIndex() {
  redirect("/listings");
}
