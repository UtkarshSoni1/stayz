export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Link from "next/link";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { ReportsClient } from "./reports-client";
import type { AdminReportDTO } from "@/types/admin";

export const metadata = {
  title: "Reports | StayZ Admin",
  description: "Review and act on user-submitted reports.",
};

const PAGE_SIZE = 20;

async function getReports(
  search?: string,
  status?: string,
  reportType?: string,
  page = 1
) {
  const where = {
    ...(status && status !== "ALL" ? { status: status as "PENDING" | "RESOLVED" | "DISMISSED" } : {}),
    ...(reportType && reportType !== "ALL" ? { reportType: reportType as "USER" | "LISTING" } : {}),
    ...(search && {
      OR: [
        { reason: { contains: search, mode: "insensitive" as const } },
        {
          reporter: {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          },
        },
      ],
    }),
  };

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        reportType: true,
        reason: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        reporter: { select: { id: true, name: true, email: true } },
        reportedUser: { select: { id: true, name: true, email: true } },
        reportedListing: { select: { id: true, title: true, city: true } },
      },
    }),
    prisma.report.count({ where }),
  ]);

  const data: AdminReportDTO[] = reports.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
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

export default async function ReportsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const sp = await searchParams;
  const search = sp.search;
  const status = sp.status;
  const reportType = sp.reportType;
  const page = Math.max(1, Number(sp.page || 1));

  const result = await getReports(search, status, reportType, page);

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
          icon={AlertTriangle}
          iconBg="bg-orange-500/10"
          iconColor="text-orange-400"
          title="Reports"
          description="Review and action user-submitted content reports."
          breadcrumbs={[
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Reports" },
          ]}
        />

        <Suspense fallback={<TableSkeleton rows={8} cols={6} />}>
          <ReportsClient
            initialData={result}
            initialSearch={search ?? ""}
            initialStatus={status ?? "ALL"}
            initialType={reportType ?? "ALL"}
          />
        </Suspense>
      </main>
    </div>
  );
}
