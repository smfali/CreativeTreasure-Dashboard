"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { IntegrationLogo } from "@/components/settings/IntegrationLogo";
import { integrationCategoryLabels, type Integration } from "@/lib/data/settings";

interface ConnectIntegrationDialogProps {
  integration: Integration | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

/** Mock "connect" flow for a demo integration — frontend configuration only. */
export function ConnectIntegrationDialog({
  integration,
  onClose,
  onConfirm,
}: ConnectIntegrationDialogProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!integration) return;
    setValues(
      Object.fromEntries(
        integration.fields.map((f) => [f.key, f.value ?? ""])
      )
    );
  }, [integration]);

  if (!integration) return null;

  function setField(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Dialog
      open={!!integration}
      onClose={onClose}
      title={`Connect ${integration.name}`}
      description={`This is a demo connection — no external service is contacted.`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} data-autofocus>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onConfirm(integration.id);
              onClose();
            }}
          >
            Connect
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-4">
          <IntegrationLogo initials={integration.initials} color={integration.color} size="sm" />
          <div>
            <p className="heading-section text-foreground">{integration.name}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{integration.description}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              {integrationCategoryLabels[integration.category]}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {integration.fields.map((field) => (
            <div key={field.key}>
              <Label htmlFor={`connect-${integration.id}-${field.key}`}>{field.label}</Label>
              <Input
                id={`connect-${integration.id}-${field.key}`}
                type="text"
                value={values[field.key] ?? ""}
                placeholder={field.placeholder}
                onChange={(e) => setField(field.key, e.target.value)}
                className="mt-1.5"
              />
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          Credentials are mocked and stored only in this browser session.
        </div>
      </div>
    </Dialog>
  );
}