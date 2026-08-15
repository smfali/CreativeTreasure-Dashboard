"use client";

import { Check, Copy, KeyRound, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyState from "@/components/EmptyState";
import {
  apiKeyStatusLabels,
  formatSettingsDateTime,
  type ApiKey,
} from "@/lib/data/settings";

interface ApiKeysPanelProps {
  keys: ApiKey[];
  copiedId: string | null;
  onCopy: (key: ApiKey) => void;
  onRevoke: (key: ApiKey) => void;
}

export function ApiKeysPanel({ keys, copiedId, onCopy, onRevoke }: ApiKeysPanelProps) {
  if (keys.length === 0) {
    return (
      <EmptyState
        icon={KeyRound}
        title="No API keys yet"
        description="Create your first key to start integrating with the demo workspace."
      />
    );
  }

  return (
    <Card>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last used</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map((key) => (
              <TableRow key={key.id}>
                <TableCell className="font-medium text-foreground">{key.name}</TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                    {key.masked}
                  </code>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatSettingsDateTime(key.createdAt)}
                </TableCell>
                <TableCell className="text-muted-foreground">{key.lastUsed}</TableCell>
                <TableCell>
                  <Badge variant={key.status === "active" ? "success" : "default"} className={key.status === "revoked" ? "bg-muted text-muted-foreground" : undefined}>
                    {apiKeyStatusLabels[key.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {key.status === "active" && (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCopy(key)}
                        aria-label={`Copy ${key.name} key`}
                      >
                        {copiedId === key.id ? (
                          <Check className="h-4 w-4 text-success" aria-hidden />
                        ) : (
                          <Copy className="h-4 w-4" aria-hidden />
                        )}
                        {copiedId === key.id ? "Copied" : "Copy"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => onRevoke(key)}
                        aria-label={`Revoke ${key.name} key`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                        Revoke
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="divide-y divide-border md:hidden">
        {keys.map((key) => (
          <li key={key.id} className="p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="heading-section text-foreground">{key.name}</p>
              <Badge variant={key.status === "active" ? "success" : "default"} className={key.status === "revoked" ? "bg-muted text-muted-foreground" : undefined}>
                {apiKeyStatusLabels[key.status]}
              </Badge>
            </div>
            <code className="mt-2 block rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
              {key.masked}
            </code>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Created</dt>
                <dd className="text-foreground">{formatSettingsDateTime(key.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Last used</dt>
                <dd className="text-foreground">{key.lastUsed}</dd>
              </div>
            </dl>
            {key.status === "active" && (
              <div className="mt-3 flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => onCopy(key)}>
                  {copiedId === key.id ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                  {copiedId === key.id ? "Copied" : "Copy"}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-destructive"
                  onClick={() => onRevoke(key)}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  Revoke
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
