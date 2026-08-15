import { CheckCircle2, Clock, Loader2, RotateCcw, Ban } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { orderStatusLabels, type OrderStatus } from "@/lib/data/orders";

const meta: Record<OrderStatus, { variant: BadgeProps["variant"]; icon: typeof Clock }> = {
  completed: { variant: "success", icon: CheckCircle2 },
  pending: { variant: "warning", icon: Clock },
  processing: { variant: "info", icon: Loader2 },
  refunded: { variant: "destructive", icon: RotateCcw },
  cancelled: { variant: "outline", icon: Ban },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { variant, icon: Icon } = meta[status];
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" aria-hidden />
      <span className="sr-only">Order status:</span>
      {orderStatusLabels[status]}
    </Badge>
  );
}