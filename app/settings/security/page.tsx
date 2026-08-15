"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsSectionHeader } from "@/components/settings/SettingsSectionHeader";
import { PasswordForm } from "@/components/settings/PasswordForm";
import { TwoFactorPanel } from "@/components/settings/TwoFactorPanel";
import { SessionsPanel } from "@/components/settings/SessionsPanel";

export default function SecuritySettingsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Settings" }, { label: "Security" }]} />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-52 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        segments={[{ label: "Home" }, { label: "Settings", href: "/settings" }, { label: "Security" }]}
      />
      <SettingsSectionHeader
        title="Security"
        description="Password, two-factor authentication and session management. All actions are local demonstrations."
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PasswordForm />
        <TwoFactorPanel />
      </div>
      <SessionsPanel />
    </div>
  );
}
