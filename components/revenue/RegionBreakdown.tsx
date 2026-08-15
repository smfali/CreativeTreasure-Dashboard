"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { regionBreakdown } from "@/lib/data/revenue";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

interface RegionBreakdownProps {
  symbol: string;
}

export default function RegionBreakdown({ symbol }: RegionBreakdownProps) {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="heading-section text-foreground">Revenue by region</h3>
        <p className="text-sm text-muted-foreground">All-time product revenue</p>
      </div>
      <ul className="space-y-4">
        {regionBreakdown.map((row) => {
          const up = row.change >= 0;
          return (
            <li key={row.name}>
              <div className="mb-1 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">{row.name}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatMoney(row.revenue, symbol)}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {(row.share * 100).toFixed(0)}%
                  </span>
                  <Badge
                    variant={up ? "success" : "destructive"}
                    aria-label={`${up ? "up" : "down"} ${Math.abs(row.change).toFixed(1)} percent`}
                  >
                    {up ? (
                      <TrendingUp className="h-3 w-3" aria-hidden />
                    ) : (
                      <TrendingDown className="h-3 w-3" aria-hidden />
                    )}
                    {Math.abs(row.change).toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <div
                role="progressbar"
                aria-valuenow={Math.round(row.share * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${row.name} revenue share`}
                className="h-2 w-full overflow-hidden rounded-full bg-muted"
              >
                <div
                  className={cn("h-full rounded-full bg-indigo-500")}
                  style={{ width: `${row.share * 100}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">
        Geo split is simulated mock data based on customer locations.
      </p>
    </Card>
  );
}
