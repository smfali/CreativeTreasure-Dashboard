"use client";

import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import TableSkeleton from "@/components/TableSkeleton";
import { NotificationNav } from "@/components/notifications/NotificationNav";
import { NotificationPreferencesForm } from "@/components/notifications/NotificationPreferencesForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationPreferencesPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Notifications", href: "/notifications" }, { label: "Preferences" }]} />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-14" />
        <TableSkeleton rows={5} cols={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Notifications", href: "/notifications" }, { label: "Preferences" }]} />
        <div className="mt-2">
          <h1 className="heading-page">Notification preferences</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose which activities you want to hear about. These settings are local to this demo workspace.
          </p>
        </div>
      </div>

      <NotificationNav />

      <NotificationPreferencesForm />

      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        <Copy className="h-3.5 w-3.5" aria-hidden />
        Demo workspace — preferences are stored locally and reset on reload.
      </div>
    </div>
  );
}