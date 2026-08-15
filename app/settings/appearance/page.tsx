"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsSectionHeader } from "@/components/settings/SettingsSectionHeader";
import { AppearanceForm } from "@/components/settings/AppearanceForm";

export default function AppearanceSettingsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Settings" }, { label: "Appearance" }]} />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb segments={[{ label: "Home" }, { label: "Settings", href: "/settings" }, { label: "Appearance" }]} />
      <SettingsSectionHeader
        title="Appearance"
        description="Customise the dashboard theme and accent colour."
      />
      <AppearanceForm />
    </div>
  );
}
