"use client";

import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useChartTheme } from "./useChartTheme";
import { getRangeSeries, rangeOptions, type RevenueRange } from "@/lib/data/revenue";
import { formatNumber } from "@/lib/format";

type TooltipValue = number | string | ReadonlyArray<number | string>;

interface SalesPerformanceChartProps {
  range: RevenueRange;
}

export default function SalesPerformanceChart({ range }: SalesPerformanceChartProps) {
  const theme = useChartTheme();
  const data = getRangeSeries(range);
  const rangeLabel = rangeOptions.find((r) => r.value === range)?.label ?? range;

  return (
    <Card className="p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="heading-section text-foreground">Sales performance</h3>
          <p className="text-sm text-muted-foreground">
            Orders last {rangeLabel.toLowerCase()} vs previous period
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" aria-hidden />
            This period
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-zinc-300 dark:bg-zinc-600" aria-hidden />
            Previous period
          </span>
        </div>
      </div>
      <figure>
        <figcaption className="sr-only">
          Number of orders over the selected period compared with the previous period.
        </figcaption>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }} barGap={2}>
              <CartesianGrid strokeDasharray="4 4" stroke={theme.gridStroke} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: theme.tickFill, fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: theme.axisStroke }}
                minTickGap={28}
              />
              <YAxis
                tick={{ fill: theme.tickFill, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                cursor={{ fill: theme.dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
                formatter={(value: TooltipValue | undefined) =>
                  typeof value === "number" ? formatNumber(value) : value
                }
                contentStyle={{
                  backgroundColor: theme.tooltipStyle.backgroundColor,
                  border: theme.tooltipStyle.border,
                  borderRadius: "8px",
                  color: theme.tooltipStyle.color,
                  fontSize: "13px",
                }}
                labelStyle={{ color: theme.tooltipStyle.color, fontWeight: 600 }}
              />
              <Bar dataKey="previousSales" name="Previous period" fill={theme.colors.muted} radius={[3, 3, 0, 0]} />
              <Bar dataKey="sales" name="Sales" fill="#6366f1" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </figure>
    </Card>
  );
}
