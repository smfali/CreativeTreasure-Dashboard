"use client";

import { Vault, Printer } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatMoney, formatDate } from "@/lib/format";
import { orderStatusLabels, type Order } from "@/lib/data/orders";

interface OrderInvoiceProps {
  order: Order;
  symbol: string;
  open: boolean;
  onClose: () => void;
}

export function OrderInvoice({ order, symbol, open, onClose }: OrderInvoiceProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Invoice"
      description={`Invoice for order ${order.number}`}
      className="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => window.print()}>
            <Printer className="h-4 w-4" aria-hidden />
            Print invoice
          </Button>
        </>
      }
    >
      <div className="rounded-lg border border-border bg-background p-5">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Vault className="h-7 w-7" style={{ color: "rgb(var(--accent))" }} aria-hidden />
            <div>
              <p className="font-semibold text-foreground">CreativeTreasury</p>
              <p className="text-xs text-muted-foreground">Digital products for creators</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-foreground">INVOICE</p>
            <p className="text-xs text-muted-foreground">{order.number}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 border-b border-border py-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">Billed to</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{order.customerName}</p>
            <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
            <p className="text-sm text-muted-foreground">{order.customerLocation}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-medium uppercase text-muted-foreground">Details</p>
            <p className="mt-1 text-sm text-foreground">Order date: {formatDate(order.date)}</p>
            <p className="text-sm text-foreground">
              Order status: {orderStatusLabels[order.orderStatus]}
            </p>
            <p className="mt-1 text-sm text-foreground">
              Payment: <PaymentStatusBadge status={order.paymentStatus} />
            </p>
          </div>
        </div>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Unit</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.productId}>
                <TableCell className="text-foreground">{item.name}</TableCell>
                <TableCell className="text-right text-muted-foreground">{item.quantity}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatMoney(item.unitPrice, symbol)}
                </TableCell>
                <TableCell className="text-right font-medium text-foreground">
                  {formatMoney(item.unitPrice * item.quantity, symbol)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <dl className="ml-auto mt-4 max-w-xs space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="text-foreground">{formatMoney(order.subtotal, symbol)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Discount</dt>
            <dd className="text-destructive">−{formatMoney(order.discount, symbol)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Tax (digital goods)</dt>
            <dd className="text-foreground">{formatMoney(order.tax, symbol)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-border pt-2">
            <dt className="font-semibold text-foreground">Total</dt>
            <dd className="font-bold text-foreground">{formatMoney(order.total, symbol)}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          <Badge variant="outline">Paid via {order.paymentMethod}</Badge>
          <p className="text-xs text-muted-foreground">
            Demo only — printing opens your browser&apos;s print dialog.
          </p>
        </div>
      </div>
    </Dialog>
  );
}