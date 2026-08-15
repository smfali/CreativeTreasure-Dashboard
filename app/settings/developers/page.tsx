"use client";

import { useEffect, useRef, useState } from "react";
import { KeyRound, Plus, Copy } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { SettingsSectionHeader } from "@/components/settings/SettingsSectionHeader";
import { ApiKeysPanel } from "@/components/settings/ApiKeysPanel";
import { CreateApiKeyDialog } from "@/components/settings/CreateApiKeyDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useSettings } from "@/contexts/SettingsContext";
import type { ApiKey } from "@/lib/data/settings";

export default function DevelopersSettingsPage() {
  const { apiKeys, createApiKey, revokeApiKey } = useSettings();
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

function handleCreate(name: string): ApiKey {
    const key = createApiKey(name);
    setNotice(`API key "${name}" created.`);
    return key;
  }

  function handleRevoke() {
    if (!revokeTarget) return;
    revokeApiKey(revokeTarget.id);
    setNotice(`API key "${revokeTarget.name}" revoked.`);
    setRevokeTarget(null);
  }

  function handleCopy(key: ApiKey) {
    navigator.clipboard?.writeText(key.masked).catch(() => undefined);
    setCopiedId(key.id);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopiedId(null), 2000);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Settings" }, { label: "Developers" }]} />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        segments={[{ label: "Home" }, { label: "Settings", href: "/settings" }, { label: "Developers" }]}
      />
      <SettingsSectionHeader
        title="API & developer"
        description="Manage API keys for the demo workspace. Keys are masked demo values — no real secrets are stored."
        meta={
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Create API key
          </button>
        }
      />

      {notice && <Alert variant="success">{notice}</Alert>}

      <ApiKeysPanel
        keys={apiKeys}
        copiedId={copiedId}
        onCopy={handleCopy}
        onRevoke={setRevokeTarget}
      />

      {apiKeys.length === 0 && (
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <KeyRound className="h-4 w-4" aria-hidden />
          Create your first API key
        </button>
      )}

      <CreateApiKeyDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />

      <ConfirmDialog
        open={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        title={`Revoke API key "${revokeTarget?.name ?? "key"}"?`}
        description="This key will stop working immediately and cannot be restored. This is a local demo action."
        confirmLabel="Revoke key"
        destructive
        onConfirm={handleRevoke}
      />

      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        <Copy className="h-3.5 w-3.5" aria-hidden />
        Demo workspace — API keys are masked, stored locally and reset on reload.
      </div>
    </div>
  );
}
