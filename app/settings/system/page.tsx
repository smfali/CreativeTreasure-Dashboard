"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsSectionHeader } from "@/components/settings/SettingsSectionHeader";
import { SystemInfoPanel } from "@/components/settings/SystemInfoPanel";

export default function SystemSettingsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Settings" }, { label: "System" }]} />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        segments={[{ label: "Home" }, { label: "Settings", href: "/settings" }, { label: "System" }]}
      />
      <SettingsSectionHeader
        title="System information"
        description="Runtime details for the CreativeTreasury workspace and this browser session."
      />
      <SystemInfoPanel />
    </div>
  );
}
