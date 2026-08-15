"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useChartTheme } from "@/components/revenue/useChartTheme";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import type { ChannelPerformance } from "@/lib/data/marketing";

type TooltipValue = number | string | ReadonlyArray<number | string>;

const channelColors = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"];

export function ChannelPerformanceChart({
  channels,
  symbol,
}: {
  channels: ChannelPerformance[];
  symbol: string;
}) {
  const theme = useChartTheme();
  const rows = [...channels]
    .sort((a, b) => b.revenue - a.revenue)
    .map((c, i) => ({ name: c.label, revenue: c.revenue, fill: channelColors[i % channelColors.length] }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Channel performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
              <CartesianGrid strokeDasharray="4 4" stroke={theme.gridStroke} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: theme.tickFill, fontSize: 12 }} tickLine={false} axisLine={{ stroke: theme.axisStroke }} />
              <YAxis
                tick={{ fill: theme.tickFill, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={56}
                tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
              />
              <Tooltip
                cursor={{ fill: theme.dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
                contentStyle={{ ...theme.tooltipStyle, borderRadius: "8px", fontSize: "13px" }}
                formatter={(value: TooltipValue | undefined) => [formatMoney(Number(value), symbol), "Revenue"]}
                labelStyle={{ color: theme.tooltipStyle.color, fontWeight: 600 }}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]} barSize={40}>
                {rows.map((r) => (
                  <Cell key={r.name} fill={r.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}