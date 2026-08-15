"use client";

import { useTheme } from "next-themes";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  subs: Math.floor(12000 + Math.sin(i * 0.5) * 500 + i * 80),
  revenue: Math.floor(3200 + Math.sin(i * 0.3) * 200 + i * 15),
}));

function handleExportCSV() {
  const headers = ["date", "subs", "revenue"];
  const rows = data.map((row) => [row.date, row.subs, row.revenue]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "creator-treasury-data.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function GrowthChart() {
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
      <h3 className="heading-section mb-4 text-foreground">Growth</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke={gridStroke}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: tickFill, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: axisStroke }}
            />
            <YAxis
              tick={{ fill: tickFill, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipStyle.backgroundColor,
                border: tooltipStyle.border,
                borderRadius: "8px",
                color: tooltipStyle.color,
              }}
            />
            <Area
              type="monotone"
              dataKey="subs"
              stroke="#6366f1"
              strokeWidth={2}
              fill="none"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleExportCSV}
        className="mt-4 text-muted-foreground hover:text-foreground"
      >
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
    </Card>
  );
}
