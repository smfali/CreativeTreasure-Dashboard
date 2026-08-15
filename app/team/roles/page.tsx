"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ShieldCheck, Copy } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { TeamNav } from "@/components/team/TeamNav";
import { RoleCard } from "@/components/team/RoleCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { useTeam } from "@/contexts/TeamContext";
import { roleMemberCount, type Role } from "@/lib/data/team";

export default function RolesPage() {
  const { roles, members, deleteRole, duplicateRole } = useTeam();

  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [blockedTarget, setBlockedTarget] = useState<Role | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  function handleDelete() {
    if (!deleteTarget) return;
    deleteRole(deleteTarget.id);
    setNotice(`${deleteTarget.name} role deleted.`);
    setDeleteTarget(null);
  }

  function handleDuplicate(role: Role) {
    const copy = duplicateRole(role.id);
    if (copy) setNotice(`${copy.name} created from ${role.name}.`);
  }

  function requestDelete(role: Role) {
    if (role.protected) {
      setBlockedTarget(role);
      return;
    }
    const count = roleMemberCount(role.id, members);
    if (count > 0) {
      setBlockedTarget(role);
      return;
    }
    setDeleteTarget(role);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Team", href: "/team" }, { label: "Roles" }]} />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Team", href: "/team" }, { label: "Roles" }]} />
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="heading-page">Roles</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Define roles and permission levels for your workspace.
            </p>
          </div>
          <Link href="/team/roles/new">
            <Button variant="primary" className="shrink-0">
              <Plus className="h-4 w-4" aria-hidden />
              Create role
            </Button>
          </Link>
        </div>
      </div>

      <TeamNav />

      {notice && <Alert variant="success">{notice}</Alert>}

      {roles.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No roles yet"
          description="Create your first role to start assigning permissions."
          action={
            <Link href="/team/roles/new">
              <Button variant="primary">Create role</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              memberCount={roleMemberCount(role.id, members)}
              onDuplicate={handleDuplicate}
              onDelete={requestDelete}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        <Copy className="h-3.5 w-3.5" aria-hidden />
        Demo workspace — roles and permissions are local only and reset on reload.
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.name ?? "role"}?`}
        description={`Delete the ${deleteTarget?.name ?? ""} role? Members with this role will be unassigned. This is a local demo action.`}
        confirmLabel="Delete role"
        destructive
        onConfirm={handleDelete}
      />

      <ConfirmDialog
        open={!!blockedTarget}
        onClose={() => setBlockedTarget(null)}
        title={`Cannot delete ${blockedTarget?.name ?? "this role"}`}
        description={
          blockedTarget?.protected
            ? "This role is protected and cannot be deleted."
            : "This role is assigned to one or more members. Reassign those members first."
        }
        confirmLabel="Got it"
        onConfirm={() => setBlockedTarget(null)}
        cancelLabel="Close"
      />
    </div>
  );
}