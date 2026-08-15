"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { SectionCard } from "@/components/settings/SectionCard";
import { passwordPolicy } from "@/lib/data/settings";

interface PasswordErrors {
  current?: string;
  next?: string;
  confirm?: string;
}

export function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [notice, setNotice] = useState<string | null>(null);

  function validate(): boolean {
    const nextErrors: PasswordErrors = {};
    if (!current) nextErrors.current = "Enter your current password.";
    if (!next) {
      nextErrors.next = "Enter a new password.";
    } else if (next.length < passwordPolicy.minLength) {
      nextErrors.next = `Use at least ${passwordPolicy.minLength} characters.`;
    }
    if (!confirm) {
      nextErrors.confirm = "Confirm your new password.";
    } else if (confirm !== next) {
      nextErrors.confirm = "Passwords do not match.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    setCurrent("");
    setNext("");
    setConfirm("");
    setNotice("Password updated. This is a local demo — nothing was actually changed.");
  }

  return (
    <SectionCard
      title="Change password"
      description="Update the password used to sign in to this demo workspace."
    >
      {notice && <Alert variant="success">{notice}</Alert>}

      <div>
        <Label htmlFor="current-password">Current password</Label>
        <div className="relative mt-1.5">
          <Input
            id="current-password"
            type={show ? "text" : "password"}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            autoComplete="current-password"
            aria-invalid={!!errors.current}
            aria-describedby={errors.current ? "current-password-error" : undefined}
          />
        </div>
        {errors.current && (
          <p id="current-password-error" className="mt-1.5 text-sm text-destructive">
            {errors.current}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="new-password">New password</Label>
        <div className="relative mt-1.5">
          <Input
            id="new-password"
            type={show ? "text" : "password"}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            autoComplete="new-password"
            aria-invalid={!!errors.next}
            aria-describedby={errors.next ? "new-password-error" : "new-password-hint"}
          />
        </div>
        <p id="new-password-hint" className="mt-1.5 text-sm text-muted-foreground">
          {passwordPolicy.hint}
        </p>
        {errors.next && (
          <p id="new-password-error" className="mt-1.5 text-sm text-destructive">
            {errors.next}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="confirm-password">Confirm new password</Label>
        <div className="relative mt-1.5">
          <Input
            id="confirm-password"
            type={show ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            aria-invalid={!!errors.confirm}
            aria-describedby={errors.confirm ? "confirm-password-error" : undefined}
          />
        </div>
        {errors.confirm && (
          <p id="confirm-password-error" className="mt-1.5 text-sm text-destructive">
            {errors.confirm}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" onClick={() => setShow((s) => !s)}>
          {show ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
          {show ? "Hide" : "Show"} passwords
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!current && !next && !confirm}>
          <Lock className="h-4 w-4" aria-hidden />
          Update password
        </Button>
      </div>
    </SectionCard>
  );
}