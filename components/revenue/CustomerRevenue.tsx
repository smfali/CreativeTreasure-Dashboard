"use client";

import { useMemo } from "react";
import { UserPlus, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getCustomerRevenueSummary, getRangeKpis, type RevenueRange } from "@/lib/data/revenue";
import { formatMoney, formatNumber } from "@/lib/format";

interface CustomerRevenueProps {
  range: RevenueRange;
  symbol: string;
}

export default function CustomerRevenue({ range, symbol }: CustomerRevenueProps) {
  const summary = useMemo(() => getCustomerRevenueSummary(range), [range]);
  const kpis = useMemo(() => getRangeKpis(range), [range]);
  const total = summary.newRevenue + summary.returningRevenue;
  const newShare = total > 0 ? (summary.newRevenue / total) * 100 : 0;

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="heading-section text-foreground">Customer revenue</h3>
        <p className="text-sm text-muted-foreground">New vs returning customers this period</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-muted/40 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserPlus className="h-4 w-4 text-indigo-500" aria-hidden />
            Revenue from new customers
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {formatMoney(summary.newRevenue, symbol)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatNumber(summary.newCustomers)} new customers · {newShare.toFixed(0)}% of revenue
          </p>
        </div>
        <div className="rounded-lg border border-border bg-muted/40 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserCheck className="h-4 w-4 text-emerald-500" aria-hidden />
            Revenue from returning customers
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {formatMoney(summary.returningRevenue, symbol)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatNumber(summary.returningCustomers)} returning customers ·{" "}
            {(100 - newShare).toFixed(0)}% of revenue
          </p>
        </div>
      </div>

      <div
        role="progressbar"
        aria-valuenow={Math.round(newShare)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Share of revenue from new vs returning customers"
        className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-muted"
      >
        <div className="h-full bg-indigo-500" style={{ width: `${newShare}%` }} />
        <div className="h-full bg-emerald-500" style={{ width: `${100 - newShare}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>New {newShare.toFixed(0)}%</span>
        <span>Returning {(100 - newShare).toFixed(0)}%</span>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-muted-foreground">Average customer value</dt>
          <dd className="mt-0.5 text-lg font-bold text-foreground">
            {formatMoney(summary.avgCustomerValue, symbol)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Customers this period</dt>
          <dd className="mt-0.5 text-lg font-bold text-foreground">
            {formatNumber(summary.buyers)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Total revenue</dt>
          <dd className="mt-0.5 text-lg font-bold text-foreground">
            {formatMoney(kpis.totalRevenue, symbol)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Order count</dt>
          <dd className="mt-0.5 text-lg font-bold text-foreground">
            {formatNumber(kpis.totalSales)}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
