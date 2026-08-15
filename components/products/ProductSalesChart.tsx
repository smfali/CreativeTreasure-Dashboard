"use client";

import { useTheme } from "next-themes";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getProductTrend, type Product } from "@/lib/data/products";

interface ProductSalesChartProps {
  product: Product;
}

export default function ProductSalesChart({ product }: ProductSalesChartProps) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  const gridStroke = dark ? "#27272a" : "#e4e4e7";
  const tickFill = dark ? "#a1a1aa" : "#71717a";
  const axisStroke = dark ? "#27272a" : "#e4e4e7";
  const tooltipStyle = dark
    ? { backgroundColor: "#18181b", border: "1px solid #3f3f46", color: "#f4f4f5" }
    : { backgroundColor: "#ffffff", border: "1px solid #e4e4e7", color: "#18181b" };

  const data = getProductTrend(product.id);

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="heading-section text-foreground">Sales &amp; revenue trend</h3>
        <p className="text-sm text-muted-foreground">Last 6 months</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="4 4" stroke={gridStroke} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: tickFill, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: axisStroke }}
            />
            <YAxis yAxisId="left" tick={{ fill: tickFill, fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis
              yAxisId="right"
              orientation="right"
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
                fontSize: "13px",
              }}
            />
            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} name="Revenue" dot={false} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="sales"
              stroke="#10b981"
              strokeWidth={2}
              name="Sales"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
