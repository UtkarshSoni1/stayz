import type { Role, AccountStatus, ReportStatus, ReportType } from "@prisma/client"

// ─── User Management DTOs ─────────────────────────────────────────────────────

export interface AdminUserDTO {
  id: string
  name: string | null
  email: string
  role: Role
  accountStatus: AccountStatus
  emailVerified: string | null  // ISO date string
  createdAt: string             // ISO date string
  _count: {
    listings: number
    reviews: number
  }
}

export interface AdminUserDetailDTO extends AdminUserDTO {
  image: string | null
  phone: string | null
  whatsappNumber: string | null
  bio: string | null
}

// ─── Owner Management DTOs ────────────────────────────────────────────────────

export interface AdminOwnerDTO {
  id: string
  name: string | null
  email: string
  role: Role
  accountStatus: AccountStatus
  emailVerified: string | null
  createdAt: string
  _count: {
    listings: number
  }
}

// ─── Report DTOs ──────────────────────────────────────────────────────────────

export interface AdminReportDTO {
  id: string
  reportType: ReportType
  reason: string
  description: string | null
  status: ReportStatus
  createdAt: string
  updatedAt: string
  reporter: {
    id: string
    name: string | null
    email: string
  }
  reportedUser: {
    id: string
    name: string | null
    email: string
  } | null
  reportedListing: {
    id: string
    title: string
    city: string
  } | null
}

// ─── Paginated response wrapper ───────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ─── Patch payloads ───────────────────────────────────────────────────────────

export interface PatchUserPayload {
  name?: string
  email?: string
  role?: Role
  accountStatus?: AccountStatus
}

export interface PatchReportPayload {
  status: ReportStatus
}
