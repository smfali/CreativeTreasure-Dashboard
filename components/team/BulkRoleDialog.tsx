"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { Role } from "@/lib/data/team";

interface BulkRoleDialogProps {
  open: boolean;
  onClose: () => void;
  count: number;
  roles: Role[];
  onConfirm: (roleId: string) => void;
}

export function BulkRoleDialog({ open, onClose, count, roles, onConfirm }: BulkRoleDialogProps) {
  const [roleId, setRoleId] = useState("");

  useEffect(() => {
    if (!open) return;
    setRoleId("");
  }, [open]);

  function handleConfirm() {
    if (!roleId) return;
    onConfirm(roleId);
    onClose();
  }

  const role = roles.find((r) => r.id === roleId);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Change role for selected members"
      description={`Assign a new role to ${count} selected member(s). Their permissions update immediately — demo only.`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={!roleId}>
            Change role
          </Button>
        </>
      }
    >
      <div className="space-y-1.5">
        <label htmlFor="bulk-role-select" className="text-label">
          Role
        </label>
        <Select
          id="bulk-role-select"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          aria-label="Select a role"
        >
          <option value="">Choose a role…</option>
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