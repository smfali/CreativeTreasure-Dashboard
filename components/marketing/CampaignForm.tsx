"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Megaphone, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { CampaignInput } from "@/contexts/MarketingContext";
import {
  campaignChannelLabels,
  campaignObjectiveLabels,
  campaignStatusLabels,
  type Campaign,
  type CampaignChannel,
  type CampaignObjective,
  type CampaignStatus,
  type Segment,
} from "@/lib/data/marketing";
import { formatMoney, formatNumber } from "@/lib/format";

interface CampaignFormProps {
  mode: "create" | "edit";
  initial?: Campaign;
  segments: Segment[];
  products: { id: string; name: string; price: number; type: string; sales: number }[];
  symbol: string;
  onSubmit: (input: CampaignInput) => Campaign | null;
}

type FormState = {
  name: string;
  objective: CampaignObjective;
  channel: CampaignChannel;
  status: CampaignStatus;
  segmentId: string;
  audience: string;
  productIds: string[];
  startDate: string;
  endDate: string;
  budget: string;
};

export function CampaignForm({ mode, initial, segments, products, symbol, onSubmit }: CampaignFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: initial?.name ?? "",
    objective: initial?.objective ?? "conversions",
    channel: initial?.channel ?? "email",
    status: initial?.status ?? "draft",
    segmentId: initial?.segmentId ?? "",
    audience: initial?.audience ?? "",
    productIds: initial?.productIds ?? [],
    startDate: initial?.startDate ?? "",
    endDate: initial?.endDate ?? "",
    budget: initial ? String(initial.budget) : "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const productOptions = useMemo(
    () => products.sort((a, b) => a.name.localeCompare(b.name)),
    [products]
  );

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "segmentId") {
        const segment = segments.find((s) => s.id === value);
        if (segment && !prev.audience) next.audience = segment.name;
      }
      return next;
    });
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Campaign name is required.";
    if (!form.audience.trim()) next.audience = "Audience is required.";
    if (!form.startDate) next.startDate = "A start date is required.";
    if (form.endDate && form.endDate < form.startDate) next.endDate = "End date must be on or after the start date.";
    const budget = Number(form.budget);
    if (form.budget === "" || Number.isNaN(budget)) next.budget = "Budget is required.";
    else if (budget <= 0) next.budget = "Budget must be greater than zero.";
    if (form.productIds.length === 0) next.productIds = "Select at least one product to promote.";
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
        name: form.name.trim(),
        objective: form.objective,
        channel: form.channel,
        status: form.status,
        audience: form.audience.trim(),
        segmentId: form.segmentId || undefined,
        productIds: form.productIds,
        budget: Number(form.budget),
        startDate: form.startDate,
        endDate: form.endDate || undefined,
      });
      setSubmitting(false);
      if (result) {
        setSaved(true);
        setTimeout(() => router.push("/marketing/campaigns"), 1000);
      }
    }, 900);
  }

  function toggleProduct(id: string) {
    setForm((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(id)
        ? prev.productIds.filter((p) => p !== id)
        : [...prev.productIds, id],
    }));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {saved && (
        <Alert variant="success">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            {mode === "create" ? "Campaign created." : "Campaign updated."}
          </span>
        </Alert>
      )}

      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <span className="inline-flex items-center gap-2">
            <AlertCircle className="h-4 w-4" aria-hidden />
            Please fix the highlighted fields before saving.
          </span>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Campaign details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="campaign-name">Campaign name</Label>
            <Input
              id="campaign-name"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="e.g. Fall Template Sale"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "campaign-name-error" : undefined}
            />
            {errors.name && (
              <p id="campaign-name-error" className="text-sm text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label htmlFor="campaign-objective">Objective</Label>
              <Select
                id="campaign-objective"
                value={form.objective}
                onChange={(e) => setField("objective", e.target.value as CampaignObjective)}
                aria-label="Campaign objective"
              >
                {(Object.keys(campaignObjectiveLabels) as CampaignObjective[]).map((key) => (
                  <option key={key} value={key}>
                    {campaignObjectiveLabels[key]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="campaign-channel">Channel</Label>
              <Select
                id="campaign-channel"
                value={form.channel}
                onChange={(e) => setField("channel", e.target.value as CampaignChannel)}
                aria-label="Campaign channel"
              >
                {(Object.keys(campaignChannelLabels) as CampaignChannel[]).map((key) => (
                  <option key={key} value={key}>
                    {campaignChannelLabels[key]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="campaign-status">Status</Label>
              <Select
                id="campaign-status"
                value={form.status}
                onChange={(e) => setField("status", e.target.value as CampaignStatus)}
                aria-label="Campaign status"
              >
                {(Object.keys(campaignStatusLabels) as CampaignStatus[]).map((key) => (
                  <option key={key} value={key}>
                    {campaignStatusLabels[key]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="campaign-budget">Budget ({symbol})</Label>
              <Input
                id="campaign-budget"
                type="number"
                min="0"
                step="1"
                value={form.budget}
                onChange={(e) => setField("budget", e.target.value)}
                placeholder="0"
                aria-invalid={Boolean(errors.budget)}
                aria-describedby={errors.budget ? "campaign-budget-error" : undefined}
              />
              {errors.budget && (
                <p id="campaign-budget-error" className="text-sm text-destructive">
                  {errors.budget}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="campaign-start">Start date</Label>
              <Input
                id="campaign-start"
                type="date"
                value={form.startDate}
                onChange={(e) => setField("startDate", e.target.value)}
                aria-invalid={Boolean(errors.startDate)}
                aria-describedby={errors.startDate ? "campaign-start-error" : undefined}
              />
              {errors.startDate && (
                <p id="campaign-start-error" className="text-sm text-destructive">
                  {errors.startDate}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="campaign-end">End date</Label>
              <Input
                id="campaign-end"
                type="date"
                value={form.endDate}
                onChange={(e) => setField("endDate", e.target.value)}
                aria-invalid={Boolean(errors.endDate)}
                aria-describedby={errors.endDate ? "campaign-end-error" : undefined}
              />
              {errors.endDate && (
                <p id="campaign-end-error" className="text-sm text-destructive">
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="campaign-segment">Segment (optional)</Label>
              <Select
                id="campaign-segment"
                value={form.segmentId}
                onChange={(e) => setField("segmentId", e.target.value)}
                aria-label="Audience segment"
              >
                <option value="">Custom audience</option>
                {segments.map((segment) => (
                  <option key={segment.id} value={segment.id}>
                    {segment.name} ({segment.count})
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="campaign-audience">Audience</Label>
              <Input
                id="campaign-audience"
                value={form.audience}
                onChange={(e) => setField("audience", e.target.value)}
                placeholder="e.g. All site visitors"
                aria-invalid={Boolean(errors.audience)}
                aria-describedby={errors.audience ? "campaign-audience-error" : undefined}
              />
              {errors.audience && (
                <p id="campaign-audience-error" className="text-sm text-destructive">
                  {errors.audience}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Products to promote</CardTitle>
        </CardHeader>
        <CardContent>
          {errors.productIds && (
            <p className="mb-3 text-sm text-destructive">{errors.productIds}</p>
          )}
          <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
            {productOptions.map((product) => {
              const checked = form.productIds.includes(product.id);
              return (
                <label
                  key={product.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/60"
                >
                  <Checkbox
                    checked={checked}
                    onChange={() => toggleProduct(product.id)}
                    aria-label={`Promote ${product.name}`}
                    className="mt-0.5"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">{product.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {product.type} · {formatMoney(product.price, symbol)} · {formatNumber(product.sales)} sales
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Megaphone className="h-3 w-3" aria-hidden />
                    {checked ? "Promoted" : "Not included"}
                  </span>
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="campaign-notes" className="sr-only">
            Notes
          </Label>
          <Textarea
            id="campaign-notes"
            placeholder="Add internal notes about this campaign (demo only, not saved)."
            rows={3}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button type="button" variant="ghost" onClick={() => router.back()} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {submitting ? "Saving…" : mode === "create" ? "Create campaign" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}