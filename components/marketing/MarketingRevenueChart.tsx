"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useChartTheme } from "@/components/revenue/useChartTheme";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatNumber, formatMoney } from "@/lib/format";
import type { MonthlyMarketingPoint } from "@/lib/data/marketing";

type TooltipValue = number | string | ReadonlyArray<number | string>;

export function MarketingRevenueChart({
  monthly,
  symbol,
}: {
  monthly: MonthlyMarketingPoint[];
  symbol: string;
}) {
  const theme = useChartTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketing revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthly} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
              <CartesianGrid strokeDasharray="4 4" stroke={theme.gridStroke} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: theme.tickFill, fontSize: 12 }} tickLine={false} axisLine={{ stroke: theme.axisStroke }} />
              <YAxis
                yAxisId="revenue"
                tick={{ fill: theme.tickFill, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={56}
                tickFormatter={(v: number) => `$${formatNumber(Math.round(v / 1000))}k`}
              />
              <YAxis
                yAxisId="conversions"
                orientation="right"
                tick={{ fill: theme.tickFill, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={36}
              />
              <Tooltip
                cursor={{ fill: theme.dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
                contentStyle={{ ...theme.tooltipStyle, borderRadius: "8px", fontSize: "13px" }}
                formatter={(value: TooltipValue | undefined, name: TooltipValue | undefined) =>
                  name === "revenue"
                    ? [formatMoney(Number(value), symbol), "Revenue"]
                    : [formatNumber(Number(value)), "Conversions"]
                }
                labelStyle={{ color: theme.tooltipStyle.color, fontWeight: 600 }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", color: theme.tickFill }} />
              <Bar yAxisId="revenue" dataKey="revenue" name="revenue" fill={theme.colors.primary} radius={[4, 4, 0, 0]} />
              <Line yAxisId="conversions" dataKey="conversions" name="conversions" stroke={theme.colors.success} strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}