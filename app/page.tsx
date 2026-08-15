"use client";

import MetricCard from "@/components/MetricCard";
import GrowthChart from "@/components/GrowthChart";
import Breadcrumb from "@/components/Breadcrumb";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useCurrency } from "@/contexts/CurrencyContext";

function MetricCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-4 w-14" />
      </div>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <Card className="p-6">
      <Skeleton className="mb-4 h-3 w-16" />
      <Skeleton className="h-72 w-full" />
    </Card>
  );
}

const platforms = [
  {
    name: "YouTube",
    color: "bg-red-500",
    stats: { followers: "124K", engagement: "4.8%", revenue: "$2,840" },
    values: { followers: 100, engagement: 80, revenue: 100 },
  },
  {
    name: "Newsletter",
    color: "bg-blue-500",
    stats: { followers: "8.2K", engagement: "6.2%", revenue: "$1,920" },
    values: { followers: 30, engagement: 100, revenue: 60 },
  },
  {
    name: "Twitter",
    color: "bg-sky-500",
    stats: { followers: "42K", engagement: "2.1%", revenue: "$680" },
    values: { followers: 55, engagement: 40, revenue: 25 },
  },
];

const topContent = [
  { title: "Summer Vibes Q&A", views: "8.2k", revenue: "$1,340" },
  { title: "Behind the Scenes Vlog", views: "6.7k", revenue: "$980" },
  { title: "Reacting to Your Comments", views: "5.1k", revenue: "$720" },
  { title: "Weekly Livestream #42", views: "4.9k", revenue: "$610" },
];

export default function Home() {
  const { data, loading } = useDashboardData();
  const { format } = useCurrency();

  return (
    <>
      <Breadcrumb segments={[{ label: "Home" }]} />
        <h1 className="heading-page">Welcome back</h1>
        {loading ? (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
            </div>
            <ChartSkeleton />
            <Card className="p-6">
              <Skeleton className="mb-4 h-3 w-40" />
              <div className="space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <Skeleton className="mb-4 h-3 w-40" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data?.metrics.map((metric) => (
                <MetricCard key={metric.title} {...metric} value={metric.value.startsWith("$") ? format(metric.value) : metric.value} inverse={metric.inverse} />
              ))}
            </div>
            <GrowthChart />
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topContent.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-foreground">{item.title}</TableCell>
                      <TableCell className="text-muted-foreground">{item.views}</TableCell>
                      <TableCell className="text-foreground">{format(item.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
            <div>
              <h3 className="heading-section mb-4 text-foreground">Platform Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {platforms.map((p) => (
                  <Card key={p.name} className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                      <span className="text-sm font-medium text-foreground">{p.name}</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: "Followers", value: p.stats.followers, pct: p.values.followers },
                        { label: "Engagement", value: p.stats.engagement, pct: p.values.engagement },
                        { label: "Revenue", value: p.stats.revenue, pct: p.values.revenue },
                      ].map((row) => (
                        <div key={row.label}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{row.label}</span>
                            <span className="text-foreground">{row.label === "Revenue" ? format(row.value) : row.value}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${p.color}`} style={{ width: `${row.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
    </>
  );
}
