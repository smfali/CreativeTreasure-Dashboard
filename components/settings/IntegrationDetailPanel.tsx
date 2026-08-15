"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Info, KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { SectionCard } from "@/components/settings/SectionCard";
import { IntegrationLogo } from "@/components/settings/IntegrationLogo";
import { IntegrationStatusBadge } from "@/components/settings/IntegrationStatusBadge";
import { ConnectIntegrationDialog } from "@/components/settings/ConnectIntegrationDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useSettings } from "@/contexts/SettingsContext";
import {
  formatSettingsDateTime,
  integrationCategoryLabels,
  type Integration,
} from "@/lib/data/settings";

export function IntegrationDetailPanel({ integration }: { integration: Integration }) {
  const { connectIntegration, disconnectIntegration } = useSettings();
  const [connectOpen, setConnectOpen] = useState(false);
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const connected = integration.status === "connected";

  function handleCopy(fieldKey: string, value: string) {
    navigator.clipboard?.writeText(value).catch(() => undefined);
    setCopiedField(fieldKey);
    window.setTimeout(() => setCopiedField(null), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <IntegrationLogo
            initials={integration.initials}
            color={integration.color}
            size="lg"
          />
          <div>
            <h2 className="heading-page">{integration.name}</h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">{integration.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">{integrationCategoryLabels[integration.category]}</Badge>
              <IntegrationStatusBadge status={integration.status} />
              <a
                href={integration.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                {integration.website.replace("https://", "")}
                <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            </div>
          </div>
        </div>
        <Button
          variant={connected ? "secondary" : "primary"}
          onClick={() => (connected ? setDisconnectOpen(true) : setConnectOpen(true))}
          aria-label={`${connected ? "Disconnect from" : "Connect to"} ${integration.name}`}
        >
          {connected ? "Disconnect" : "Connect"}
        </Button>
      </div>

      <SectionCard
        title="Connection status"
        description="Current state of this demo integration."
      >
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <dt className="text-xs font-medium text-muted-foreground">Status</dt>
            <dd className="mt-1">
              <IntegrationStatusBadge status={integration.status} />
            </dd>
          </div>
          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <dt className="text-xs font-medium text-muted-foreground">Last synchronized</dt>
            <dd className="mt-1 text-sm text-foreground">
              {integration.lastSynced ? formatSettingsDateTime(integration.lastSynced) : "Never"}
            </dd>
          </div>
          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <dt className="text-xs font-medium text-muted-foreground">Data flow</dt>
            <dd className="mt-1 text-sm text-foreground">
              {connected ? "Inbound & outbound" : "Inbound only (once connected)"}
            </dd>
          </div>
        </dl>
        <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          Demo connection — no external API is contacted. The connection state is stored locally and resets on reload.
        </div>
      </SectionCard>

      <SectionCard
        title="Configuration"
        description="Stored configuration values for this integration."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {integration.fields.map((field) => (
            <div key={field.key}>
              <Label htmlFor={`detail-${integration.id}-${field.key}`}>{field.label}</Label>
              <div className="mt-1.5 flex items-center gap-2">
                <Input
                  id={`detail-${integration.id}-${field.key}`}
                  readOnly
                  value={field.value ?? ""}
                  placeholder={field.placeholder}
                  aria-label={`${field.label} (read only)`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(field.key, field.value ?? "")}
                  aria-label={`Copy ${field.label}`}
                >
                  {copiedField === field.key ? (
                    <Check className="h-4 w-4 text-success" aria-hidden />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Permissions & scopes"
        description="Access this integration is granted in the demo workspace."
      >
        <ul className="divide-y divide-border">
          {integration.scopes.map((scope) => (
            <li key={scope} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
              <KeyRound className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <span className="text-sm text-foreground">{scope}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <ConnectIntegrationDialog
        integration={connectOpen ? integration : null}
        onClose={() => setConnectOpen(false)}
        onConfirm={() => connectIntegration(integration.id)}
      />

      <ConfirmDialog
        open={disconnectOpen}
        onClose={() => setDisconnectOpen(false)}
        title={`Disconnect ${integration.name}?`}
        description="This will pause all data syncing with the integration. You can reconnect anytime. This is a local demo action."
        confirmLabel="Disconnect"
        destructive
        onConfirm={() => disconnectIntegration(integration.id)}
      />
    </div>
  );
}