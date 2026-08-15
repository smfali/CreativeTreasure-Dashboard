"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, FileSpreadsheet, CalendarRange } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import Breadcrumb from "@/components/Breadcrumb";
import TableSkeleton from "@/components/TableSkeleton";
import EmptyState from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ProductThumbnail } from "@/components/products/ProductThumbnail";
import { KpiCard } from "@/components/revenue/KpiCard";
import RevenueTrendChart from "@/components/revenue/RevenueTrendChart";
import SalesPerformanceChart from "@/components/revenue/SalesPerformanceChart";
import CategoryBreakdown from "@/components/revenue/CategoryBreakdown";
import RegionBreakdown from "@/components/revenue/RegionBreakdown";
import CustomerRevenue from "@/components/revenue/CustomerRevenue";
import TopPerformers from "@/components/revenue/TopPerformers";
import {
  rangeOptions,
  getRangeKpis,
  getRevenueByProduct,
  getRevenueByCategory,
  buildReportCsv,
  type RevenueRange,
} from "@/lib/data/revenue";
import { formatMoney, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function RevenuePage() {
  const { symbol } = useCurrency();
  const [range, setRange] = useState<RevenueRange>("30d");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const kpis = useMemo(() => getRangeKpis(range), [range]);
  const categories = useMemo(() => getRevenueByCategory(), []);
  const products = useMemo(
    () => (category === "all" ? getRevenueByProduct() : getRevenueByProduct().filter((p) => p.category === category)),
    [category]
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  function handleExport() {
    const csv = buildReportCsv(range);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `creative-treasury-revenue-${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice(`Report exported for the ${rangeOptions.find((r) => r.value === range)?.label} period.`);
    window.setTimeout(() => setNotice(null), 4000);
  }

  if (loading) {
    return (
      <div className="p-4 space-y-6 sm:p-8">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Revenue" }]} />
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
        <TableSkeleton rows={5} cols={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Revenue" }]} />
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="heading-page">Revenue &amp; Analytics</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Revenue, orders, customers and performance for CreativeTreasury.
            </p>
          </div>
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" aria-hidden />
            Export report
          </Button>
        </div>
      </div>

      <div
        role="group"
        aria-label="Report period"
        className="flex flex-wrap items-center gap-2"
      >
        <CalendarRange className="h-4 w-4 text-muted-foreground" aria-hidden />
        {rangeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={range === option.value}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              range === option.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setRange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <section aria-labelledby="kpis-heading">
        <h2 id="kpis-heading" className="sr-only">
          Key metrics
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <KpiCard label="Total revenue" value={formatMoney(kpis.totalRevenue, symbol)} change={kpis.revenueGrowth} />
          <KpiCard label="Net revenue" value={formatMoney(kpis.netRevenue, symbol)} change={kpis.netGrowth} hint="After fees and refunds" />
          <KpiCard label="Orders" value={formatNumber(kpis.totalSales)} change={kpis.salesGrowth} />
          <KpiCard label="Avg. order value" value={formatMoney(kpis.avgOrderValue, symbol)} change={kpis.aovGrowth} />
          <KpiCard label="New customers" value={formatNumber(kpis.customersNew)} change={kpis.customerGrowth} />
          <KpiCard label="Avg. customer value" value={formatMoney(kpis.avgCustomerValue, symbol)} change={kpis.revenueGrowth} />
        </div>
      </section>

      <section aria-labelledby="trend-heading" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueTrendChart range={range} symbol={symbol} />
        <SalesPerformanceChart range={range} />
      </section>

      <section aria-labelledby="breakdown-heading" className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex flex-wrap items-center justify-between gap-3 p-6 pb-2">
              <div>
                <h3 id="breakdown-heading" className="heading-section text-foreground">
                  Revenue by product
                </h3>
                <p className="text-sm text-muted-foreground">All-time product revenue</p>
              </div>
              <label className="sr-only" htmlFor="product-category-filter">
                Filter products by category
              </label>
              <select
                id="product-category-filter"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-9 rounded-md border border-input bg-transparent px-3 pr-8 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="all">All categories</option>
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            {products.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={FileSpreadsheet}
                  title="No products in this category"
                  description="There are no published products matching the selected category."
                  action={
                    <Button variant="outline" onClick={() => setCategory("all")}>
                      Show all categories
                    </Button>
                  }
                />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Contribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <ProductThumbnail name={p.name} type={p.type} />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.category}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-foreground">
                        {formatNumber(p.sales)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-foreground">
                        {formatMoney(p.revenue, symbol)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{p.pct.toFixed(1)}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
        <CategoryBreakdown symbol={symbol} />
      </section>

      <section aria-labelledby="customer-revenue-heading" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CustomerRevenue range={range} symbol={symbol} />
        <RegionBreakdown symbol={symbol} />
      </section>

      <section aria-labelledby="top-heading">
        <h2 id="top-heading" className="heading-section mb-4 text-foreground">
          Top performers
        </h2>
        <TopPerformers symbol={symbol} />
      </section>

      <div
        className={cn(
          "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground shadow-lg transition-opacity duration-300",
          notice ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        role="status"
        aria-live="polite"
      >
        {notice}
      </div>
    </div>
  );
}
