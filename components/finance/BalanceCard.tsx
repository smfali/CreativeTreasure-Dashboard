"use client";

import Link from "next/link";
import { Wallet, Landmark, Clock, CalendarClock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatMoney, formatDate } from "@/lib/format";
import type { FinanceSummary } from "@/lib/data/finance";

interface BalanceCardProps {
  summary: FinanceSummary;
  symbol: string;
}

function BalanceStat({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: typeof Wallet;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-lg font-bold text-foreground">{value}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

export function BalanceCard({ summary, symbol }: BalanceCardProps) {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
        <div className="flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" aria-hidden />
              <p className="text-sm font-medium text-muted-foreground">Available balance</p>
            </div>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {formatMoney(summary.availableBalance, symbol)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Net of fees, refunds and previous payouts.
            </p>
          </div>
          <Link href="/finance/payouts" className="self-start">
            <Button variant="secondary" size="sm">
              Manage payouts
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2">
          <BalanceStat
            icon={Clock}
            label="Pending balance"
            value={formatMoney(summary.pendingBalance, symbol)}
            hint="Sales awaiting settlement"
          />
          <BalanceStat
            icon={Landmark}
            label="Pending payout"
            value={formatMoney(summary.pendingPayout, symbol)}
            hint="In transit to your bank"
          />
          <BalanceStat
            icon={CalendarClock}
            label="Next payout"
            value={formatMoney(summary.nextPayout, symbol)}
            hint="Scheduled payout"
          />
          <BalanceStat
            icon={Landmark}
            label="Total paid out"
            value={formatMoney(summary.totalPayouts, symbol)}
            hint={
              summary.lastPayout
                ? `Last payout ${formatMoney(summary.lastPayout.amount, symbol)} on ${formatDate(summary.lastPayout.date)}`
                : "No payouts yet"
            }
          />
        </div>
      </div>
    </Card>
  );
}