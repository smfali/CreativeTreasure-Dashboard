import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/format";

interface SignedAmountProps {
  value: number;
  symbol: string;
  /** True when the row represents an inward movement (income). Defaults to sign of value. */
  income?: boolean;
  neutral?: boolean;
  className?: string;
}

export function SignedAmount({ value, symbol, income, neutral, className }: SignedAmountProps) {
  const positive = value >= 0;
  const isIncome = income ?? positive;

  if (value === 0 && neutral) {
    return <span className={cn("text-muted-foreground", className)}>—</span>;
  }

  if (value === 0) {
    return (
      <span className={cn("inline-flex items-center gap-1 text-muted-foreground", className)}>
        <Minus className="h-3.5 w-3.5" aria-hidden />
        <span>{formatMoney(0, symbol)}</span>
        <span className="sr-only">(no change)</span>
      </span>
    );
  }

  const Icon = isIncome ? ArrowUpRight : ArrowDownRight;
  const label = isIncome ? "income" : "cost";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        isIncome ? "text-success" : "text-destructive",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      <span>
        {isIncome ? "+" : "−"}
        {formatMoney(Math.abs(value), symbol)}
      </span>
      <span className="sr-only">({label})</span>
    </span>
  );
}