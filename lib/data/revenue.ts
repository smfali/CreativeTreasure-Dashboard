import { products, type Product } from "./products";
import { customers } from "./customers";

export type RevenueRange = "7d" | "30d" | "90d" | "12m";

export const rangeOptions: { value: RevenueRange; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "12m", label: "12 months" },
];

export interface RangePoint {
  label: string;
  revenue: number;
  previous: number;
  sales: number;
  previousSales: number;
}

export interface RangeKpis {
  totalRevenue: number;
  prevRevenue: number;
  revenueGrowth: number;
  netRevenue: number;
  prevNetRevenue: number;
  netGrowth: number;
  totalSales: number;
  prevSales: number;
  salesGrowth: number;
  avgOrderValue: number;
  prevAvgOrderValue: number;
  aovGrowth: number;
  customersNew: number;
  customersPrev: number;
  customerGrowth: number;
  buyers: number;
  avgCustomerValue: number;
}

const NET_RATE = 0.915;

interface MonthSpec {
  key: string;
  label: string;
  revenue: number;
  sales: number;
  prevRevenue: number;
}

// Mar–Aug revenue/sales match lib/data/products.ts revenueOverTime so the two modules agree.
const monthSpecs: MonthSpec[] = [
  { key: "2025-09", label: "Sep", revenue: 34200, sales: 1144, prevRevenue: 29600 },
  { key: "2025-10", label: "Oct", revenue: 35900, sales: 1201, prevRevenue: 31100 },
  { key: "2025-11", label: "Nov", revenue: 37600, sales: 1258, prevRevenue: 32300 },
  { key: "2025-12", label: "Dec", revenue: 39100, sales: 1308, prevRevenue: 33700 },
  { key: "2026-01", label: "Jan", revenue: 40500, sales: 1355, prevRevenue: 34900 },
  { key: "2026-02", label: "Feb", revenue: 39800, sales: 1331, prevRevenue: 34200 },
  { key: "2026-03", label: "Mar", revenue: 42100, sales: 1180, prevRevenue: 36300 },
  { key: "2026-04", label: "Apr", revenue: 45800, sales: 1290, prevRevenue: 39100 },
  { key: "2026-05", label: "May", revenue: 47200, sales: 1340, prevRevenue: 40200 },
  { key: "2026-06", label: "Jun", revenue: 53100, sales: 1480, prevRevenue: 44800 },
  { key: "2026-07", label: "Jul", revenue: 57600, sales: 1620, prevRevenue: 48400 },
  { key: "2026-08", label: "Aug", revenue: 62400, sales: 1750, prevRevenue: 52400 },
];

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

interface DailyPoint {
  date: string;
  revenue: number;
  sales: number;
}

const daysInMonth = (key: string) =>
  new Date(`${key}-01T00:00:00Z`).toISOString().slice(0, 4) === key.slice(0, 4)
    ? new Date(Date.UTC(Number(key.slice(0, 4)), Number(key.slice(5, 7)), 0)).getUTCDate()
    : 30;

function allocate(total: number, weights: number[]): number[] {
  const sum = weights.reduce((s, w) => s + w, 0);
  const exact = weights.map((w) => (total * w) / sum);
  const floors = exact.map((v) => Math.floor(v));
  let remainder = total - floors.reduce((s, v) => s + v, 0);
  const order = exact
    .map((v, i) => ({ i, frac: v - floors[i] }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < remainder; k++) {
    floors[order[k % order.length].i] += 1;
  }
  return floors;
}

function buildDailySeries(): DailyPoint[] {
  const series: DailyPoint[] = [];
  for (const spec of monthSpecs) {
    const rnd = mulberry32(hashString(`${spec.key}-daily`));
    const total = daysInMonth(spec.key);
    const weights: number[] = [];
    for (let i = 0; i < total; i++) {
      weights.push(0.55 + rnd() * 0.9);
    }
    const revenueByDay = allocate(spec.revenue, weights);
    const salesByDay = allocate(spec.sales, weights);
    for (let i = 0; i < total; i++) {
      const dd = String(i + 1).padStart(2, "0");
      series.push({ date: `${spec.key}-${dd}`, revenue: revenueByDay[i], sales: salesByDay[i] });
    }
  }
  return series;
}

const dailySeries = buildDailySeries();

function shortDate(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function weekdayLabel(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

interface Bucket {
  label: string;
  revenue: number;
  sales: number;
  previous: number;
  previousSales: number;
}

function bucketize(current: DailyPoint[], previous: DailyPoint[], size: number, label: (d: DailyPoint) => string): Bucket[] {
  const result: Bucket[] = [];
  for (let i = 0; i < current.length; i += size) {
    const cur = current.slice(i, i + size);
    const prev = previous.slice(i, i + size);
    result.push({
      label: label(cur[0]),
      revenue: cur.reduce((s, p) => s + p.revenue, 0),
      sales: cur.reduce((s, p) => s + p.sales, 0),
      previous: prev.reduce((s, p) => s + p.revenue, 0),
      previousSales: prev.reduce((s, p) => s + p.sales, 0),
    });
  }
  return result;
}

export function getRangeSeries(range: RevenueRange): RangePoint[] {
  if (range === "12m") {
    return monthSpecs.map((m) => ({
      label: m.label,
      revenue: m.revenue,
      previous: m.prevRevenue,
      sales: m.sales,
      previousSales: Math.round(m.prevRevenue / 29.9),
    }));
  }

  const dayCounts = monthSpecs.map((m) => daysInMonth(m.key));
  let n: number;
  if (range === "7d") {
    n = 7;
  } else if (range === "30d") {
    n = dayCounts[dayCounts.length - 1];
  } else {
    n = dayCounts.slice(-3).reduce((s, d) => s + d, 0);
  }

  const current = dailySeries.slice(-n);
  const previous = dailySeries.slice(-2 * n, -n);

  if (range === "7d") {
    return current.map((d, i) => ({
      label: weekdayLabel(d.date),
      revenue: d.revenue,
      previous: previous[i]?.revenue ?? 0,
      sales: d.sales,
      previousSales: previous[i]?.sales ?? 0,
    }));
  }

  if (range === "90d") {
    return bucketize(current, previous, 7, (d) => shortDate(d.date)).map((b) => ({
      label: b.label,
      revenue: b.revenue,
      previous: b.previous,
      sales: b.sales,
      previousSales: b.previousSales,
    }));
  }

  return current.map((d, i) => ({
    label: shortDate(d.date),
    revenue: d.revenue,
    previous: previous[i]?.revenue ?? 0,
    sales: d.sales,
    previousSales: previous[i]?.sales ?? 0,
  }));
}

const customersNewByRange: Record<RevenueRange, number> = { "7d": 33, "30d": 146, "90d": 457, "12m": 1461 };
const customersPrevByRange: Record<RevenueRange, number> = { "7d": 39, "30d": 168, "90d": 329, "12m": 1198 };

function pct(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function getRangeKpis(range: RevenueRange): RangeKpis {
  const series = getRangeSeries(range);
  const totalRevenue = series.reduce((s, p) => s + p.revenue, 0);
  const prevRevenue = series.reduce((s, p) => s + p.previous, 0);
  const totalSales = series.reduce((s, p) => s + p.sales, 0);
  const prevSales = series.reduce((s, p) => s + p.previousSales, 0);

  const netRevenue = Math.round(totalRevenue * NET_RATE);
  const prevNetRevenue = Math.round(prevRevenue * NET_RATE);

  const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
  const prevAvgOrderValue = prevSales > 0 ? prevRevenue / prevSales : 0;

  const buyers = Math.round(totalSales / 2.2);

  const customersNew = customersNewByRange[range];
  const customersPrev = customersPrevByRange[range];

  return {
    totalRevenue,
    prevRevenue,
    revenueGrowth: pct(totalRevenue, prevRevenue),
    netRevenue,
    prevNetRevenue,
    netGrowth: pct(netRevenue, prevNetRevenue),
    totalSales,
    prevSales,
    salesGrowth: pct(totalSales, prevSales),
    avgOrderValue,
    prevAvgOrderValue,
    aovGrowth: pct(avgOrderValue, prevAvgOrderValue),
    customersNew,
    customersPrev,
    customerGrowth: pct(customersNew, customersPrev),
    buyers,
    avgCustomerValue: buyers > 0 ? totalRevenue / buyers : 0,
  };
}

export interface ProductBreakdownRow {
  id: string;
  name: string;
  category: string;
  type: Product["type"];
  sales: number;
  revenue: number;
  pct: number;
}

export const publishedProducts: Product[] = products.filter((p) => p.status === "published");

export function getRevenueByProduct(): ProductBreakdownRow[] {
  const total = publishedProducts.reduce((s, p) => s + p.revenue, 0);
  return publishedProducts
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      type: p.type,
      sales: p.sales,
      revenue: p.revenue,
      pct: total > 0 ? (p.revenue / total) * 100 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export interface CategoryBreakdownRow {
  name: string;
  revenue: number;
  sales: number;
  pct: number;
  trend: number;
}

export function getRevenueByCategory(): CategoryBreakdownRow[] {
  const total = publishedProducts.reduce((s, p) => s + p.revenue, 0);
  const byName = new Map<string, { revenue: number; sales: number }>();
  for (const p of publishedProducts) {
    const current = byName.get(p.category) ?? { revenue: 0, sales: 0 };
    current.revenue += p.revenue;
    current.sales += p.sales;
    byName.set(p.category, current);
  }
  return Array.from(byName.entries())
    .map(([name, v]) => {
      const rnd = mulberry32(hashString(`${name}-cat-trend`));
      return {
        name,
        revenue: v.revenue,
        sales: v.sales,
        pct: total > 0 ? (v.revenue / total) * 100 : 0,
        trend: Math.round((rnd() * 30 - 6) * 10) / 10,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

export interface RegionBreakdownRow {
  name: string;
  revenue: number;
  share: number;
  change: number;
}

export const regionBreakdown: RegionBreakdownRow[] = [
  { name: "United States", revenue: 431803, share: 0.58, change: 4.2 },
  { name: "Canada", revenue: 67004, share: 0.09, change: 8.1 },
  { name: "United Kingdom", revenue: 59559, share: 0.08, change: -1.4 },
  { name: "Germany", revenue: 37224, share: 0.05, change: 6.0 },
  { name: "Australia", revenue: 29780, share: 0.04, change: 3.5 },
  { name: "France", revenue: 22335, share: 0.03, change: 2.2 },
  { name: "Rest of world", revenue: 96783, share: 0.13, change: 9.0 },
];

export interface TopProductRow {
  id: string;
  name: string;
  category: string;
  type: Product["type"];
  sales: number;
  revenue: number;
  growth: number;
}

export function getTopProducts(count = 5): TopProductRow[] {
  return [...publishedProducts]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, count)
    .map((p) => {
      const rnd = mulberry32(hashString(`${p.id}-growth`));
      return {
        id: p.id,
        name: p.name,
        category: p.category,
        type: p.type,
        sales: p.sales,
        revenue: p.revenue,
        growth: Math.round((rnd() * 40 - 5) * 10) / 10,
      };
    });
}

export interface TopCustomerRow {
  id: string;
  name: string;
  location: string;
  orders: number;
  revenue: number;
  growth: number;
}

export function getTopCustomers(count = 5): TopCustomerRow[] {
  return [...customers]
    .filter((c) => c.totalSpent > 0)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, count)
    .map((c) => {
      const rnd = mulberry32(hashString(`${c.id}-revenue-growth`));
      return {
        id: c.id,
        name: c.name,
        location: c.location,
        orders: c.orders,
        revenue: c.totalSpent,
        growth: Math.round((rnd() * 34 - 4) * 10) / 10,
      };
    });
}

export interface CustomerRevenueSummary {
  newRevenue: number;
  returningRevenue: number;
  newCustomers: number;
  returningCustomers: number;
  avgCustomerValue: number;
  buyers: number;
}

export function getCustomerRevenueSummary(range: RevenueRange): CustomerRevenueSummary {
  const k = getRangeKpis(range);
  const newRevenue = Math.round(k.totalRevenue * 0.26);
  const returningRevenue = k.totalRevenue - newRevenue;
  const newCustomers = k.customersNew;
  const returningCustomers = Math.max(0, k.buyers - k.customersNew);
  return {
    newRevenue,
    returningRevenue,
    newCustomers,
    returningCustomers,
    avgCustomerValue: k.avgCustomerValue,
    buyers: k.buyers,
  };
}

export function buildReportCsv(range: RevenueRange): string {
  const k = getRangeKpis(range);
  const rangeLabel = rangeOptions.find((r) => r.value === range)?.label ?? range;
  const lines: string[] = [];
  lines.push("CreativeTreasury — Revenue report");
  lines.push(`Period,${rangeLabel}`);
  lines.push(`Generated,${new Date().toISOString().slice(0, 10)}`);
  lines.push("");
  lines.push("Key metrics");
  lines.push("Metric,Value,Previous period,Change %");
  lines.push(
    `Total revenue,${k.totalRevenue.toFixed(2)},${k.prevRevenue.toFixed(2)},${k.revenueGrowth.toFixed(1)}`
  );
  lines.push(
    `Net revenue,${k.netRevenue.toFixed(2)},${k.prevNetRevenue.toFixed(2)},${k.netGrowth.toFixed(1)}`
  );
  lines.push(`Orders,${k.totalSales},${k.prevSales},${k.salesGrowth.toFixed(1)}`);
  lines.push(
    `Average order value,${k.avgOrderValue.toFixed(2)},${k.prevAvgOrderValue.toFixed(2)},${k.aovGrowth.toFixed(1)}`
  );
  lines.push(`New customers,${k.customersNew},${k.customersPrev},${k.customerGrowth.toFixed(1)}`);
  lines.push("");
  lines.push("Trend");
  lines.push("Period,Revenue,Previous,Sales");
  for (const p of getRangeSeries(range)) {
    lines.push(`${p.label},${p.revenue},${p.previous},${p.sales}`);
  }
  lines.push("");
  lines.push("Top products");
  lines.push("Product,Category,Sales,Revenue,Growth %");
  for (const p of getTopProducts(8)) {
    lines.push(`${p.name},${p.category},${p.sales},${p.revenue},${p.growth}`);
  }
  lines.push("");
  lines.push("Top customers");
  lines.push("Customer,Location,Orders,Revenue,Growth %");
  for (const c of getTopCustomers(8)) {
    lines.push(`${c.name},${c.location},${c.orders},${c.revenue},${c.growth}`);
  }
  return lines.join("\n");
}
