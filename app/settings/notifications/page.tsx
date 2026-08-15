"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Copy } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { NotificationPreferencesForm } from "@/components/notifications/NotificationPreferencesForm";
import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "@/components/TableSkeleton";
import { SettingsSectionHeader } from "@/components/settings/SettingsSectionHeader";

export default function NotificationSettingsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Settings" }, { label: "Notifications" }]} />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-14" />
        <TableSkeleton rows={4} cols={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        segments={[{ label: "Home" }, { label: "Settings", href: "/settings" }, { label: "Notifications" }]}
      />
      <SettingsSectionHeader
        title="Notifications"
        description="Choose which activities you want to hear about. Reuses the same preferences as the Notifications module."
        meta={
          <Link
            href="/notifications"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Bell className="h-4 w-4" aria-hidden />
            Open Notifications
          </Link>
        }
      />
      <NotificationPreferencesForm />
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        <Copy className="h-3.5 w-3.5" aria-hidden />
        Demo workspace — preferences are stored locally and reset on reload.
      </div>
    </div>
  );
}
