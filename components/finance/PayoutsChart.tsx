"use client";

import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useChartTheme } from "@/components/revenue/useChartTheme";
import { payoutStatusLabels, type Payout } from "@/lib/data/finance";
import { formatMoney } from "@/lib/format";

type TooltipValue = number | string | ReadonlyArray<number | string>;

interface PayoutsChartProps {
  payouts: Payout[];
  symbol: string;
}

export function PayoutsChart({ payouts, symbol }: PayoutsChartProps) {
  const theme = useChartTheme();
  const data = [...payouts]
    .sort((a, b) => a.datetime.localeCompare(b.datetime))
    .map((p) => ({
      label: new Date(`${p.datetime.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      amount: p.amount,
      status: p.status,
      id: p.id,
    }));

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="heading-section text-foreground">Payout activity</h3>
        <p className="text-sm text-muted-foreground">Amount per payout over time</p>
      </div>
      <figure>
        <figcaption className="sr-only">
          Bar chart of payout amounts over time. Payout status is shown in the tooltip.
        </figcaption>
        <div className="h-64">
          {data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No payouts recorded
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                <CartesianGrid strokeDasharray="4 4" stroke={theme.gridStroke} vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: theme.tickFill, fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: theme.axisStroke }}
                  minTickGap={18}
                />
                <YAxis tick={{ fill: theme.tickFill, fontSize: 11 }} tickLine={false} axisLine={false} width={56} />
                <Tooltip
                  cursor={{ fill: theme.dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
                  formatter={(value: TooltipValue | undefined) =>
                    typeof value === "number" ? formatMoney(value, symbol) : value
                  }
                  labelFormatter={(label) => `${label} · ${payoutStatusLabels[data.find((d) => d.label === label)?.status ?? "pending"]}`}
                  contentStyle={{
                    backgroundColor: theme.tooltipStyle.backgroundColor,
                    border: theme.tooltipStyle.border,
                    borderRadius: "8px",
                    color: theme.tooltipStyle.color,
                    fontSize: "13px",
                  }}
                  labelStyle={{ color: theme.tooltipStyle.color, fontWeight: 600 }}
                />
                <Bar dataKey="amount" name="Payout" fill="#6366f1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </figure>
    </Card>
  );
}