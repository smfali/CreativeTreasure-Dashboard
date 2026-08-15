"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ProductThumbnail } from "@/components/products/ProductThumbnail";
import { getTopProducts, getTopCustomers } from "@/lib/data/revenue";
import { formatMoney, formatNumber } from "@/lib/format";

interface TopPerformersProps {
  symbol: string;
}

function GrowthBadge({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <Badge
      variant={up ? "success" : "destructive"}
      aria-label={`${up ? "up" : "down"} ${Math.abs(value).toFixed(1)} percent`}
    >
      {up ? <TrendingUp className="h-3 w-3" aria-hidden /> : <TrendingDown className="h-3 w-3" aria-hidden />}
      {Math.abs(value).toFixed(1)}%
    </Badge>
  );
}

export default function TopPerformers({ symbol }: TopPerformersProps) {
  const products = useMemo(() => getTopProducts(5), []);
  const customers = useMemo(() => getTopCustomers(5), []);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="heading-section text-foreground">Top products</h3>
          <p className="text-sm text-muted-foreground">By all-time revenue</p>
        </div>
        <ol className="space-y-4">
          {products.map((p, i) => (
            <li key={p.id} className="flex items-center gap-3">
              <span className="w-5 shrink-0 text-sm font-semibold text-muted-foreground">
                {i + 1}
              </span>
              <ProductThumbnail name={p.name} type={p.type} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.category} · {formatNumber(p.sales)} sales
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-foreground">
                  {formatMoney(p.revenue, symbol)}
                </p>
                <GrowthBadge value={p.growth} />
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <Card className="p-6">
        <div className="mb-4">
          <h3 className="heading-section text-foreground">Top customers</h3>
          <p className="text-sm text-muted-foreground">By lifetime value</p>
        </div>
        <ol className="space-y-4">
          {customers.map((c, i) => (
            <li key={c.id} className="flex items-center gap-3">
              <span className="w-5 shrink-0 text-sm font-semibold text-muted-foreground">
                {i + 1}
              </span>
              <Avatar name={c.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  {c.location} · {formatNumber(c.orders)} orders
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-foreground">
                  {formatMoney(c.revenue, symbol)}
                </p>
                <GrowthBadge value={c.growth} />
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
