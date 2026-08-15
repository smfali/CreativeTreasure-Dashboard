"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsSectionHeader } from "@/components/settings/SettingsSectionHeader";
import { ProfileForm } from "@/components/settings/ProfileForm";

export default function ProfileSettingsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Settings" }, { label: "Profile" }]} />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb segments={[{ label: "Home" }, { label: "Settings", href: "/settings" }, { label: "Profile" }]} />
      <SettingsSectionHeader
        title="Profile"
        description="How you appear in the workspace and on team pages."
      />
      <ProfileForm />
    </div>
  );
}
