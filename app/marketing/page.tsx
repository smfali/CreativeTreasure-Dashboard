"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import TableSkeleton from "@/components/TableSkeleton";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingRevenueChart } from "@/components/marketing/MarketingRevenueChart";
import { CampaignPerformanceChart } from "@/components/marketing/CampaignPerformanceChart";
import { ChannelPerformanceChart } from "@/components/marketing/ChannelPerformanceChart";
import { ConversionsOverTimeChart } from "@/components/marketing/ConversionsOverTimeChart";
import { CampaignStatusBadge } from "@/components/marketing/CampaignStatusBadge";
import { FinancialStatCard } from "@/components/finance/FinancialStatCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useMarketing } from "@/contexts/MarketingContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { campaignChannelLabels, campaignObjectiveLabels } from "@/lib/data/marketing";
import { formatMoney, formatNumber } from "@/lib/format";

export default function MarketingPage() {
  const { campaigns, summary, monthly, channels } = useMarketing();
  const { symbol } = useCurrency();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const changes = useMemo(() => {
    const current = monthly.slice(-2);
    const previous = monthly.slice(0, 4).slice(-2);
    const sum = (rows: typeof monthly) => rows.reduce((s, m) => s + m.revenue, 0);
    const convSum = (rows: typeof monthly) => rows.reduce((s, m) => s + m.conversions, 0);
    const revGrowth = previous.length && sum(previous) > 0 ? ((sum(current) - sum(previous)) / sum(previous)) * 100 : null;
    const convGrowth = previous.length && convSum(previous) > 0 ? ((convSum(current) - convSum(previous)) / convSum(previous)) * 100 : null;
    return { revGrowth, convGrowth };
  }, [monthly]);

  const topCampaigns = useMemo(() => [...campaigns].sort((a, b) => b.revenue - a.revenue).slice(0, 5), [campaigns]);

  if (loading) {
    return (
      <div className="p-4 space-y-6 sm:p-8">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Marketing" }]} />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-80" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
        <TableSkeleton rows={5} cols={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Marketing" }]} />
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="heading-page">Marketing</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Campaigns, promotions and growth for CreativeTreasury.
            </p>
          </div>
          <Link href="/marketing/campaigns/new">
            <Button className="gap-2">
              <Megaphone className="h-4 w-4" aria-hidden />
              New campaign
            </Button>
          </Link>
        </div>
      </div>

      <MarketingNav />

      <section aria-labelledby="marketing-kpis-heading">
        <h2 id="marketing-kpis-heading" className="sr-only">
          Marketing performance metrics
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <FinancialStatCard label="Campaigns" value={formatNumber(summary.totalCampaigns)} hint={`${summary.activeCampaigns} active`} />
          <FinancialStatCard label="Active campaigns" value={formatNumber(summary.activeCampaigns)} hint="Running right now" />
          <FinancialStatCard label="Total reach" value={formatNumber(summary.totalReach)} hint="All-time impressions" />
          <FinancialStatCard label="Conversions" value={formatNumber(summary.totalConversions)} change={changes.convGrowth} />
          <FinancialStatCard label="Conversion rate" value={`${summary.conversionRate.toFixed(2)}%`} hint="Conversions / clicks" />
          <FinancialStatCard label="Marketing revenue" value={formatMoney(summary.marketingRevenue, symbol)} change={changes.revGrowth} />
          <FinancialStatCard label="Campaign ROI" value={`${summary.campaignRoi.toFixed(2)}×`} hint={`Spend ${formatMoney(summary.budgetSpent, symbol)}`} />
          <FinancialStatCard label="Customer acquisition" value={formatNumber(summary.customersAcquired)} hint="Mar – Aug" />
        </div>
      </section>

      <section aria-labelledby="overview-charts-heading" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <h2 id="overview-charts-heading" className="sr-only">
          Marketing charts
        </h2>
        <MarketingRevenueChart monthly={monthly} symbol={symbol} />
        <CampaignPerformanceChart campaigns={campaigns} />
      </section>

      <section aria-labelledby="overview-charts2-heading" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <h2 id="overview-charts2-heading" className="sr-only">
          Channel and conversion charts
        </h2>
        <ChannelPerformanceChart channels={channels} symbol={symbol} />
        <ConversionsOverTimeChart monthly={monthly} />
      </section>

      <section aria-labelledby="top-campaigns-heading">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="top-campaigns-heading" className="heading-section text-foreground">
              Top campaigns
            </h2>
            <p className="text-sm text-muted-foreground">Ranked by attributed revenue</p>
          </div>
          <Link href="/marketing/campaigns">
            <Button variant="secondary" size="sm">
              View all
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </Link>
        </div>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Reach</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">ROI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <Link
                      href={`/marketing/campaigns/${campaign.id}`}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      {campaign.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{campaignObjectiveLabels[campaign.objective]}</p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{campaignChannelLabels[campaign.channel]}</TableCell>
                  <TableCell>
                    <CampaignStatusBadge status={campaign.status} />
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium text-foreground">
                    {campaign.reach > 0 ? formatNumber(campaign.reach) : "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium text-foreground">
                    {campaign.conversions > 0 ? formatNumber(campaign.conversions) : "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium text-foreground">
                    {campaign.revenue > 0 ? formatMoney(campaign.revenue, symbol) : "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium text-foreground">
                    {campaign.roi > 0 ? `${campaign.roi.toFixed(1)}×` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>
    </div>
  );
}