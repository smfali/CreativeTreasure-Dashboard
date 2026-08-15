import { products, type ProductType } from "./products";
import { customers } from "./customers";
import type { Order } from "./orders";

export type TransactionType = "sale" | "refund" | "payout" | "fee" | "adjustment";
export type TransactionStatus = "completed" | "pending" | "failed" | "refunded";
export type PayoutStatus = "paid" | "pending" | "processing" | "failed";
export type FinanceRange = "today" | "7d" | "30d" | "90d" | "year" | "all";

export const transactionTypeLabels: Record<TransactionType, string> = {
  sale: "Sale",
  refund: "Refund",
  payout: "Payout",
  fee: "Fee",
  adjustment: "Adjustment",
};

export const transactionStatusLabels: Record<TransactionStatus, string> = {
  completed: "Completed",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
};

export const payoutStatusLabels: Record<PayoutStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  processing: "Processing",
  failed: "Failed",
};

export const financeRangeOptions: { value: FinanceRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "year", label: "This year" },
  { value: "all", label: "All time" },
];

export const PAYOUT_DESTINATION = "•••• 4821 · CreativeTreasury LLC";

export interface FeeBreakdownParts {
  platform: number;
  processing: number;
  refund: number;
}

export interface FinanceTransaction {
  id: string;
  orderId?: string;
  orderNumber?: string;
  productId?: string;
  productName?: string;
  productType?: ProductType;
  customerId?: string;
  customerName?: string;
  datetime: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  fee: number;
  net: number;
  paymentMethod?: string;
  description?: string;
  feeBreakdown?: FeeBreakdownParts;
}

export interface Payout {
  id: string;
  datetime: string;
  amount: number;
  destination: string;
  status: PayoutStatus;
  reference?: string;
}

export interface FinanceSummary {
  availableBalance: number;
  pendingBalance: number;
  pendingPayout: number;
  nextPayout: number;
  lastPayout: { date: string; amount: number } | null;
  totalPayouts: number;
  payoutCount: number;
  totalGross: number;
  totalNet: number;
  totalFees: number;
  totalRefunds: number;
  refundCount: number;
}

const PLATFORM_RATE = 0.05;
const PROCESSING_RATE = 0.029;
const PROCESSING_FIXED = 0.3;
const REFUND_FEE_RATE = 0.15;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface SaleFees extends FeeBreakdownParts {
  total: number;
}

export function saleFees(total: number): SaleFees {
  const platform = round2(total * PLATFORM_RATE);
  const processing = round2(total * PROCESSING_RATE + PROCESSING_FIXED);
  return { platform, processing, refund: 0, total: round2(platform + processing) };
}

function timeFor(seed: string): string {
  const rnd = mulberry32(hashString(`${seed}-tx-time`));
  const h = String(8 + Math.floor(rnd() * 14)).padStart(2, "0");
  const m = String(Math.floor(rnd() * 60)).padStart(2, "0");
  return `${h}:${m}`;
}

export function financeToday(orderList: Order[]): string {
  return orderList.reduce((max, o) => (o.date > max ? o.date : max), "");
}

function shiftDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

interface RangeBounds {
  start?: string;
  end?: string;
  prevStart?: string;
  prevEnd?: string;
}

export function rangeBounds(range: FinanceRange, today: string): RangeBounds {
  switch (range) {
    case "today":
      return { start: today, end: today, prevStart: shiftDays(today, -1), prevEnd: shiftDays(today, -1) };
    case "7d":
      return {
        start: shiftDays(today, -6),
        end: today,
        prevStart: shiftDays(today, -13),
        prevEnd: shiftDays(today, -7),
      };
    case "30d":
      return {
        start: shiftDays(today, -29),
        end: today,
        prevStart: shiftDays(today, -59),
        prevEnd: shiftDays(today, -30),
      };
    case "90d":
      return {
        start: shiftDays(today, -89),
        end: today,
        prevStart: shiftDays(today, -179),
        prevEnd: shiftDays(today, -90),
      };
    case "year":
      return { start: `${today.slice(0, 4)}-01-01`, end: today, prevStart: `${Number(today.slice(0, 4)) - 1}-01-01`, prevEnd: `${Number(today.slice(0, 4)) - 1}-12-31` };
    case "all":
    default:
      return {};
  }
}

interface StandaloneSpec {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  fee: number;
  description: string;
  feeBreakdown: FeeBreakdownParts;
}

const STANDALONE: StandaloneSpec[] = [
  {
    id: "tx-adj-001",
    date: "2026-06-18",
    type: "adjustment",
    amount: -12.4,
    fee: 0,
    description: "Currency conversion adjustment",
    feeBreakdown: { platform: 0, processing: 0, refund: 0 },
  },
  {
    id: "tx-fee-001",
    date: "2026-06-30",
    type: "fee",
    amount: 0,
    fee: 12,
    description: "Monthly platform subscription",
    feeBreakdown: { platform: 12, processing: 0, refund: 0 },
  },
  {
    id: "tx-fee-002",
    date: "2026-07-08",
    type: "fee",
    amount: 0,
    fee: 15,
    description: "Dispute resolution fee",
    feeBreakdown: { platform: 0, processing: 0, refund: 0 },
  },
  {
    id: "tx-fee-003",
    date: "2026-07-31",
    type: "fee",
    amount: 0,
    fee: 12,
    description: "Monthly platform subscription",
    feeBreakdown: { platform: 12, processing: 0, refund: 0 },
  },
  {
    id: "tx-adj-002",
    date: "2026-08-05",
    type: "adjustment",
    amount: 9.75,
    fee: 0,
    description: "Correction — fee overcharge",
    feeBreakdown: { platform: 0, processing: 0, refund: 0 },
  },
];

function buildSaleTransactions(orderList: Order[]): FinanceTransaction[] {
  const txs: FinanceTransaction[] = [];
  for (const order of orderList) {
    const first = order.items[0];
    const fees = saleFees(order.total);
    const base = {
      orderId: order.id,
      orderNumber: order.number,
      productId: first?.productId,
      productName: first?.name,
      productType: first?.type,
      customerId: order.customerId,
      customerName: order.customerName,
      paymentMethod: order.paymentMethod,
    };

    const saleStatus: TransactionStatus =
      order.orderStatus === "completed" || order.orderStatus === "processing"
        ? "completed"
        : order.orderStatus === "pending"
          ? "pending"
          : order.orderStatus === "refunded"
            ? "refunded"
            : "failed";

    const failed = saleStatus === "failed";
    txs.push({
      id: `tx-${order.id}`,
      ...base,
      datetime: `${order.date}T${timeFor(order.id)}:00`,
      type: "sale",
      status: saleStatus,
      amount: order.total,
      fee: failed ? 0 : fees.total,
      net: failed ? 0 : round2(order.total - fees.total),
      description: failed
        ? "Payment was not captured — order cancelled."
        : `Payment received via ${order.paymentMethod}.`,
      feeBreakdown: failed
        ? { platform: 0, processing: 0, refund: 0 }
        : { platform: fees.platform, processing: fees.processing, refund: 0 },
    });

    if (order.orderStatus === "refunded") {
      const refundCharge = round2(fees.total * REFUND_FEE_RATE);
      txs.push({
        id: `tx-${order.id}-refund`,
        ...base,
        datetime: `${order.date}T${timeFor(`${order.id}-refund`)}:00`,
        type: "refund",
        status: "completed",
        amount: round2(-order.total),
        fee: round2(-fees.total + refundCharge),
        net: round2(-order.total + fees.total - refundCharge),
        description: "Full refund issued to customer.",
        feeBreakdown: { platform: -fees.platform, processing: -fees.processing, refund: refundCharge },
      });
    }
  }
  return txs;
}

export function buildTransactions(orderList: Order[]): FinanceTransaction[] {
  const txs = buildSaleTransactions(orderList);
  for (const spec of STANDALONE) {
    txs.push({
      id: spec.id,
      datetime: `${spec.date}T00:00:00`,
      type: spec.type,
      status: "completed",
      amount: spec.amount,
      fee: spec.fee,
      net: round2(spec.amount - spec.fee),
      description: spec.description,
      feeBreakdown: spec.feeBreakdown,
    });
  }
  return txs.sort((a, b) => a.datetime.localeCompare(b.datetime));
}

interface PayoutScheduleItem {
  id: string;
  date: string;
  status: PayoutStatus;
}

const PAYOUT_SCHEDULE: PayoutScheduleItem[] = [
  { id: "PO-2026-014", date: "2026-06-15", status: "paid" },
  { id: "PO-2026-015", date: "2026-06-29", status: "paid" },
  { id: "PO-2026-016", date: "2026-07-06", status: "failed" },
  { id: "PO-2026-017", date: "2026-07-13", status: "paid" },
  { id: "PO-2026-018", date: "2026-07-27", status: "paid" },
  { id: "PO-2026-019", date: "2026-08-10", status: "processing" },
  { id: "PO-2026-020", date: "2026-08-24", status: "pending" },
];

export function buildPayouts(txs: FinanceTransaction[]): Payout[] {
  const settled = txs
    .filter((t) => t.type !== "payout" && t.status !== "failed" && t.status !== "pending")
    .sort((a, b) => a.datetime.localeCompare(b.datetime));

  const payouts: Payout[] = [];
  let paidOut = 0;
  for (const item of PAYOUT_SCHEDULE) {
    const settledNet = settled.reduce((s, t) => (t.datetime.slice(0, 10) <= item.date ? s + t.net : s), 0);
    const amount = round2(Math.max(0, settledNet - paidOut));
    payouts.push({
      id: item.id,
      datetime: `${item.date}T00:00:00`,
      amount,
      destination: PAYOUT_DESTINATION,
      status: item.status,
    });
    if (item.status === "paid" || item.status === "processing") {
      paidOut += amount;
    }
  }
  return payouts;
}

export function payoutToTransaction(payout: Payout): FinanceTransaction {
  const status: TransactionStatus =
    payout.status === "paid" ? "completed" : payout.status === "failed" ? "failed" : "pending";
  return {
    id: `tx-${payout.id}`,
    datetime: payout.datetime,
    type: "payout",
    status,
    amount: payout.amount,
    fee: 0,
    net: payout.amount,
    paymentMethod: payout.destination,
    description: `Payout ${payout.id} · ${payout.destination}`,
  };
}

export function getFinanceSummary(txs: FinanceTransaction[], payouts: Payout[]): FinanceSummary {
  const settledNet = txs
    .filter((t) => t.type !== "payout" && (t.status === "completed" || t.status === "refunded"))
    .reduce((s, t) => s + t.net, 0);
  const pendingBalance = txs
    .filter((t) => t.type === "sale" && t.status === "pending")
    .reduce((s, t) => s + t.net, 0);

  const paidPayouts = payouts.filter((p) => p.status === "paid");
  const processingPayout = payouts
    .filter((p) => p.status === "processing")
    .reduce((s, p) => s + p.amount, 0);
  const paidTotal = paidPayouts.reduce((s, p) => s + p.amount, 0);

  const availableBalance = round2(Math.max(0, settledNet - paidTotal - processingPayout));

  const lastPaid = [...paidPayouts].sort((a, b) => b.datetime.localeCompare(a.datetime))[0];

  const totalGross = txs
    .filter((t) => t.type === "sale" && t.status !== "failed")
    .reduce((s, t) => s + t.amount, 0);
  const totalNet = txs
    .filter((t) => t.type !== "payout" && t.status !== "failed")
    .reduce((s, t) => s + t.net, 0);
  const totalFees = txs
    .filter((t) => t.type !== "payout" && t.status !== "failed")
    .reduce((s, t) => s + t.fee, 0);
  const refundTxs = txs.filter((t) => t.type === "refund");
  const totalRefunds = refundTxs.reduce((s, t) => s + Math.abs(t.amount), 0);

  return {
    availableBalance,
    pendingBalance: round2(pendingBalance),
    pendingPayout: round2(processingPayout),
    nextPayout: availableBalance,
    lastPayout: lastPaid ? { date: lastPaid.datetime, amount: lastPaid.amount } : null,
    totalPayouts: round2(paidTotal),
    payoutCount: paidPayouts.length,
    totalGross: round2(totalGross),
    totalNet: round2(totalNet),
    totalFees: round2(totalFees),
    totalRefunds: round2(totalRefunds),
    refundCount: refundTxs.length,
  };
}

export interface FinanceData {
  transactions: FinanceTransaction[];
  payouts: Payout[];
  summary: FinanceSummary;
}

export function buildFinanceData(orderList: Order[]): FinanceData {
  const txs = buildTransactions(orderList);
  const payouts = buildPayouts(txs);
  const transactions = [...txs, ...payouts.map(payoutToTransaction)].sort((a, b) =>
    b.datetime.localeCompare(a.datetime)
  );
  return { transactions, payouts, summary: getFinanceSummary(txs, payouts) };
}

export interface PeriodSummaries {
  gross: number;
  net: number;
  fees: number;
  refunds: number;
  sales: number;
  payouts: number;
}

export function summarizeIn(transactions: FinanceTransaction[], start?: string, end?: string): PeriodSummaries {
  let gross = 0;
  let net = 0;
  let fees = 0;
  let refunds = 0;
  let sales = 0;
  let payouts = 0;
  for (const t of transactions) {
    const d = t.datetime.slice(0, 10);
    if (start && d < start) continue;
    if (end && d > end) continue;
    if (t.type === "sale") {
      if (t.status === "failed") continue;
      gross += t.amount;
      net += t.net;
      fees += t.fee;
      sales += 1;
    } else if (t.type === "refund") {
      refunds += Math.abs(t.amount);
      net += t.net;
      fees += t.fee;
    } else if (t.type === "payout") {
      if (t.status === "completed") payouts += t.amount;
    } else {
      net += t.net;
      fees += t.fee;
    }
  }
  return { gross, net, fees, refunds, sales, payouts };
}

function growth(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export interface PeriodKpis {
  gross: number;
  prevGross: number;
  grossGrowth: number | null;
  net: number;
  prevNet: number;
  netGrowth: number | null;
  fees: number;
  prevFees: number;
  feesGrowth: number | null;
  refunds: number;
  prevRefunds: number;
  refundsGrowth: number | null;
  payouts: number;
  prevPayouts: number;
  payoutsGrowth: number | null;
  sales: number;
  prevSales: number;
  salesGrowth: number | null;
}

export function getPeriodKpis(
  transactions: FinanceTransaction[],
  range: FinanceRange,
  today: string
): PeriodKpis {
  const bounds = rangeBounds(range, today);
  const cur = summarizeIn(transactions, bounds.start, bounds.end);
  const prev = summarizeIn(transactions, bounds.prevStart, bounds.prevEnd);
  return {
    gross: cur.gross,
    prevGross: prev.gross,
    grossGrowth: growth(cur.gross, prev.gross),
    net: cur.net,
    prevNet: prev.net,
    netGrowth: growth(cur.net, prev.net),
    fees: cur.fees,
    prevFees: prev.fees,
    feesGrowth: growth(cur.fees, prev.fees),
    refunds: cur.refunds,
    prevRefunds: prev.refunds,
    refundsGrowth: growth(cur.refunds, prev.refunds),
    payouts: cur.payouts,
    prevPayouts: prev.payouts,
    payoutsGrowth: growth(cur.payouts, prev.payouts),
    sales: cur.sales,
    prevSales: prev.sales,
    salesGrowth: growth(cur.sales, prev.sales),
  };
}

export interface PerformancePoint {
  label: string;
  gross: number;
  net: number;
  fees: number;
}

function shortDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getPerformanceSeries(
  transactions: FinanceTransaction[],
  range: FinanceRange,
  today: string
): PerformancePoint[] {
  const bounds = rangeBounds(range, today);
  const dates = transactions.map((t) => t.datetime.slice(0, 10));
  const earliest = dates.length > 0 ? dates.reduce((a, b) => (a < b ? a : b)) : today;
  const latest = dates.length > 0 ? dates.reduce((a, b) => (a > b ? a : b)) : today;

  const start = bounds.start ? (bounds.start > earliest ? bounds.start : earliest) : earliest;
  const end = bounds.end ?? latest;
  const bucketSize = range === "7d" || range === "30d" ? 1 : 7;

  const points: PerformancePoint[] = [];
  for (let day = start; day <= end; day = shiftDays(day, bucketSize)) {
    const bucketEnd = shiftDays(day, bucketSize - 1);
    let gross = 0;
    let net = 0;
    let fees = 0;
    for (const t of transactions) {
      const d = t.datetime.slice(0, 10);
      if (d < day || d > bucketEnd) continue;
      if (t.type === "payout") continue;
      if (t.type === "sale" && t.status === "failed") continue;
      if (t.type === "sale" || t.type === "refund" || t.type === "fee" || t.type === "adjustment") {
        gross += t.type === "sale" ? t.amount : 0;
        net += t.net;
        fees += t.fee;
      }
    }
    points.push({ label: shortDate(day), gross: round2(gross), net: round2(net), fees: round2(fees) });
  }
  return points;
}

export interface FeeBreakdown {
  platform: number;
  processing: number;
  refund: number;
  other: number;
  total: number;
  gross: number;
  refunds: number;
  netRevenue: number;
  effectiveRate: number;
}

export function getFeeBreakdown(transactions: FinanceTransaction[]): FeeBreakdown {
  let platform = 0;
  let processing = 0;
  let refund = 0;
  let other = 0;
  let gross = 0;
  let refunds = 0;
  for (const t of transactions) {
    if (t.type === "payout" || t.status === "failed") continue;
    if (t.type === "sale") {
      gross += t.amount;
      platform += t.feeBreakdown?.platform ?? 0;
      processing += t.feeBreakdown?.processing ?? 0;
    } else if (t.type === "refund") {
      refunds += Math.abs(t.amount);
      platform += t.feeBreakdown?.platform ?? 0;
      processing += t.feeBreakdown?.processing ?? 0;
      refund += t.feeBreakdown?.refund ?? 0;
    } else if (t.type === "fee") {
      if (t.feeBreakdown && t.feeBreakdown.platform > 0) platform += t.feeBreakdown.platform;
      else other += t.fee;
    }
  }
  const total = round2(platform + processing + refund + other);
  const netRevenue = round2(gross - refunds - total);
  return {
    platform: round2(platform),
    processing: round2(processing),
    refund: round2(refund),
    other: round2(other),
    total,
    gross: round2(gross),
    refunds: round2(refunds),
    netRevenue,
    effectiveRate: gross > 0 ? (total / gross) * 100 : 0,
  };
}

export interface RefundSummary {
  count: number;
  amount: number;
  rate: number;
  gross: number;
  recent: FinanceTransaction[];
}

export function getRefundSummary(transactions: FinanceTransaction[]): RefundSummary {
  const recent = transactions
    .filter((t) => t.type === "refund")
    .sort((a, b) => b.datetime.localeCompare(a.datetime));
  const amount = recent.reduce((s, t) => s + Math.abs(t.amount), 0);
  const gross = transactions
    .filter((t) => t.type === "sale" && t.status !== "failed")
    .reduce((s, t) => s + t.amount, 0);
  return {
    count: recent.length,
    amount: round2(amount),
    rate: gross > 0 ? (amount / gross) * 100 : 0,
    gross: round2(gross),
    recent,
  };
}

export function getRefundableOrders(orderList: Order[]): Order[] {
  return orderList.filter(
    (o) => o.orderStatus === "completed" || o.orderStatus === "processing" || o.orderStatus === "pending"
  );
}

export function findTransaction(
  transactions: FinanceTransaction[],
  id: string
): FinanceTransaction | undefined {
  return transactions.find((t) => t.id === id);
}

export function findProductName(productId?: string): string | undefined {
  if (!productId) return undefined;
  return products.find((p) => p.id === productId)?.name;
}

export function findCustomer(customerId?: string) {
  if (!customerId) return undefined;
  return customers.find((c) => c.id === customerId);
}

const CSV_ESCAPE = /[",\n\r]/;

function csvCell(value: unknown): string {
  const str = value === undefined || value === null ? "" : String(value);
  return CSV_ESCAPE.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function buildTransactionsCsv(transactions: FinanceTransaction[]): string {
  const header = [
    "Transaction ID",
    "Date",
    "Type",
    "Status",
    "Customer",
    "Product",
    "Order",
    "Payment method",
    "Amount",
    "Fees",
    "Net",
  ];
  const rows = transactions.map((t) =>
    [
      t.id,
      t.datetime,
      transactionTypeLabels[t.type],
      transactionStatusLabels[t.status],
      t.customerName ?? "",
      t.productName ?? "",
      t.orderNumber ?? "",
      t.paymentMethod ?? "",
      t.amount,
      t.fee,
      t.net,
    ]
      .map(csvCell)
      .join(",")
  );
  return [header.map(csvCell).join(","), ...rows].join("\n");
}

export function buildFinanceReportCsv(
  transactions: FinanceTransaction[],
  payouts: Payout[],
  summary: FinanceSummary,
  today: string
): string {
  const lines: string[] = [];
  lines.push("CreativeTreasury — Financial report");
  lines.push(`Period,${today}`);
  lines.push(`Generated,${new Date().toISOString().slice(0, 10)}`);
  lines.push("");
  lines.push("Balances");
  lines.push("Metric,Value");
  lines.push(`Available balance,${summary.availableBalance.toFixed(2)}`);
  lines.push(`Pending balance,${summary.pendingBalance.toFixed(2)}`);
  lines.push(`Pending payout,${summary.pendingPayout.toFixed(2)}`);
  lines.push(`Next payout,${summary.nextPayout.toFixed(2)}`);
  lines.push("");
  lines.push("All-time summary");
  lines.push("Metric,Value");
  lines.push(`Total revenue (gross),${summary.totalGross.toFixed(2)}`);
  lines.push(`Net revenue,${summary.totalNet.toFixed(2)}`);
  lines.push(`Total fees,${summary.totalFees.toFixed(2)}`);
  lines.push(`Refunds,${summary.totalRefunds.toFixed(2)}`);
  lines.push(`Refund count,${summary.refundCount}`);
  lines.push(`Payouts paid,${summary.totalPayouts.toFixed(2)}`);
  lines.push("");
  lines.push("Payout history");
  lines.push("Payout ID,Date,Amount,Destination,Status");
  for (const p of payouts) {
    lines.push(`${csvCell(p.id)},${csvCell(p.datetime)},${p.amount.toFixed(2)},${csvCell(p.destination)},${payoutStatusLabels[p.status]}`);
  }
  lines.push("");
  lines.push("Recent transactions");
  lines.push("Transaction ID,Date,Type,Status,Customer,Product,Amount,Fees,Net");
  for (const t of [...transactions].sort((a, b) => b.datetime.localeCompare(a.datetime)).slice(0, 50)) {
    lines.push(
      [
        csvCell(t.id),
        csvCell(t.datetime),
        csvCell(transactionTypeLabels[t.type]),
        csvCell(transactionStatusLabels[t.status]),
        csvCell(t.customerName ?? ""),
        csvCell(t.productName ?? ""),
        t.amount.toFixed(2),
        t.fee.toFixed(2),
        t.net.toFixed(2),
      ].join(",")
    );
  }
  return lines.join("\n");
}