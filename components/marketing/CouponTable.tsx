"use client";

import { MoreHorizontal, Pencil, Archive, Power, Tag } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CouponStatusBadge } from "@/components/marketing/CouponStatusBadge";
import {
  discountTypeLabels,
  getCouponUsageLabel,
  getCouponRedeemedRatio,
  type Coupon,
} from "@/lib/data/marketing";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";

interface CouponTableProps {
  coupons: Coupon[];
  symbol: string;
  onEdit: (coupon: Coupon) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function formatDiscount(coupon: Coupon, symbol: string): string {
  return coupon.type === "percentage" ? `${coupon.value}% off` : `${formatMoney(coupon.value, symbol)} off`;
}

export function CouponTable({ coupons, symbol, onEdit, onToggle, onDelete }: CouponTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Usage</TableHead>
          <TableHead>Starts</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coupons.map((coupon) => {
          const ratio = getCouponRedeemedRatio(coupon);
          return (
            <TableRow key={coupon.id}>
              <TableCell>
                <span className="inline-flex items-center gap-2 font-mono text-sm font-semibold text-foreground">
                  <Tag className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                  {coupon.code}
                </span>
                {coupon.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{coupon.description}</p>
                )}
              </TableCell>
              <TableCell className="text-sm text-foreground">
                {formatDiscount(coupon, symbol)}
                <span className="text-xs text-muted-foreground"> · {discountTypeLabels[coupon.type]}</span>
                {coupon.minOrder ? (
                  <p className="text-xs text-muted-foreground">Min order {formatMoney(coupon.minOrder, symbol)}</p>
                ) : null}
              </TableCell>
              <TableCell>
                <div className="max-w-[10rem]">
                  <p className="text-sm text-foreground">{getCouponUsageLabel(coupon)}</p>
                  {coupon.usageLimit > 0 && (
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${ratio * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                {formatDate(coupon.startDate)}
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                {coupon.expiryDate ? formatDate(coupon.expiryDate) : "—"}
              </TableCell>
              <TableCell>
                <CouponStatusBadge status={coupon.status} />
              </TableCell>
              <TableCell className="text-right">
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
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}