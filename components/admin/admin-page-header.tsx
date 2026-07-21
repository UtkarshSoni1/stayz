import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface AdminPageHeaderProps {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  title: string
  description: string
  breadcrumbs?: BreadcrumbItem[]
  /** Optional action slot (e.g. a button) */
  action?: React.ReactNode
}

export function AdminPageHeader({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
  breadcrumbs,
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-8">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-white/30 mb-4">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-white/60 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white/50">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="mt-0.5 text-sm text-white/40">{description}</p>
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  )
}
