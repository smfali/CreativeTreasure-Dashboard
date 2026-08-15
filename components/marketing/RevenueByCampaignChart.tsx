"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useChartTheme } from "@/components/revenue/useChartTheme";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import type { Campaign } from "@/lib/data/marketing";

type TooltipValue = number | string | ReadonlyArray<number | string>;

export function RevenueByCampaignChart({
  campaigns,
  symbol,
}: {
  campaigns: Campaign[];
  symbol: string;
}) {
  const theme = useChartTheme();
  const rows = campaigns
    .filter((c) => c.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 7)
    .map((c) => ({ name: c.name, revenue: c.revenue }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by campaign</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
              <CartesianGrid strokeDasharray="4 4" stroke={theme.gridStroke} horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: theme.tickFill, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={170}
                tick={{ fill: theme.tickFill, fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: theme.axisStroke }}
              />
              <Tooltip
                cursor={{ fill: theme.dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
                contentStyle={{ ...theme.tooltipStyle, borderRadius: "8px", fontSize: "13px" }}
                formatter={(value: TooltipValue | undefined) => [formatMoney(Number(value), symbol), "Revenue"]}
                labelStyle={{ color: theme.tooltipStyle.color, fontWeight: 600 }}
              />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={22}>
                {rows.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? theme.colors.primary : theme.colors.muted} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}