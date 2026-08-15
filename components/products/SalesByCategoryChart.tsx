"use client";

import { useTheme } from "next-themes";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SalesByCategoryChartProps {
  data: { name: string; revenue: number; sales: number }[];
}

export default function SalesByCategoryChart({ data }: SalesByCategoryChartProps) {
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
        <h3 className="heading-section text-foreground">Revenue by category</h3>
        <p className="text-sm text-muted-foreground">All products</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="4 4" stroke={gridStroke} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: tickFill, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: axisStroke }}
            />
            <YAxis tick={{ fill: tickFill, fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
              contentStyle={{
                backgroundColor: tooltipStyle.backgroundColor,
                border: tooltipStyle.border,
                borderRadius: "8px",
                color: tooltipStyle.color,
                fontSize: "13px",
              }}
            />
            <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
