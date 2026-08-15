"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card } from "@/components/ui/card";
import { ProductThumbnail } from "@/components/products/ProductThumbnail";
import { useChartTheme } from "@/components/revenue/useChartTheme";
import { getOrderAnalytics, orderStatusLabels, type Order } from "@/lib/data/orders";
import { formatMoney, formatNumber } from "@/lib/format";

type TooltipValue = number | string | ReadonlyArray<number | string>;

const statusColors: Record<string, string> = {
  completed: "#10b981",
  processing: "#6366f1",
  pending: "#f59e0b",
  refunded: "#ec4899",
  cancelled: "#71717a",
};

interface OrdersAnalyticsProps {
  orders: Order[];
  symbol: string;
}

export default function OrdersAnalytics({ orders, symbol }: OrdersAnalyticsProps) {
  const theme = useChartTheme();
  const analytics = useMemo(() => getOrderAnalytics(orders), [orders]);

  const byMonthData = analytics.byMonth;
  const donutData = analytics.revenueByStatus.filter((s) => s.revenue > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="heading-section text-foreground">Orders over time</h3>
            <p className="text-sm text-muted-foreground">Orders and completed orders by month</p>
          </div>
          <figure>
            <figcaption className="sr-only">Bar chart of orders by month with completed count.</figcaption>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byMonthData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }} barGap={2}>
                  <CartesianGrid strokeDasharray="4 4" stroke={theme.gridStroke} vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: theme.tickFill, fontSize: 11 }} tickLine={false} axisLine={{ stroke: theme.axisStroke }} />
                  <YAxis tick={{ fill: theme.tickFill, fontSize: 11 }} tickLine={false} axisLine={false} width={36} />
                  <Tooltip
                    cursor={{ fill: theme.dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
                    formatter={(value: TooltipValue | undefined) => (typeof value === "number" ? formatNumber(value) : value)}
                    contentStyle={{ backgroundColor: theme.tooltipStyle.backgroundColor, border: theme.tooltipStyle.border, borderRadius: "8px", color: theme.tooltipStyle.color, fontSize: "13px" }}
                    labelStyle={{ color: theme.tooltipStyle.color, fontWeight: 600 }}
                  />
                  <Bar dataKey="orders" name="Orders" fill="#6366f1" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </figure>
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <h3 className="heading-section text-foreground">Revenue by status</h3>
            <p className="text-sm text-muted-foreground">Order revenue split by status</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <figure>
              <figcaption className="sr-only">Donut chart of revenue by order status.</figcaption>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      formatter={(value: TooltipValue | undefined) => (typeof value === "number" ? formatMoney(value, symbol) : value)}
                      contentStyle={{ backgroundColor: theme.tooltipStyle.backgroundColor, border: theme.tooltipStyle.border, borderRadius: "8px", color: theme.tooltipStyle.color, fontSize: "13px" }}
                    />
                    <Pie data={donutData} dataKey="revenue" nameKey="status" innerRadius="58%" outerRadius="82%" paddingAngle={2} strokeWidth={0}>
                      {donutData.map((entry) => (
                        <Cell key={entry.status} fill={statusColors[entry.status]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </figure>
            <ul className="space-y-2">
              {analytics.revenueByStatus
                .filter((s) => s.count > 0)
                .map((s) => (
                  <li key={s.status} className="flex items-center justify-between gap-2 text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusColors[s.status] }} aria-hidden />
                      {orderStatusLabels[s.status]}
                    </span>
                    <span className="font-medium text-foreground">{formatMoney(s.revenue, symbol)}</span>
                  </li>
                ))}
            </ul>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-4">
          <h3 className="heading-section text-foreground">Top-selling products</h3>
          <p className="text-sm text-muted-foreground">Derived from order line items</p>
        </div>
        <ol className="space-y-4">
          {analytics.topProducts.map((p, i) => (
            <li key={p.productId} className="flex items-center gap-3">
              <span className="w-5 shrink-0 text-sm font-semibold text-muted-foreground">{i + 1}</span>
              <ProductThumbnail name={p.name} type={p.type} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{formatNumber(p.units)} units sold</p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-foreground">
                {formatMoney(p.revenue, symbol)}
              </span>
            </li>
          ))}
          {analytics.topProducts.length === 0 && (
            <li className="py-8 text-center text-sm text-muted-foreground">No product data yet.</li>
          )}
        </ol>
      </Card>
    </div>
  );
}