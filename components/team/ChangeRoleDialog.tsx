"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { Role, TeamMember } from "@/lib/data/team";

interface ChangeRoleDialogProps {
  open: boolean;
  onClose: () => void;
  member: TeamMember | null;
  roles: Role[];
  onConfirm: (roleId: string) => void;
}

export function ChangeRoleDialog({ open, onClose, member, roles, onConfirm }: ChangeRoleDialogProps) {
  const [roleId, setRoleId] = useState("");

  useEffect(() => {
    if (!open || !member) return;
    setRoleId(member.roleId);
  }, [open, member]);

  const role = roles.find((r) => r.id === roleId);

  function handleConfirm() {
    if (!member || !roleId) return;
    onConfirm(roleId);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Change role"
      description={member ? `Assign a new role for ${member.name}. Their permissions update immediately — demo only.` : undefined}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={!roleId || roleId === member?.roleId}>
            Change role
          </Button>
        </>
      }
    >
      <div className="space-y-1.5">
        <label htmlFor="change-role-select" className="text-label">
          Role
        </label>
        <Select
          id="change-role-select"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          aria-label="Select a role"
        >
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </Select>
        {role && (
          <p className="text-xs text-muted-foreground">
            {role.name} · {role.permissions.length} permissions · {role.description}
          </p>
        )}
      </div>
    </Dialog>
  );
}