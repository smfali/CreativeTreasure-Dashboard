"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  UserCog,
  Ban,
  UserCheck,
  Trash2,
  SearchX,
  Mail,
  MapPin,
  Phone,
  Building2,
  CalendarDays,
  Activity as ActivityIcon,
  ShieldCheck,
  Copy,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { MemberStatusBadge } from "@/components/team/MemberStatusBadge";
import { RoleBadge } from "@/components/team/RoleBadge";
import { TeamActivityTimeline } from "@/components/team/TeamActivityTimeline";
import { PermissionGroupsReadonly } from "@/components/team/PermissionGroupsReadonly";
import { EditMemberDialog } from "@/components/team/EditMemberDialog";
import { ChangeRoleDialog } from "@/components/team/ChangeRoleDialog";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTeam } from "@/contexts/TeamContext";
import { formatDate } from "@/lib/format";
import { getMemberActivity, getDepartmentOptions, permissionGroups, type TeamMember } from "@/lib/data/team";

function InfoRow({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Mail }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {label}
      </dt>
      <dd className="break-all text-right text-sm font-medium text-foreground">{value || "—"}</dd>
    </div>
  );
}

export default function MemberDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const {
    members,
    roles,
    getMember,
    updateMember,
    changeMemberRole,
    suspendMember,
    reactivateMember,
    removeMember,
  } = useTeam();

  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [reactivateOpen, setReactivateOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const member = id ? getMember(id) : undefined;
  const role = member ? roles.find((r) => r.id === member.roleId) : undefined;
  const isOwner = role?.protected;

  const activity = useMemo(() => (member ? getMemberActivity(member) : []), [member]);
  const departments = useMemo(() => getDepartmentOptions(members), [members]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-8 w-52" />
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-72" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-56" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="p-4 sm:p-8">
        <EmptyState
          icon={SearchX}
          title="Member not found"
          description="This member may have been removed from the team."
          action={
            <Link href="/team">
              <Button variant="secondary">Back to team</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const grantedKeys = role?.permissions ?? [];
  const current = member;

  function handleEditSave(patch: Partial<TeamMember>) {
    updateMember(current.id, patch);
    setNotice("Profile updated.");
  }

  function handleChangeRole(roleId: string) {
    changeMemberRole(current.id, roleId);
    setNotice(`Role changed.`);
  }

  function handleCopyEmail() {
    navigator.clipboard?.writeText(current.email).catch(() => {});
    setNotice(`Copied ${current.email} to clipboard.`);
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Team", href: "/team" }, { label: member.name }]} />
        <Link
          href="/team"
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to team
        </Link>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={member.name} className="h-14 w-14 text-lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="heading-page mb-0 text-xl sm:text-2xl">{member.name}</h1>
                <MemberStatusBadge status={member.status} />
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{member.email}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <RoleBadge role={role} />
                <Badge variant="outline">{member.department}</Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" aria-hidden />
              Edit member
            </Button>
            <Button variant="secondary" onClick={() => setRoleOpen(true)} disabled={isOwner}>
              <UserCog className="h-4 w-4" aria-hidden />
              Change role
            </Button>
            {member.status === "suspended" ? (
              <Button variant="secondary" onClick={() => setReactivateOpen(true)} disabled={isOwner}>
                <UserCheck className="h-4 w-4" aria-hidden />
                Reactivate
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => setSuspendOpen(true)} disabled={isOwner}>
                <Ban className="h-4 w-4" aria-hidden />
                Suspend
              </Button>
            )}
            <Button variant="destructive" onClick={() => setRemoveOpen(true)} disabled={isOwner}>
              <Trash2 className="h-4 w-4" aria-hidden />
              Remove
            </Button>
          </div>
        </CardContent>
      </Card>

      {notice && <Alert variant="success">{notice}</Alert>}

      {member.status === "suspended" && (
        <Alert variant="warning">
          This member is suspended and cannot sign in or take actions. Reactivate them to restore access.
        </Alert>
      )}

      {isOwner && (
        <Alert variant="info">
          This is the workspace owner. Owner membership is protected and cannot be suspended, removed or reassigned.
        </Alert>
      )}

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">
            Activity
            <span className="ml-1.5 rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
              {activity.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <TeamActivityTimeline activities={activity.slice(0, 6)} members={members} />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="divide-y divide-border">
                    <InfoRow label="Email" value={member.email} icon={Mail} />
                    <InfoRow label="Phone" value={member.phone ?? "—"} icon={Phone} />
                    <InfoRow label="Location" value={member.location ?? "—"} icon={MapPin} />
                    <InfoRow label="Department" value={member.department} icon={Building2} />
                    <InfoRow label="Joined" value={formatDate(member.joinedAt)} icon={CalendarDays} />
                  </dl>
                  <Button variant="secondary" size="sm" onClick={handleCopyEmail} className="mt-3 w-full">
                    <Copy className="h-3.5 w-3.5" aria-hidden />
                    Copy email
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Last active</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="flex items-center gap-2 text-sm text-foreground">
                    <ActivityIcon className="h-4 w-4 text-muted-foreground" aria-hidden />
                    {formatDate(member.lastActive)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity history</CardTitle>
            </CardHeader>
            <CardContent>
              <TeamActivityTimeline activities={activity} members={members} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Effective permissions</CardTitle>
              <p className="text-sm text-muted-foreground">
                {member.name} inherits permissions from the <span className="font-medium text-foreground">{role?.name ?? "Unknown"}</span> role
                ({grantedKeys.length} of{" "}
                {permissionGroups.reduce((sum, g) => sum + g.permissions.length, 0)} permissions).
              </p>
            </CardHeader>
            <CardContent>
              <PermissionGroupsReadonly keys={grantedKeys} />
              <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                Permissions are resolved from the assigned role. This is a local demo — no real authorization is enforced.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EditMemberDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        member={member}
        departments={departments}
        onSave={handleEditSave}
      />

      <ChangeRoleDialog
        open={roleOpen}
        onClose={() => setRoleOpen(false)}
        member={member}
        roles={roles}
        onConfirm={handleChangeRole}
      />

      <ConfirmDialog
        open={suspendOpen}
        onClose={() => setSuspendOpen(false)}
        title={`Suspend ${member.name}?`}
        description="Suspended members cannot sign in or take actions. You can reactivate them anytime. This is a local demo action."
        confirmLabel="Suspend member"
        destructive
        onConfirm={() => {
          suspendMember(member.id);
          setNotice(`${member.name} suspended.`);
        }}
      />

      <ConfirmDialog
        open={reactivateOpen}
        onClose={() => setReactivateOpen(false)}
        title={`Reactivate ${member.name}?`}
        description="This member will regain access to the workspace immediately. This is a local demo action."
        confirmLabel="Reactivate member"
        onConfirm={() => {
          reactivateMember(member.id);
          setNotice(`${member.name} reactivated.`);
        }}
      />

      <ConfirmDialog
        open={removeOpen}
        onClose={() => setRemoveOpen(false)}
        title={`Remove ${member.name}?`}
        description="This member will lose access to the workspace. Their pending invitation will be cancelled. This is a local demo action."
        confirmLabel="Remove member"
        destructive
        onConfirm={() => {
          removeMember(member.id);
          setNotice(`${member.name} removed from the team.`);
        }}
      />
    </div>
  );
}