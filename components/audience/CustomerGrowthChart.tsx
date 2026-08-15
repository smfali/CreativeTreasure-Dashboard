"use client";

import { useTheme } from "next-themes";
import { Card } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { customerGrowth } from "@/lib/data/customers";

export default function CustomerGrowthChart() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  const gridStroke = dark ? "#27272a" : "#e4e4e7";
  const tickFill = dark ? "#a1a1aa" : "#71717a";
  const axisStroke = dark ? "#27272a" : "#e4e4e7";
  const tooltipStyle = dark
    ? { backgroundColor: "#18181b", border: "1px solid #3f3f46", color: "#f4f4f5" }
    : { backgroundColor: "#ffffff", border: "1px solid #e4e4e7", color: "#18181b" };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="heading-section text-foreground">Customer Growth</h3>
        <p className="text-sm text-muted-foreground">Last 6 months</p>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={customerGrowth}>
            <defs>
              <linearGradient id="newGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke={gridStroke} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: tickFill, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: axisStroke }}
            />
            <YAxis tick={{ fill: tickFill, fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipStyle.backgroundColor,
                border: tooltipStyle.border,
                borderRadius: "8px",
                color: tooltipStyle.color,
                fontSize: "13px",
              }}
            />
            <Area
              type="monotone"
              dataKey="returning"
              stroke="#10b981"
              strokeWidth={2}
              fill="none"
            />
            <Area
              type="monotone"
              dataKey="new"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#newGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
