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
import { cn } from "@/lib/utils";
import {
  currencyOptions,
  defaultCommerceSettings,
  pricingBehaviorOptions,
  taxDisplayOptions,
  type CommerceSettings,
} from "@/lib/data/settings";

type FieldErrors = Partial<Record<keyof CommerceSettings, string>>;

export function CommerceForm() {
  const { commerce, saveCommerce } = useSettings();
  const form = useSettingsForm<CommerceSettings>(commerce, defaultCommerceSettings);
  const [errors, setErrors] = useState<FieldErrors>({});
  const draft = form.draft;

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!draft.orderNumberPrefix.trim()) next.orderNumberPrefix = "Order number prefix is required.";
    if (!draft.invoicePrefix.trim()) next.invoicePrefix = "Invoice prefix is required.";
    if (draft.orderNumberStart < 0) next.orderNumberStart = "Start number must be positive.";
    if (!draft.businessName.trim()) next.businessName = "Business name is required.";
    if (!draft.businessEmail.trim()) {
      next.businessEmail = "Business email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.businessEmail.trim())) {
      next.businessEmail = "Enter a valid email address.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    form.save(saveCommerce);
  }

  return (
    <div className="space-y-6">
      <SettingsNotices notice={form.notice} dirty={form.dirty} />
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">Please fix the highlighted fields and try again.</Alert>
      )}

      <SectionCard
        title="Store & pricing"
        description="Default currency and how product prices are displayed."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="commerce-currency">Default currency</Label>
            <Select
              id="commerce-currency"
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
        </div>

        <fieldset>
          <legend className="text-label">Tax display</legend>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {taxDisplayOptions.map((opt) => {
              const selected = draft.taxDisplay === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => form.setField("taxDisplay", opt.value)}
                  className={cn(
                    "rounded-lg border p-3 text-left transition-colors",
                    selected ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                  )}
                >
                  <span className="heading-section text-foreground">{opt.label}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{opt.description}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-label">Product pricing behavior</legend>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {pricingBehaviorOptions.map((opt) => {
              const selected = draft.pricingBehavior === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => form.setField("pricingBehavior", opt.value)}
                  className={cn(
                    "rounded-lg border p-3 text-left transition-colors",
                    selected ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                  )}
                >
                  <span className="heading-section text-foreground">{opt.label}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{opt.description}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </SectionCard>

      <SectionCard
        title="Order & invoice numbering"
        description="How order numbers and invoices are generated."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="commerce-order-prefix">Order number prefix</Label>
            <Input
              id="commerce-order-prefix"
              value={draft.orderNumberPrefix}
              onChange={(e) => form.setField("orderNumberPrefix", e.target.value)}
              aria-invalid={!!errors.orderNumberPrefix}
              aria-describedby={errors.orderNumberPrefix ? "commerce-order-prefix-error" : undefined}
              className="mt-1.5"
            />
            {errors.orderNumberPrefix && (
              <p id="commerce-order-prefix-error" className="mt-1.5 text-sm text-destructive">
                {errors.orderNumberPrefix}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="commerce-order-start">Order number start</Label>
            <Input
              id="commerce-order-start"
              type="number"
              min={0}
              value={draft.orderNumberStart}
              onChange={(e) => form.setField("orderNumberStart", Number(e.target.value))}
              aria-invalid={!!errors.orderNumberStart}
              aria-describedby={errors.orderNumberStart ? "commerce-order-start-error" : undefined}
              className="mt-1.5"
            />
            {errors.orderNumberStart && (
              <p id="commerce-order-start-error" className="mt-1.5 text-sm text-destructive">
                {errors.orderNumberStart}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="commerce-invoice-prefix">Invoice prefix</Label>
            <Input
              id="commerce-invoice-prefix"
              value={draft.invoicePrefix}
              onChange={(e) => form.setField("invoicePrefix", e.target.value)}
              aria-invalid={!!errors.invoicePrefix}
              aria-describedby={errors.invoicePrefix ? "commerce-invoice-prefix-error" : undefined}
              className="mt-1.5"
            />
            {errors.invoicePrefix && (
              <p id="commerce-invoice-prefix-error" className="mt-1.5 text-sm text-destructive">
                {errors.invoicePrefix}
              </p>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="commerce-invoice-footer">Invoice footer</Label>
          <Textarea
            id="commerce-invoice-footer"
            rows={2}
            value={draft.invoiceFooter}
            onChange={(e) => form.setField("invoiceFooter", e.target.value)}
            className="mt-1.5"
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Policies & customer information"
        description="Refund policy and the business details shown to customers."
      >
        <div>
          <Label htmlFor="commerce-refund-policy">Refund policy</Label>
          <Textarea
            id="commerce-refund-policy"
            rows={2}
            value={draft.refundPolicy}
            onChange={(e) => form.setField("refundPolicy", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="commerce-business-name">Business name</Label>
            <Input
              id="commerce-business-name"
              value={draft.businessName}
              onChange={(e) => form.setField("businessName", e.target.value)}
              aria-invalid={!!errors.businessName}
              aria-describedby={errors.businessName ? "commerce-business-name-error" : undefined}
              className="mt-1.5"
            />
            {errors.businessName && (
              <p id="commerce-business-name-error" className="mt-1.5 text-sm text-destructive">
                {errors.businessName}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="commerce-business-email">Business email</Label>
            <Input
              id="commerce-business-email"
              type="email"
              value={draft.businessEmail}
              onChange={(e) => form.setField("businessEmail", e.target.value)}
              aria-invalid={!!errors.businessEmail}
              aria-describedby={errors.businessEmail ? "commerce-business-email-error" : undefined}
              className="mt-1.5"
            />
            {errors.businessEmail && (
              <p id="commerce-business-email-error" className="mt-1.5 text-sm text-destructive">
                {errors.businessEmail}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="commerce-business-address">Business address</Label>
            <Textarea
              id="commerce-business-address"
              rows={2}
              value={draft.businessAddress}
              onChange={(e) => form.setField("businessAddress", e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>
      </SectionCard>

      <FormActions
        dirty={form.dirty}
        submitting={form.submitting}
        onSave={handleSave}
        onDiscard={form.discard}
        onReset={form.resetDefaults}
      />
    </div>
  );
}