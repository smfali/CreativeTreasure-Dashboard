"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormActions } from "@/components/settings/FormActions";
import { SectionCard } from "@/components/settings/SectionCard";
import { SettingsNotices } from "@/components/settings/SettingsNotices";
import { useSettings } from "@/contexts/SettingsContext";
import { useSettingsForm } from "@/hooks/useSettingsForm";
import {
  currencyOptions,
  dateFormatOptions,
  defaultGeneralSettings,
  languageOptions,
  timezoneOptions,
  type GeneralSettings,
} from "@/lib/data/settings";

type FieldErrors = Partial<Record<keyof GeneralSettings, string>>;

export function GeneralForm() {
  const { general, saveGeneral } = useSettings();
  const form = useSettingsForm<GeneralSettings>(general, defaultGeneralSettings);
  const [errors, setErrors] = useState<FieldErrors>({});
  const draft = form.draft;

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!draft.businessName.trim()) next.businessName = "Business name is required.";
    if (!draft.contactEmail.trim()) {
      next.contactEmail = "Contact email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.contactEmail.trim())) {
      next.contactEmail = "Enter a valid email address.";
    }
    if (!draft.website.trim()) {
      next.website = "Website is required.";
    } else if (!/^https?:\/\/.+\..+/.test(draft.website.trim())) {
      next.website = "Enter a valid URL, e.g. https://example.com";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    form.save(saveGeneral);
  }

  return (
    <SectionCard
      title="General"
      description="Workspace-wide information used across the dashboard and invoices."
    >
      <SettingsNotices notice={form.notice} dirty={form.dirty} />
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">Please fix the highlighted fields and try again.</Alert>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="general-business-name">Business / application name</Label>
          <Input
            id="general-business-name"
            value={draft.businessName}
            onChange={(e) => form.setField("businessName", e.target.value)}
            aria-invalid={!!errors.businessName}
            aria-describedby={errors.businessName ? "general-business-name-error" : undefined}
            className="mt-1.5"
          />
          {errors.businessName && (
            <p id="general-business-name-error" className="mt-1.5 text-sm text-destructive">
              {errors.businessName}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="general-email">Contact email</Label>
          <Input
            id="general-email"
            type="email"
            value={draft.contactEmail}
            onChange={(e) => form.setField("contactEmail", e.target.value)}
            aria-invalid={!!errors.contactEmail}
            aria-describedby={errors.contactEmail ? "general-email-error" : undefined}
            className="mt-1.5"
          />
          {errors.contactEmail && (
            <p id="general-email-error" className="mt-1.5 text-sm text-destructive">
              {errors.contactEmail}
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="general-description">Description</Label>
          <Textarea
            id="general-description"
            rows={3}
            value={draft.description}
            onChange={(e) => form.setField("description", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="general-website">Website</Label>
          <Input
            id="general-website"
            type="url"
            value={draft.website}
            onChange={(e) => form.setField("website", e.target.value)}
            aria-invalid={!!errors.website}
            aria-describedby={errors.website ? "general-website-error" : undefined}
            className="mt-1.5"
          />
          {errors.website && (
            <p id="general-website-error" className="mt-1.5 text-sm text-destructive">
              {errors.website}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="general-currency">Default currency</Label>
          <Select
            id="general-currency"
            value={draft.defaultCurrency}
            onChange={(e) => form.setField("defaultCurrency", e.target.value)}
            className="mt-1.5"
          >
            {currencyOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="general-timezone">Timezone</Label>
          <Select
            id="general-timezone"
            value={draft.timezone}
            onChange={(e) => form.setField("timezone", e.target.value)}
            className="mt-1.5"
          >
            {timezoneOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="general-language">Language</Label>
          <Select
            id="general-language"
            value={draft.language}
            onChange={(e) => form.setField("language", e.target.value)}
            className="mt-1.5"
          >
            {languageOptions.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="general-date-format">Date format</Label>
          <Select
            id="general-date-format"
            value={draft.dateFormat}
            onChange={(e) => form.setField("dateFormat", e.target.value)}
            className="mt-1.5"
          >
            {dateFormatOptions.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </Select>
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