import { CheckCircle2, Clock, RotateCcw } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { paymentStatusLabels, type PaymentStatus } from "@/lib/data/orders";

const meta: Record<PaymentStatus, { variant: BadgeProps["variant"]; icon: typeof Clock }> = {
  paid: { variant: "success", icon: CheckCircle2 },
  pending: { variant: "warning", icon: Clock },
  refunded: { variant: "destructive", icon: RotateCcw },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { variant, icon: Icon } = meta[status];
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" aria-hidden />
      <span className="sr-only">Payment status:</span>
      {paymentStatusLabels[status]}
    </Badge>
  );
}