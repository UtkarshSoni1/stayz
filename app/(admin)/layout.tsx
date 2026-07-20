import { requireAdmin } from "@/lib/auth-helpers";
import { AdminNavBar } from "@/components/admin/AdminNavBar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <>
      <AdminNavBar />
      {children}
    </>
  );
}
