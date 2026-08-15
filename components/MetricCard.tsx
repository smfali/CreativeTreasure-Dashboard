import { HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import type { Metric } from "@/hooks/useDashboardData";

const tooltips: Record<string, string> = {
  Subs: "Total number of active subscribers",
  Rev: "Total revenue generated this period",
  "Open Rate": "Percentage of subscribers who opened your latest email",
  Views: "Total views across all content this period",
  "Churn Rate": "Percentage of subscribers who cancelled this month",
};

export default function MetricCard({ title, value, change, positive, inverse }: Metric) {
  const good = inverse ? !positive : positive;
  const tip = tooltips[title];

  return (
    <Card className="p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-zinc-950/50">
      <div className="flex items-center gap-1.5">
        <p className="text-sm text-muted-foreground">{title}</p>
        {tip && (
          <Tooltip content={tip} contentClassName="w-56 -translate-x-0 text-left">
            <HelpCircle className="h-3.5 w-3.5 cursor-help text-muted-foreground" />
          </Tooltip>
        )}
      </div>
      <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
      <p className={`mt-2 text-sm font-medium ${good ? "text-success" : "text-destructive"}`}>
        {change}
      </p>
    </Card>
  );
}
