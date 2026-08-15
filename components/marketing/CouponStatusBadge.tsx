import { CheckCircle2, CalendarClock, Clock3, CircleSlash } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { couponStatusLabels, type CouponStatus } from "@/lib/data/marketing";

const meta: Record<CouponStatus, { variant: BadgeProps["variant"]; icon: typeof Clock3 }> = {
  active: { variant: "success", icon: CheckCircle2 },
  scheduled: { variant: "info", icon: CalendarClock },
  expired: { variant: "outline", icon: Clock3 },
  inactive: { variant: "default", icon: CircleSlash },
};

export function CouponStatusBadge({ status }: { status: CouponStatus }) {
  const { variant, icon: Icon } = meta[status];
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" aria-hidden />
      <span className="sr-only">Coupon status:</span>
      {couponStatusLabels[status]}
    </Badge>
  );
}