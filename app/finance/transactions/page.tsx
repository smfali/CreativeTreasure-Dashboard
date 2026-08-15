"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SearchX, X, Download, Landmark } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import TableSkeleton from "@/components/TableSkeleton";
import EmptyState from "@/components/EmptyState";
import { FinanceNav } from "@/components/finance/FinanceNav";
import { FinanceRangePicker } from "@/components/finance/FinanceRangePicker";
import { TransactionTable, type TransactionSortKey, type TransactionSortState } from "@/components/finance/TransactionTable";
import { TransactionCards } from "@/components/finance/TransactionCards";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { useFinance } from "@/contexts/FinanceContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  transactionTypeLabels,
  transactionStatusLabels,
  rangeBounds,
  buildTransactionsCsv,
  type FinanceRange,
  type TransactionType,
  type TransactionStatus,
} from "@/lib/data/finance";
import { formatNumber } from "@/lib/format";

const PAGE_SIZE = 8;
const ALL = "all";

function compare(a: { datetime: string; amount: number; net: number; customerName?: string }, b: { datetime: string; amount: number; net: number; customerName?: string }, key: TransactionSortKey, dir: "asc" | "desc"): number {
  let res = 0;
  switch (key) {
    case "date":
      res = a.datetime.localeCompare(b.datetime);
      break;
    case "amount":
      res = a.amount - b.amount;
      break;
    case "net":
      res = a.net - b.net;
      break;
    case "customer":
      res = (a.customerName ?? "").localeCompare(b.customerName ?? "");
      break;
  }
  return dir === "asc" ? res : -res;
}

export default function TransactionsPage() {
  const { transactions, today } = useFinance();
  const { symbol } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>(ALL);
  const [status, setStatus] = useState<string>(ALL);
  const [payment, setPayment] = useState<string>(ALL);
  const [range, setRange] = useState<FinanceRange>("all");
  const [sort, setSort] = useState<TransactionSortState>({ key: "date", dir: "desc" });
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, type, status, payment, range, sort.key, sort.dir]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  const paymentOptions = useMemo(
    () => Array.from(new Set(transactions.map((t) => t.paymentMethod).filter((m): m is string => Boolean(m)))).sort(),
    [transactions]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const bounds = rangeBounds(range, today);
    return transactions
      .filter((t) => {
        if (type !== ALL && t.type !== type) return false;
        if (status !== ALL && t.status !== status) return false;
        if (payment !== ALL && (t.paymentMethod ?? "") !== payment) return false;
        const d = t.datetime.slice(0, 10);
        if (bounds.start && d < bounds.start) return false;
        if (bounds.end && d > bounds.end) return false;
        if (!q) return true;
        return (
          t.id.toLowerCase().includes(q) ||
          (t.customerName ?? "").toLowerCase().includes(q) ||
          (t.productName ?? "").toLowerCase().includes(q) ||
          (t.orderNumber ?? "").toLowerCase().includes(q) ||
          (t.description ?? "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => compare(a, b, sort.key, sort.dir));
  }, [transactions, search, type, status, payment, range, today, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const start = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, filtered.length);

  const filterCount =
    (search !== "" ? 1 : 0) +
    (type !== ALL ? 1 : 0) +
    (status !== ALL ? 1 : 0) +
    (payment !== ALL ? 1 : 0) +
    (range !== "all" ? 1 : 0);

  function clearFilters() {
    setSearch("");
    setType(ALL);
    setStatus(ALL);
    setPayment(ALL);
    setRange("all");
  }

  function handleExport() {
    const csv = buildTransactionsCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `creative-treasury-transactions-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice(`Exported ${formatNumber(filtered.length)} transaction${filtered.length === 1 ? "" : "s"} as CSV.`);
  }

  if (loading) {
    return (
      <div className="p-4 space-y-6 sm:p-8">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Finance" }, { label: "Transactions" }]} />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-14" />
        <TableSkeleton rows={6} cols={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Finance" }, { label: "Transactions" }]} />
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="heading-page">Transactions</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sales, refunds, payouts, fees and adjustments for CreativeTreasury.
            </p>
          </div>
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" aria-hidden />
            Export transactions
          </Button>
        </div>
      </div>

      <FinanceNav />

      {notice && <Alert variant="success">{notice}</Alert>}

      <Card>
        <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative sm:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search transactions"
              placeholder="Search ID, customer, product, order…"
              className="pl-9"
            />
          </div>
          <Select value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by transaction type">
            <option value={ALL}>All types</option>
            {(Object.keys(transactionTypeLabels) as TransactionType[]).map((t) => (
              <option key={t} value={t}>
                {transactionTypeLabels[t]}
              </option>
            ))}
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
            <option value={ALL}>All statuses</option>
            {(Object.keys(transactionStatusLabels) as TransactionStatus[]).map((s) => (
              <option key={s} value={s}>
                {transactionStatusLabels[s]}
              </option>
            ))}
          </Select>
          <Select value={payment} onChange={(e) => setPayment(e.target.value)} aria-label="Filter by payment method">
            <option value={ALL}>All payments</option>
            {paymentOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4 p-4">
          <FinanceRangePicker value={range} onChange={setRange} label="Filter by date range" />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">
              Showing {formatNumber(transactions.length)} transactions ·{" "}
              {filterCount > 0 ? `${formatNumber(filtered.length)} match filters` : "all transactions"}
            </p>
            <div className="flex items-center gap-3">
              {filterCount > 0 && (
                <span
                  className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                  aria-label={`${filterCount} active filter${filterCount === 1 ? "" : "s"}`}
                >
                  {filterCount} active
                </span>
              )}
              {filterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4" aria-hidden />
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {transactions.length === 0 ? (
        <EmptyState
          icon={Landmark}
          title="No transactions yet"
          description="Transactions will appear here once customers start purchasing."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No transactions found"
          description="Try adjusting your search or filters."
          action={
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <div className="hidden xl:block">
            <Card>
              <TransactionTable transactions={pageRows} symbol={symbol} sort={sort} onSort={(key) =>
                setSort((prev) =>
                  prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
                )
              } />
              <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {start}–{end} of {formatNumber(filtered.length)}
                </p>
                <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
              </div>
            </Card>
          </div>

          <div className="xl:hidden">
            <TransactionCards transactions={pageRows} symbol={symbol} />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {start}–{end} of {formatNumber(filtered.length)}
              </p>
              <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
            </div>
          </div>
        </>
      )}

      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        <Landmark className="h-3.5 w-3.5" aria-hidden />
        Demo workspace — exports are generated locally in your browser and no real payments are processed.
      </div>
    </div>
  );
}