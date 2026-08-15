import { Badge, type BadgeProps } from "@/components/ui/badge";
import { statusLabels, type CustomerStatus } from "@/lib/data/customers";

const variants: Record<CustomerStatus, BadgeProps["variant"]> = {
  active: "success",
  new: "info",
  vip: "primary",
  inactive: "default",
};

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  return <Badge variant={variants[status]}>{statusLabels[status]}</Badge>;
}
