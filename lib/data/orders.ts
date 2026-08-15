import { products, type Product, type ProductType } from "./products";
import { customers } from "./customers";

export type OrderStatus = "completed" | "pending" | "processing" | "refunded" | "cancelled";
export type PaymentStatus = "paid" | "pending" | "refunded";

export const orderStatusLabels: Record<OrderStatus, string> = {
  completed: "Completed",
  pending: "Pending",
  processing: "Processing",
  refunded: "Refunded",
  cancelled: "Cancelled",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  refunded: "Refunded",
};

export interface OrderLineItem {
  productId: string;
  name: string;
  type: ProductType;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerLocation: string;
  date: string;
  items: OrderLineItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
}

export interface TimelineEvent {
  id: string;
  type: "placed" | "payment" | "delivered" | "refund" | "cancel" | "pending";
  title: string;
  description: string;
  date: string;
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

function pickWeighted<T>(items: T[], weight: (item: T) => number, rnd: () => number): T {
  const total = items.reduce((s, it) => s + weight(it), 0);
  let target = rnd() * total;
  for (const item of items) {
    target -= weight(item);
    if (target <= 0) return item;
  }
  return items[items.length - 1];
}

const published = products.filter((p) => p.status === "published" && !p.archived);
const activeCustomers = customers.filter((c) => c.orders > 0);

const paymentMethods = ["Card", "PayPal", "Apple Pay", "Google Pay"] as const;

const ORDER_COUNT = 52;
const START_DATE = new Date(Date.UTC(2026, 5, 1)); // 2026-06-01
const SPAN_DAYS = 73; // through 2026-08-12

function isoFromOffset(offset: number): string {
  const d = new Date(START_DATE.getTime() + offset * 86400000);
  return d.toISOString().slice(0, 10);
}

function buildOrders(): Order[] {
  const rnd = mulberry32(hashString("orders-v1"));
  const orders: Order[] = [];

  for (let i = 0; i < ORDER_COUNT; i++) {
    const customer = pickWeighted(activeCustomers, (c) => Math.max(1, c.orders), rnd);

    const itemCount = rnd() < 0.78 ? 1 : 2;
    const picked: Product[] = [];
    const used = new Set<string>();
    for (let k = 0; k < itemCount; k++) {
      let product = pickWeighted(published, (p) => Math.max(1, p.sales), rnd);
      let guard = 0;
      while (used.has(product.id) && guard < 8) {
        product = pickWeighted(published, (p) => Math.max(1, p.sales), rnd);
        guard++;
      }
      used.add(product.id);
      picked.push(product);
    }

    const items: OrderLineItem[] = picked.map((p) => ({
      productId: p.id,
      name: p.name,
      type: p.type,
      unitPrice: p.price,
      quantity: 1 + Math.floor(rnd() * 2),
    }));

    const subtotal = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
    const discount = rnd() < 0.14 ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal - discount;

    const roll = rnd();
    const orderStatus: OrderStatus =
      roll < 0.52
        ? "completed"
        : roll < 0.74
          ? "processing"
          : roll < 0.86
            ? "pending"
            : roll < 0.94
              ? "refunded"
              : "cancelled";

    const paymentStatus: PaymentStatus =
      orderStatus === "refunded"
        ? "refunded"
        : orderStatus === "cancelled"
          ? "pending"
          : orderStatus === "pending"
            ? "pending"
            : "paid";

    orders.push({
      id: `o-${3001 + i}`,
      number: `#CT-${2420 + i}`,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerLocation: customer.location,
      date: isoFromOffset(Math.floor(rnd() * SPAN_DAYS)),
      items,
      subtotal,
      discount,
      tax: 0,
      total,
      paymentMethod: paymentMethods[Math.floor(rnd() * paymentMethods.length)],
      paymentStatus,
      orderStatus,
    });
  }

  return orders.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

export const orders: Order[] = buildOrders();

export function getOrderCounts(list: Order[]) {
  const byStatus: Record<OrderStatus, number> = {
    completed: 0,
    pending: 0,
    processing: 0,
    refunded: 0,
    cancelled: 0,
  };
  let revenue = 0;
  for (const order of list) {
    byStatus[order.orderStatus] += 1;
    if (order.orderStatus === "completed") revenue += order.total;
  }
  return {
    total: list.length,
    ...byStatus,
    revenue,
    aov: byStatus.completed > 0 ? revenue / byStatus.completed : 0,
  };
}

export interface OrderAnalytics {
  byMonth: { label: string; orders: number; completed: number; revenue: number }[];
  revenueByStatus: { status: OrderStatus; revenue: number; count: number }[];
  topProducts: { productId: string; name: string; type: ProductType; units: number; revenue: number }[];
}

export function getOrderAnalytics(list: Order[]): OrderAnalytics {
  const months = ["Jun", "Jul", "Aug"];
  const byMonth = months.map((label) => ({ label, orders: 0, completed: 0, revenue: 0 }));
  for (const order of list) {
    const month = Number(order.date.slice(5, 7));
    const bucket = month === 6 ? 0 : month === 7 ? 1 : 2;
    if (!byMonth[bucket]) continue;
    byMonth[bucket].orders += 1;
    if (order.orderStatus === "completed") {
      byMonth[bucket].completed += 1;
      byMonth[bucket].revenue += order.total;
    }
  }

  const revenueByStatusMap = new Map<OrderStatus, { revenue: number; count: number }>();
  for (const s of Object.keys(orderStatusLabels) as OrderStatus[]) {
    revenueByStatusMap.set(s, { revenue: 0, count: 0 });
  }
  for (const order of list) {
    const entry = revenueByStatusMap.get(order.orderStatus)!;
    entry.revenue += order.total;
    entry.count += 1;
  }
  const revenueByStatus = (Object.keys(orderStatusLabels) as OrderStatus[]).map((status) => ({
    status,
    revenue: revenueByStatusMap.get(status)!.revenue,
    count: revenueByStatusMap.get(status)!.count,
  }));

  const productMap = new Map<string, { name: string; type: ProductType; units: number; revenue: number }>();
  for (const order of list) {
    for (const item of order.items) {
      const entry = productMap.get(item.productId) ?? {
        name: item.name,
        type: item.type,
        units: 0,
        revenue: 0,
      };
      entry.units += item.quantity;
      entry.revenue += item.unitPrice * item.quantity;
      productMap.set(item.productId, entry);
    }
  }
  const topProducts = Array.from(productMap.entries())
    .map(([productId, value]) => ({ productId, ...value }))
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  return { byMonth, revenueByStatus, topProducts };
}

export function getOrderTimeline(order: Order): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: "placed",
      type: "placed",
      title: "Order placed",
      description: `Order ${order.number} was placed.`,
      date: order.date,
    },
  ];

  if (order.orderStatus === "pending") {
    events.push({
      id: "awaiting",
      type: "pending",
      title: "Awaiting payment",
      description: `Payment of ${order.paymentMethod} is pending confirmation.`,
      date: order.date,
    });
  }

  if (order.paymentStatus === "paid" && order.orderStatus !== "cancelled") {
    events.push({
      id: "payment",
      type: "payment",
      title: "Payment received",
      description: `Payment received via ${order.paymentMethod}.`,
      date: order.date,
    });
  }

  if (order.orderStatus === "completed") {
    events.push({
      id: "delivered",
      type: "delivered",
      title: "Product delivered",
      description: "Download links and licenses were delivered to the customer.",
      date: order.date,
    });
  }

  if (order.orderStatus === "refunded") {
    events.push({
      id: "refund",
      type: "refund",
      title: "Refund issued",
      description: `Refund of the full order total was issued.`,
      date: order.date,
    });
  }

  if (order.orderStatus === "cancelled") {
    events.push({
      id: "cancel",
      type: "cancel",
      title: "Order cancelled",
      description: "The order was cancelled and no payment was captured.",
      date: order.date,
    });
  }

  return events;
}