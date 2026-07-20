export const dynamic = "force-dynamic";

import { requireAdmin } from "@/lib/auth-helpers";
import { AdminAnalyticsClient } from "../../../../components/admin/AdminAnalyticsClient";

export const metadata = {
  title: "Analytics | StayZ Admin",
  description: "Platform-wide usage statistics and performance metrics.",
};

export default async function AdminAnalyticsPage() {
  await requireAdmin();
  return <AdminAnalyticsClient />;
}
