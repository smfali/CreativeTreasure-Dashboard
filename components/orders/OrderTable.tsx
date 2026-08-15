"use client";

import Link from "next/link";
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, Eye, Copy, RotateCcw, Ban, CheckCircle2, Loader2, Clock } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { ProductThumbnail } from "@/components/products/ProductThumbnail";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { DropdownMenu, DropdownMenuItem, DropdownMenuHeader } from "@/components/ui/dropdown-menu";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatMoney, formatDate } from "@/lib/format";
import { orderStatusLabels, type Order, type OrderStatus } from "@/lib/data/orders";

export type OrderSortKey = "number" | "date" | "amount" | "customer";
export interface OrderSortState {
  key: OrderSortKey;
  dir: "asc" | "desc";
}

interface OrderTableProps {
  orders: Order[];
  symbol: string;
  selected: Set<string>;
  allSelected: boolean;
  someSelected: boolean;
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  sort: OrderSortState;
  onSort: (key: OrderSortKey) => void;
  onUpdateStatus: (order: Order, status: OrderStatus) => void;
  onRefund: (order: Order) => void;
  onCancel: (order: Order) => void;
  onCopyId: (order: Order) => void;
}

function SortableHead({
  label,
  sortKey,
  sort,
  onSort,
  className,
}: {
  label: string;
  sortKey: OrderSortKey;
  sort: OrderSortState;
  onSort: (key: OrderSortKey) => void;
  className?: string;
}) {
  const active = sort.key === sortKey;
  const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
        className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {label}
        <Icon className="h-3.5 w-3.5" aria-hidden />
      </button>
    </TableHead>
  );
}

export function OrderTable({
  orders,
  symbol,
  selected,
  allSelected,
  someSelected,
  onToggleSelectAll,
  onToggleSelect,
  sort,
  onSort,
  onUpdateStatus,
  onRefund,
  onCancel,
  onCopyId,
}: OrderTableProps) {
  const statusOptions: OrderStatus[] = ["completed", "processing", "pending"];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <input
              type="checkbox"
              aria-label="Select all orders"
              checked={allSelected}
              ref={(el) => {
                if (el) el.indeterminate = someSelected && !allSelected;
              }}
              onChange={onToggleSelectAll}
              className="h-4 w-4 accent-primary"
            />
          </TableHead>
          <SortableHead label="Order" sortKey="number" sort={sort} onSort={onSort} />
          <SortableHead label="Customer" sortKey="customer" sort={sort} onSort={onSort} />
          <TableHead>Product</TableHead>
          <SortableHead label="Date" sortKey="date" sort={sort} onSort={onSort} />
          <SortableHead label="Amount" sortKey="amount" sort={sort} onSort={onSort} className="text-right" />
          <TableHead>Payment</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const first = order.items[0];
          const moreCount = order.items.length - 1;
          const locked = order.orderStatus === "refunded" || order.orderStatus === "cancelled";
          return (
            <TableRow key={order.id}>
              <TableCell>
                <input
                  type="checkbox"
                  aria-label={`Select order ${order.number}`}
                  checked={selected.has(order.id)}
                  onChange={() => onToggleSelect(order.id)}
                  className="h-4 w-4 accent-primary"
                />
              </TableCell>
              <TableCell>
                <Link
                  href={`/orders/${order.id}`}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  {order.number}
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar name={order.customerName} className="h-8 w-8 text-xs" />
                  <span className="max-w-[10rem] truncate text-sm text-foreground">
                    {order.customerName}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <ProductThumbnail name={first.name} type={first.type} className="h-8 w-8 rounded-md [&>svg]:h-4 [&>svg]:w-4" />
                  <span className="max-w-[12rem] truncate text-sm text-foreground">
                    {first.name}
                    {moreCount > 0 && (
                      <span className="text-muted-foreground"> +{moreCount} more</span>
                    )}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{formatDate(order.date)}</TableCell>
              <TableCell className="text-right text-sm font-medium text-foreground">
                {formatMoney(order.total, symbol)}
              </TableCell>
              <TableCell>
                <div className="flex flex-col items-start gap-1">
                  <PaymentStatusBadge status={order.paymentStatus} />
                  <span className="text-xs text-muted-foreground">{order.paymentMethod}</span>
                </div>
              </TableCell>
              <TableCell>
                <OrderStatusBadge status={order.orderStatus} />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu
                  align="end"
                  triggerClassName="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  trigger={<MoreHorizontal className="h-4 w-4" aria-hidden />}
                >
                  <DropdownMenuItem onClick={() => onCopyId(order)}>
                    <Copy className="h-4 w-4" aria-hidden />
                    Copy order ID
                  </DropdownMenuItem>
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    <Eye className="h-4 w-4" aria-hidden />
                    View order
                  </Link>
                  {!locked && (
                    <>
                      <DropdownMenuHeader>Update status</DropdownMenuHeader>
                      {statusOptions.map((status) => {
                        const icon =
                          status === "completed"
                            ? CheckCircle2
                            : status === "processing"
                              ? Loader2
                              : Clock;
                        const Icon = icon;
                        return (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => onUpdateStatus(order, status)}
                          >
                            <Icon className="h-4 w-4" aria-hidden />
                            Mark {orderStatusLabels[status].toLowerCase()}
                          </DropdownMenuItem>
                        );
                      })}
                      <div className="my-1 border-t border-border" aria-hidden />
                      <DropdownMenuItem onClick={() => onRefund(order)} className="text-destructive hover:text-destructive">
                        <RotateCcw className="h-4 w-4" aria-hidden />
                        Refund order
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onCancel(order)} className="text-destructive hover:text-destructive">
                        <Ban className="h-4 w-4" aria-hidden />
                        Cancel order
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}