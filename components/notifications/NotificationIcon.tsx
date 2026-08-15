import {
  ShoppingCart,
  Package,
  BarChart3,
  Landmark,
  Megaphone,
  Users,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { NotificationModule } from "@/lib/data/notifications";

const meta: Record<NotificationModule, { icon: LucideIcon; cls: string }> = {
  orders: { icon: ShoppingCart, cls: "bg-warning/15 text-warning" },
  products: { icon: Package, cls: "bg-success/15 text-success" },
  revenue: { icon: BarChart3, cls: "bg-info/15 text-info" },
  finance: { icon: Landmark, cls: "bg-success/15 text-success" },
  marketing: { icon: Megaphone, cls: "bg-info/15 text-info" },
  team: { icon: Users, cls: "bg-primary/15 text-primary" },
  customers: { icon: UserRound, cls: "bg-muted text-muted-foreground" },
};

export function NotificationIcon({ module }: { module: NotificationModule }) {
  const { icon: Icon, cls } = meta[module];
  return (
    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${cls}`}>
      <Icon className="h-4 w-4" aria-hidden />
    </span>
  );
}