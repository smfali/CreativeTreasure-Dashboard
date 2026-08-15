"use client";

import Link from "next/link";
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { ProductThumbnail } from "@/components/products/ProductThumbnail";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { TransactionTypeBadge } from "./TransactionTypeBadge";
import { SignedAmount } from "./SignedAmount";
import { formatMoney, formatDate } from "@/lib/format";
import type { FinanceTransaction } from "@/lib/data/finance";

export type TransactionSortKey = "date" | "amount" | "net" | "customer";
export interface TransactionSortState {
  key: TransactionSortKey;
  dir: "asc" | "desc";
}

interface TransactionTableProps {
  transactions: FinanceTransaction[];
  symbol: string;
  sort: TransactionSortState;
  onSort: (key: TransactionSortKey) => void;
}

function SortableHead({
  label,
  sortKey,
  sort,
  onSort,
  className,
}: {
  label: string;
  sortKey: TransactionSortKey;
  sort: TransactionSortState;
  onSort: (key: TransactionSortKey) => void;
  className?: string;
}) {
  const active = sort.key === sortKey;
  const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
        className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {label}
        <Icon className="h-3.5 w-3.5" aria-hidden />
      </button>
    </TableHead>
  );
}

export function TransactionTable({ transactions, symbol, sort, onSort }: TransactionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction</TableHead>
          <SortableHead label="Date" sortKey="date" sort={sort} onSort={onSort} />
          <SortableHead label="Customer" sortKey="customer" sort={sort} onSort={onSort} />
          <TableHead>Product</TableHead>
          <TableHead>Type</TableHead>
          <SortableHead label="Amount" sortKey="amount" sort={sort} onSort={onSort} className="text-right" />
          <TableHead className="text-right">Fees</TableHead>
          <SortableHead label="Net" sortKey="net" sort={sort} onSort={onSort} className="text-right" />
          <TableHead>Payment</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => {
          const isPayout = tx.type === "payout";
          const netIncome = tx.type !== "payout" && tx.type !== "fee" && tx.type !== "adjustment";
          return (
            <TableRow key={tx.id}>
              <TableCell>
                <Link
                  href={`/finance/transactions/${tx.id}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  {tx.id}
                  <ExternalLink className="h-3 w-3" aria-hidden />
                </Link>
                {tx.orderNumber && (
                  <p className="text-xs text-muted-foreground">{tx.orderNumber}</p>
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                {formatDate(tx.datetime)}
              </TableCell>
              <TableCell>
                {tx.customerName ? (
                  <div className="flex items-center gap-2.5">
                    <Avatar name={tx.customerName} className="h-8 w-8 text-xs" />
                    <span className="max-w-[9rem] truncate text-sm text-foreground">
                      {tx.customerName}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {tx.productName ? (
                  <div className="flex items-center gap-2.5">
                    <ProductThumbnail
                      name={tx.productName}
                      type={tx.productType ?? "digital"}
                      className="h-8 w-8 rounded-md [&>svg]:h-4 [&>svg]:w-4"
                    />
                    <span className="max-w-[10rem] truncate text-sm text-foreground">
                      {tx.productName}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <TransactionTypeBadge type={tx.type} />
              </TableCell>
              <TableCell className="text-right text-sm font-medium text-foreground">
                {tx.type === "fee" ? (
                  <SignedAmount value={-tx.fee} symbol={symbol} />
                ) : tx.type === "adjustment" ? (
                  <SignedAmount value={tx.amount} symbol={symbol} />
                ) : (
                  <SignedAmount value={tx.amount} symbol={symbol} income={!isPayout} />
                )}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {tx.status === "failed" ? "—" : formatMoney(Math.abs(tx.fee), symbol)}
              </TableCell>
              <TableCell className="text-right">
                {tx.status === "failed" ? (
                  <span className="text-sm text-muted-foreground">—</span>
                ) : tx.type === "fee" ? (
                  <SignedAmount value={tx.net} symbol={symbol} />
                ) : (
                  <SignedAmount value={tx.net} symbol={symbol} income={netIncome} />
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {tx.paymentMethod ? tx.paymentMethod : "—"}
              </TableCell>
              <TableCell>
                <TransactionStatusBadge status={tx.status} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}