"use client";

import { useState, useCallback, useTransition } from "react";
import {
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  ShieldCheck,
  UserX,
  UserCheck,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PaginationBar } from "@/components/admin/pagination-bar";
import {
  RoleBadge,
  AccountStatusBadge,
  VerificationBadge,
} from "@/components/admin/status-badge";
import type { AdminUserDTO, PaginatedResponse, PatchUserPayload } from "@/types/admin";
import type { Role, AccountStatus } from "@prisma/client";

// ─── Dropdown Menu ─────────────────────────────────────────────────────────────

function ActionMenu({
  user,
  onView,
  onEdit,
  onChangeRole,
  onSuspend,
  onActivate,
  onDelete,
}: {
  user: AdminUserDTO;
  onView: () => void;
  onEdit: () => void;
  onChangeRole: () => void;
  onSuspend: () => void;
  onActivate: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  const items = [
    { icon: Eye, label: "View Details", action: onView },
    { icon: Pencil, label: "Edit", action: onEdit },
    { icon: ShieldCheck, label: "Change Role", action: onChangeRole },
    ...(user.accountStatus === "ACTIVE"
      ? [{ icon: UserX, label: "Suspend", action: onSuspend, danger: true }]
      : [{ icon: UserCheck, label: "Activate", action: onActivate }]),
    { icon: Trash2, label: "Delete", action: onDelete, danger: true },
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon-sm"
        className="h-7 w-7 text-white/40 hover:text-white hover:bg-white/[0.06]"
        onClick={() => setOpen((v) => !v)}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-8 z-20 w-44 rounded-xl border border-white/[0.08] bg-[#1a1a1a] py-1 shadow-xl shadow-black/40">
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setOpen(false);
                  item.action();
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
                  item.danger
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── View Dialog ───────────────────────────────────────────────────────────────

function ViewUserDialog({
  user,
  open,
  onOpenChange,
}: {
  user: AdminUserDTO | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  if (!user) return null;
  const rows: [string, React.ReactNode][] = [
    ["ID", <span key="id" className="font-mono text-xs text-white/60">{user.id}</span>],
    ["Name", user.name ?? <span className="text-white/30 italic">No name</span>],
    ["Email", user.email],
    ["Role", <RoleBadge key="role" role={user.role} />],
    ["Account Status", <AccountStatusBadge key="as" status={user.accountStatus} />],
    ["Email Verified", <VerificationBadge key="ev" verified={!!user.emailVerified} />],
    ["Listings", user._count.listings],
    ["Reviews", user._count.reviews],
    ["Joined", new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })],
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111] border-white/[0.08] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">User Details</DialogTitle>
        </DialogHeader>
        <div className="rounded-xl border border-white/[0.06] overflow-hidden">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 px-4 py-3 border-b border-white/[0.04] last:border-0"
            >
              <span className="text-xs text-white/40 shrink-0">{label}</span>
              <span className="text-xs text-white text-right">{value}</span>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            className="text-white/60 hover:text-white hover:bg-white/5"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit Dialog ───────────────────────────────────────────────────────────────

function EditUserDialog({
  user,
  open,
  onOpenChange,
  onSave,
}: {
  user: AdminUserDTO | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (id: string, payload: PatchUserPayload) => Promise<void>;
}) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saving, setSaving] = useState(false);

  // Sync when user changes
  const handleOpen = (v: boolean) => {
    if (v && user) {
      setName(user.name ?? "");
      setEmail(user.email);
    }
    onOpenChange(v);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="bg-[#111] border-white/[0.08] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Edit User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-white/50">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20"
              placeholder="User's name"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-white/50">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20"
              placeholder="user@example.com"
              type="email"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            className="text-white/60 hover:text-white hover:bg-white/5"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20"
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              await onSave(user.id, { name, email });
              setSaving(false);
              onOpenChange(false);
            }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Change Role Dialog ────────────────────────────────────────────────────────

function ChangeRoleDialog({
  user,
  open,
  onOpenChange,
  onSave,
}: {
  user: AdminUserDTO | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (id: string, payload: PatchUserPayload) => Promise<void>;
}) {
  const [role, setRole] = useState<Role>(user?.role ?? "USER");
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111] border-white/[0.08] text-white sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white">Change Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5">
          <label className="text-xs text-white/50">Role</label>
          <Select
            value={role}
            onValueChange={(v) => setRole(v as Role)}
          >
            <SelectTrigger className="w-full bg-white/[0.04] border-white/[0.08] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/[0.08] text-white">
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="OWNER">Owner</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            className="text-white/60 hover:text-white hover:bg-white/5"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            className="bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20"
            disabled={saving || role === user.role}
            onClick={async () => {
              setSaving(true);
              await onSave(user.id, { role });
              setSaving(false);
              onOpenChange(false);
            }}
          >
            {saving ? "Saving…" : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.06] mb-4">
        <Users className="h-7 w-7 text-white/20" />
      </div>
      <p className="text-sm font-medium text-white/50">
        {hasFilters ? "No users match your filters" : "No users found"}
      </p>
      <p className="mt-1 text-xs text-white/30">
        {hasFilters
          ? "Try adjusting your search or filter criteria."
          : "Users will appear here once they register."}
      </p>
    </div>
  );
}

// ─── Main Client Component ─────────────────────────────────────────────────────

interface UsersClientProps {
  initialData: PaginatedResponse<AdminUserDTO>;
  initialSearch: string;
  initialRole: string;
  initialStatus: string;
}

function UsersClientInner({
  initialData,
  initialSearch,
  initialRole,
  initialStatus,
}: UsersClientProps) {
  const { toast } = useToast();
  const [, startTransition] = useTransition();

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState(initialSearch);
  const [role, setRole] = useState(initialRole);
  const [status, setStatus] = useState(initialStatus);
  const [page, setPage] = useState(initialData.page);

  // Dialogs
  const [viewUser, setViewUser] = useState<AdminUserDTO | null>(null);
  const [editUser, setEditUser] = useState<AdminUserDTO | null>(null);
  const [roleUser, setRoleUser] = useState<AdminUserDTO | null>(null);
  const [confirmSuspend, setConfirmSuspend] = useState<AdminUserDTO | null>(null);
  const [confirmActivate, setConfirmActivate] = useState<AdminUserDTO | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminUserDTO | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(
    async (opts: { search?: string; role?: string; status?: string; page?: number }) => {
      setLoading(true);
      try {
        const p = new URLSearchParams();
        if (opts.search) p.set("search", opts.search);
        if (opts.role && opts.role !== "ALL") p.set("role", opts.role);
        if (opts.status && opts.status !== "ALL") p.set("accountStatus", opts.status);
        if (opts.page && opts.page > 1) p.set("page", String(opts.page));

        const res = await fetch(`/api/admin/users?${p.toString()}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          toast("Failed to load users.", "error");
        }
      } catch {
        toast("Network error.", "error");
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  // ── Filter/Search ─────────────────────────────────────────────────────────────
  const applyFilters = (newSearch: string, newRole: string, newStatus: string, newPage = 1) => {
    setSearch(newSearch);
    setRole(newRole);
    setStatus(newStatus);
    setPage(newPage);
    startTransition(() => {
      fetchUsers({ search: newSearch, role: newRole, status: newStatus, page: newPage });
    });
  };

  // ── Patch helper ──────────────────────────────────────────────────────────────
  const patchUser = async (id: string, payload: PatchUserPayload): Promise<boolean> => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.success) {
      // Optimistically update local state
      setData((prev) => ({
        ...prev,
        data: prev.data.map((u) =>
          u.id === id ? { ...u, ...payload } : u
        ),
      }));
      return true;
    }
    toast(json.error ?? "Action failed.", "error");
    return false;
  };

  // ── Actions ───────────────────────────────────────────────────────────────────
  const handleEdit = async (id: string, payload: PatchUserPayload) => {
    const ok = await patchUser(id, payload);
    if (ok) toast("User updated successfully.", "success");
  };

  const handleRoleChange = async (id: string, payload: PatchUserPayload) => {
    const ok = await patchUser(id, payload);
    if (ok) toast("Role updated successfully.", "success");
  };

  const handleSuspend = async () => {
    if (!confirmSuspend) return;
    setActionLoading(true);
    const ok = await patchUser(confirmSuspend.id, { accountStatus: "SUSPENDED" as AccountStatus });
    if (ok) toast("Account suspended.", "success");
    setConfirmSuspend(null);
    setActionLoading(false);
  };

  const handleActivate = async () => {
    if (!confirmActivate) return;
    setActionLoading(true);
    const ok = await patchUser(confirmActivate.id, { accountStatus: "ACTIVE" as AccountStatus });
    if (ok) toast("Account activated.", "success");
    setConfirmActivate(null);
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setActionLoading(true);
    const res = await fetch(`/api/admin/users/${confirmDelete.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      setData((prev) => ({
        ...prev,
        data: prev.data.filter((u) => u.id !== confirmDelete.id),
        total: prev.total - 1,
      }));
      toast("User deleted.", "success");
    } else {
      toast(json.error ?? "Delete failed.", "error");
    }
    setConfirmDelete(null);
    setActionLoading(false);
  };

  const hasFilters = search !== "" || role !== "ALL" || status !== "ALL";

  return (
    <>
      {/* ── Toolbar ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Search by name, email, or ID…"
              value={search}
              onChange={(e) => applyFilters(e.target.value, role, status)}
              className="pl-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30"
            />
          </div>

          {/* Role filter */}
          <Select value={role} onValueChange={(v) => applyFilters(search, v, status)}>
            <SelectTrigger className="w-full sm:w-36 bg-white/[0.04] border-white/[0.08] text-white">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/[0.08] text-white">
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="OWNER">Owner</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select value={status} onValueChange={(v) => applyFilters(search, role, v)}>
            <SelectTrigger className="w-full sm:w-40 bg-white/[0.04] border-white/[0.08] text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/[0.08] text-white">
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
              <SelectItem value="BANNED">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#111] overflow-hidden">
        {loading ? (
          <div className="divide-y divide-white/[0.04]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="h-8 w-8 rounded-full bg-white/[0.05] animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 bg-white/[0.05] rounded animate-pulse" />
                  <div className="h-2.5 w-48 bg-white/[0.04] rounded animate-pulse" />
                </div>
                <div className="h-5 w-16 bg-white/[0.05] rounded-full animate-pulse" />
                <div className="h-5 w-16 bg-white/[0.05] rounded-full animate-pulse" />
                <div className="h-5 w-14 bg-white/[0.04] rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : data.data.length === 0 ? (
          <EmptyState hasFilters={hasFilters} />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["User", "Role", "Account Status", "Verified", "Joined", ""].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-xs font-medium text-white/30 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {data.data.map((u) => (
                    <tr
                      key={u.id}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-xs font-semibold text-white/70">
                            {(u.name?.[0] ?? u.email[0]).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate max-w-[180px]">
                              {u.name ?? <span className="text-white/30 italic">No name</span>}
                            </p>
                            <p className="text-xs text-white/40 truncate max-w-[180px]">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Role */}
                      <td className="px-5 py-4">
                        <RoleBadge role={u.role} />
                      </td>
                      {/* Account Status */}
                      <td className="px-5 py-4">
                        <AccountStatusBadge status={u.accountStatus} />
                      </td>
                      {/* Verified */}
                      <td className="px-5 py-4">
                        <VerificationBadge verified={!!u.emailVerified} />
                      </td>
                      {/* Joined */}
                      <td className="px-5 py-4">
                        <span className="text-xs text-white/50">
                          {new Date(u.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <ActionMenu
                          user={u}
                          onView={() => setViewUser(u)}
                          onEdit={() => setEditUser(u)}
                          onChangeRole={() => setRoleUser(u)}
                          onSuspend={() => setConfirmSuspend(u)}
                          onActivate={() => setConfirmActivate(u)}
                          onDelete={() => setConfirmDelete(u)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-white/[0.04]">
              {data.data.map((u) => (
                <div key={u.id} className="px-4 py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-xs font-semibold text-white/70">
                        {(u.name?.[0] ?? u.email[0]).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {u.name ?? <span className="text-white/30 italic">No name</span>}
                        </p>
                        <p className="text-xs text-white/40">{u.email}</p>
                      </div>
                    </div>
                    <ActionMenu
                      user={u}
                      onView={() => setViewUser(u)}
                      onEdit={() => setEditUser(u)}
                      onChangeRole={() => setRoleUser(u)}
                      onSuspend={() => setConfirmSuspend(u)}
                      onActivate={() => setConfirmActivate(u)}
                      onDelete={() => setConfirmDelete(u)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-10">
                    <RoleBadge role={u.role} />
                    <AccountStatusBadge status={u.accountStatus} />
                    <VerificationBadge verified={!!u.emailVerified} />
                    <span className="text-[10px] text-white/30 self-center">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {data.data.length > 0 && (
          <div className="px-5 pb-5">
            <PaginationBar
              page={page}
              totalPages={data.totalPages}
              total={data.total}
              pageSize={data.pageSize}
              onPageChange={(p) => applyFilters(search, role, status, p)}
            />
          </div>
        )}
      </div>

      {/* ── Dialogs ───────────────────────────────────────────────────────────── */}
      <ViewUserDialog
        user={viewUser}
        open={!!viewUser}
        onOpenChange={(v) => !v && setViewUser(null)}
      />

      <EditUserDialog
        user={editUser}
        open={!!editUser}
        onOpenChange={(v) => !v && setEditUser(null)}
        onSave={handleEdit}
      />

      <ChangeRoleDialog
        user={roleUser}
        open={!!roleUser}
        onOpenChange={(v) => !v && setRoleUser(null)}
        onSave={handleRoleChange}
      />

      <ConfirmDialog
        open={!!confirmSuspend}
        onOpenChange={(v) => !v && setConfirmSuspend(null)}
        title="Suspend Account"
        description={`This will suspend ${confirmSuspend?.name ?? confirmSuspend?.email}'s account. They will not be able to log in.`}
        confirmLabel="Suspend"
        variant="warning"
        loading={actionLoading}
        onConfirm={handleSuspend}
      />

      <ConfirmDialog
        open={!!confirmActivate}
        onOpenChange={(v) => !v && setConfirmActivate(null)}
        title="Activate Account"
        description={`This will restore access for ${confirmActivate?.name ?? confirmActivate?.email}.`}
        confirmLabel="Activate"
        variant="warning"
        loading={actionLoading}
        onConfirm={handleActivate}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(v) => !v && setConfirmDelete(null)}
        title="Delete User"
        description={`This will permanently delete ${confirmDelete?.name ?? confirmDelete?.email} and all their data. This cannot be undone.`}
        confirmLabel="Delete Permanently"
        variant="destructive"
        loading={actionLoading}
        onConfirm={handleDelete}
      />
    </>
  );
}

// Wrap with ToastProvider
export function UsersClient(props: UsersClientProps) {
  return (
    <ToastProvider>
      <UsersClientInner {...props} />
    </ToastProvider>
  );
}
