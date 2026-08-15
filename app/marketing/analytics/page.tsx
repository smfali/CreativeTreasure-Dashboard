"use client";

import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingRevenueChart } from "@/components/marketing/MarketingRevenueChart";
import { ConversionsOverTimeChart } from "@/components/marketing/ConversionsOverTimeChart";
import { RevenueByCampaignChart } from "@/components/marketing/RevenueByCampaignChart";
import { ChannelPerformanceChart } from "@/components/marketing/ChannelPerformanceChart";
import { CampaignPerformanceChart } from "@/components/marketing/CampaignPerformanceChart";
import { FinancialStatCard } from "@/components/finance/FinancialStatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useMarketing } from "@/contexts/MarketingContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatMoney, formatNumber } from "@/lib/format";

export default function AnalyticsPage() {
  const { summary, monthly, channels, campaigns } = useMarketing();
  const { symbol } = useCurrency();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const bestChannel = useMemo(
    () => [...channels].sort((a, b) => b.revenue - a.revenue)[0],
    [channels]
  );

  const avgConversionRate = useMemo(() => {
    const withClicks = channels.filter((c) => c.clicks > 0);
    if (withClicks.length === 0) return 0;
    const totalClicks = withClicks.reduce((s, c) => s + c.clicks, 0);
    const totalConversions = withClicks.reduce((s, c) => s + c.conversions, 0);
    return (totalConversions / totalClicks) * 100;
  }, [channels]);

  const channelTotals = useMemo(() => {
    const reach = channels.reduce((s, c) => s + c.reach, 0);
    const clicks = channels.reduce((s, c) => s + c.clicks, 0);
    const conversions = channels.reduce((s, c) => s + c.conversions, 0);
    const revenue = channels.reduce((s, c) => s + c.revenue, 0);
    return { reach, clicks, conversions, revenue };
  }, [channels]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Marketing" }, { label: "Analytics" }]} />
        <h1 className="heading-page">Marketing analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Campaign performance, conversions and channel insights for CreativeTreasury.
        </p>
      </div>

      <MarketingNav />

      <section aria-labelledby="analytics-kpis-heading">
        <h2 id="analytics-kpis-heading" className="sr-only">
          Marketing analytics metrics
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <FinancialStatCard label="Marketing revenue" value={formatMoney(summary.marketingRevenue, symbol)} hint="Mar – Aug" />
          <FinancialStatCard label="Conversions" value={formatNumber(summary.totalConversions)} hint={`${summary.conversionRate.toFixed(2)}% of clicks`} />
          <FinancialStatCard label="Total reach" value={formatNumber(summary.totalReach)} hint="Across all channels" />
          <FinancialStatCard label="Campaign ROI" value={`${summary.campaignRoi.toFixed(2)}×`} hint={`Spend ${formatMoney(summary.budgetSpent, symbol)}`} />
        </div>
      </section>

      <section aria-labelledby="analytics-metrics-heading" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <h2 id="analytics-metrics-heading" className="sr-only">
          Additional marketing metrics
        </h2>
        <FinancialStatCard label="Avg. conversion rate" value={`${avgConversionRate.toFixed(2)}%`} hint="Across channels" />
        <FinancialStatCard label="Active campaigns" value={formatNumber(summary.activeCampaigns)} hint="Running right now" />
        <FinancialStatCard label="Best channel" value={bestChannel ? bestChannel.label : "—"} hint={bestChannel ? `${formatMoney(bestChannel.revenue, symbol)} revenue` : "No data"} />
        <FinancialStatCard label="Campaigns tracked" value={formatNumber(summary.totalCampaigns)} hint={`${campaigns.filter((c) => c.revenue > 0).length} with revenue`} />
      </section>

      <section aria-labelledby="trend-charts-heading" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <h2 id="trend-charts-heading" className="sr-only">
          Marketing trend charts
        </h2>
        <MarketingRevenueChart monthly={monthly} symbol={symbol} />
        <ConversionsOverTimeChart monthly={monthly} />
      </section>

      <section aria-labelledby="compare-charts-heading" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <h2 id="compare-charts-heading" className="sr-only">
          Campaign and channel comparison charts
        </h2>
        <RevenueByCampaignChart campaigns={campaigns} symbol={symbol} />
        <ChannelPerformanceChart channels={channels} symbol={symbol} />
      </section>

      <CampaignPerformanceChart campaigns={campaigns} />

      <Card>
        <CardHeader>
          <CardTitle>Channel breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Campaigns</TableHead>
                <TableHead className="text-right">Reach</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="text-right">Conv. rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channels.map((channel) => (
                <TableRow key={channel.channel}>
                  <TableCell className="text-sm font-semibold text-foreground">{channel.label}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{formatNumber(channel.campaigns)}</TableCell>
                  <TableCell className="text-right text-sm font-medium text-foreground">{formatNumber(channel.reach)}</TableCell>
                  <TableCell className="text-right text-sm font-medium text-foreground">{formatNumber(channel.clicks)}</TableCell>
                  <TableCell className="text-right text-sm font-medium text-foreground">{formatNumber(channel.conversions)}</TableCell>
                  <TableCell className="text-right text-sm font-medium text-foreground">{formatMoney(channel.revenue, symbol)}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{channel.ctr.toFixed(2)}%</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{channel.conversionRate.toFixed(2)}%</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="text-sm font-semibold text-foreground">Total</TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {formatNumber(channels.reduce((s, c) => s + c.campaigns, 0))}
                </TableCell>
                <TableCell className="text-right text-sm font-semibold text-foreground">{formatNumber(channelTotals.reach)}</TableCell>
                <TableCell className="text-right text-sm font-semibold text-foreground">{formatNumber(channelTotals.clicks)}</TableCell>
                <TableCell className="text-right text-sm font-semibold text-foreground">{formatNumber(channelTotals.conversions)}</TableCell>
                <TableCell className="text-right text-sm font-semibold text-foreground">{formatMoney(channelTotals.revenue, symbol)}</TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {channelTotals.reach > 0 ? `${((channelTotals.clicks / channelTotals.reach) * 100).toFixed(2)}%` : "—"}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {channelTotals.clicks > 0 ? `${((channelTotals.conversions / channelTotals.clicks) * 100).toFixed(2)}%` : "—"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}