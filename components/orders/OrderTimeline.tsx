import { ShoppingBag, CreditCard, Download, RotateCcw, Ban, Clock } from "lucide-react";
import { getOrderTimeline, type Order } from "@/lib/data/orders";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const iconMeta = {
  placed: { icon: ShoppingBag, cls: "bg-primary/15 text-primary" },
  payment: { icon: CreditCard, cls: "bg-success/15 text-success" },
  delivered: { icon: Download, cls: "bg-info/15 text-info" },
  refund: { icon: RotateCcw, cls: "bg-destructive/15 text-destructive" },
  cancel: { icon: Ban, cls: "bg-muted text-muted-foreground" },
  pending: { icon: Clock, cls: "bg-warning/15 text-warning" },
} as const;

export function OrderTimeline({ order }: { order: Order }) {
  const events = getOrderTimeline(order);

  return (
    <ol className="relative space-y-6">
      <span
        aria-hidden
        className="absolute left-[19px] top-2 bottom-2 w-px bg-border"
      />
      {events.map((event) => {
        const meta = iconMeta[event.type];
        const Icon = meta.icon;
        return (
          <li key={event.id} className="relative flex gap-4">
            <span
              className={cn(
                "z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                meta.cls
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <div className="pt-1">
              <p className="text-sm font-medium text-foreground">{event.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{event.description}</p>
              <p className="mt-1 text-xs text-muted-foreground/80">{formatDate(event.date)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}