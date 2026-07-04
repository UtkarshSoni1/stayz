export const dynamic = "force-dynamic";

import { requireOwner } from "@/lib/auth-helpers";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOwner();
  return <>{children}</>;
}
