"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormActions } from "@/components/settings/FormActions";
import { SectionCard } from "@/components/settings/SectionCard";
import { SettingsNotices } from "@/components/settings/SettingsNotices";
import { useSettings } from "@/contexts/SettingsContext";
import { useSettingsForm } from "@/hooks/useSettingsForm";
import {
  defaultProfileSettings,
  profileJobTitleOptions,
  profileRoleOptions,
  type ProfileSettings,
} from "@/lib/data/settings";

type FieldErrors = Partial<Record<keyof ProfileSettings, string>>;

export function ProfileForm() {
  const { profile, saveProfile } = useSettings();
  const form = useSettingsForm<ProfileSettings>(profile, defaultProfileSettings);
  const [errors, setErrors] = useState<FieldErrors>({});
  const draft = form.draft;

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!draft.name.trim()) next.name = "Name is required.";
    if (!draft.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    form.save(saveProfile);
  }

  return (
    <SectionCard
      title="Profile"
      description="How you appear in the workspace and on team pages."
    >
      <SettingsNotices notice={form.notice} dirty={form.dirty} />
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">Please fix the highlighted fields and try again.</Alert>
      )}

      <div className="flex items-center gap-4">
        <Avatar name={draft.name || "?"} className="h-14 w-14 text-lg" />
        <div>
          <Button variant="secondary" size="sm">
            <Camera className="h-4 w-4" aria-hidden />
            Change avatar
          </Button>
          <p className="mt-1 text-xs text-muted-foreground">
            Demo only — avatars are generated from your name.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="profile-name">Full name</Label>
          <Input
            id="profile-name"
            value={draft.name}
            onChange={(e) => form.setField("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "profile-name-error" : undefined}
            className="mt-1.5"
          />
          {errors.name && (
            <p id="profile-name-error" className="mt-1.5 text-sm text-destructive">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="profile-email">Email</Label>
          <Input
            id="profile-email"
            type="email"
            value={draft.email}
            onChange={(e) => form.setField("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "profile-email-error" : undefined}
            className="mt-1.5"
          />
          {errors.email && (
            <p id="profile-email-error" className="mt-1.5 text-sm text-destructive">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="profile-role">Role</Label>
          <Select
            id="profile-role"
            value={draft.role}
            onChange={(e) => form.setField("role", e.target.value)}
            className="mt-1.5"
          >
            {profileRoleOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="profile-job-title">Job title</Label>
          <Select
            id="profile-job-title"
            value={draft.jobTitle}
            onChange={(e) => form.setField("jobTitle", e.target.value)}
            className="mt-1.5"
          >
            {profileJobTitleOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="profile-bio">Bio</Label>
          <Textarea
            id="profile-bio"
            rows={4}
            value={draft.bio}
            onChange={(e) => form.setField("bio", e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>

      <FormActions
        dirty={form.dirty}
        submitting={form.submitting}
        onSave={handleSave}
        onDiscard={form.discard}
        onReset={form.resetDefaults}
      />
    </SectionCard>
  );
}