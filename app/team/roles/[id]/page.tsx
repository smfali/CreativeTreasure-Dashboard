"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Lock, SearchX, Users, ShieldCheck, Copy } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import { RoleForm } from "@/components/team/RoleForm";
import { PermissionGroupsReadonly } from "@/components/team/PermissionGroupsReadonly";
import { PermissionSummary } from "@/components/team/PermissionSummary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeam } from "@/contexts/TeamContext";
import { formatDate } from "@/lib/format";
import { roleMemberCount } from "@/lib/data/team";

export default function RoleEditorPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const isNew = id === "new";

  const { roles, members, createRole, updateRole } = useTeam();

  const [loading, setLoading] = useState(true);

  const role = isNew ? undefined : roles.find((r) => r.id === id);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!isNew && !role) {
    return (
      <div className="p-4 sm:p-8">
        <EmptyState
          icon={SearchX}
          title="Role not found"
          description="This role may have been deleted."
          action={
            <Link href="/team/roles">
              <Button variant="secondary">Back to roles</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const memberCount = role ? roleMemberCount(role.id, members) : 0;

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb
          segments={[
            { label: "Home" },
            { label: "Team", href: "/team" },
            { label: "Roles", href: "/team/roles" },
            { label: isNew ? "New role" : role?.name ?? "Role" },
          ]}
        />
        <Link
          href="/team/roles"
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to roles
        </Link>
      </div>

      <div>
        <h1 className="heading-page">{isNew ? "New role" : `Edit ${role?.name}`}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isNew
            ? "Define a role with the permissions you want to grant. Local demo only."
            : "Update this role's details and permissions. Local demo only."}
        </p>
      </div>

      {role?.protected ? (
        <div className="space-y-6">
          <Alert variant="info">
            <span className="inline-flex items-center gap-2">
              <Lock className="h-4 w-4" aria-hidden />
              The {role.name} role is protected and cannot be edited or deleted.
            </span>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>{role.name}</CardTitle>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-border text-sm">
                <div className="flex items-start justify-between gap-4 py-2.5">
                  <dt className="shrink-0 text-muted-foreground">Status</dt>
                  <dd className="flex items-center gap-1.5 font-medium text-foreground">
                    <Badge variant="outline" className="gap-1">
                      <Lock className="h-3 w-3" aria-hidden />
                      Protected
                    </Badge>
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-2.5">
                  <dt className="shrink-0 text-muted-foreground">Members</dt>
                  <dd className="flex items-center gap-1.5 font-medium text-foreground">
                    <Users className="h-3.5 w-3.5" aria-hidden />
                    {memberCount}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-2.5">
                  <dt className="shrink-0 text-muted-foreground">Created</dt>
                  <dd className="font-medium text-foreground">{formatDate(role.createdAt)}</dd>
                </div>
              </dl>
              <div className="mt-4">
                <PermissionSummary keys={role.permissions} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <PermissionGroupsReadonly keys={role.permissions} />
            </CardContent>
          </Card>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
            <Copy className="h-3.5 w-3.5" aria-hidden />
            Demo workspace — roles and permissions are local only and reset on reload.
          </div>
        </div>
      ) : (
        <RoleForm
          mode={isNew ? "create" : "edit"}
          initial={role}
          onSubmit={(input) => {
            if (isNew) {
              const created = createRole(input);
              return created;
            }
            if (role) {
              updateRole(role.id, input);
              return { ...role, ...input };
            }
            return null;
          }}
        />
      )}

      {!role?.protected && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          Demo workspace — roles and permissions are local only and reset on reload.
        </div>
      )}
    </div>
  );
}