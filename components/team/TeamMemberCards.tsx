"use client";

import Link from "next/link";
import { Pencil, UserCog, Ban, UserCheck, Trash2, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MemberStatusBadge } from "./MemberStatusBadge";
import { RoleBadge } from "./RoleBadge";
import { formatDate, timeAgo } from "@/lib/format";
import type { Role, TeamMember } from "@/lib/data/team";

interface TeamMemberCardsProps {
  members: TeamMember[];
  roles: Role[];
  onEdit: (member: TeamMember) => void;
  onChangeRole: (member: TeamMember) => void;
  onSuspend: (member: TeamMember) => void;
  onReactivate: (member: TeamMember) => void;
  onRemove: (member: TeamMember) => void;
}

export function TeamMemberCards({
  members,
  roles,
  onEdit,
  onChangeRole,
  onSuspend,
  onReactivate,
  onRemove,
}: TeamMemberCardsProps) {
  return (
    <ul className="space-y-3">
      {members.map((member) => {
        const role = roles.find((r) => r.id === member.roleId);
        const isOwner = role?.protected;
        return (
          <li key={member.id}>
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <Avatar name={member.name} className="h-11 w-11 text-sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/team/members/${member.id}`}
                      className="truncate text-sm font-semibold text-foreground hover:text-primary"
                    >
                      {member.name}
                    </Link>
                    <MemberStatusBadge status={member.status} />
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <RoleBadge role={role} />
                    <span className="text-xs text-muted-foreground">{member.department}</span>
                  </div>
                </div>
                <Link
                  href={`/team/members/${member.id}`}
                  aria-label={`View ${member.name}`}
                  className="mt-1 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>

              <dl className="mt-3 flex gap-6 border-t border-border pt-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Last active</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{timeAgo(member.lastActive)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Joined</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{formatDate(member.joinedAt)}</dd>
                </div>
              </dl>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => onEdit(member)}>
                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                  Edit
                </Button>
                <Button variant="secondary" size="sm" onClick={() => onChangeRole(member)} disabled={isOwner}>
                  <UserCog className="h-3.5 w-3.5" aria-hidden />
                  Role
                </Button>
                {member.status === "suspended" ? (
                  <Button variant="secondary" size="sm" onClick={() => onReactivate(member)} disabled={isOwner}>
                    <UserCheck className="h-3.5 w-3.5" aria-hidden />
                    Reactivate
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => onSuspend(member)} disabled={isOwner}>
                    <Ban className="h-3.5 w-3.5" aria-hidden />
                    Suspend
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => onRemove(member)} disabled={isOwner} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  Remove
                </Button>
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}