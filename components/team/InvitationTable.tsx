"use client";

import { Send, Ban } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { InvitationStatusBadge } from "./InvitationStatusBadge";
import { RoleBadge } from "./RoleBadge";
import { formatDate } from "@/lib/format";
import type { Invitation, Role, TeamMember } from "@/lib/data/team";

interface InvitationTableProps {
  invitations: Invitation[];
  roles: Role[];
  members: TeamMember[];
  onResend: (invitation: Invitation) => void;
  onCancel: (invitation: Invitation) => void;
}

export function InvitationTable({ invitations, roles, members, onResend, onCancel }: InvitationTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invitee</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Invited by</TableHead>
          <TableHead>Sent</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => {
          const role = roles.find((r) => r.id === invitation.roleId);
          const inviter = members.find((m) => m.id === invitation.invitedById);
          const pending = invitation.status === "pending";
          return (
            <TableRow key={invitation.id} className="group hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar name={invitation.name} className="h-9 w-9 text-xs" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{invitation.name}</p>
                    <span className="block truncate text-xs text-muted-foreground">{invitation.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <RoleBadge role={role} />
              </TableCell>
              <TableCell className="text-muted-foreground">{inviter?.name ?? "Unknown"}</TableCell>
              <TableCell className="text-muted-foreground">{formatDate(invitation.sentAt)}</TableCell>
              <TableCell className="text-muted-foreground">{formatDate(invitation.expiresAt)}</TableCell>
              <TableCell>
                <InvitationStatusBadge status={invitation.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="inline-flex items-center justify-end gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onResend(invitation)} disabled={!pending}>
                    <Send className="h-3.5 w-3.5" aria-hidden />
                    Resend
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCancel(invitation)}
                    disabled={!pending}
                    className="text-destructive hover:text-destructive"
                  >
                    <Ban className="h-3.5 w-3.5" aria-hidden />
                    Cancel
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}