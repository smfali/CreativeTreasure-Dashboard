"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Copy, Archive, SearchX, Megaphone, CalendarDays, Users, MousePointerClick, Eye, Target, Wallet, TrendingUp, FileText, Rocket, Pause, Play, CheckCircle2, Trophy } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { CampaignStatusBadge } from "@/components/marketing/CampaignStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMarketing } from "@/contexts/MarketingContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useChartTheme } from "@/components/revenue/useChartTheme";
import {
  campaignChannelLabels,
  campaignObjectiveLabels,
  campaignProducts,
  campaignStatusLabels,
  findSegment,
  getCampaignActivity,
  getCampaignMetrics,
} from "@/lib/data/marketing";
import { formatMoney, formatDate, timeAgo, formatNumber } from "@/lib/format";

const activityMeta = {
  created: { icon: FileText, className: "text-info bg-info/15" },
  scheduled: { icon: CalendarDays, className: "text-warning bg-warning/15" },
  launched: { icon: Rocket, className: "text-success bg-success/15" },
  paused: { icon: Pause, className: "text-warning bg-warning/15" },
  resumed: { icon: Play, className: "text-info bg-info/15" },
  completed: { icon: CheckCircle2, className: "text-success bg-success/15" },
  milestone: { icon: Trophy, className: "text-primary bg-primary/15" },
} as const;

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Megaphone }) {
  return (
    <Card className="p-5">
      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="break-all text-right text-sm font-medium text-foreground">{value || "—"}</dd>
    </div>
  );
}

export default function CampaignDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();

  const { campaigns, deleteCampaign, duplicateCampaign } = useMarketing();
  const { symbol } = useCurrency();
  const theme = useChartTheme();

  const [loading, setLoading] = useState(true);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const campaign = useMemo(() => (id ? campaigns.find((c) => c.id === id) : undefined), [campaigns, id]);
  const products = useMemo(() => (campaign ? campaignProducts(campaign) : []), [campaign]);
  const activity = useMemo(() => (campaign ? getCampaignActivity(campaign) : []), [campaign]);
  const metrics = useMemo(() => (campaign ? getCampaignMetrics(campaign) : null), [campaign]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-64" />
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
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

  const segment = campaign.segmentId ? findSegment(campaign.segmentId) : undefined;
  const funnel = [
    { label: "Reach", value: campaign.reach, fill: theme.colors.primary },
    { label: "Engagement", value: campaign.engagement, fill: theme.colors.pink },
    { label: "Clicks", value: campaign.clicks, fill: theme.colors.warning },
    { label: "Conversions", value: campaign.conversions, fill: theme.colors.success },
  ];
  const launched = campaign.reach > 0 || campaign.revenue > 0;

  return (
    <div className="space-y-6">
      <Breadcrumb
        segments={[
          { label: "Home" },
          { label: "Marketing" },
          { label: "Campaigns", href: "/marketing/campaigns" },
          { label: campaign.name },
        ]}
      />

      <Link
        href="/marketing/campaigns"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to campaigns
      </Link>

      {notice && (
        <Alert variant="success">
          <span className="inline-flex items-center gap-2">{notice}</span>
        </Alert>
      )}

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="heading-page mb-0 text-xl sm:text-2xl">{campaign.name}</h1>
              <CampaignStatusBadge status={campaign.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {campaignObjectiveLabels[campaign.objective]} · {campaignChannelLabels[campaign.channel]} ·{" "}
              {formatDate(campaign.startDate)}
              {campaign.endDate ? ` – ${formatDate(campaign.endDate)}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/marketing/campaigns/${campaign.id}/edit`}>
              <Button variant="secondary">
                <Pencil className="h-4 w-4" aria-hidden />
                Edit
              </Button>
            </Link>
            <Button
              variant="secondary"
              onClick={() => {
                const copy = duplicateCampaign(campaign.id);
                if (copy) setNotice(`Duplicated ${copy.name} as a draft.`);
              }}
            >
              <Copy className="h-4 w-4" aria-hidden />
              Duplicate
            </Button>
            <Button variant="destructive" onClick={() => setArchiveOpen(true)}>
              <Archive className="h-4 w-4" aria-hidden />
              Archive
            </Button>
          </div>
        </CardContent>
      </Card>

      {campaign.status === "draft" && (
        <Alert variant="info">
          This campaign is still a draft and has no live metrics yet. Once you schedule or launch it,
          performance numbers will start tracking.
        </Alert>
      )}
      {campaign.status === "scheduled" && (
        <Alert variant="info">
          This campaign is scheduled to go live. No metrics are tracked until launch.
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Budget" value={formatMoney(campaign.budget, symbol)} icon={Wallet} />
        <Stat label="Reach" value={campaign.reach > 0 ? formatNumber(campaign.reach) : "—"} icon={Users} />
        <Stat label="Conversions" value={campaign.conversions > 0 ? formatNumber(campaign.conversions) : "—"} icon={Target} />
        <Stat label="Revenue" value={campaign.revenue > 0 ? formatMoney(campaign.revenue, symbol) : "—"} icon={TrendingUp} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Campaign details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="divide-y divide-border">
                  <InfoRow label="Objective" value={campaignObjectiveLabels[campaign.objective]} />
                  <InfoRow label="Channel" value={campaignChannelLabels[campaign.channel]} />
                  <InfoRow label="Status" value={campaignStatusLabels[campaign.status]} />
                  <InfoRow label="Audience" value={campaign.audience} />
                  <InfoRow label="Segment" value={segment ? segment.name : "—"} />
                  <InfoRow label="Start date" value={formatDate(campaign.startDate)} />
                  <InfoRow label="End date" value={campaign.endDate ? formatDate(campaign.endDate) : "—"} />
                  <InfoRow label="Budget" value={formatMoney(campaign.budget, symbol)} />
                  <InfoRow label="Created" value={formatDate(campaign.createdAt)} />
                  <InfoRow label="Last updated" value={formatDate(campaign.updatedAt)} />
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion funnel</CardTitle>
              </CardHeader>
              <CardContent>
                {!launched ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No funnel data yet. Metrics appear once the campaign goes live.
                  </p>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={funnel} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 8 }}>
                        <XAxis type="number" stroke={theme.axisStroke} tick={{ fill: theme.tickFill, fontSize: 12 }} />
                        <YAxis
                          type="category"
                          dataKey="label"
                          width={92}
                          stroke={theme.axisStroke}
                          tick={{ fill: theme.tickFill, fontSize: 12 }}
                        />
                        <Tooltip
                          cursor={{ fill: theme.dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
                          contentStyle={theme.tooltipStyle}
                          formatter={(value) => [formatNumber(Number(value)), "Audience"]}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {metrics && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Stat label="Engagement rate" value={launched ? `${metrics.engagementRate.toFixed(1)}%` : "—"} icon={Eye} />
              <Stat label="Click-through rate" value={launched ? `${metrics.ctr.toFixed(2)}%` : "—"} icon={MousePointerClick} />
              <Stat label="Conversion rate" value={launched ? `${metrics.conversionRate.toFixed(1)}%` : "—"} icon={Target} />
              <Stat label="Cost per conversion" value={launched ? formatMoney(metrics.costPerConversion, symbol) : "—"} icon={Wallet} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Campaign overview</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="divide-y divide-border">
                  <InfoRow label="Reach" value={launched ? formatNumber(campaign.reach) : "—"} />
                  <InfoRow label="Engagement" value={launched ? formatNumber(campaign.engagement) : "—"} />
                  <InfoRow label="Clicks" value={launched ? formatNumber(campaign.clicks) : "—"} />
                  <InfoRow label="Conversions" value={launched ? formatNumber(campaign.conversions) : "—"} />
                  <InfoRow label="Revenue" value={launched ? formatMoney(campaign.revenue, symbol) : "—"} />
                  <InfoRow label="ROI" value={launched ? `${campaign.roi.toFixed(2)}×` : "—"} />
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Derived metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="divide-y divide-border">
                  <InfoRow label="Engagement rate" value={launched ? `${metrics?.engagementRate.toFixed(1)}%` : "—"} />
                  <InfoRow label="Click-through rate" value={launched ? `${metrics?.ctr.toFixed(2)}%` : "—"} />
                  <InfoRow label="Conversion rate" value={launched ? `${metrics?.conversionRate.toFixed(1)}%` : "—"} />
                  <InfoRow label="Cost per conversion" value={launched ? formatMoney(metrics?.costPerConversion ?? 0, symbol) : "—"} />
                  <InfoRow label="Revenue per conversion" value={launched ? formatMoney(metrics?.revenuePerConversion ?? 0, symbol) : "—"} />
                </dl>
              </CardContent>
            </Card>
          </div>

          {!launched && (
            <Alert variant="info">
              This campaign has not launched yet, so performance metrics are not available.
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Promoted products ({products.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No products linked to this campaign.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <Card key={product.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{product.type}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0">
                          {formatMoney(product.price, symbol)}
                        </Badge>
                      </div>
                      <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3 text-sm">
                        <div>
                          <dt className="text-xs text-muted-foreground">Sales</dt>
                          <dd className="font-medium text-foreground">{formatNumber(product.sales)}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-muted-foreground">Revenue</dt>
                          <dd className="font-medium text-foreground">{formatMoney(product.revenue, symbol)}</dd>
                        </div>
                      </dl>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardContent className="p-6">
              {activity.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No activity recorded.</p>
              ) : (
                <ol className="relative space-y-6 border-l border-border pl-6">
                  {activity.map((event) => {
                    const meta = activityMeta[event.type];
                    const Icon = meta.icon;
                    return (
                      <li key={event.id} className="relative">
                        <span
                          className={`absolute -left-[35px] flex h-7 w-7 items-center justify-center rounded-full ${meta.className}`}
                        >
                          <Icon className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                          <p className="text-sm font-medium text-foreground">{event.title}</p>
                          <time className="text-xs text-muted-foreground" title={formatDate(event.date)}>
                            {timeAgo(event.date)}
                          </time>
                        </div>
                        {event.description && (
                          <p className="mt-0.5 text-sm text-muted-foreground">{event.description}</p>
                        )}
                      </li>
                    );
                  })}
                </ol>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        title={`Archive ${campaign.name}?`}
        description="This campaign will be removed from your campaign list. This is a local demo action and cannot be undone."
        confirmLabel="Archive campaign"
        destructive
        onConfirm={() => {
          deleteCampaign(campaign.id);
          router.push(`/marketing/campaigns?archived=${encodeURIComponent(campaign.name)}`);
        }}
      />
    </div>
  );
}