"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  SearchX,
  X,
  Users,
  UserPlus,
  Ban,
  Trash2,
  UserCog,
  Copy,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { StatCard } from "@/components/StatCard";
import EmptyState from "@/components/EmptyState";
import TableSkeleton from "@/components/TableSkeleton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { TeamNav } from "@/components/team/TeamNav";
import { TeamMemberTable, type MemberSortKey, type MemberSortState } from "@/components/team/TeamMemberTable";
import { TeamMemberCards } from "@/components/team/TeamMemberCards";
import { InviteMemberDialog } from "@/components/team/InviteMemberDialog";
import { EditMemberDialog } from "@/components/team/EditMemberDialog";
import { ChangeRoleDialog } from "@/components/team/ChangeRoleDialog";
import { BulkRoleDialog } from "@/components/team/BulkRoleDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { useTeam } from "@/contexts/TeamContext";
import { formatNumber } from "@/lib/format";
import {
  memberStatusLabels,
  getDepartmentOptions,
  type MemberStatus,
  type TeamMember,
} from "@/lib/data/team";

const PAGE_SIZE = 8;
const ALL = "all";

function compare(
  a: TeamMember,
  b: TeamMember,
  roleName: (id: string) => string,
  key: MemberSortKey,
  dir: "asc" | "desc"
): number {
  let res = 0;
  switch (key) {
    case "name":
      res = a.name.localeCompare(b.name);
      break;
    case "role":
      res = roleName(a.roleId).localeCompare(roleName(b.roleId));
      break;
    case "department":
      res = a.department.localeCompare(b.department);
      break;
    case "lastActive":
      res = a.lastActive.localeCompare(b.lastActive);
      break;
    case "joinedAt":
      res = a.joinedAt.localeCompare(b.joinedAt);
      break;
  }
  return dir === "asc" ? res : -res;
}

export default function TeamPage() {
  const {
    members,
    roles,
    summary,
    inviteMember,
    updateMember,
    changeMemberRole,
    suspendMember,
    reactivateMember,
    removeMember,
  } = useTeam();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>(ALL);
  const [role, setRole] = useState<string>(ALL);
  const [sort, setSort] = useState<MemberSortState>({ key: "lastActive", dir: "desc" });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<string | null>(null);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TeamMember | null>(null);
  const [roleTarget, setRoleTarget] = useState<TeamMember | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<TeamMember | null>(null);
  const [reactivateTarget, setReactivateTarget] = useState<TeamMember | null>(null);
  const [removeTarget, setRemoveTarget] = useState<TeamMember | null>(null);
  const [bulkRoleOpen, setBulkRoleOpen] = useState(false);
  const [bulkSuspendOpen, setBulkSuspendOpen] = useState(false);
  const [bulkRemoveOpen, setBulkRemoveOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setPage(1);
    setSelected(new Set());
  }, [search, status, role, sort.key, sort.dir]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  const departments = useMemo(() => getDepartmentOptions(members), [members]);

  const roleName = useMemo(() => {
    const map = new Map(roles.map((r) => [r.id, r.name]));
    return (id: string) => map.get(id) ?? "Unknown role";
  }, [roles]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members
      .filter((m) => {
        if (status !== ALL && m.status !== status) return false;
        if (role !== ALL && m.roleId !== role) return false;
        if (!q) return true;
        return (
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.department.toLowerCase().includes(q) ||
          roleName(m.roleId).toLowerCase().includes(q)
        );
      })
      .sort((a, b) => compare(a, b, roleName, sort.key, sort.dir));
  }, [members, search, status, role, roleName, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const start = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, filtered.length);

  const allSelected = filtered.length > 0 && filtered.every((m) => selected.has(m.id));
  const someSelected = filtered.some((m) => selected.has(m.id));

  const selectedMembers = useMemo(
    () => members.filter((m) => selected.has(m.id)),
    [members, selected]
  );

  const hasFilters = search.trim() !== "" || status !== ALL || role !== ALL;

  function clearFilters() {
    setSearch("");
    setStatus(ALL);
    setRole(ALL);
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        filtered.forEach((m) => next.delete(m.id));
      } else {
        filtered.forEach((m) => {
          const roleObj = roles.find((r) => r.id === m.roleId);
          if (!roleObj?.protected) next.add(m.id);
        });
      }
      return next;
    });
  }

  function handleInvite(input: { name: string; email: string; roleId: string; department: string }) {
    inviteMember(input);
    setNotice(`Invitation sent to ${input.name}.`);
  }

  function handleEditSave(patch: Partial<TeamMember>) {
    if (!editTarget) return;
    updateMember(editTarget.id, patch);
    setNotice(`${editTarget.name}'s profile updated.`);
  }

  function handleChangeRole(roleId: string) {
    if (!roleTarget) return;
    changeMemberRole(roleTarget.id, roleId);
    setNotice(`${roleTarget.name} moved to ${roleName(roleId)}.`);
  }

  function handleSuspend(member: TeamMember) {
    suspendMember(member.id);
    setNotice(`${member.name} suspended.`);
  }

  function handleReactivate(member: TeamMember) {
    reactivateMember(member.id);
    setNotice(`${member.name} reactivated.`);
  }

  function handleRemove(member: TeamMember) {
    removeMember(member.id);
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(member.id);
      return next;
    });
    setNotice(`${member.name} removed from the team.`);
  }

  function handleBulkSuspend() {
    selectedMembers.forEach((m) => suspendMember(m.id));
    setNotice(`${selectedMembers.length} members suspended.`);
    setSelected(new Set());
    setBulkSuspendOpen(false);
  }

  function handleBulkRemove() {
    selectedMembers.forEach((m) => removeMember(m.id));
    setNotice(`${selectedMembers.length} members removed.`);
    setSelected(new Set());
    setBulkRemoveOpen(false);
  }

  function handleBulkChangeRole(roleId: string) {
    selectedMembers.forEach((m) => changeMemberRole(m.id, roleId));
    setNotice(`${selectedMembers.length} members moved to ${roleName(roleId)}.`);
    setSelected(new Set());
    setBulkRoleOpen(false);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Team" }]} />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-14" />
        <TableSkeleton rows={6} cols={7} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Team" }]} />
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="heading-page">Team</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage members, invitations, roles and permissions for your workspace.
            </p>
          </div>
          <Button variant="primary" onClick={() => setInviteOpen(true)} className="shrink-0">
            <UserPlus className="h-4 w-4" aria-hidden />
            Invite member
          </Button>
        </div>
      </div>

      <TeamNav />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Total members" value={formatNumber(summary.totalMembers)} />
        <StatCard label="Active members" value={formatNumber(summary.activeMembers)} />
        <StatCard
          label="Pending invitations"
          value={formatNumber(summary.pendingInvitations)}
          hint={`${formatNumber(summary.invitedMembers)} members awaiting acceptance`}
        />
        <StatCard label="Available roles" value={formatNumber(summary.totalRoles)} />
      </div>

      {notice && <Alert variant="success">{notice}</Alert>}

      <Card>
        <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, department, role…"
              aria-label="Search team members"
              className="pl-9"
            />
          </div>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by member status"
          >
            <option value={ALL}>All statuses</option>
            {(Object.keys(memberStatusLabels) as MemberStatus[]).map((s) => (
              <option key={s} value={s}>
                {memberStatusLabels[s]}
              </option>
            ))}
          </Select>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-label="Filter by role"
          >
            <option value={ALL}>All roles</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-sm text-muted-foreground">
            Showing {formatNumber(members.length)} members ·{" "}
            {hasFilters ? `${formatNumber(filtered.length)} match filters` : "all members"}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {hasFilters && (
              <Button variant="ghost" onClick={clearFilters} className="shrink-0">
                <X className="h-4 w-4" aria-hidden />
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {selected.size > 0 && (
        <Card className="border-primary/40 bg-primary/5">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-foreground">{selected.size} selected</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={() => setBulkRoleOpen(true)}>
                <UserCog className="h-4 w-4" aria-hidden />
                Change role
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setBulkSuspendOpen(true)}>
                <Ban className="h-4 w-4" aria-hidden />
                Suspend
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setBulkRemoveOpen(true)}>
                <Trash2 className="h-4 w-4" aria-hidden />
                Remove
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
                Clear selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No team members yet"
          description="Invite your first team member to start collaborating."
          action={
            <Button variant="primary" onClick={() => setInviteOpen(true)}>
              <Plus className="h-4 w-4" aria-hidden />
              Invite member
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No members found"
          description="Try adjusting your search or filters."
          action={
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <div className="hidden lg:block">
            <Card>
              <TeamMemberTable
                members={pageRows}
                roles={roles}
                selected={selected}
                allSelected={allSelected}
                someSelected={someSelected}
                onToggleSelectAll={toggleSelectAll}
                onToggleSelect={toggleSelect}
                sort={sort}
                onSort={(key) =>
                  setSort((prev) =>
                    prev.key === key
                      ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
                      : { key, dir: "asc" }
                  )
                }
                onEdit={setEditTarget}
                onChangeRole={setRoleTarget}
                onSuspend={setSuspendTarget}
                onReactivate={setReactivateTarget}
                onRemove={setRemoveTarget}
              />
              <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {start}–{end} of {formatNumber(filtered.length)}
                </p>
                <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
              </div>
            </Card>
          </div>

          <div className="lg:hidden">
            <TeamMemberCards
              members={pageRows}
              roles={roles}
              onEdit={setEditTarget}
              onChangeRole={setRoleTarget}
              onSuspend={setSuspendTarget}
              onReactivate={setReactivateTarget}
              onRemove={setRemoveTarget}
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {start}–{end} of {formatNumber(filtered.length)}
              </p>
              <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
            </div>
          </div>
        </>
      )}

      <InviteMemberDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        roles={roles}
        departments={departments}
        onInvite={handleInvite}
      />

      <EditMemberDialog
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        member={editTarget}
        departments={departments}
        onSave={handleEditSave}
      />

      <ChangeRoleDialog
        open={!!roleTarget}
        onClose={() => setRoleTarget(null)}
        member={roleTarget}
        roles={roles}
        onConfirm={handleChangeRole}
      />

      <ConfirmDialog
        open={!!suspendTarget}
        onClose={() => setSuspendTarget(null)}
        title={`Suspend ${suspendTarget?.name ?? "member"}?`}
        description="Suspended members cannot sign in or take actions. You can reactivate them anytime. This is a local demo action."
        confirmLabel="Suspend member"
        destructive
        onConfirm={() => {
          if (suspendTarget) handleSuspend(suspendTarget);
        }}
      />

      <ConfirmDialog
        open={!!reactivateTarget}
        onClose={() => setReactivateTarget(null)}
        title={`Reactivate ${reactivateTarget?.name ?? "member"}?`}
        description="This member will regain access to the workspace immediately. This is a local demo action."
        confirmLabel="Reactivate member"
        onConfirm={() => {
          if (reactivateTarget) handleReactivate(reactivateTarget);
        }}
      />

      <ConfirmDialog
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        title={`Remove ${removeTarget?.name ?? "member"}?`}
        description="This member will lose access to the workspace. Their pending invitation will be cancelled. This is a local demo action."
        confirmLabel="Remove member"
        destructive
        onConfirm={() => {
          if (removeTarget) handleRemove(removeTarget);
        }}
      />

      <BulkRoleDialog
        open={bulkRoleOpen}
        onClose={() => setBulkRoleOpen(false)}
        count={selected.size}
        roles={roles}
        onConfirm={handleBulkChangeRole}
      />

      <ConfirmDialog
        open={bulkSuspendOpen}
        onClose={() => setBulkSuspendOpen(false)}
        title="Suspend selected members"
        description={`Suspend ${selected.size} selected member(s)? They can be reactivated anytime. This is a local demo action.`}
        confirmLabel="Suspend members"
        destructive
        onConfirm={handleBulkSuspend}
      />

      <ConfirmDialog
        open={bulkRemoveOpen}
        onClose={() => setBulkRemoveOpen(false)}
        title="Remove selected members"
        description={`Remove ${selected.size} selected member(s) from the workspace? This is a local demo action.`}
        confirmLabel="Remove members"
        destructive
        onConfirm={handleBulkRemove}
      />

      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        <Copy className="h-3.5 w-3.5" aria-hidden />
        Demo workspace — member changes, invitations and roles are local only and reset on reload.
      </div>
    </div>
  );
}