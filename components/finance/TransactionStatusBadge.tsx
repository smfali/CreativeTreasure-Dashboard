import { CheckCircle2, Clock, XCircle, RotateCcw } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { transactionStatusLabels, type TransactionStatus } from "@/lib/data/finance";

const meta: Record<TransactionStatus, { variant: BadgeProps["variant"]; icon: typeof Clock }> = {
  completed: { variant: "success", icon: CheckCircle2 },
  pending: { variant: "warning", icon: Clock },
  failed: { variant: "destructive", icon: XCircle },
  refunded: { variant: "info", icon: RotateCcw },
};

export function TransactionStatusBadge({ status }: { status: TransactionStatus }) {
  const { variant, icon: Icon } = meta[status];
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" aria-hidden />
      <span className="sr-only">Transaction status:</span>
      {transactionStatusLabels[status]}
    </Badge>
  );
}