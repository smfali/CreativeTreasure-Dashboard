"use client";

import { Send, Ban } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InvitationStatusBadge } from "./InvitationStatusBadge";
import { RoleBadge } from "./RoleBadge";
import { formatDate } from "@/lib/format";
import type { Invitation, Role, TeamMember } from "@/lib/data/team";

interface InvitationCardsProps {
  invitations: Invitation[];
  roles: Role[];
  members: TeamMember[];
  onResend: (invitation: Invitation) => void;
  onCancel: (invitation: Invitation) => void;
}

export function InvitationCards({ invitations, roles, members, onResend, onCancel }: InvitationCardsProps) {
  return (
    <ul className="space-y-3">
      {invitations.map((invitation) => {
        const role = roles.find((r) => r.id === invitation.roleId);
        const inviter = members.find((m) => m.id === invitation.invitedById);
        const pending = invitation.status === "pending";
        return (
          <li key={invitation.id}>
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <Avatar name={invitation.name} className="h-10 w-10 text-xs" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{invitation.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{invitation.email}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <RoleBadge role={role} />
                    <InvitationStatusBadge status={invitation.status} />
                  </div>
                </div>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-4 border-t border-border pt-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Invited by</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{inviter?.name ?? "Unknown"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Sent</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{formatDate(invitation.sentAt)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Expires</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{formatDate(invitation.expiresAt)}</dd>
                </div>
              </dl>
              {pending && (
                <div className="mt-3 flex gap-2 border-t border-border pt-3">
                  <Button variant="secondary" size="sm" onClick={() => onResend(invitation)}>
                    <Send className="h-3.5 w-3.5" aria-hidden />
                    Resend
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCancel(invitation)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Ban className="h-3.5 w-3.5" aria-hidden />
                    Cancel
                  </Button>
                </div>
              )}
            </Card>
          </li>
        );
      })}
    </ul>
  );
}