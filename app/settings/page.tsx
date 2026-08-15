"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsSectionHeader } from "@/components/settings/SettingsSectionHeader";
import { GeneralForm } from "@/components/settings/GeneralForm";

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Settings" }]} />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb segments={[{ label: "Home" }, { label: "Settings" }]} />
      <SettingsSectionHeader
        title="General"
        description="Workspace-wide information used across the dashboard and invoices."
      />
      <GeneralForm />
    </div>
  );
}
