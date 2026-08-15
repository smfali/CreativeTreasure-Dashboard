"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useChartTheme } from "./useChartTheme";
import { getRevenueByCategory } from "@/lib/data/revenue";
import { formatMoney } from "@/lib/format";

const palette = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#06b6d4", "#8b5cf6", "#f97316", "#84cc16"];

type TooltipValue = number | string | ReadonlyArray<number | string>;

interface CategoryBreakdownProps {
  symbol: string;
}

export default function CategoryBreakdown({ symbol }: CategoryBreakdownProps) {
  const theme = useChartTheme();
  const data = useMemo(() => getRevenueByCategory(), []);
  const total = data.reduce((s, d) => s + d.revenue, 0);

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="heading-section text-foreground">Revenue by category</h3>
        <p className="text-sm text-muted-foreground">Share of all-time product revenue</p>
      </div>
      <figure>
        <figcaption className="sr-only">
          Donut chart showing the revenue share of each product category.
        </figcaption>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(value: TooltipValue | undefined) =>
                  typeof value === "number" ? formatMoney(value, symbol) : value
                }
                contentStyle={{
                  backgroundColor: theme.tooltipStyle.backgroundColor,
                  border: theme.tooltipStyle.border,
                  borderRadius: "8px",
                  color: theme.tooltipStyle.color,
                  fontSize: "13px",
                }}
              />
              <Pie
                data={data}
                dataKey="revenue"
                nameKey="name"
                innerRadius="58%"
                outerRadius="82%"
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={entry.name} fill={palette[i % palette.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </figure>
      <ul className="mt-5 space-y-3">
        {data.map((row, i) => {
          const up = row.trend >= 0;
          return (
            <li key={row.name} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: palette[i % palette.length] }}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{row.name}</p>
                  <p className="text-xs text-muted-foreground">{formatMoney(row.revenue, symbol)}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {row.pct.toFixed(1)}%
                </span>
                <Badge
                  variant={up ? "success" : "destructive"}
                  className="gap-0.5"
                  aria-label={`${row.trend >= 0 ? "up" : "down"} ${Math.abs(row.trend).toFixed(1)} percent`}
                >
                  {up ? (
                    <TrendingUp className="h-3 w-3" aria-hidden />
                  ) : (
                    <TrendingDown className="h-3 w-3" aria-hidden />
                  )}
                  {Math.abs(row.trend).toFixed(1)}%
                </Badge>
              </div>
            </li>
          );
        })}
        {data.length === 0 && (
          <li className="py-8 text-center text-sm text-muted-foreground">No category data yet.</li>
        )}
      </ul>
      <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
        Total {formatMoney(total, symbol)} across {data.length} categories.
      </p>
    </Card>
  );
}
