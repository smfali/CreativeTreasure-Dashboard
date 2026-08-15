import { TEAM_TODAY } from "./team";

/**
 * Deterministic "today" for the notifications module, aligned with the rest
 * of the app (2026-08-12).
 */
export const NOTIF_TODAY = TEAM_TODAY;

export type NotificationModule =
  | "orders"
  | "products"
  | "revenue"
  | "finance"
  | "marketing"
  | "team"
  | "customers";

export type NotificationPriority = "low" | "normal" | "high";

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  module: NotificationModule;
  /** Label of the related resource (e.g. order number, product name). */
  resource: string;
  /** Route to open when the notification is clicked. */
  resourceHref?: string;
  /** ISO datetime. */
  createdAt: string;
  read: boolean;
  important: boolean;
  priority: NotificationPriority;
}

export const notificationModuleLabels: Record<NotificationModule, string> = {
  orders: "Orders",
  products: "Products",
  revenue: "Revenue",
  finance: "Finance",
  marketing: "Marketing",
  team: "Team",
  customers: "Customers",
};

export const notificationPriorityLabels: Record<NotificationPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
};

// ---------------------------------------------------------------------------
// Seed notifications — every entry references a real entity from the other
// modules so "open related resource" always lands somewhere meaningful.
// ---------------------------------------------------------------------------

export const seedNotifications: AppNotification[] = [
  {
    id: "n-9001",
    title: "Refund processed",
    description: "A refund of $47.00 for order #CT-2463 was processed to the customer.",
    module: "orders",
    resource: "#CT-2463",
    resourceHref: "/orders/o-3044",
    createdAt: "2026-08-12T08:12:00",
    read: false,
    important: true,
    priority: "high",
  },
  {
    id: "n-9002",
    title: "New review on Nova UI Kit",
    description: "Nova UI Kit received a new 5-star review from a customer in the US.",
    module: "products",
    resource: "Nova UI Kit",
    resourceHref: "/products/p-2001",
    createdAt: "2026-08-12T07:48:00",
    read: false,
    important: false,
    priority: "normal",
  },
  {
    id: "n-9003",
    title: "Payout completed",
    description: "Payout PO-2026-018 of $3,842.60 was sent to your bank account.",
    module: "finance",
    resource: "PO-2026-018",
    resourceHref: "/finance/payouts",
    createdAt: "2026-08-12T06:30:00",
    read: false,
    important: true,
    priority: "high",
  },
  {
    id: "n-9004",
    title: "Campaign above target",
    description: "August Drops Campaign conversions are 18% above target this week.",
    module: "marketing",
    resource: "August Drops Campaign",
    resourceHref: "/marketing/campaigns/camp-4008",
    createdAt: "2026-08-12T06:05:00",
    read: false,
    important: false,
    priority: "normal",
  },
  {
    id: "n-9005",
    title: "Team member invited",
    description: "Amara Diallo was invited by Priya Nair to join as an Analyst.",
    module: "team",
    resource: "Amara Diallo",
    resourceHref: "/team/invitations",
    createdAt: "2026-08-12T05:40:00",
    read: false,
    important: false,
    priority: "normal",
  },
  {
    id: "n-9006",
    title: "New customer",
    description: "Taylor Reed placed their first order and joined the audience.",
    module: "customers",
    resource: "Taylor Reed",
    resourceHref: "/audience/c-1005",
    createdAt: "2026-08-11T16:22:00",
    read: true,
    important: false,
    priority: "low",
  },
  {
    id: "n-9007",
    title: "Order completed",
    description: "Order #CT-2459 from Jordan Blake was completed.",
    module: "orders",
    resource: "#CT-2459",
    resourceHref: "/orders/o-3040",
    createdAt: "2026-08-11T14:10:00",
    read: true,
    important: false,
    priority: "normal",
  },
  {
    id: "n-9008",
    title: "Weekly sales report ready",
    description: "Your weekly revenue report for July 28 – August 3 is ready to review.",
    module: "revenue",
    resource: "Weekly report",
    resourceHref: "/revenue",
    createdAt: "2026-08-11T09:30:00",
    read: true,
    important: false,
    priority: "normal",
  },
  {
    id: "n-9009",
    title: "Product updated",
    description: "Aurora Design System was updated to version 3.1.0.",
    module: "products",
    resource: "Aurora Design System",
    resourceHref: "/products/p-2002",
    createdAt: "2026-08-10T15:05:00",
    read: true,
    important: false,
    priority: "low",
  },
  {
    id: "n-9010",
    title: "Campaign scheduled",
    description: "Launch Week Push is scheduled to start on August 14.",
    module: "marketing",
    resource: "Launch Week Push",
    resourceHref: "/marketing/campaigns/camp-4010",
    createdAt: "2026-08-10T10:45:00",
    read: true,
    important: false,
    priority: "normal",
  },
  {
    id: "n-9011",
    title: "Payout payment declined",
    description: "The payment for payout PO-2026-016 was declined. Please update payout details.",
    module: "finance",
    resource: "PO-2026-016",
    resourceHref: "/finance/payouts",
    createdAt: "2026-08-09T11:20:00",
    read: true,
    important: true,
    priority: "high",
  },
  {
    id: "n-9012",
    title: "New member joined",
    description: "Hannah Lindqvist accepted the invitation and is now on the Support team.",
    module: "team",
    resource: "Hannah Lindqvist",
    resourceHref: "/team/members/m-6010",
    createdAt: "2026-08-08T14:00:00",
    read: true,
    important: false,
    priority: "normal",
  },
];

// ---------------------------------------------------------------------------
// Notification preferences
// ---------------------------------------------------------------------------

export interface NotificationPreferenceCategories {
  id: string;
  label: string;
  description: string;
  options: { key: string; label: string; description: string }[];
}

export const notificationPreferenceCategories: NotificationPreferenceCategories[] = [
  {
    id: "orders",
    label: "Orders",
    description: "Purchases, refunds and order issues.",
    options: [
      { key: "newOrder", label: "New order", description: "A customer places a new order." },
      { key: "refund", label: "Refund", description: "A refund is requested or processed." },
      { key: "failedOrder", label: "Failed order", description: "A payment fails or an order is cancelled." },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    description: "Payouts, payment issues and reports.",
    options: [
      { key: "payout", label: "Payout", description: "A payout is scheduled or completed." },
      { key: "paymentIssue", label: "Payment issue", description: "A payment or payout is declined." },
      { key: "financialReport", label: "Financial report", description: "Monthly financial reports are ready." },
    ],
  },
  {
    id: "products",
    label: "Products",
    description: "Publishing and product updates.",
    options: [
      { key: "productPublished", label: "Product published", description: "A product goes live." },
      { key: "productUpdate", label: "Product update", description: "A product is updated or versioned." },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    description: "Campaign performance and status.",
    options: [
      { key: "campaignPerformance", label: "Campaign performance", description: "Campaigns hit or miss their targets." },
      { key: "campaignStatus", label: "Campaign status", description: "Campaigns launch, pause or end." },
    ],
  },
  {
    id: "team",
    label: "Team",
    description: "Membership and role changes.",
    options: [
      { key: "newMember", label: "New member", description: "A member is invited or joins the workspace." },
      { key: "roleChanges", label: "Role changes", description: "Member roles or permissions change." },
    ],
  },
];

export type NotificationPreferences = Record<string, Record<string, boolean>>;

export const defaultNotificationPreferences: NotificationPreferences = {
  orders: { newOrder: true, refund: true, failedOrder: true },
  finance: { payout: true, paymentIssue: true, financialReport: true },
  products: { productPublished: true, productUpdate: true },
  marketing: { campaignPerformance: true, campaignStatus: true },
  team: { newMember: true, roleChanges: true },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Relative label anchored to the deterministic mock "today". */
export function notificationTime(iso: string, today: string = NOTIF_TODAY): string {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return "—";
  const ref = new Date(`${today}T00:00:00`).getTime();
  const days = Math.round((ref - target) / 864e5);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

/** True when every preference in a category is turned off. */
export function categoryIsOff(prefs: NotificationPreferences, categoryId: string): boolean {
  const category = prefs[categoryId];
  if (!category) return false;
  return Object.values(category).every((v) => !v);
}