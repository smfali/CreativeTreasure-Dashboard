"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RotateCcw, SearchX, Receipt, TrendingDown, Percent } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import TableSkeleton from "@/components/TableSkeleton";
import EmptyState from "@/components/EmptyState";
import { FinanceNav } from "@/components/finance/FinanceNav";
import { FinancialStatCard } from "@/components/finance/FinancialStatCard";
import { TransactionStatusBadge } from "@/components/finance/TransactionStatusBadge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useFinance } from "@/contexts/FinanceContext";
import { useOrders } from "@/contexts/OrdersContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getRefundSummary, getRefundableOrders } from "@/lib/data/finance";
import { formatMoney, formatNumber, formatDate } from "@/lib/format";
import type { Order } from "@/lib/data/orders";

export default function RefundsPage() {
  const { transactions } = useFinance();
  const { orders, refundOrder } = useOrders();
  const { symbol } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [refundTarget, setRefundTarget] = useState<Order | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const summary = useMemo(() => getRefundSummary(transactions), [transactions]);
  const refundable = useMemo(
    () => getRefundableOrders(orders).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4),
    [orders]
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  function handleRefund() {
    if (!refundTarget) return;
    refundOrder(refundTarget.id);
    setNotice(`Order ${refundTarget.number} refunded. This is a local demo — no real payment is processed.`);
    setRefundTarget(null);
  }

  if (loading) {
    return (
      <div className="p-4 space-y-6 sm:p-8">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Finance" }, { label: "Refunds" }]} />
        <Skeleton className="h-9 w-44" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <TableSkeleton rows={4} cols={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Finance" }, { label: "Refunds" }]} />
        <div className="mt-2">
          <h1 className="heading-page">Refunds</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Refund activity and refundable orders for CreativeTreasury.
          </p>
        </div>
      </div>

      <FinanceNav />

      {notice && <Alert variant="success">{notice}</Alert>}

      <section aria-labelledby="refund-kpis-heading">
        <h2 id="refund-kpis-heading" className="sr-only">
          Refund summary
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <FinancialStatCard label="Refund count" value={formatNumber(summary.count)} hint="All-time" />
          <FinancialStatCard label="Refund amount" value={formatMoney(summary.amount, symbol)} hint="All-time" />
          <FinancialStatCard
            label="Refund rate"
            value={`${summary.rate.toFixed(2)}%`}
            hint="Of gross revenue"
          />
          <FinancialStatCard label="Gross revenue" value={formatMoney(summary.gross, symbol)} hint="All-time" />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section aria-labelledby="recent-refunds-heading">
          <div className="mb-4">
            <h2 id="recent-refunds-heading" className="heading-section text-foreground">
              Recent refunds
            </h2>
            <p className="text-sm text-muted-foreground">Refund transactions linked to orders</p>
          </div>
          <Card>
            {summary.recent.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={RotateCcw}
                  title="No refunds yet"
                  description="Refunded orders will appear here."
                />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.recent.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <Link
                          href={`/finance/transactions/${tx.id}`}
                          className="text-sm font-semibold text-primary hover:underline"
                        >
                          {tx.id}
                        </Link>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(tx.datetime)}
                      </TableCell>
                      <TableCell>
                        {tx.orderId ? (
                          <Link
                            href={`/orders/${tx.orderId}`}
                            className="text-sm font-medium text-foreground hover:text-primary hover:underline"
                          >
                            {tx.orderNumber}
                          </Link>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[9rem] truncate text-sm text-foreground">
                        {tx.customerName ?? "—"}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium text-destructive">
                        −{formatMoney(Math.abs(tx.amount), symbol)}
                      </TableCell>
                      <TableCell>
                        <TransactionStatusBadge status={tx.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </section>

        <section aria-labelledby="refundable-heading">
          <div className="mb-4">
            <h2 id="refundable-heading" className="heading-section text-foreground">
              Refundable orders
            </h2>
            <p className="text-sm text-muted-foreground">Recent orders that can be refunded (demo)</p>
          </div>
          <Card>
            {refundable.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={Receipt}
                  title="No refundable orders"
                  description="Completed, processing and pending orders will appear here."
                />
              </div>
            ) : (
              <CardContent className="divide-y divide-border p-0">
                {refundable.map((order) => (
                  <div key={order.id} className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/orders/${order.id}`}
                          className="text-sm font-semibold text-primary hover:underline"
                        >
                          {order.number}
                        </Link>
                        <OrderStatusBadge status={order.orderStatus} />
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {order.customerName} · {formatDate(order.date)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-sm font-medium text-foreground">
                        {formatMoney(order.total, symbol)}
                      </span>
                      <Button variant="secondary" size="sm" onClick={() => setRefundTarget(order)}>
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                        Refund
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <RotateCcw className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Refund count</p>
              <p className="text-2xl font-bold text-foreground">{formatNumber(summary.count)}</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Individual refund transactions issued.</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <TrendingDown className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Refunded amount</p>
              <p className="text-2xl font-bold text-foreground">{formatMoney(summary.amount, symbol)}</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Total returned to customers.</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 text-info">
              <Percent className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Refund rate</p>
              <p className="text-2xl font-bold text-foreground">{summary.rate.toFixed(2)}%</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Refunds as a percentage of gross revenue. Refunds reduce net revenue.
          </p>
        </Card>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        <SearchX className="h-3.5 w-3.5" aria-hidden />
        Demo workspace — refund actions are local only and reset on reload. No real payments are processed.
      </div>

      <ConfirmDialog
        open={!!refundTarget}
        onClose={() => setRefundTarget(null)}
        title="Refund order"
        description={
          refundTarget
            ? `Issue a refund of ${formatMoney(refundTarget.total, symbol)} for order ${refundTarget.number}? This is a local demo action and no real payment is processed.`
            : ""
        }
        confirmLabel="Refund order"
        destructive
        onConfirm={handleRefund}
      />
    </div>
  );
}