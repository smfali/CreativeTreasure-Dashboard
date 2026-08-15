"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import type { InviteInput } from "@/contexts/TeamContext";
import type { Role } from "@/lib/data/team";

interface InviteMemberDialogProps {
  open: boolean;
  onClose: () => void;
  roles: Role[];
  departments: string[];
  onInvite: (input: InviteInput) => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InviteMemberDialog({
  open,
  onClose,
  roles,
  departments,
  onInvite,
}: InviteMemberDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName("");
    setEmail("");
    setRoleId(roles[0]?.id ?? "");
    setDepartment("");
    setMessage("");
    setErrors({});
    setSubmitting(false);
    setSaved(false);
  }, [open, roles]);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Full name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email address.";
    if (!roleId) next.roleId = "Select a role for this member.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || saved) return;
    if (!validate()) return;

    setSubmitting(true);
    setTimeout(() => {
      onInvite({
        name: name.trim(),
        email: email.trim(),
        roleId,
        department: department.trim(),
      });
      setSubmitting(false);
      setSaved(true);
    }, 900);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Invite team member"
      description="Send an invitation to join your workspace. Invitations are simulated locally and nothing is emailed."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="invite-form" loading={submitting} data-autofocus>
            {saved ? "Invitation sent" : "Send invitation"}
          </Button>
        </>
      }
    >
      {saved ? (
        <Alert variant="success">Invitation sent to {email.trim()}. It appears under pending invitations.</Alert>
      ) : (
        <form id="invite-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">Please fix the highlighted fields before inviting.</Alert>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="invite-name">Full name</Label>
            <Input
              id="invite-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              autoComplete="off"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "invite-name-error" : undefined}
            />
            {errors.name && (
              <p id="invite-name-error" className="text-sm text-destructive">
                {errors.name}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              autoComplete="off"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "invite-email-error" : undefined}
            />
            {errors.email && (
              <p id="invite-email-error" className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="invite-role">Role</Label>
              <Select
                id="invite-role"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                aria-label="Invitation role"
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Select>
              {errors.roleId && <p className="text-sm text-destructive">{errors.roleId}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-department">Department</Label>
              <Select
                id="invite-department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                aria-label="Invitation department"
              >
                <option value="">Unassigned</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invite-message">Personal message (optional)</Label>
            <Textarea
              id="invite-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Say a few words about why you are inviting them…"
            />
            <p className="text-xs text-muted-foreground">This message is a demo-only preview and is not sent.</p>
          </div>
        </form>
      )}
    </Dialog>
  );
}