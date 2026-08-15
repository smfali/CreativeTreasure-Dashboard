"use client";

import Link from "next/link";
import { Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IntegrationLogo } from "@/components/settings/IntegrationLogo";
import { IntegrationStatusBadge } from "@/components/settings/IntegrationStatusBadge";
import { integrationCategoryLabels, formatSettingsDateTime, type Integration } from "@/lib/data/settings";

interface IntegrationCardProps {
  integration: Integration;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
}

export function IntegrationCard({ integration, onConnect, onDisconnect }: IntegrationCardProps) {
  const connected = integration.status === "connected";

  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <IntegrationLogo
          initials={integration.initials}
          color={integration.color}
          size="md"
        />
        <IntegrationStatusBadge status={integration.status} />
      </div>

      <div className="mt-4">
        <h3 className="heading-section text-foreground">{integration.name}</h3>
        <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
          {integration.description}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Badge variant="outline">{integrationCategoryLabels[integration.category]}</Badge>
        {connected && integration.lastSynced && (
          <span className="text-xs text-muted-foreground">
            Synced {formatSettingsDateTime(integration.lastSynced)}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => (connected ? onDisconnect(integration.id) : onConnect(integration.id))}
          aria-label={`${connected ? "Disconnect" : "Connect"} ${integration.name}`}
        >
          {connected ? "Disconnect" : "Connect"}
        </Button>
        <Link
          href={`/settings/integrations/${integration.id}`}
          className={buttonClasses("ghost", "sm") + " flex-1"}
        >
          <Settings2 className="h-4 w-4" aria-hidden />
          Configure
        </Link>
      </div>
    </Card>
  );
}