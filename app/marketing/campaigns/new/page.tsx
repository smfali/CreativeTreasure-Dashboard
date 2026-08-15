"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { CampaignForm } from "@/components/marketing/CampaignForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarketing } from "@/contexts/MarketingContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { products as allProducts } from "@/lib/data/products";

export default function NewCampaignPage() {
  const { createCampaign, segments } = useMarketing();
  const { symbol } = useCurrency();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        segments={[
          { label: "Home" },
          { label: "Marketing" },
          { label: "Campaigns", href: "/marketing/campaigns" },
          { label: "New campaign" },
        ]}
      />

      <Link
        href="/marketing/campaigns"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to campaigns
      </Link>

      <div>
        <h1 className="heading-page">New campaign</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Plan a new marketing campaign. Local demo only — nothing is sent or published.
        </p>
      </div>

      <CampaignForm
        mode="create"
        segments={segments}
        products={allProducts}
        symbol={symbol}
        onSubmit={(input) => createCampaign(input)}
      />
    </div>
  );
}