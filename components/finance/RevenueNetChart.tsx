"use client";

import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useChartTheme } from "@/components/revenue/useChartTheme";
import { getPerformanceSeries, rangeBounds, financeRangeOptions, type FinanceRange, type FinanceTransaction } from "@/lib/data/finance";
import { formatMoney } from "@/lib/format";

type TooltipValue = number | string | ReadonlyArray<number | string>;

interface RevenueNetChartProps {
  range: FinanceRange;
  today: string;
  transactions: FinanceTransaction[];
  symbol: string;
}

export function RevenueNetChart({ range, today, transactions, symbol }: RevenueNetChartProps) {
  const theme = useChartTheme();
  const data = getPerformanceSeries(transactions, range, today);
  const rangeLabel = financeRangeOptions.find((r) => r.value === range)?.label ?? range;

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="heading-section text-foreground">Revenue vs net revenue</h3>
        <p className="text-sm text-muted-foreground">Gross versus net after fees and refunds · {rangeLabel.toLowerCase()}</p>
      </div>
      <figure>
        <figcaption className="sr-only">
          Area chart comparing gross revenue with net revenue over the selected period.
        </figcaption>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
              <defs>
                <linearGradient id="financeGrossGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="financeNetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
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
              <YAxis tick={{ fill: theme.tickFill, fontSize: 11 }} tickLine={false} axisLine={false} width={56} />
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
                dataKey="net"
                name="Net revenue"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#financeNetGradient)"
              />
              <Area
                type="monotone"
                dataKey="gross"
                name="Gross revenue"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#financeGrossGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </figure>
      <p className="sr-only">
        Chart window {rangeBounds(range, today).start ?? "start"} to {rangeBounds(range, today).end ?? "end"}.
      </p>
    </Card>
  );
}