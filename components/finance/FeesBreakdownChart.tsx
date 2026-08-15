"use client";

import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useChartTheme } from "@/components/revenue/useChartTheme";
import { getFeeBreakdown, type FinanceTransaction } from "@/lib/data/finance";
import { formatMoney } from "@/lib/format";

type TooltipValue = number | string | ReadonlyArray<number | string>;

const categoryColors: Record<string, string> = {
  Platform: "#6366f1",
  Processing: "#10b981",
  Refund: "#ec4899",
  Other: "#f59e0b",
};

interface FeesBreakdownChartProps {
  transactions: FinanceTransaction[];
  symbol: string;
}

export function FeesBreakdownChart({ transactions, symbol }: FeesBreakdownChartProps) {
  const theme = useChartTheme();
  const breakdown = getFeeBreakdown(transactions);
  const data = [
    { name: "Platform", value: breakdown.platform },
    { name: "Processing", value: breakdown.processing },
    { name: "Refund", value: breakdown.refund },
    { name: "Other", value: breakdown.other },
  ].filter((d) => d.value > 0);

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="heading-section text-foreground">Fees breakdown</h3>
        <p className="text-sm text-muted-foreground">
          {formatMoney(breakdown.total, symbol)} total fees · {breakdown.effectiveRate.toFixed(2)}% of gross
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <figure>
          <figcaption className="sr-only">
            Donut chart of fees split by platform, processing, refund and other categories.
          </figcaption>
          <div className="h-44">
            {data.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No fees recorded
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(value: TooltipValue | undefined) =>
                      typeof value === "number" ? formatMoney(value, symbol) : value
                    }
                    contentStyle={{
                      backgroundColor: theme.tooltipStyle.backgroundColor,
                      border: theme.tooltipStyle.border,
                      borderRadius: "8px",
                      color: theme.tooltipStyle.color,
                      fontSize: "13px",
                    }}
                    labelStyle={{ color: theme.tooltipStyle.color, fontWeight: 600 }}
                  />
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="58%"
                    outerRadius="82%"
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {data.map((entry) => (
                      <Cell key={entry.name} fill={categoryColors[entry.name]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </figure>
        <ul className="space-y-2">
          {data.map((d) => (
            <li key={d.name} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: categoryColors[d.name] }}
                  aria-hidden
                />
                {d.name}
              </span>
              <span className="font-medium text-foreground">{formatMoney(d.value, symbol)}</span>
            </li>
          ))}
          {data.length > 0 && (
            <li className="flex items-center justify-between gap-2 border-t border-border pt-2 text-sm">
              <span className="text-muted-foreground">Total fees</span>
              <span className="font-semibold text-foreground">{formatMoney(breakdown.total, symbol)}</span>
            </li>
          )}
        </ul>
      </div>
    </Card>
  );
}