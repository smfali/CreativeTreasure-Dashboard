"use client";

import { useEffect, useMemo, useState } from "react";
import { Plug, SearchX } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { SettingsSectionHeader } from "@/components/settings/SettingsSectionHeader";
import { IntegrationCard } from "@/components/settings/IntegrationCard";
import { ConnectIntegrationDialog } from "@/components/settings/ConnectIntegrationDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useSettings } from "@/contexts/SettingsContext";
import { formatNumber } from "@/lib/format";
import { integrationCategories, type Integration } from "@/lib/data/settings";

const ALL = "all";

export default function IntegrationsSettingsPage() {
  const { integrations, connectIntegration, disconnectIntegration } = useSettings();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>(ALL);
  const [connectTarget, setConnectTarget] = useState<Integration | null>(null);
  const [disconnectTarget, setDisconnectTarget] = useState<Integration | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  const connectedCount = useMemo(
    () => integrations.filter((i) => i.status === "connected").length,
    [integrations]
  );

  const filtered = useMemo(
    () =>
      category === ALL
        ? integrations
        : integrations.filter((i) => i.category === category),
    [integrations, category]
  );

  function handleConnect(id: string) {
    connectIntegration(id);
    setNotice("Integration connected. This is a local demo connection.");
  }

  function handleDisconnect() {
    if (!disconnectTarget) return;
    disconnectIntegration(disconnectTarget.id);
    setNotice(`${disconnectTarget.name} disconnected.`);
    setDisconnectTarget(null);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Settings" }, { label: "Integrations" }]} />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-10 w-96" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        segments={[{ label: "Home" }, { label: "Settings", href: "/settings" }, { label: "Integrations" }]}
      />
      <SettingsSectionHeader
        title="Integrations"
        description="Connect the dashboard to your favourite tools. These are frontend/demo configurations — no real services are contacted."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {formatNumber(connectedCount)} of {formatNumber(integrations.length)} integrations connected
        </p>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter integrations by category"
          className="sm:w-56"
        >
          <option value={ALL}>All categories</option>
          {integrationCategories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>
      </div>

      {notice && <Alert variant="success">{notice}</Alert>}

      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No integrations in this category"
          description="Try another category or check back later."
          action={
            <button
              type="button"
              className="text-sm font-medium text-primary hover:underline"
              onClick={() => setCategory(ALL)}
            >
              Show all integrations
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onConnect={(id) => setConnectTarget(integration)}
              onDisconnect={(id) => setDisconnectTarget(integration)}
            />
          ))}
        </div>
      )}

      <ConnectIntegrationDialog
        integration={connectTarget}
        onClose={() => setConnectTarget(null)}
        onConfirm={handleConnect}
      />

      <ConfirmDialog
        open={!!disconnectTarget}
        onClose={() => setDisconnectTarget(null)}
        title={`Disconnect ${disconnectTarget?.name ?? "integration"}?`}
        description="Syncing will be paused until you reconnect. This is a local demo action."
        confirmLabel="Disconnect"
        destructive
        onConfirm={handleDisconnect}
      />

      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        <Plug className="h-3.5 w-3.5" aria-hidden />
        Demo workspace — connections are local only and reset on reload.
      </div>
    </div>
  );
}
