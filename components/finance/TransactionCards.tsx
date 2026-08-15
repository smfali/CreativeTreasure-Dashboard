"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { TransactionTypeBadge } from "./TransactionTypeBadge";
import { SignedAmount } from "./SignedAmount";
import { formatDate } from "@/lib/format";
import type { FinanceTransaction } from "@/lib/data/finance";

interface TransactionCardsProps {
  transactions: FinanceTransaction[];
  symbol: string;
}

export function TransactionCards({ transactions, symbol }: TransactionCardsProps) {
  return (
    <ul className="space-y-3">
      {transactions.map((tx) => {
        const netIncome = tx.type !== "payout" && tx.type !== "fee" && tx.type !== "adjustment";
        return (
          <li key={tx.id}>
            <Link href={`/finance/transactions/${tx.id}`} className="block">
              <Card className="p-4 transition-colors hover:border-primary/50">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-primary">{tx.id}</span>
                  <TransactionStatusBadge status={tx.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(tx.datetime)}
                  {tx.orderNumber ? ` · ${tx.orderNumber}` : ""}
                </p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {tx.customerName ?? tx.description ?? "—"}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <TransactionTypeBadge type={tx.type} />
                      {tx.productName && (
                        <span className="truncate text-xs text-muted-foreground">
                          {tx.productName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {tx.type === "fee" ? (
                      <SignedAmount value={-tx.fee} symbol={symbol} />
                    ) : (
                      <SignedAmount value={tx.amount} symbol={symbol} income={netIncome} />
                    )}
                    {tx.status !== "failed" && (
                      <span className="text-xs text-muted-foreground">
                        Net {tx.net >= 0 ? "+" : "−"}
                        {Math.abs(tx.net).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
                </div>
              </Card>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}