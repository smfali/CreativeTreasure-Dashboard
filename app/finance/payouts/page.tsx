"use client";

import { useEffect, useState } from "react";
import { Wallet, Landmark, CalendarClock, History, Send, Copy, SearchX } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import TableSkeleton from "@/components/TableSkeleton";
import EmptyState from "@/components/EmptyState";
import { FinanceNav } from "@/components/finance/FinanceNav";
import { FinancialStatCard } from "@/components/finance/FinancialStatCard";
import { PayoutTable } from "@/components/finance/PayoutTable";
import { PayoutCards } from "@/components/finance/PayoutCards";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { useFinance } from "@/contexts/FinanceContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatMoney, formatDate } from "@/lib/format";
import { payoutStatusLabels, type Payout } from "@/lib/data/finance";

export default function PayoutsPage() {
  const { payouts, summary, requestPayout } = useFinance();
  const { symbol } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [requestOpen, setRequestOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  function handleRequest() {
    const payout = requestPayout();
    setRequestOpen(false);
    if (payout) {
      setNotice(`Payout ${payout.id} requested. This is a local demo — no real transfer occurs.`);
    } else {
      setNotice("Nothing to pay out — the available balance is zero.");
    }
  }

  function handleCopyId(p: Payout) {
    navigator.clipboard?.writeText(p.id).catch(() => {});
    setNotice(`Copied payout ID ${p.id} to clipboard.`);
  }

  if (loading) {
    return (
      <div className="p-4 space-y-6 sm:p-8">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Finance" }, { label: "Payouts" }]} />
        <Skeleton className="h-9 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <TableSkeleton rows={5} cols={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Finance" }, { label: "Payouts" }]} />
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="heading-page">Payouts</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Balances and payout history for CreativeTreasury.
            </p>
          </div>
          <Button onClick={() => setRequestOpen(true)} className="gap-2">
            <Send className="h-4 w-4" aria-hidden />
            Request payout
          </Button>
        </div>
      </div>

      <FinanceNav />

      {notice && <Alert variant="success">{notice}</Alert>}

      <section aria-labelledby="payout-balances-heading">
        <h2 id="payout-balances-heading" className="sr-only">
          Payout balances
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <FinancialStatCard
            label="Available balance"
            value={formatMoney(summary.availableBalance, symbol)}
            hint="Ready to pay out"
          />
          <FinancialStatCard
            label="Pending payout"
            value={formatMoney(summary.pendingPayout, symbol)}
            hint="In transit to your bank"
          />
          <FinancialStatCard
            label="Next payout"
            value={formatMoney(summary.nextPayout, symbol)}
            hint="Scheduled payout"
          />
          <FinancialStatCard
            label="Last payout"
            value={
              summary.lastPayout
                ? formatMoney(summary.lastPayout.amount, symbol)
                : formatMoney(0, symbol)
            }
            hint={
              summary.lastPayout
                ? `Paid ${formatDate(summary.lastPayout.date)}`
                : "No payouts yet"
            }
          />
        </div>
      </section>

      <section aria-labelledby="history-heading">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="history-heading" className="heading-section text-foreground">
              Payout history
            </h2>
            <p className="text-sm text-muted-foreground">
              {formatMoney(summary.totalPayouts, symbol)} paid out across {summary.payoutCount} payouts
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <History className="h-3.5 w-3.5" aria-hidden />
            Destination · {payouts[0]?.destination ?? "—"}
          </span>
        </div>

        {payouts.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No payouts yet"
            description="Payouts will appear here once your balance is eligible."
          />
        ) : (
          <>
            <div className="hidden lg:block">
              <Card>
                <PayoutTable payouts={payouts} symbol={symbol} />
              </Card>
            </div>
            <div className="lg:hidden">
              <PayoutCards payouts={payouts} symbol={symbol} />
            </div>
          </>
        )}
      </section>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
            <div>
              <p className="text-sm font-medium text-foreground">Payout details</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Funds settle to {payouts[0]?.destination ?? "your bank account"} on the next payout date.
                Payouts are scheduled every two weeks.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {payouts.slice(0, 3).map((p) => (
              <Button key={p.id} variant="outline" size="sm" onClick={() => handleCopyId(p)}>
                <Copy className="h-3.5 w-3.5" aria-hidden />
                {p.id}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        <Landmark className="h-3.5 w-3.5" aria-hidden />
        Demo workspace — payouts are simulated locally and no real banking transfers are performed.
      </div>

      <ConfirmDialog
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        title="Request payout"
        description={`Request a payout of ${formatMoney(summary.availableBalance, symbol)} to your connected bank account? This is a local demo action and no real transfer will be made.`}
        confirmLabel="Request payout"
        onConfirm={handleRequest}
      />
    </div>
  );
}