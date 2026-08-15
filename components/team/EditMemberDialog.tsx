"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { TeamMember } from "@/lib/data/team";

interface EditMemberDialogProps {
  open: boolean;
  onClose: () => void;
  member: TeamMember | null;
  departments: string[];
  onSave: (patch: Partial<TeamMember>) => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EditMemberDialog({
  open,
  onClose,
  member,
  departments,
  onSave,
}: EditMemberDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !member) return;
    setName(member.name);
    setEmail(member.email);
    setDepartment(member.department);
    setLocation(member.location ?? "");
    setPhone(member.phone ?? "");
    setError("");
  }, [open, member]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!member) return;
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    onSave({
      name: name.trim(),
      email: email.trim(),
      department: department.trim() || "Unassigned",
      location: location.trim() || undefined,
      phone: phone.trim() || undefined,
    });
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Edit member"
      description={member ? `Update details for ${member.name}. Changes are saved locally in this session.` : undefined}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="edit-member-form" data-autofocus>
            Save changes
          </Button>
        </>
      }
    >
      <form id="edit-member-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="space-y-1.5">
          <Label htmlFor="edit-name">Full name</Label>
          <Input
            id="edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="edit-email">Email</Label>
          <Input
            id="edit-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-department">Department</Label>
            <Select
              id="edit-department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              aria-label="Department"
            >
              <option value="">Unassigned</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-location">Location</Label>
            <Input
              id="edit-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="edit-phone">Phone</Label>
          <Input
            id="edit-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Optional"
            autoComplete="off"
          />
        </div>
      </form>
    </Dialog>
  );
}