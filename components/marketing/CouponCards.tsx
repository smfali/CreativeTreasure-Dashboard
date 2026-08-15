"use client";

import { MoreHorizontal, Pencil, Archive, Power, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CouponStatusBadge } from "@/components/marketing/CouponStatusBadge";
import { getCouponUsageLabel, getCouponRedeemedRatio, type Coupon } from "@/lib/data/marketing";
import { formatDate, formatMoney } from "@/lib/format";
import { formatDiscount } from "@/components/marketing/CouponTable";

interface CouponCardsProps {
  coupons: Coupon[];
  symbol: string;
  onEdit: (coupon: Coupon) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CouponCards({ coupons, symbol, onEdit, onToggle, onDelete }: CouponCardsProps) {
  return (
    <div className="space-y-3">
      {coupons.map((coupon) => {
        const ratio = getCouponRedeemedRatio(coupon);
        return (
          <Card key={coupon.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="inline-flex items-center gap-2 font-mono text-sm font-semibold text-foreground">
                  <Tag className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                  {coupon.code}
                </p>
                <p className="mt-0.5 text-sm text-foreground">{formatDiscount(coupon, symbol)}</p>
              </div>
              <DropdownMenu
                align="end"
                triggerClassName="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                trigger={
                  <span className="inline-flex items-center justify-center">
                    <MoreHorizontal className="h-4 w-4" aria-hidden />
                    <span className="sr-only">Actions for {coupon.code}</span>
                  </span>
                }
              >
                <DropdownMenuItem onClick={() => onEdit(coupon)}>
                  <Pencil className="h-4 w-4" aria-hidden />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggle(coupon.id)}>
                  <Power className="h-4 w-4" aria-hidden />
                  {coupon.status === "inactive" ? "Activate" : "Deactivate"}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive hover:text-destructive" onClick={() => onDelete(coupon.id)}>
                  <Archive className="h-4 w-4" aria-hidden />
                  Delete
                </DropdownMenuItem>
              </DropdownMenu>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <CouponStatusBadge status={coupon.status} />
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              {formatDate(coupon.startDate)} – {coupon.expiryDate ? formatDate(coupon.expiryDate) : "No expiry"} · {coupon.description ?? "No description"}
            </p>

            <div className="mt-3 border-t border-border pt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Used {getCouponUsageLabel(coupon)}</span>
                <span className="font-medium text-foreground">
                  {coupon.usageLimit > 0 ? `${Math.round(ratio * 100)}%` : ""}
                </span>
              </div>
              {coupon.usageLimit > 0 && (
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${ratio * 100}%` }}
                  />
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}