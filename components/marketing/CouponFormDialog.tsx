"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  couponStatusLabels,
  discountTypeLabels,
  type Coupon,
  type CouponStatus,
  type DiscountType,
} from "@/lib/data/marketing";
import type { CouponInput } from "@/contexts/MarketingContext";

interface CouponFormDialogProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initial?: Coupon;
  symbol: string;
  onSubmit: (input: CouponInput) => void;
}

type CouponFormState = {
  code: string;
  type: DiscountType;
  value: string;
  usageLimit: string;
  minOrder: string;
  startDate: string;
  expiryDate: string;
  status: CouponStatus;
  description: string;
};

function initialState(initial?: Coupon): CouponFormState {
  return {
    code: initial?.code ?? "",
    type: initial?.type ?? "percentage",
    value: initial ? String(initial.value) : "",
    usageLimit: initial ? String(initial.usageLimit) : "100",
    minOrder: initial?.minOrder ? String(initial.minOrder) : "",
    startDate: initial?.startDate ?? "",
    expiryDate: initial?.expiryDate ?? "",
    status: initial?.status ?? "active",
    description: initial?.description ?? "",
  };
}

export function CouponFormDialog({ open, onClose, mode, initial, symbol, onSubmit }: CouponFormDialogProps) {
  const [form, setForm] = useState<CouponFormState>(initialState(initial));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(initialState(initial));
      setErrors({});
    }
  }, [open, initial]);

  function setField<K extends keyof CouponFormState>(key: K, value: CouponFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    const code = form.code.trim().toUpperCase();
    if (!/^[A-Z0-9_-]{3,24}$/.test(code)) {
      next.code = "Code must be 3–24 characters (letters, numbers, - or _).";
    }
    if (form.value === "" || Number.isNaN(Number(form.value)) || Number(form.value) <= 0) {
      next.value = "Discount value must be greater than zero.";
    } else if (form.type === "percentage" && Number(form.value) > 100) {
      next.value = "Percentage discount cannot exceed 100.";
    }
    const limit = Number(form.usageLimit);
    if (form.usageLimit === "" || Number.isNaN(limit) || limit < 0) {
      next.usageLimit = "Usage limit must be 0 (unlimited) or a positive number.";
    }
    if (!form.startDate) next.startDate = "A start date is required.";
    if (form.expiryDate && form.startDate && form.expiryDate < form.startDate) {
      next.expiryDate = "Expiry must be on or after the start date.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value),
      usageLimit: Number(form.usageLimit),
      minOrder: form.minOrder ? Number(form.minOrder) : undefined,
      startDate: form.startDate,
      expiryDate: form.expiryDate || undefined,
      status: form.status,
      description: form.description.trim() || undefined,
    });
    onClose();
  }

  const description =
    mode === "create"
      ? "Create a coupon code customers can redeem at checkout. Local demo only — no real codes are issued."
      : `Edit coupon ${initial?.code}. Local demo only — no real codes are issued.`;

  return (
    <Dialog open={open} onClose={onClose} title={mode === "create" ? "New coupon" : "Edit coupon"} description={description}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="coupon-code">Code</Label>
            <Input
              id="coupon-code"
              value={form.code}
              onChange={(e) => setField("code", e.target.value)}
              placeholder="e.g. FALL15"
              className="font-mono"
              aria-invalid={Boolean(errors.code)}
              aria-describedby={errors.code ? "coupon-code-error" : undefined}
            />
            {errors.code && (
              <p id="coupon-code-error" className="text-sm text-destructive">
                {errors.code}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="coupon-status">Status</Label>
            <Select
              id="coupon-status"
              value={form.status}
              onChange={(e) => setField("status", e.target.value as CouponStatus)}
              aria-label="Coupon status"
            >
              {(Object.keys(couponStatusLabels) as CouponStatus[]).map((key) => (
                <option key={key} value={key}>
                  {couponStatusLabels[key]}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="coupon-type">Discount type</Label>
            <Select
              id="coupon-type"
              value={form.type}
              onChange={(e) => setField("type", e.target.value as DiscountType)}
              aria-label="Discount type"
            >
              {(Object.keys(discountTypeLabels) as DiscountType[]).map((key) => (
                <option key={key} value={key}>
                  {discountTypeLabels[key]}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="coupon-value">
              Value ({form.type === "percentage" ? "%" : symbol})
            </Label>
            <Input
              id="coupon-value"
              type="number"
              min="0"
              step={form.type === "percentage" ? "1" : "0.5"}
              value={form.value}
              onChange={(e) => setField("value", e.target.value)}
              placeholder={form.type === "percentage" ? "e.g. 15" : "e.g. 10.00"}
              aria-invalid={Boolean(errors.value)}
              aria-describedby={errors.value ? "coupon-value-error" : undefined}
            />
            {errors.value && (
              <p id="coupon-value-error" className="text-sm text-destructive">
                {errors.value}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="coupon-limit">Usage limit (0 = unlimited)</Label>
            <Input
              id="coupon-limit"
              type="number"
              min="0"
              step="1"
              value={form.usageLimit}
              onChange={(e) => setField("usageLimit", e.target.value)}
              aria-invalid={Boolean(errors.usageLimit)}
              aria-describedby={errors.usageLimit ? "coupon-limit-error" : undefined}
            />
            {errors.usageLimit && (
              <p id="coupon-limit-error" className="text-sm text-destructive">
                {errors.usageLimit}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="coupon-minorder">Minimum order ({symbol}, optional)</Label>
            <Input
              id="coupon-minorder"
              type="number"
              min="0"
              step="0.5"
              value={form.minOrder}
              onChange={(e) => setField("minOrder", e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="coupon-start">Start date</Label>
            <Input
              id="coupon-start"
              type="date"
              value={form.startDate}
              onChange={(e) => setField("startDate", e.target.value)}
              aria-invalid={Boolean(errors.startDate)}
              aria-describedby={errors.startDate ? "coupon-start-error" : undefined}
            />
            {errors.startDate && (
              <p id="coupon-start-error" className="text-sm text-destructive">
                {errors.startDate}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="coupon-expiry">Expiry date (optional)</Label>
            <Input
              id="coupon-expiry"
              type="date"
              value={form.expiryDate}
              onChange={(e) => setField("expiryDate", e.target.value)}
              aria-invalid={Boolean(errors.expiryDate)}
              aria-describedby={errors.expiryDate ? "coupon-expiry-error" : undefined}
            />
            {errors.expiryDate && (
              <p id="coupon-expiry-error" className="text-sm text-destructive">
                {errors.expiryDate}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="coupon-description">Description (optional)</Label>
          <Input
            id="coupon-description"
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="e.g. Summer sale"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {mode === "create" ? "Create coupon" : "Save changes"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}