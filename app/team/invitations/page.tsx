"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SearchX, X, Mail, Send, Copy } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import TableSkeleton from "@/components/TableSkeleton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { TeamNav } from "@/components/team/TeamNav";
import { InvitationTable } from "@/components/team/InvitationTable";
import { InvitationCards } from "@/components/team/InvitationCards";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { useTeam } from "@/contexts/TeamContext";
import { formatNumber } from "@/lib/format";
import { invitationStatusLabels, type InvitationStatus } from "@/lib/data/team";

const ALL = "all";

export default function InvitationsPage() {
  const { invitations, members, roles, resendInvitation, cancelInvitation } = useTeam();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>(ALL);
  const [cancelTarget, setCancelTarget] = useState<{ id: string; name: string } | null>(null);
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

  const counts = useMemo(() => {
    const pending = invitations.filter((i) => i.status === "pending").length;
    const expired = invitations.filter((i) => i.status === "expired").length;
    const cancelled = invitations.filter((i) => i.status === "cancelled").length;
    return { pending, expired, cancelled };
  }, [invitations]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return invitations
      .filter((i) => {
        if (status !== ALL && i.status !== status) return false;
        if (!q) return true;
        return (
          i.name.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt));
  }, [invitations, search, status]);

  const hasFilters = search.trim() !== "" || status !== ALL;

  function clearFilters() {
    setSearch("");
    setStatus(ALL);
  }

  function handleResend(id: string) {
    const updated = resendInvitation(id);
    setNotice(updated ? `Invitation resent to ${updated.name}.` : "Invitation not found.");
  }

  function handleCancel() {
    if (!cancelTarget) return;
    cancelInvitation(cancelTarget.id);
    setNotice(`Invitation to ${cancelTarget.name} cancelled.`);
    setCancelTarget(null);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Team", href: "/team" }, { label: "Invitations" }]} />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-14" />
        <TableSkeleton rows={5} cols={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Team", href: "/team" }, { label: "Invitations" }]} />
        <div className="mt-2">
          <h1 className="heading-page">Invitations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track pending invitations and manage who has been asked to join your workspace.
          </p>
        </div>
      </div>

      <TeamNav />

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5" aria-hidden />
            Pending
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">{formatNumber(counts.pending)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Expired</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{formatNumber(counts.expired)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Cancelled</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{formatNumber(counts.cancelled)}</p>
        </Card>
      </div>

      {notice && <Alert variant="success">{notice}</Alert>}

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invitee or email…"
              aria-label="Search invitations"
              className="pl-9"
            />
          </div>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by invitation status"
            className="sm:w-44"
          >
            <option value={ALL}>All statuses</option>
            {(Object.keys(invitationStatusLabels) as InvitationStatus[]).map((s) => (
              <option key={s} value={s}>
                {invitationStatusLabels[s]}
              </option>
            ))}
          </Select>
          {hasFilters && (
            <Button variant="ghost" onClick={clearFilters} className="shrink-0">
              <X className="h-4 w-4" aria-hidden />
              Clear filters
            </Button>
          )}
        </CardContent>
      </Card>

      {invitations.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No invitations yet"
          description="Invite team members to start building your workspace."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No invitations found"
          description="Try adjusting your search or filters."
          action={
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <div className="hidden md:block">
            <Card>
              <InvitationTable
                invitations={filtered}
                roles={roles}
                members={members}
                onResend={(i) => handleResend(i.id)}
                onCancel={(i) => setCancelTarget({ id: i.id, name: i.name })}
              />
              <p className="border-t border-border p-4 text-sm text-muted-foreground">
                Showing {filtered.length} invitation{filtered.length === 1 ? "" : "s"}
              </p>
            </Card>
          </div>
          <div className="md:hidden">
            <InvitationCards
              invitations={filtered}
              roles={roles}
              members={members}
              onResend={(i) => handleResend(i.id)}
              onCancel={(i) => setCancelTarget({ id: i.id, name: i.name })}
            />
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title={`Cancel invitation to ${cancelTarget?.name ?? "member"}?`}
        description="The invitation will be revoked and the member will not be added to the workspace. This is a local demo action."
        confirmLabel="Cancel invitation"
        destructive
        onConfirm={handleCancel}
      />

      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        <Copy className="h-3.5 w-3.5" aria-hidden />
        Demo workspace — resending or cancelling invitations is local only and resets on reload.
      </div>
    </div>
  );
}