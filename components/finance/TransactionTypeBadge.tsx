import { ShoppingBag, RotateCcw, Landmark, Percent, SlidersHorizontal } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { transactionTypeLabels, type TransactionType } from "@/lib/data/finance";

const meta: Record<TransactionType, { variant: BadgeProps["variant"]; icon: typeof ShoppingBag }> = {
  sale: { variant: "default", icon: ShoppingBag },
  refund: { variant: "warning", icon: RotateCcw },
  payout: { variant: "info", icon: Landmark },
  fee: { variant: "outline", icon: Percent },
  adjustment: { variant: "outline", icon: SlidersHorizontal },
};

export function TransactionTypeBadge({ type }: { type: TransactionType }) {
  const { variant, icon: Icon } = meta[type];
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" aria-hidden />
      <span className="sr-only">Transaction type:</span>
      {transactionTypeLabels[type]}
    </Badge>
  );
}