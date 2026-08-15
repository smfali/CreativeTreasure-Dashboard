"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, SearchX } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import { CampaignForm } from "@/components/marketing/CampaignForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarketing } from "@/contexts/MarketingContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { products as allProducts } from "@/lib/data/products";

export default function EditCampaignPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { campaigns, updateCampaign, segments } = useMarketing();
  const { symbol } = useCurrency();
  const [loading, setLoading] = useState(true);

  const campaign = useMemo(() => (id ? campaigns.find((c) => c.id === id) : undefined), [campaigns, id]);

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

  if (!campaign) {
    return (
      <EmptyState
        icon={SearchX}
        title="Campaign not found"
        description="This campaign may have been archived or removed."
        action={
          <Link href="/marketing/campaigns">
            <Button variant="secondary">Back to campaigns</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        segments={[
          { label: "Home" },
          { label: "Marketing" },
          { label: "Campaigns", href: "/marketing/campaigns" },
          { label: campaign.name, href: `/marketing/campaigns/${campaign.id}` },
          { label: "Edit" },
        ]}
      />

      <Link
        href={`/marketing/campaigns/${campaign.id}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to campaign
      </Link>

      <div>
        <h1 className="heading-page">Edit campaign</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update {campaign.name}. Changes are saved locally for this demo session only.
        </p>
      </div>

      <CampaignForm
        mode="edit"
        initial={campaign}
        segments={segments}
        products={allProducts}
        symbol={symbol}
        onSubmit={(input) => updateCampaign(campaign.id, input)}
      />
    </div>
  );
}