"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useChartTheme } from "@/components/revenue/useChartTheme";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import type { Campaign } from "@/lib/data/marketing";

type TooltipValue = number | string | ReadonlyArray<number | string>;

export function CampaignPerformanceChart({ campaigns }: { campaigns: Campaign[] }) {
  const theme = useChartTheme();
  const rows = campaigns
    .filter((c) => c.clicks > 0)
    .sort((a, b) => b.conversions - a.conversions)
    .slice(0, 6)
    .map((c) => ({ name: c.name, clicks: c.clicks, conversions: c.conversions }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
              <CartesianGrid strokeDasharray="4 4" stroke={theme.gridStroke} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: theme.tickFill, fontSize: 11 }} tickLine={false} axisLine={{ stroke: theme.axisStroke }} interval={0} angle={-18} textAnchor="end" height={70} />
              <YAxis tick={{ fill: theme.tickFill, fontSize: 11 }} tickLine={false} axisLine={false} width={48} />
              <Tooltip
                cursor={{ fill: theme.dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
                contentStyle={{ ...theme.tooltipStyle, borderRadius: "8px", fontSize: "13px" }}
                formatter={(value: TooltipValue | undefined, name: TooltipValue | undefined) => [
                  formatNumber(Number(value)),
                  name === "clicks" ? "Clicks" : "Conversions",
                ]}
                labelStyle={{ color: theme.tooltipStyle.color, fontWeight: 600 }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", color: theme.tickFill }} />
              <Bar dataKey="clicks" name="clicks" fill={theme.colors.muted} radius={[4, 4, 0, 0]} />
              <Bar dataKey="conversions" name="conversions" fill={theme.colors.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}