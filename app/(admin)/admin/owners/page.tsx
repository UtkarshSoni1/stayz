export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Link from "next/link";
import { Building2, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { OwnersClient } from "./owners-client";
import type { AdminOwnerDTO } from "@/types/admin";

export const metadata = {
  title: "Manage Owners | StayZ Admin",
  description: "Review and manage all owner accounts on the StayZ platform.",
};

const PAGE_SIZE = 20;

async function getOwners(search?: string, accountStatus?: string, page = 1) {
  const where = {
    role: "OWNER" as const,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        { id: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(accountStatus && accountStatus !== "ALL"
      ? { accountStatus: accountStatus as "ACTIVE" | "SUSPENDED" | "BANNED" }
      : {}),
  };

  const [owners, total] = await Promise.all([
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
        _count: { select: { listings: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const data: AdminOwnerDTO[] = owners.map((o) => ({
    ...o,
    emailVerified: o.emailVerified?.toISOString() ?? null,
    createdAt: o.createdAt.toISOString(),
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

export default async function ManageOwnersPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const sp = await searchParams;
  const search = sp.search;
  const accountStatus = sp.accountStatus;
  const page = Math.max(1, Number(sp.page || 1));

  const result = await getOwners(search, accountStatus, page);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Bar */}
      <header className="border-b border-white/[0.08] bg-[#0d0d0d] sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
              <ShieldCheck className="h-4 w-4 text-red-400" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">StayZ Admin</span>
              <span className="ml-2 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400 uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40">{session.user.email}</span>
            <Link
              href="/admin/dashboard"
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <AdminPageHeader
          icon={Building2}
          iconBg="bg-violet-500/10"
          iconColor="text-violet-400"
          title="Manage Owners"
          description="Review and moderate all landlord accounts on the platform."
          breadcrumbs={[
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Owners" },
          ]}
        />

        <Suspense fallback={<TableSkeleton rows={8} cols={5} />}>
          <OwnersClient
            initialData={result}
            initialSearch={search ?? ""}
            initialStatus={accountStatus ?? "ALL"}
          />
        </Suspense>
      </main>
    </div>
  );
}
