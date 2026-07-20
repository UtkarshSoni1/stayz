"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DollarSign,
  CalendarCheck,
  Home,
  Users,
  TrendingUp,
  ArrowUpRight,
  Star,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// ─── Types (mirror API response) ────────────────────────────────────────────

interface KPIs {
  estimatedRevenue: number;
  totalBookings: number;
  activeListings: number;
  activeUsers: number;
}

interface DayDataPoint {
  date: string;
  revenue: number;
}

interface BookingDayDataPoint {
  date: string;
  count: number;
}

interface StatusSegment {
  status: string;
  count: number;
}

interface CityRevenue {
  city: string;
  revenue: number;
}

interface TopListing {
  id: string;
  title: string;
  city: string;
  monthlyRent: number;
  reviewCount: number;
  avgRating: number;
  confirmedBookings: number;
}

interface RecentBooking {
  id: string;
  listingTitle: string;
  userName: string | null;
  status: string;
  createdAt: string;
}

interface AnalyticsPayload {
  kpis: KPIs;
  revenueByDay: DayDataPoint[];
  bookingsByDay: BookingDayDataPoint[];
  bookingsByStatus: StatusSegment[];
  revenueByCity: CityRevenue[];
  topListings: TopListing[];
  recentBookings: RecentBooking[];
}

// ─── Chart Configs ───────────────────────────────────────────────────────────

const revenueChartConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "hsl(152, 60%, 52%)" },
};

const bookingsChartConfig: ChartConfig = {
  count: { label: "Bookings", color: "hsl(217, 91%, 65%)" },
};

const donutChartConfig: ChartConfig = {
  Pending: { label: "Pending", color: "hsl(38, 92%, 60%)" },
  Confirmed: { label: "Confirmed", color: "hsl(152, 60%, 52%)" },
  Cancelled: { label: "Cancelled", color: "hsl(0, 72%, 60%)" },
};

const cityChartConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "hsl(262, 83%, 65%)" },
};

const DONUT_COLORS = [
  "hsl(38, 92%, 60%)",
  "hsl(152, 60%, 52%)",
  "hsl(0, 72%, 60%)",
];

const STATUS_COLORS: Record<string, string> = {
  Pending: "hsl(38, 92%, 60%)",
  Confirmed: "hsl(152, 60%, 52%)",
  Cancelled: "hsl(0, 72%, 60%)",
};

// ─── Formatters ──────────────────────────────────────────────────────────────

function formatCurrency(val: number): string {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val.toLocaleString("en-IN")}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

function KPICard({
  icon: Icon,
  label,
  value,
  subtitle,
  accent,
  bg,
  border,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subtitle?: string;
  accent: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${border} bg-[#111]/80 p-5 backdrop-blur-sm shadow-lg`}
    >
      <div
        className={`absolute top-0 right-0 h-24 w-24 rounded-full ${bg} blur-3xl opacity-30`}
      />
      <div className="relative">
        <div
          className={`inline-flex items-center justify-center rounded-xl p-2.5 ${bg} mb-3`}
        >
          <Icon className={`h-5 w-5 ${accent}`} />
        </div>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
          {label}
        </p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-white">
          {value}
        </p>
        {subtitle && (
          <p className="mt-1 text-[11px] text-white/30">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────

function BookingStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${styles[status] ?? "bg-white/5 text-white/50 border-white/10"}`}
    >
      {status}
    </span>
  );
}

// ─── Loading Skeletons ───────────────────────────────────────────────────────

function KPISkeletons() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/[0.06] bg-[#111]/80 p-5 space-y-3"
        >
          <Skeleton className="h-10 w-10 rounded-xl bg-white/[0.06]" />
          <Skeleton className="h-3 w-20 bg-white/[0.06]" />
          <Skeleton className="h-8 w-28 bg-white/[0.06]" />
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.06] bg-[#111]/80 p-5 ${className}`}
    >
      <Skeleton className="h-4 w-40 mb-4 bg-white/[0.06]" />
      <Skeleton className="h-[250px] w-full rounded-xl bg-white/[0.04]" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#111]/80 p-5 space-y-3">
      <Skeleton className="h-4 w-48 bg-white/[0.06]" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full bg-white/[0.04]" />
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function AdminAnalyticsClient() {
  const [range, setRange] = useState("30d");
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (r: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/analytics?range=${r}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error ?? "Failed to load analytics.");
        return;
      }
      setData(json.data);
    } catch {
      setError("Network error loading analytics.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(range);
  }, [range, fetchData]);

  const rangeLabel: Record<string, string> = {
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    "1y": "Last Year",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header + Range Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Analytics
            </h1>
            <p className="mt-1 text-sm text-white/40">
              Platform-wide performance metrics and trends.
            </p>
          </div>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[180px] bg-black/40 border-white/10 text-white h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#111] border-white/10 text-white">
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* KPI Cards */}
        {isLoading ? (
          <KPISkeletons />
        ) : data ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              icon={DollarSign}
              label="Estimated Revenue"
              value={formatCurrency(data.kpis.estimatedRevenue)}
              subtitle="From confirmed bookings"
              accent="text-emerald-400"
              bg="bg-emerald-500/10"
              border="border-emerald-500/20"
            />
            <KPICard
              icon={CalendarCheck}
              label="Total Bookings"
              value={data.kpis.totalBookings.toLocaleString()}
              subtitle={rangeLabel[range]}
              accent="text-blue-400"
              bg="bg-blue-500/10"
              border="border-blue-500/20"
            />
            <KPICard
              icon={Home}
              label="Active Listings"
              value={data.kpis.activeListings.toLocaleString()}
              subtitle="Status = ACTIVE"
              accent="text-violet-400"
              bg="bg-violet-500/10"
              border="border-violet-500/20"
            />
            <KPICard
              icon={Users}
              label="Active Users"
              value={data.kpis.activeUsers.toLocaleString()}
              subtitle="Booked or saved in range"
              accent="text-cyan-400"
              bg="bg-cyan-500/10"
              border="border-cyan-500/20"
            />
          </div>
        ) : null}

        {/* Revenue & Bookings Charts — side by side on desktop */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Revenue Area Chart */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#111]/80 p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">
                  Estimated Revenue (from confirmed bookings)
                </h3>
              </div>
              {data.revenueByDay.length > 0 ? (
                <ChartContainer
                  config={revenueChartConfig}
                  className="aspect-[16/9] w-full"
                >
                  <AreaChart
                    data={data.revenueByDay}
                    margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="revGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(152, 60%, 52%)"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(152, 60%, 52%)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatDate}
                      stroke="rgba(255,255,255,0.15)"
                      tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                    />
                    <YAxis
                      tickFormatter={(v) => formatCurrency(v)}
                      stroke="rgba(255,255,255,0.15)"
                      tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                      width={60}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(label) => formatDate(String(label))}
                          formatter={(value) => [
                            `₹${Number(value).toLocaleString("en-IN")}`,
                            "Revenue",
                          ]}
                        />
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(152, 60%, 52%)"
                      strokeWidth={2}
                      fill="url(#revGradient)"
                    />
                  </AreaChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-white/20 text-sm">
                  No revenue data for this period
                </div>
              )}
            </div>

            {/* Bookings Line Chart */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#111]/80 p-5">
              <div className="flex items-center gap-2 mb-4">
                <CalendarCheck className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">
                  Booking Requests
                </h3>
              </div>
              {data.bookingsByDay.length > 0 ? (
                <ChartContainer
                  config={bookingsChartConfig}
                  className="aspect-[16/9] w-full"
                >
                  <LineChart
                    data={data.bookingsByDay}
                    margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatDate}
                      stroke="rgba(255,255,255,0.15)"
                      tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.15)"
                      tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                      width={40}
                      allowDecimals={false}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(label) => formatDate(String(label))}
                        />
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(217, 91%, 65%)"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "hsl(217, 91%, 65%)" }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-white/20 text-sm">
                  No booking data for this period
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Booking Status Donut + Revenue by City */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Booking Status Donut */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#111]/80 p-5">
              <h3 className="text-sm font-semibold text-white mb-4">
                Booking Status Distribution
              </h3>
              {data.bookingsByStatus.length > 0 ? (
                <ChartContainer
                  config={donutChartConfig}
                  className="mx-auto aspect-square max-h-[280px]"
                >
                  <PieChart>
                    <Pie
                      data={data.bookingsByStatus}
                      dataKey="count"
                      nameKey="status"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {data.bookingsByStatus.map((entry, idx) => (
                        <Cell
                          key={entry.status}
                          fill={
                            STATUS_COLORS[entry.status] ??
                            DONUT_COLORS[idx % DONUT_COLORS.length]
                          }
                        />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-white/20 text-sm">
                  No bookings in this period
                </div>
              )}
            </div>

            {/* Revenue by City — Horizontal Bar */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#111]/80 p-5">
              <h3 className="text-sm font-semibold text-white mb-4">
                Revenue by City (Top 8)
              </h3>
              {data.revenueByCity.length > 0 ? (
                <ChartContainer
                  config={cityChartConfig}
                  className="aspect-[4/3] w-full"
                >
                  <BarChart
                    data={data.revenueByCity}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tickFormatter={(v) => formatCurrency(v)}
                      stroke="rgba(255,255,255,0.15)"
                      tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="city"
                      stroke="rgba(255,255,255,0.15)"
                      tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                      width={90}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) => [
                            `₹${Number(value).toLocaleString("en-IN")}`,
                            "Revenue",
                          ]}
                        />
                      }
                    />
                    <Bar
                      dataKey="revenue"
                      fill="hsl(262, 83%, 65%)"
                      radius={[0, 6, 6, 0]}
                      barSize={18}
                    />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-white/20 text-sm">
                  No city revenue data
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Top Performing Listings Table */}
        {isLoading ? (
          <TableSkeleton />
        ) : data && data.topListings.length > 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-[#111]/80 overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">
                Top Performing Listings
              </h3>
              <span className="text-xs text-white/30 ml-1">
                Ranked by confirmed bookings
              </span>
            </div>
            <Table>
              <TableHeader className="border-b border-white/[0.06] bg-white/[0.01]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-white/40 w-8">#</TableHead>
                  <TableHead className="text-white/40">Property</TableHead>
                  <TableHead className="text-white/40">City</TableHead>
                  <TableHead className="text-white/40 text-right">
                    Rent
                  </TableHead>
                  <TableHead className="text-white/40 text-center">
                    Bookings
                  </TableHead>
                  <TableHead className="text-white/40 text-center">
                    Rating
                  </TableHead>
                  <TableHead className="text-white/40 text-center">
                    Reviews
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-white/[0.04]">
                {data.topListings.map((listing, idx) => (
                  <TableRow
                    key={listing.id}
                    className="hover:bg-white/[0.02]"
                  >
                    <TableCell className="text-white/30 font-mono text-xs">
                      {idx + 1}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-white truncate max-w-[220px] block">
                        {listing.title}
                      </span>
                    </TableCell>
                    <TableCell className="text-white/70 text-sm">
                      {listing.city}
                    </TableCell>
                    <TableCell className="text-right font-bold text-white/90">
                      ₹{listing.monthlyRent.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-sm">
                        {listing.confirmedBookings}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-1 text-amber-400 text-sm">
                        <Star className="h-3 w-3 fill-amber-400" />
                        {listing.avgRating.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-white/50 text-sm">
                      {listing.reviewCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}

        {/* Recent Bookings Table */}
        {isLoading ? (
          <TableSkeleton />
        ) : data && data.recentBookings.length > 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-[#111]/80 overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">
                Recent Bookings
              </h3>
              <span className="text-xs text-white/30 ml-1">Last 20</span>
            </div>
            <Table>
              <TableHeader className="border-b border-white/[0.06] bg-white/[0.01]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-white/40">Listing</TableHead>
                  <TableHead className="text-white/40">User</TableHead>
                  <TableHead className="text-white/40 text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-white/40 text-right">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-white/[0.04]">
                {data.recentBookings.map((booking) => (
                  <TableRow
                    key={booking.id}
                    className="hover:bg-white/[0.02]"
                  >
                    <TableCell>
                      <span className="font-medium text-white truncate max-w-[250px] block">
                        {booking.listingTitle}
                      </span>
                    </TableCell>
                    <TableCell className="text-white/70 text-sm">
                      {booking.userName ?? "Anonymous"}
                    </TableCell>
                    <TableCell className="text-center">
                      <BookingStatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell className="text-right text-white/40 text-xs">
                      {formatFullDate(booking.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}
      </main>
    </div>
  );
}
