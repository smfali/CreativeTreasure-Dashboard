"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useChartTheme } from "@/components/revenue/useChartTheme";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import type { MonthlyMarketingPoint } from "@/lib/data/marketing";

type TooltipValue = number | string | ReadonlyArray<number | string>;

export function ConversionsOverTimeChart({ monthly }: { monthly: MonthlyMarketingPoint[] }) {
  const theme = useChartTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversions over time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
              <CartesianGrid strokeDasharray="4 4" stroke={theme.gridStroke} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: theme.tickFill, fontSize: 12 }} tickLine={false} axisLine={{ stroke: theme.axisStroke }} />
              <YAxis tick={{ fill: theme.tickFill, fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
              <Tooltip
                cursor={{ fill: theme.dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
                contentStyle={{ ...theme.tooltipStyle, borderRadius: "8px", fontSize: "13px" }}
                formatter={(value: TooltipValue | undefined) => [formatNumber(Number(value)), "Conversions"]}
                labelStyle={{ color: theme.tooltipStyle.color, fontWeight: 600 }}
              />
              <Bar dataKey="conversions" fill={theme.colors.success} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}