"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Info, Server } from "lucide-react";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/settings/SectionCard";
import { formatSettingsDateTime, systemInfo, systemInfoRows } from "@/lib/data/settings";

function browserName(ua: string): string {
  if (/Edg\//.test(ua)) return "Microsoft Edge";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua)) return "Safari";
  return "Unknown browser";
}

export function SystemInfoPanel() {
  const { resolvedTheme } = useTheme();
  const [browser, setBrowser] = useState<{
    name: string;
    resolution: string;
    timezone: string;
    locale: string;
  } | null>(null);

  useEffect(() => {
    setBrowser({
      name: browserName(navigator.userAgent),
      resolution: `${window.screen.width} × ${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: navigator.language,
    });
  }, []);

  const environment = useMemo(() => {
    const env: string = systemInfo.environment;
    switch (env) {
      case "Production":
        return <Badge variant="success">Production</Badge>;
      case "Staging":
        return <Badge variant="warning">Staging</Badge>;
      default:
        return <Badge variant="info">{env}</Badge>;
    }
  }, []);

  return (
    <div className="space-y-6">
      <SectionCard
        title="Application"
        description="Runtime information for the CreativeTreasury workspace."
      >
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {systemInfoRows.map((row) => (
            <div key={row.key} className="rounded-lg border border-border bg-muted/40 p-4">
              <dt className="text-xs font-medium text-muted-foreground">{row.label}</dt>
              <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-foreground">
                {row.key === "environment" ? environment : row.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          All values are deterministic demo data aligned with the rest of the dashboard.
        </p>
      </SectionCard>

      <SectionCard
        title="This browser session"
        description="Environment details collected from your current session."
      >
        {browser ? (
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <dt className="text-xs font-medium text-muted-foreground">Browser</dt>
              <dd className="mt-1 text-sm text-foreground">{browser.name}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <dt className="text-xs font-medium text-muted-foreground">Screen resolution</dt>
              <dd className="mt-1 text-sm text-foreground">{browser.resolution}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <dt className="text-xs font-medium text-muted-foreground">Timezone</dt>
              <dd className="mt-1 text-sm text-foreground">{browser.timezone}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <dt className="text-xs font-medium text-muted-foreground">Locale</dt>
              <dd className="mt-1 text-sm text-foreground">{browser.locale}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <dt className="text-xs font-medium text-muted-foreground">Active theme</dt>
              <dd className="mt-1 text-sm text-foreground">
                {resolvedTheme === "dark" ? "Dark" : "Light"}
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <dt className="text-xs font-medium text-muted-foreground">Last deployment</dt>
              <dd className="mt-1 text-sm text-foreground">
                {formatSettingsDateTime(systemInfo.lastDeployment)}
              </dd>
            </div>
          </dl>
        ) : (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Server className="h-4 w-4 animate-pulse" aria-hidden />
            Reading session information…
          </div>
        )}
        <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          This is a demo workspace running on deterministic mock data. No production services are connected.
        </div>
      </SectionCard>
    </div>
  );
}