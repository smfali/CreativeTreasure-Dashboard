"use client";

import Link from "next/link";
import { Users, Pencil, Copy, Trash2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PermissionSummary } from "./PermissionSummary";
import { formatDate } from "@/lib/format";
import type { Role } from "@/lib/data/team";

interface RoleCardProps {
  role: Role;
  memberCount: number;
  onDuplicate: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export function RoleCard({ role, memberCount, onDuplicate, onDelete }: RoleCardProps) {
  const deletable = !role.protected && memberCount === 0;

  return (
    <Card className="flex flex-col p-5 transition-colors hover:border-primary/50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{role.name}</h3>
            {role.protected && (
              <Badge variant="outline" className="gap-1">
                <Lock className="h-3 w-3" aria-hidden />
                Protected
              </Badge>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{role.description}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Users className="h-3.5 w-3.5" aria-hidden />
          {memberCount} member{memberCount === 1 ? "" : "s"}
        </span>
        <span>Created {formatDate(role.createdAt)}</span>
      </div>

      <div className="mt-4">
        <PermissionSummary keys={role.permissions} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
        <Link href={`/team/roles/${role.id}`}>
          <Button variant="secondary" size="sm">
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            Edit
          </Button>
        </Link>
        <Button variant="secondary" size="sm" onClick={() => onDuplicate(role)}>
          <Copy className="h-3.5 w-3.5" aria-hidden />
          Duplicate
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(role)}
          className={deletable ? "text-destructive hover:text-destructive" : "text-muted-foreground hover:text-muted-foreground"}
          title={
            role.protected
              ? "This role is protected and cannot be deleted."
              : memberCount > 0
                ? "Reassign members before deleting this role."
                : "Delete role"
          }
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
          Delete
        </Button>
      </div>
    </Card>
  );
}