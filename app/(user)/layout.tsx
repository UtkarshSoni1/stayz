export const dynamic = "force-dynamic";

import { requireUser } from "@/lib/auth-helpers";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return <>{children}</>;
}
