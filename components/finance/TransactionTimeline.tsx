"use client";

import { CheckCircle2, Clock, RotateCcw, Percent, Landmark, XCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, formatMoney } from "@/lib/format";
import { transactionTypeLabels, type FinanceTransaction } from "@/lib/data/finance";

interface TimelineEvent {
  id: string;
  type: "payment" | "pending" | "refund" | "fee" | "payout" | "failed";
  title: string;
  description: string;
  datetime: string;
}

const eventMeta: Record<TimelineEvent["type"], { icon: typeof Clock; className: string }> = {
  payment: { icon: CheckCircle2, className: "text-success bg-success/15" },
  pending: { icon: Clock, className: "text-warning bg-warning/15" },
  refund: { icon: RotateCcw, className: "text-destructive bg-destructive/15" },
  fee: { icon: Percent, className: "text-muted-foreground bg-muted" },
  payout: { icon: Landmark, className: "text-info bg-info/15" },
  failed: { icon: XCircle, className: "text-destructive bg-destructive/15" },
};

function shiftTime(datetime: string, minutes: number): string {
  const [datePart, timePart] = datetime.split("T");
  const [h, m, s] = timePart.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const dayShift = Math.floor(total / (24 * 60));
  const rem = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const dd = new Date(`${datePart}T00:00:00Z`);
  dd.setUTCDate(dd.getUTCDate() + dayShift);
  const nh = String(Math.floor(rem / 60)).padStart(2, "0");
  const nm = String(rem % 60).padStart(2, "0");
  return `${dd.toISOString().slice(0, 10)}T${nh}:${nm}:${String(s ?? 0).padStart(2, "0")}`;
}

function dateTimeLabel(datetime: string): string {
  return `${formatDate(datetime)} · ${datetime.slice(11, 16)}`;
}

function buildEvents(tx: FinanceTransaction, symbol: string): TimelineEvent[] {
  const money = (value: number) => formatMoney(value, symbol);
  const events: TimelineEvent[] = [];

  if (tx.type === "sale") {
    events.push({
      id: "authorized",
      type: tx.status === "failed" ? "failed" : "payment",
      title: tx.status === "failed" ? "Payment failed" : "Payment authorized",
      description:
        tx.status === "failed"
          ? "The payment attempt was declined and no funds were captured."
          : `Payment of ${money(tx.amount)} attempted via ${tx.paymentMethod ?? "card"}.`,
      datetime: tx.datetime,
    });
    if (tx.status === "pending") {
      events.push({
        id: "settlement",
        type: "pending",
        title: "Settlement pending",
        description: "Funds are being held until the payment confirms.",
        datetime: shiftTime(tx.datetime, 30),
      });
    } else if (tx.status !== "failed") {
      events.push({
        id: "processed",
        type: "payment",
        title: "Payment processed",
        description: `Payment received via ${tx.paymentMethod ?? "card"}.`,
        datetime: shiftTime(tx.datetime, 30),
      });
      events.push({
        id: "fees",
        type: "fee",
        title: "Fees deducted",
        description: `${money(tx.fee)} in platform and processing fees.`,
        datetime: shiftTime(tx.datetime, 45),
      });
      events.push({
        id: "net",
        type: "payout",
        title: "Net added to available balance",
        description: `${money(tx.net)} is available for payout.`,
        datetime: shiftTime(tx.datetime, 60),
      });
    }
    if (tx.status === "refunded") {
      events.push({
        id: "refund",
        type: "refund",
        title: "Refund issued",
        description: `The full ${money(Math.abs(tx.amount))} was returned to the customer.`,
        datetime: tx.datetime,
      });
    }
  } else if (tx.type === "refund") {
    events.push({
      id: "initiated",
      type: "refund",
      title: "Refund initiated",
      description: `Refund of ${money(Math.abs(tx.amount))} initiated for the original order.`,
      datetime: tx.datetime,
    });
    events.push({
      id: "completed",
      type: "payment",
      title: "Refund completed",
      description: "The refund was returned to the customer's payment method.",
      datetime: shiftTime(tx.datetime, 30),
    });
    events.push({
      id: "fees",
      type: "fee",
      title: "Fee reversal applied",
      description: `Original fees were credited back, minus a refund charge of ${money(tx.feeBreakdown?.refund ?? 0)}.`,
      datetime: shiftTime(tx.datetime, 45),
    });
  } else if (tx.type === "payout") {
    events.push({
      id: "scheduled",
      type: "payout",
      title: "Payout scheduled",
      description: `Payout ${tx.id} was created for the available balance.`,
      datetime: tx.datetime,
    });
    if (tx.status === "failed") {
      events.push({
        id: "failed",
        type: "failed",
        title: "Payout failed",
        description: "The bank transfer could not be completed. Funds remain available.",
        datetime: shiftTime(tx.datetime, 1440),
      });
    } else {
      events.push({
        id: "processing",
        type: "pending",
        title: "Processing",
        description: "The transfer is in transit to your bank account.",
        datetime: shiftTime(tx.datetime, 1440),
      });
      if (tx.status === "completed") {
        events.push({
          id: "paid",
          type: "payment",
          title: "Paid out",
          description: `${money(tx.amount)} deposited to ${tx.paymentMethod ?? "your bank"}.`,
          datetime: shiftTime(tx.datetime, 2880),
        });
      }
    }
  } else if (tx.type === "fee") {
    events.push({
      id: "charged",
      type: "fee",
      title: "Fee charged",
      description: `${money(tx.fee)} — ${tx.description}.`,
      datetime: tx.datetime,
    });
  } else {
    events.push({
      id: "applied",
      type: "payment",
      title: "Adjustment applied",
      description: `${tx.description ?? "Manual adjustment"}: ${money(tx.amount)}.`,
      datetime: tx.datetime,
    });
  }

  return events;
}

export function TransactionTimeline({ tx, symbol }: { tx: FinanceTransaction; symbol: string }) {
  const events = buildEvents(tx, symbol);
  return (
    <ol className="relative space-y-6 border-l border-border pl-6">
      {events.map((event) => {
        const meta = eventMeta[event.type];
        const Icon = meta.icon;
        return (
          <li key={event.id} className="relative">
            <span
              className={cn(
                "absolute -left-[35px] flex h-7 w-7 items-center justify-center rounded-full",
                meta.className
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
            </span>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className="text-sm font-medium text-foreground">{event.title}</p>
              <time className="text-xs text-muted-foreground" dateTime={event.datetime}>
                {dateTimeLabel(event.datetime)}
              </time>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{event.description}</p>
          </li>
        );
      })}
      <li className="relative">
        <span className="absolute -left-[35px] flex h-7 w-7 items-center justify-center rounded-full bg-muted">
          <PlusCircle className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
        </span>
        <p className="text-sm font-medium text-foreground">{transactionTypeLabels[tx.type]} recorded</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          This {transactionTypeLabels[tx.type].toLowerCase()} was recorded in your financial ledger.
        </p>
      </li>
    </ol>
  );
}