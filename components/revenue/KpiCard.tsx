import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  change: number;
  hint?: string;
}

export function KpiCard({ label, value, change, hint }: KpiCardProps) {
  const up = change >= 0;
  const absolute = `${Math.abs(change).toFixed(1)}%`;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
            up ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
          )}
          aria-hidden
        >
          {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {absolute}
        </span>
      </div>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        <span className="sr-only">
          {up ? "Up" : "Down"} {absolute} from the previous period
        </span>
        vs previous period
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground/80">{hint}</p>}
    </Card>
  );
}
