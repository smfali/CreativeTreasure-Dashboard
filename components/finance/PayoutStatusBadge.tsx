import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { payoutStatusLabels, type PayoutStatus } from "@/lib/data/finance";

const meta: Record<PayoutStatus, { variant: BadgeProps["variant"]; icon: typeof Clock }> = {
  paid: { variant: "success", icon: CheckCircle2 },
  pending: { variant: "warning", icon: Clock },
  processing: { variant: "info", icon: Loader2 },
  failed: { variant: "destructive", icon: XCircle },
};

export function PayoutStatusBadge({ status }: { status: PayoutStatus }) {
  const { variant, icon: Icon } = meta[status];
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" aria-hidden />
      <span className="sr-only">Payout status:</span>
      {payoutStatusLabels[status]}
    </Badge>
  );
}