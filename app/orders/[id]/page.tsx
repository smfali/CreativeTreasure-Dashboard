"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  RotateCcw,
  Ban,
  Receipt,
  CheckCircle2,
  Loader2,
  Clock,
  SearchX,
  Mail,
  MapPin,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { PaymentStatusBadge } from "@/components/orders/PaymentStatusBadge";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { OrderInvoice } from "@/components/orders/OrderInvoice";
import { CustomerStatusBadge } from "@/components/audience/CustomerStatusBadge";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuItem, DropdownMenuHeader } from "@/components/ui/dropdown-menu";
import { useOrders } from "@/contexts/OrdersContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatMoney, formatDate } from "@/lib/format";
import { customers } from "@/lib/data/customers";
import { orderStatusLabels, type OrderStatus } from "@/lib/data/orders";

const statusOptions: Array<{ value: OrderStatus; label: string; icon: typeof CheckCircle2 }> = [
  { value: "completed", label: "Completed", icon: CheckCircle2 },
  { value: "processing", label: "Processing", icon: Loader2 },
  { value: "pending", label: "Pending", icon: Clock },
];

export default function OrderDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { getOrder, updateOrderStatus, refundOrder, cancelOrder } = useOrders();
  const { symbol } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const order = id ? getOrder(id) : undefined;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  if (loading) {
    return (
      <div className="p-4 space-y-6 sm:p-8">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-48" />
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-44" />
            <Skeleton className="h-56" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-44" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4 sm:p-8">
        <EmptyState
          icon={SearchX}
          title="Order not found"
          description="This order may have been removed."
          action={
            <Link href="/orders">
              <Button variant="secondary">Back to orders</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const record = order;
  const customer = customers.find((c) => c.id === record.customerId);
  const locked = record.orderStatus === "refunded" || record.orderStatus === "cancelled";

  function handleCopyId() {
    navigator.clipboard?.writeText(record.id).catch(() => {});
    setNotice(`Copied order ID ${record.id} to clipboard.`);
  }

  function handleUpdateStatus(next: OrderStatus) {
    updateOrderStatus(record.id, next);
    setNotice(`Order ${record.number} marked as ${orderStatusLabels[next].toLowerCase()}.`);
  }

  function handleRefund() {
    refundOrder(record.id);
    setNotice(`Order ${record.number} refunded.`);
  }

  function handleCancel() {
    cancelOrder(record.id);
    setNotice(`Order ${record.number} cancelled.`);
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Orders" }, { label: order.number }]} />
        <Link
          href="/orders"
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to orders
        </Link>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="heading-page mb-0 text-xl sm:text-2xl">{order.number}</h1>
              <OrderStatusBadge status={order.orderStatus} />
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed {formatDate(order.date)} · Paid via {order.paymentMethod}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleCopyId}>
              <Copy className="h-4 w-4" aria-hidden />
              Copy ID
            </Button>
            <Button variant="secondary" onClick={() => setInvoiceOpen(true)}>
              <Receipt className="h-4 w-4" aria-hidden />
              Invoice
            </Button>
            {!locked && (
              <>
                <DropdownMenu
                  align="end"
                  triggerClassName="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 h-10 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  trigger={
                    <>
                      <Loader2 className="h-4 w-4" aria-hidden />
                      Update status
                    </>
                  }
                >
                  <DropdownMenuHeader>Set order status</DropdownMenuHeader>
                  {statusOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <DropdownMenuItem key={option.value} onClick={() => handleUpdateStatus(option.value)}>
                        <Icon className="h-4 w-4" aria-hidden />
                        {option.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenu>
                <Button variant="destructive" onClick={() => setRefundOpen(true)}>
                  <RotateCcw className="h-4 w-4" aria-hidden />
                  Refund
                </Button>
                <Button variant="secondary" onClick={() => setCancelOpen(true)}>
                  <Ban className="h-4 w-4" aria-hidden />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {notice && <Alert variant="success">{notice}</Alert>}

      {order.orderStatus === "refunded" && (
        <Alert variant="info">
          This order has been refunded and is locked for further edits. Refunds are a local demo.
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar name={order.customerName} className="h-12 w-12 text-base" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground">{order.customerName}</p>
                    {customer && <CustomerStatusBadge status={customer.status} />}
                  </div>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                    {order.customerEmail}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    {order.customerLocation}
                  </p>
                </div>
              </div>
              <Link href={`/audience/${order.customerId}`}>
                <Button variant="secondary">View customer</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Purchased products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell className="text-foreground">{item.name}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {item.quantity}
                      </TableCell>
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
              <p className="mt-3 text-xs text-muted-foreground">
                Discount applied at order level: {formatMoney(order.discount, symbol)}.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment summary</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="text-foreground">{formatMoney(order.subtotal, symbol)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Discount</dt>
                  <dd className="text-destructive">−{formatMoney(order.discount, symbol)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Tax</dt>
                  <dd className="text-foreground">{formatMoney(order.tax, symbol)}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-border pt-2">
                  <dt className="font-semibold text-foreground">Total</dt>
                  <dd className="font-bold text-foreground">{formatMoney(order.total, symbol)}</dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                <Badge variant="outline">{order.paymentMethod}</Badge>
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline order={order} />
            </CardContent>
          </Card>
        </div>
      </div>

      <OrderInvoice order={order} symbol={symbol} open={invoiceOpen} onClose={() => setInvoiceOpen(false)} />

      <ConfirmDialog
        open={refundOpen}
        onClose={() => setRefundOpen(false)}
        title="Refund order"
        description={`Issue a refund of ${formatMoney(order.total, symbol)} for order ${order.number}? This is a local demo action and no real payment is processed.`}
        confirmLabel="Refund order"
        destructive
        onConfirm={() => {
          handleRefund();
          setRefundOpen(false);
        }}
      />

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel order"
        description={`Cancel order ${order.number}? The customer will not be charged. This is a local demo action.`}
        confirmLabel="Cancel order"
        destructive
        onConfirm={() => {
          handleCancel();
          setCancelOpen(false);
        }}
      />
    </div>
  );
}