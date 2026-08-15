"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, ShieldCheck, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PermissionMatrix } from "./PermissionMatrix";
import { PermissionSummary } from "./PermissionSummary";
import type { NewRoleInput } from "@/contexts/TeamContext";
import { allPermissionKeys, type Role } from "@/lib/data/team";

interface RoleFormProps {
  mode: "create" | "edit";
  initial?: Role;
  onSubmit: (input: NewRoleInput) => Role | null;
}

export function RoleForm({ mode, initial, onSubmit }: RoleFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [permissions, setPermissions] = useState<string[]>(initial?.permissions ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty = useMemo(
    () =>
      name !== (initial?.name ?? "") ||
      description !== (initial?.description ?? "") ||
      permissions.join(",") !== (initial?.permissions ?? []).join(","),
    [name, description, permissions, initial]
  );

  useEffect(() => {
    if (!initial) return;
    setName(initial.name);
    setDescription(initial.description);
    setPermissions([...initial.permissions]);
  }, [initial]);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Role name is required.";
    if (!description.trim()) next.description = "Role description is required.";
    if (permissions.length === 0) next.permissions = "Select at least one permission.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saved || submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    setTimeout(() => {
      const result = onSubmit({
        name: name.trim(),
        description: description.trim(),
        permissions,
      });
      setSubmitting(false);
      if (result) {
        setSaved(true);
        setTimeout(() => router.push("/team/roles"), 1000);
      }
    }, 900);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {saved && (
        <Alert variant="success">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            {mode === "create" ? "Role created." : "Role updated."}
          </span>
        </Alert>
      )}

      {dirty && !saved && (
        <Alert variant="info">
          <span className="inline-flex items-center gap-2">
            <Undo2 className="h-4 w-4" aria-hidden />
            You have unsaved changes.
          </span>
        </Alert>
      )}

      {Object.keys(errors).length > 0 && !saved && (
        <Alert variant="destructive">
          <span className="inline-flex items-center gap-2">
            <AlertCircle className="h-4 w-4" aria-hidden />
            Please fix the highlighted fields before saving.
          </span>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Role details</CardTitle>
              <CardDescription>
                {mode === "create"
                  ? "Define a new role for your workspace."
                  : `Editing the ${initial?.name ?? ""} role.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="role-name">Role name</Label>
                <Input
                  id="role-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Content Manager"
                  autoComplete="off"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "role-name-error" : undefined}
                />
                {errors.name && (
                  <p id="role-name-error" className="text-sm text-destructive">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role-description">Description</Label>
                <Textarea
                  id="role-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="What can members with this role do?"
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={errors.description ? "role-description-error" : undefined}
                />
                {errors.description && (
                  <p id="role-description-error" className="text-sm text-destructive">
                    {errors.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>
                Grant access to each area of the workspace. Permissions resolve immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errors.permissions && (
                <p className="mb-3 text-sm text-destructive">{errors.permissions}</p>
              )}
              <PermissionMatrix value={permissions} onChange={setPermissions} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="xl:sticky xl:top-6">
            <CardHeader>
              <CardTitle>Permission summary</CardTitle>
              <CardDescription>
                {permissions.length} of {allPermissionKeys.length} permissions selected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4" aria-hidden />
                <span>{mode === "create" ? "New role" : initial?.name}</span>
              </div>
              <PermissionSummary keys={permissions} className="mt-3" />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button type="button" variant="ghost" onClick={() => router.back()} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {submitting ? "Saving…" : mode === "create" ? "Create role" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}