"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Copy, Printer, SearchX, Package, ShoppingCart, User } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import { FinanceNav } from "@/components/finance/FinanceNav";
import { TransactionStatusBadge } from "@/components/finance/TransactionStatusBadge";
import { TransactionTypeBadge } from "@/components/finance/TransactionTypeBadge";
import { SignedAmount } from "@/components/finance/SignedAmount";
import { TransactionTimeline } from "@/components/finance/TransactionTimeline";
import { Avatar } from "@/components/ui/avatar";
import { ProductThumbnail } from "@/components/products/ProductThumbnail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFinance } from "@/contexts/FinanceContext";
import { useOrders } from "@/contexts/OrdersContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  findTransaction,
  findCustomer,
  transactionTypeLabels,
  transactionStatusLabels,
  type TransactionType,
  type TransactionStatus,
} from "@/lib/data/finance";
import { products } from "@/lib/data/products";
import { formatMoney, formatDate } from "@/lib/format";

function transactionTypeLabel(type: TransactionType): string {
  return transactionTypeLabels[type];
}

function transactionStatusLabel(status: TransactionStatus): string {
  return transactionStatusLabels[status];
}

function InfoRow({ label, value, href }: { label: string; value: React.ReactNode; href?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium text-foreground">
        {href ? (
          <Link href={href} className="text-primary hover:underline">
            {value}
          </Link>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export default function TransactionDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { transactions } = useFinance();
  const { getOrder } = useOrders();
  const { symbol } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const tx = id ? findTransaction(transactions, id) : undefined;

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
        <Skeleton className="h-8 w-56" />
        <Card className="p-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-56" />
            <Skeleton className="h-44" />
          </div>
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="p-4 sm:p-8">
        <EmptyState
          icon={SearchX}
          title="Transaction not found"
          description="This transaction may have been removed."
          action={
            <Link href="/finance/transactions">
              <Button variant="secondary">Back to transactions</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const order = tx.orderId ? getOrder(tx.orderId) : undefined;
  const product = tx.productId ? products.find((p) => p.id === tx.productId) : undefined;
  const customer = findCustomer(tx.customerId);

  const relatedProduct = product ?? (tx.productName ? { id: "", name: tx.productName, type: tx.productType ?? "digital" } : undefined);

  const handleCopyId = () => {
    navigator.clipboard?.writeText(tx.id).catch(() => {});
    setNotice(`Copied transaction ID ${tx.id} to clipboard.`);
  };

  const isOutflow = tx.type === "refund" || tx.type === "fee";
  const isNeutral = tx.type === "payout";
  const netIncome = !isOutflow && !isNeutral;

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Finance" }, { label: "Transactions" }, { label: tx.id }]} />
        <FinanceNav />
        <Link
          href="/finance/transactions"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to transactions
        </Link>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="heading-page mb-0 text-xl sm:text-2xl">{tx.id}</h1>
              <TransactionTypeBadge type={tx.type} />
              <TransactionStatusBadge status={tx.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDate(tx.datetime)} at {tx.datetime.slice(11, 16)} · {tx.description ?? "Financial transaction"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleCopyId}>
              <Copy className="h-4 w-4" aria-hidden />
              Copy ID
            </Button>
            <Button variant="secondary" onClick={() => window.print()}>
              <Printer className="h-4 w-4" aria-hidden />
              Print
            </Button>
          </div>
        </CardContent>
      </Card>

      {notice && <Alert variant="success">{notice}</Alert>}

      {tx.type === "payout" && tx.status === "failed" && (
        <Alert variant="warning">
          This payout failed and the funds remain in your available balance.
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Transaction timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionTimeline tx={tx} symbol={symbol} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment summary</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Gross amount</dt>
                  <dd className="text-foreground">{formatMoney(Math.abs(tx.amount), symbol)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Fees</dt>
                  <dd className={tx.fee > 0 ? "text-destructive" : "text-foreground"}>
                    {tx.fee > 0 ? `−${formatMoney(tx.fee, symbol)}` : formatMoney(Math.abs(tx.fee), symbol)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-border pt-2">
                  <dt className="font-semibold text-foreground">Net amount</dt>
                  <dd className="font-bold text-foreground">
                    {isOutflow || isNeutral ? formatMoney(Math.abs(tx.net), symbol) : formatMoney(tx.net, symbol)}
                  </dd>
                </div>
              </dl>
              {tx.feeBreakdown && (tx.feeBreakdown.platform !== 0 || tx.feeBreakdown.processing !== 0 || tx.feeBreakdown.refund !== 0) && (
                <div className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Platform fee</dt>
                    <dd className="text-foreground">{formatMoney(Math.abs(tx.feeBreakdown.platform), symbol)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Processing fee</dt>
                    <dd className="text-foreground">{formatMoney(Math.abs(tx.feeBreakdown.processing), symbol)}</dd>
                  </div>
                  {tx.feeBreakdown.refund !== 0 && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Refund charge</dt>
                      <dd className="text-foreground">{formatMoney(Math.abs(tx.feeBreakdown.refund), symbol)}</dd>
                    </div>
                  )}
                </div>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                {tx.paymentMethod && <Badge variant="outline">{tx.paymentMethod}</Badge>}
                <TransactionTypeBadge type={tx.type} />
                <TransactionStatusBadge status={tx.status} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-border">
                <InfoRow label="Transaction ID" value={tx.id} />
                <InfoRow label="Date / time" value={`${formatDate(tx.datetime)} · ${tx.datetime.slice(11, 16)}`} />
                <InfoRow label="Type" value={transactionTypeLabel(tx.type)} />
                <InfoRow label="Status" value={transactionStatusLabel(tx.status)} />
                <InfoRow label="Payment method" value={tx.paymentMethod ?? "—"} />
                {tx.orderId && order && (
                  <InfoRow label="Order" value={order.number} href={`/orders/${order.id}`} />
                )}
                {tx.productId && product && (
                  <InfoRow label="Product" value={product.name} href={`/products/${product.id}`} />
                )}
                {tx.customerId && customer && (
                  <InfoRow label="Customer" value={customer.name} href={`/audience/${customer.id}`} />
                )}
              </dl>
            </CardContent>
          </Card>

          {relatedProduct && (
            <Card>
              <CardHeader>
                <CardTitle>Related product</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <ProductThumbnail
                  name={relatedProduct.name}
                  type={relatedProduct.type}
                  className="h-10 w-10"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{relatedProduct.name}</p>
                  {product ? (
                    <Link
                      href={`/products/${product.id}`}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Package className="h-3 w-3" aria-hidden />
                      View product
                    </Link>
                  ) : (
                    <p className="text-xs text-muted-foreground">Product not found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {customer && (
            <Card>
              <CardHeader>
                <CardTitle>Related customer</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <Avatar name={customer.name} className="h-10 w-10 text-sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{customer.name}</p>
                  <Link
                    href={`/audience/${customer.id}`}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <User className="h-3 w-3" aria-hidden />
                    View customer
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {order && (
            <Card>
              <CardHeader>
                <CardTitle>Related order</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShoppingCart className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{order.number}</p>
                  <p className="text-xs text-muted-foreground">{formatMoney(order.total, symbol)}</p>
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <ShoppingCart className="h-3 w-3" aria-hidden />
                    View order
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="sr-only">
        Net movement for this transaction is {isOutflow ? "a cost" : isNeutral ? "a balance transfer" : "income"} of {formatMoney(Math.abs(tx.net), symbol)}.
      </div>
    </div>
  );
}