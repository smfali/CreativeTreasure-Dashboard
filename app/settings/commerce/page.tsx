"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsSectionHeader } from "@/components/settings/SettingsSectionHeader";
import { CommerceForm } from "@/components/settings/CommerceForm";

export default function CommerceSettingsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Settings" }, { label: "Commerce" }]} />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb segments={[{ label: "Home" }, { label: "Settings", href: "/settings" }, { label: "Commerce" }]} />
      <SettingsSectionHeader
        title="Commerce"
        description="Digital store settings for pricing, numbering, invoices and refunds."
      />
      <CommerceForm />
    </div>
  );
}
