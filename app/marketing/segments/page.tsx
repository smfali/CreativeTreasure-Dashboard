"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { SegmentCards } from "@/components/marketing/SegmentCards";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarketing } from "@/contexts/MarketingContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatNumber } from "@/lib/format";

export default function SegmentsPage() {
  const { segments } = useMarketing();
  const { symbol } = useCurrency();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Marketing" }, { label: "Audience Segments" }]} />
        <h1 className="heading-page">Audience segments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Targetable groups derived from your customer data. Segments update automatically and are
          available to use in campaigns.
        </p>
      </div>

      <MarketingNav />

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{formatNumber(segments.length)}</span> segments
          </p>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" aria-hidden />
            Based on {formatNumber(segments.reduce((s, seg) => s + seg.count, 0))} customer memberships
          </p>
        </CardContent>
      </Card>

      <SegmentCards segments={segments} symbol={symbol} />
    </div>
  );
}