"use client";

import { useEffect, useMemo, useState } from "react";
import { Percent, Wallet, TrendingUp, Info } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import TableSkeleton from "@/components/TableSkeleton";
import { FinanceNav } from "@/components/finance/FinanceNav";
import { FinancialStatCard } from "@/components/finance/FinancialStatCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFinance } from "@/contexts/FinanceContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getFeeBreakdown } from "@/lib/data/finance";
import { formatMoney } from "@/lib/format";

const categoryColors: Record<string, string> = {
  Platform: "#6366f1",
  Processing: "#10b981",
  Refund: "#ec4899",
  Other: "#f59e0b",
};

export default function FeesPage() {
  const { transactions } = useFinance();
  const { symbol } = useCurrency();

  const [loading, setLoading] = useState(true);
  const breakdown = useMemo(() => getFeeBreakdown(transactions), [transactions]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const rows = [
    { name: "Platform", value: breakdown.platform, description: "Marketplace commission on sales" },
    { name: "Processing", value: breakdown.processing, description: "Card and payment processing fees" },
    { name: "Refund", value: breakdown.refund, description: "Charges applied when refunds are issued" },
    { name: "Other", value: breakdown.other, description: "Disputes, subscriptions and adjustments" },
  ];

  if (loading) {
    return (
      <div className="p-4 space-y-6 sm:p-8">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Finance" }, { label: "Fees" }]} />
        <Skeleton className="h-9 w-40" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <TableSkeleton rows={4} cols={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Finance" }, { label: "Fees" }]} />
        <div className="mt-2">
          <h1 className="heading-page">Fees</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Platform, processing and refund fees for CreativeTreasury.
          </p>
        </div>
      </div>

      <FinanceNav />

      <section aria-labelledby="fee-kpis-heading">
        <h2 id="fee-kpis-heading" className="sr-only">
          Fee summary
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <FinancialStatCard
            label="Total fees"
            value={formatMoney(breakdown.total, symbol)}
            hint="All-time"
          />
          <FinancialStatCard
            label="Effective rate"
            value={`${breakdown.effectiveRate.toFixed(2)}%`}
            hint="Of gross revenue"
          />
          <FinancialStatCard
            label="Gross revenue"
            value={formatMoney(breakdown.gross, symbol)}
            hint="All-time"
          />
          <FinancialStatCard
            label="Net revenue"
            value={formatMoney(breakdown.netRevenue, symbol)}
            hint="After fees and refunds"
          />
        </div>
      </section>

      <Card>
        <div className="p-6 pb-2">
          <h2 className="heading-section text-foreground">Fee breakdown</h2>
          <p className="text-sm text-muted-foreground">
            Fees are calculated deterministically from each transaction and reconcile with net revenue.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Fee breakdown by category</caption>
            <thead>
              <tr className="border-b border-border [&_th]:text-left [&_th]:font-medium [&_th]:text-muted-foreground">
                <th scope="col" className="px-6 py-4">
                  Category
                </th>
                <th scope="col" className="px-6 py-4 text-left">
                  Description
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  Amount
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  Share
                </th>
                <th scope="col" className="px-6 py-4">
                  Distribution
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name} className="border-b border-border last:border-0">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 font-medium text-foreground">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: categoryColors[row.name] }}
                        aria-hidden
                      />
                      {row.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{row.description}</td>
                  <td className="px-6 py-4 text-right font-medium text-foreground">
                    {formatMoney(row.value, symbol)}
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground">
                    {breakdown.total > 0 ? ((row.value / breakdown.total) * 100).toFixed(1) : "0.0"}%
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="h-2 overflow-hidden rounded-full bg-muted"
                      role="img"
                      aria-label={`${row.name} fees represent ${breakdown.total > 0 ? ((row.value / breakdown.total) * 100).toFixed(1) : "0"}% of total fees`}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${breakdown.total > 0 ? Math.max(0, (row.value / breakdown.total) * 100) : 0}%`,
                          backgroundColor: categoryColors[row.name],
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="border-t border-border">
                <td className="px-6 py-4 font-semibold text-foreground">Total fees</td>
                <td className="px-6 py-4 text-muted-foreground">All fee categories combined</td>
                <td className="px-6 py-4 text-right font-bold text-foreground">
                  {formatMoney(breakdown.total, symbol)}
                </td>
                <td className="px-6 py-4 text-right text-muted-foreground">100%</td>
                <td className="px-6 py-4" />
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Percent className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Revenue retained</p>
              <p className="text-2xl font-bold text-foreground">
                {breakdown.gross > 0 ? (((breakdown.gross - breakdown.refunds) / breakdown.gross) * 100).toFixed(1) : "0"}%
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Share of gross revenue kept before fees are deducted.
          </p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <TrendingUp className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Net margin</p>
              <p className="text-2xl font-bold text-foreground">
                {breakdown.gross > 0 ? ((breakdown.netRevenue / breakdown.gross) * 100).toFixed(1) : "0"}%
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Net revenue as a percentage of gross revenue.
          </p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <Wallet className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Refund impact</p>
              <p className="text-2xl font-bold text-foreground">
                {breakdown.gross > 0 ? ((breakdown.refunds / breakdown.gross) * 100).toFixed(1) : "0"}%
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Refunds as a percentage of gross revenue.
          </p>
        </Card>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5" aria-hidden />
        Fees are computed locally from transaction data for this demo — no real financial processing occurs.
      </div>
    </div>
  );
}