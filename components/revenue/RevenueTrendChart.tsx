"use client";

import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useChartTheme } from "./useChartTheme";
import { getRangeSeries, rangeOptions, type RevenueRange } from "@/lib/data/revenue";
import { formatMoney } from "@/lib/format";

type TooltipValue = number | string | ReadonlyArray<number | string>;

interface RevenueTrendChartProps {
  range: RevenueRange;
  symbol: string;
}

export default function RevenueTrendChart({ range, symbol }: RevenueTrendChartProps) {
  const theme = useChartTheme();
  const data = getRangeSeries(range);
  const rangeLabel = rangeOptions.find((r) => r.value === range)?.label ?? range;

  return (
    <Card className="p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="heading-section text-foreground">Revenue trend</h3>
          <p className="text-sm text-muted-foreground">
            Last {rangeLabel.toLowerCase()} vs previous period
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" aria-hidden />
            This period
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded bg-zinc-400 dark:bg-zinc-500" aria-hidden />
            Previous period
          </span>
        </div>
      </div>
      <figure>
        <figcaption className="sr-only">
          Revenue over the selected period compared with the previous period.
        </figcaption>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
              <defs>
                <linearGradient id="revenueRangeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                width={56}
              />
              <Tooltip
                cursor={{ stroke: theme.colors.muted }}
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
                labelStyle={{ color: theme.tooltipStyle.color, fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="previous"
                name="Previous period"
                stroke={theme.colors.muted}
                strokeWidth={1.5}
                strokeDasharray="5 5"
                fill="none"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#revenueRangeGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </figure>
    </Card>
  );
}
