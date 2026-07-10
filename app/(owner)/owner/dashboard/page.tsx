export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDashboardSummary } from "@/lib/dashboard-service";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./DashboardClient";

export const metadata = {
  title: "Owner Dashboard | StayZ",
  description: "Manage your listings, track performance, and grow your rental business.",
};

export default async function OwnerDashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const sessionUser = session.user;

  // Fetch full user details from the database to supply accurate fields to the profile modal
  const dbUser = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      whatsappNumber: true,
    },
  });

  if (!dbUser) {
    redirect("/login");
  }

  // Fetch real summary
  const summary = await getDashboardSummary(dbUser.id);

  return <DashboardClient summary={summary} user={dbUser} />;
}
