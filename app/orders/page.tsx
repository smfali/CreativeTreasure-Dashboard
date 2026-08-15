"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SearchX,
  X,
  ShoppingBag,
  RotateCcw,
  Ban,
  CheckCircle2,
  Copy,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { StatCard } from "@/components/StatCard";
import EmptyState from "@/components/EmptyState";
import TableSkeleton from "@/components/TableSkeleton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { OrderTable, type OrderSortKey, type OrderSortState } from "@/components/orders/OrderTable";
import { OrderCards } from "@/components/orders/OrderCards";
import OrdersAnalytics from "@/components/orders/OrdersAnalytics";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useOrders } from "@/contexts/OrdersContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatMoney, formatNumber } from "@/lib/format";
import {
  orderStatusLabels,
  paymentStatusLabels,
  getOrderCounts,
  type Order,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/data/orders";

const PAGE_SIZE = 8;

const ALL = "all";

const dateOptions = [
  { value: "all", label: "All time" },
  { value: "week", label: "Last 7 days" },
  { value: "month", label: "Last 30 days" },
  { value: "quarter", label: "Last 90 days" },
];

const dateCutoffs: Record<string, string> = {
  week: "2026-08-06",
  month: "2026-07-13",
  quarter: "2026-06-01",
};

function compare(a: Order, b: Order, key: OrderSortKey, dir: "asc" | "desc"): number {
  let res = 0;
  switch (key) {
    case "number":
      res = a.number.localeCompare(b.number);
      break;
    case "date":
      res = a.date.localeCompare(b.date);
      break;
    case "amount":
      res = a.total - b.total;
      break;
    case "customer":
      res = a.customerName.localeCompare(b.customerName);
      break;
  }
  return dir === "asc" ? res : -res;
}

export default function OrdersPage() {
  const {
    orders,
    updateOrderStatus,
    refundOrder,
    cancelOrder,
    markOrdersCompleted,
  } = useOrders();
  const { symbol } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("orders");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>(ALL);
  const [payment, setPayment] = useState<string>(ALL);
  const [product, setProduct] = useState<string>(ALL);
  const [customer, setCustomer] = useState<string>(ALL);
  const [dateRange, setDateRange] = useState<string>("all");
  const [sort, setSort] = useState<OrderSortState>({ key: "date", dir: "desc" });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [refundTarget, setRefundTarget] = useState<Order | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);
  const [bulkCancelOpen, setBulkCancelOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setPage(1);
    setSelected(new Set());
  }, [search, status, payment, product, customer, dateRange, sort.key, sort.dir]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  const metrics = useMemo(() => getOrderCounts(orders), [orders]);

  const productOptions = useMemo(() => {
    const names = new Set<string>();
    for (const order of orders) {
      for (const item of order.items) names.add(item.name);
    }
    return Array.from(names).sort();
  }, [orders]);

  const customerOptions = useMemo(
    () => Array.from(new Set(orders.map((o) => o.customerName))).sort(),
    [orders]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders
      .filter((o) => {
        if (status !== ALL && o.orderStatus !== status) return false;
        if (payment !== ALL && o.paymentStatus !== payment) return false;
        if (product !== ALL && !o.items.some((it) => it.name === product)) return false;
        if (customer !== ALL && o.customerName !== customer) return false;
        const cutoff = dateCutoffs[dateRange];
        if (cutoff && o.date < cutoff) return false;
        if (!q) return true;
        return (
          o.number.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.items.some((it) => it.name.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => compare(a, b, sort.key, sort.dir));
  }, [orders, search, status, payment, product, customer, dateRange, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const start = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, filtered.length);

  const allSelected = filtered.length > 0 && filtered.every((o) => selected.has(o.id));
  const someSelected = filtered.some((o) => selected.has(o.id));

  const hasFilters =
    search !== "" ||
    status !== ALL ||
    payment !== ALL ||
    product !== ALL ||
    customer !== ALL ||
    dateRange !== "all";

  function clearFilters() {
    setSearch("");
    setStatus(ALL);
    setPayment(ALL);
    setProduct(ALL);
    setCustomer(ALL);
    setDateRange("all");
  }

  function toggleSelectAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        filtered.forEach((o) => next.delete(o.id));
      } else {
        filtered.forEach((o) => next.add(o.id));
      }
      return next;
    });
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleUpdateStatus(order: Order, next: OrderStatus) {
    updateOrderStatus(order.id, next);
    setNotice(`Order ${order.number} marked as ${orderStatusLabels[next].toLowerCase()}.`);
  }

  function handleCopyId(order: Order) {
    navigator.clipboard?.writeText(order.id).catch(() => {});
    setNotice(`Copied order ID ${order.id} to clipboard.`);
  }

  function handleRefund() {
    if (!refundTarget) return;
    refundOrder(refundTarget.id);
    setNotice(`Order ${refundTarget.number} refunded.`);
    setRefundTarget(null);
  }

  function handleCancel() {
    if (!cancelTarget) return;
    cancelOrder(cancelTarget.id);
    setNotice(`Order ${cancelTarget.number} cancelled.`);
    setCancelTarget(null);
  }

  function handleBulkComplete() {
    const ids = Array.from(selected);
    markOrdersCompleted(ids);
    setNotice(`${ids.length} orders marked as completed.`);
    setSelected(new Set());
  }

  function handleBulkCancelSelected() {
    const ids = Array.from(selected);
    ids.forEach((id) => cancelOrder(id));
    setNotice(`${ids.length} orders cancelled.`);
    setSelected(new Set());
    setBulkCancelOpen(false);
  }

  if (loading) {
    return (
      <div className="p-4 space-y-6 sm:p-8">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Orders" }]} />
        <Skeleton className="h-9 w-40" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-14" />
        <TableSkeleton rows={5} cols={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Orders" }]} />
        <div className="mt-2">
          <h1 className="heading-page">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage orders, refunds and fulfilment for CreativeTreasury.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-7">
        <StatCard label="Total orders" value={formatNumber(metrics.total)} />
        <StatCard label="Completed" value={formatNumber(metrics.completed)} />
        <StatCard label="Processing" value={formatNumber(metrics.processing)} />
        <StatCard label="Pending" value={formatNumber(metrics.pending)} />
        <StatCard
          label="Refunded & cancelled"
          value={formatNumber(metrics.refunded + metrics.cancelled)}
        />
        <StatCard label="Order revenue" value={formatMoney(metrics.revenue, symbol)} hint="Completed orders" />
        <StatCard label="Avg. order value" value={formatMoney(metrics.aov, symbol)} hint="Completed orders" />
      </div>

      {notice && <Alert variant="success">{notice}</Alert>}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <div className="space-y-4">
            <Card>
              <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
                <div className="relative sm:col-span-2">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search orders"
                    placeholder="Search order, customer, product…"
                    className="pl-9"
                  />
                </div>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  aria-label="Filter by status"
                >
                  <option value={ALL}>All statuses</option>
                  {(Object.keys(orderStatusLabels) as OrderStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {orderStatusLabels[s]}
                    </option>
                  ))}
                </Select>
                <Select
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                  aria-label="Filter by payment status"
                >
                  <option value={ALL}>All payments</option>
                  {(Object.keys(paymentStatusLabels) as PaymentStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {paymentStatusLabels[s]}
                    </option>
                  ))}
                </Select>
                <Select
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  aria-label="Filter by product"
                >
                  <option value={ALL}>All products</option>
                  {productOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </Select>
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  aria-label="Filter by date range"
                >
                  {dateOptions.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                <p className="text-sm text-muted-foreground">
                  Showing {formatNumber(metrics.total)} orders ·{" "}
                  {hasFilters
                    ? `${formatNumber(filtered.length)} match filters`
                    : "all orders"}
                </p>
                <div className="flex items-center gap-2">
                  <Select
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    aria-label="Filter by customer"
                    className="w-44"
                  >
                    <option value={ALL}>All customers</option>
                    {customerOptions.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </Select>
                  {hasFilters && (
                    <Button variant="ghost" onClick={clearFilters} className="shrink-0">
                      <X className="h-4 w-4" aria-hidden />
                      Clear filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {selected.size > 0 && (
              <Card className="border-primary/40 bg-primary/5">
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {selected.size} selected
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleBulkComplete}
                    >
                      <CheckCircle2 className="h-4 w-4" aria-hidden />
                      Mark completed
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setBulkCancelOpen(true)}
                    >
                      <Ban className="h-4 w-4" aria-hidden />
                      Cancel selected
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
                      Clear selection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {orders.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="No orders yet"
                description="Orders will appear here once customers start purchasing."
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="No orders found"
                description="Try adjusting your search or filters."
                action={
                  <Button variant="secondary" onClick={clearFilters}>
                    Clear filters
                  </Button>
                }
              />
            ) : (
              <>
                <div className="hidden lg:block">
                  <Card>
                    <OrderTable
                      orders={pageRows}
                      symbol={symbol}
                      selected={selected}
                      allSelected={allSelected}
                      someSelected={someSelected}
                      onToggleSelectAll={toggleSelectAll}
                      onToggleSelect={toggleSelect}
                      sort={sort}
                      onSort={(key) =>
                        setSort((prev) =>
                          prev.key === key
                            ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
                            : { key, dir: "asc" }
                        )
                      }
                      onUpdateStatus={handleUpdateStatus}
                      onRefund={setRefundTarget}
                      onCancel={setCancelTarget}
                      onCopyId={handleCopyId}
                    />
                    <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-muted-foreground">
                        Showing {start}–{end} of {formatNumber(filtered.length)}
                      </p>
                      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
                    </div>
                  </Card>
                </div>

                <div className="lg:hidden">
                  <OrderCards orders={pageRows} symbol={symbol} />
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing {start}–{end} of {formatNumber(filtered.length)}
                    </p>
                    <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
                  </div>
                </div>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <OrdersAnalytics orders={orders} symbol={symbol} />
        </TabsContent>
      </Tabs>

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

      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Cancel order"
        description={
          cancelTarget
            ? `Cancel order ${cancelTarget.number}? The customer will not be charged. This is a local demo action.`
            : ""
        }
        confirmLabel="Cancel order"
        destructive
        onConfirm={handleCancel}
      />

      <ConfirmDialog
        open={bulkCancelOpen}
        onClose={() => setBulkCancelOpen(false)}
        title="Cancel selected orders"
        description={`Cancel ${selected.size} selected order(s)? This is a local demo action.`}
        confirmLabel="Cancel orders"
        destructive
        onConfirm={handleBulkCancelSelected}
      />

      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        <Copy className="h-3.5 w-3.5" aria-hidden />
        Demo workspace — status changes and refunds are local only and reset on reload.
      </div>
    </div>
  );
}