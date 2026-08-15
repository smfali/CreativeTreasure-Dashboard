"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plug } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { IntegrationDetailPanel } from "@/components/settings/IntegrationDetailPanel";
import { useSettings } from "@/contexts/SettingsContext";

export default function IntegrationDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { getIntegration } = useSettings();
  const [loading, setLoading] = useState(true);

  const integration = getIntegration(id ?? "");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!integration) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          segments={[{ label: "Home" }, { label: "Settings", href: "/settings" }, { label: "Integrations", href: "/settings/integrations" }]}
        />
        <EmptyState
          icon={Plug}
          title="Integration not found"
          description="This integration may have been removed. Pick one from the integrations list."
          action={
            <Link href="/settings/integrations" className="text-sm font-medium text-primary hover:underline">
              Back to integrations
            </Link>
          }
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          segments={[{ label: "Home" }, { label: "Settings", href: "/settings" }, { label: "Integrations", href: "/settings/integrations" }, { label: integration.name }]}
        />
        <Skeleton className="h-16" />
        <Skeleton className="h-44 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        segments={[{ label: "Home" }, { label: "Settings", href: "/settings" }, { label: "Integrations", href: "/settings/integrations" }, { label: integration.name }]}
      />
      <IntegrationDetailPanel integration={integration} />
    </div>
  );
}