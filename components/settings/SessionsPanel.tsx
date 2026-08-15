"use client";

import { useState } from "react";
import { LogOut, MonitorSmartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/settings/SectionCard";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatSettingsDateTime,
  seedLoginHistory,
  seedSessions,
  type ActiveSession,
} from "@/lib/data/settings";

export function SessionsPanel() {
  const [sessions, setSessions] = useState<ActiveSession[]>(() =>
    seedSessions.map((s) => ({ ...s }))
  );
  const [signOutTarget, setSignOutTarget] = useState<ActiveSession | null>(null);

  function handleSignOut() {
    if (!signOutTarget) return;
    if (signOutTarget.current) {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === signOutTarget.id ? { ...s, device: "This browser", lastActive: "2026-08-12T08:05:00" } : s
        )
      );
    } else {
      setSessions((prev) => prev.filter((s) => s.id !== signOutTarget.id));
    }
    setSignOutTarget(null);
  }

  return (
    <>
      <SectionCard
        title="Active sessions"
        description="Devices and browsers currently signed in to this workspace. Demo data only."
      >
        <ul className="divide-y divide-border">
          {sessions.map((session) => (
            <li key={session.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <MonitorSmartphone className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
                    {session.device}
                    {session.current && <Badge variant="primary">Current</Badge>}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {session.location} · Last active {formatSettingsDateTime(session.lastActive)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSignOutTarget(session)}
                aria-label={`Sign out ${session.device}`}
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Sign out
              </Button>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        title="Login history"
        description="Recent sign-in attempts for this workspace."
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seedLoginHistory.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium text-foreground">{event.device}</TableCell>
                  <TableCell className="text-muted-foreground">{event.location}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatSettingsDateTime(event.date)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={event.result === "success" ? "success" : "destructive"}>
                      {event.result === "success" ? "Success" : "Failed"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <ConfirmDialog
        open={!!signOutTarget}
        onClose={() => setSignOutTarget(null)}
        title={signOutTarget?.current ? "Sign out of this session?" : "Sign out this session?"}
        description={
          signOutTarget?.current
            ? "This is your current browser session. It will be removed from the demo session list. This is a local demo action."
            : "The device will be signed out immediately. This is a local demo action."
        }
        confirmLabel="Sign out"
        destructive={!signOutTarget?.current}
        onConfirm={handleSignOut}
      />
    </>
  );
}