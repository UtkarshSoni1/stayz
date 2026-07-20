export const dynamic = "force-dynamic";

import { requireAdmin } from "@/lib/auth-helpers";
import { AdminListingsClient } from "@/components/admin/AdminListingsClient";

export const metadata = {
  title: "Manage Listings | StayZ Admin",
  description: "Review, moderate, and manage all property listings.",
};

export default async function AdminListingsPage() {
  const user = await requireAdmin();

  return <AdminListingsClient userEmail={user.email ?? ""} />;
}
