export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Link from "next/link";
import { Users, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { UsersClient } from "./users-client";
import type { AdminUserDTO } from "@/types/admin";

export const metadata = {
  title: "Manage Users | StayZ Admin",
  description: "View and manage all user accounts on the StayZ platform.",
};

const PAGE_SIZE = 20;

async function getUsers(search?: string, role?: string, accountStatus?: string, page = 1) {
  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        { id: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(role && role !== "ALL" ? { role: role as "USER" | "OWNER" | "ADMIN" } : {}),
    ...(accountStatus && accountStatus !== "ALL"
      ? { accountStatus: accountStatus as "ACTIVE" | "SUSPENDED" | "BANNED" }
      : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        accountStatus: true,
        emailVerified: true,
        createdAt: true,
        _count: { select: { listings: true, reviews: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const data: AdminUserDTO[] = users.map((u) => ({
    ...u,
    emailVerified: u.emailVerified?.toISOString() ?? null,
    createdAt: u.createdAt.toISOString(),
  }));

  return {
    data,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ManageUsersPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const sp = await searchParams;
  const search = sp.search;
  const role = sp.role;
  const accountStatus = sp.accountStatus;
  const page = Math.max(1, Number(sp.page || 1));

  const result = await getUsers(search, role, accountStatus, page);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <AdminPageHeader
          icon={Users}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-400"
          title="Manage Users"
          description="View, edit, and moderate all registered user accounts."
          breadcrumbs={[
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Users" },
          ]}
        />

        <Suspense fallback={<TableSkeleton rows={8} cols={6} />}>
          <UsersClient
            initialData={result}
            initialSearch={search ?? ""}
            initialRole={role ?? "ALL"}
            initialStatus={accountStatus ?? "ALL"}
          />
        </Suspense>
      </main>
    </div>
  );
}
