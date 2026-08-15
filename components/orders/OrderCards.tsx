"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { ProductThumbnail } from "@/components/products/ProductThumbnail";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { Card } from "@/components/ui/card";
import { formatMoney, formatDate } from "@/lib/format";
import type { Order } from "@/lib/data/orders";

export function OrderCards({ orders, symbol }: { orders: Order[]; symbol: string }) {
  return (
    <ul className="space-y-3">
      {orders.map((order) => {
        const first = order.items[0];
        const moreCount = order.items.length - 1;
        return (
          <li key={order.id}>
            <Link href={`/orders/${order.id}`} className="block">
              <Card className="p-4 transition-colors hover:border-primary/50">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-primary">{order.number}</span>
                  <OrderStatusBadge status={order.orderStatus} />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Avatar name={order.customerName} className="h-9 w-9 text-xs" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.date)}</p>
                  </div>
                  <span className="ml-auto text-sm font-semibold text-foreground">
                    {formatMoney(order.total, symbol)}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <ProductThumbnail
                      name={first.name}
                      type={first.type}
                      className="h-8 w-8 rounded-md [&>svg]:h-4 [&>svg]:w-4"
                    />
                    <span className="truncate text-xs text-muted-foreground">
                      {first.name}
                      {moreCount > 0 && ` +${moreCount} more`}
                    </span>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <PaymentStatusBadge status={order.paymentStatus} />
                    <span className="text-xs text-muted-foreground">{order.paymentMethod}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
                </div>
              </Card>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}