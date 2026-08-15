import { Badge, type BadgeProps } from "@/components/ui/badge";
import { notificationModuleLabels, type NotificationModule } from "@/lib/data/notifications";

const variants: Record<NotificationModule, BadgeProps["variant"]> = {
  orders: "warning",
  products: "success",
  revenue: "info",
  finance: "default",
  marketing: "primary",
  team: "info",
  customers: "default",
};

export function ModuleBadge({ module }: { module: NotificationModule }) {
  return <Badge variant={variants[module]}>{notificationModuleLabels[module]}</Badge>;
}