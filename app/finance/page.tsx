"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, FileSpreadsheet, ArrowRight } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import TableSkeleton from "@/components/TableSkeleton";
import { FinanceNav } from "@/components/finance/FinanceNav";
import { FinanceRangePicker } from "@/components/finance/FinanceRangePicker";
import { BalanceCard } from "@/components/finance/BalanceCard";
import { FinancialStatCard } from "@/components/finance/FinancialStatCard";
import { RevenueNetChart } from "@/components/finance/RevenueNetChart";
import { FeesBreakdownChart } from "@/components/finance/FeesBreakdownChart";
import { PayoutsChart } from "@/components/finance/PayoutsChart";
import { TransactionStatusBadge } from "@/components/finance/TransactionStatusBadge";
import { TransactionTypeBadge } from "@/components/finance/TransactionTypeBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useFinance } from "@/contexts/FinanceContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getPeriodKpis, buildFinanceReportCsv, type FinanceRange } from "@/lib/data/finance";
import { formatMoney, formatNumber, formatDate } from "@/lib/format";

export default function FinancePage() {
  const { transactions, payouts, summary, today } = useFinance();
  const { symbol } = useCurrency();

  const [range, setRange] = useState<FinanceRange>("30d");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const kpis = useMemo(() => getPeriodKpis(transactions, range, today), [transactions, range, today]);
  const recent = useMemo(() => transactions.slice(0, 6), [transactions]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  function handleDownloadReport() {
    const csv = buildFinanceReportCsv(transactions, payouts, summary, today);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `creative-treasury-finance-report-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice("Financial report downloaded as CSV.");
  }

  if (loading) {
    return (
      <div className="p-4 space-y-6 sm:p-8">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Finance" }]} />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-44" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
        <TableSkeleton rows={4} cols={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Finance" }]} />
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="heading-page">Finance</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Balances, transactions, payouts, fees and refunds for CreativeTreasury.
            </p>
          </div>
          <Button onClick={handleDownloadReport} className="gap-2">
            <Download className="h-4 w-4" aria-hidden />
            Download report
          </Button>
        </div>
      </div>

      <FinanceNav />

      <FinanceRangePicker value={range} onChange={setRange} />

      <BalanceCard summary={summary} symbol={symbol} />

      <section aria-labelledby="finance-kpis-heading">
        <h2 id="finance-kpis-heading" className="sr-only">
          Financial metrics for the selected period
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <FinancialStatCard
            label="Total revenue"
            value={formatMoney(kpis.gross, symbol)}
            change={kpis.grossGrowth}
          />
          <FinancialStatCard
            label="Net revenue"
            value={formatMoney(kpis.net, symbol)}
            change={kpis.netGrowth}
            hint="After fees and refunds"
          />
          <FinancialStatCard
            label="Total fees"
            value={formatMoney(kpis.fees, symbol)}
            change={kpis.feesGrowth}
          />
          <FinancialStatCard
            label="Refunds"
            value={formatMoney(kpis.refunds, symbol)}
            change={kpis.refundsGrowth}
          />
          <FinancialStatCard
            label="Payouts paid"
            value={formatMoney(kpis.payouts, symbol)}
            change={kpis.payoutsGrowth}
          />
          <FinancialStatCard
            label="Sales"
            value={formatNumber(kpis.sales)}
            change={kpis.salesGrowth}
          />
        </div>
      </section>

      <section aria-labelledby="performance-heading" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueNetChart range={range} today={today} transactions={transactions} symbol={symbol} />
        <FeesBreakdownChart transactions={transactions} symbol={symbol} />
      </section>

      <PayoutsChart payouts={payouts} symbol={symbol} />

      <section aria-labelledby="recent-heading">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="recent-heading" className="heading-section text-foreground">
              Recent transactions
            </h2>
            <p className="text-sm text-muted-foreground">Latest activity in your ledger</p>
          </div>
          <Link href="/finance/transactions">
            <Button variant="secondary" size="sm">
              View all
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </Link>
        </div>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Net</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((tx) => (
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
                  <TableCell className="text-sm text-foreground">{tx.customerName ?? "—"}</TableCell>
                  <TableCell>
                    <TransactionTypeBadge type={tx.type} />
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium text-foreground">
                    {tx.status === "failed" || tx.type === "fee"
                      ? tx.type === "fee"
                        ? `−${formatMoney(Math.abs(tx.net), symbol)}`
                        : "—"
                      : `${tx.net >= 0 ? "+" : "−"}${formatMoney(Math.abs(tx.net), symbol)}`}
                  </TableCell>
                  <TableCell>
                    <TransactionStatusBadge status={tx.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      {notice && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground shadow-lg"
        >
          <span className="inline-flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-primary" aria-hidden />
            {notice}
          </span>
        </div>
      )}
    </div>
  );
}