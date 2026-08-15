import { NOTIF_TODAY, notificationModuleLabels, type NotificationModule } from "./notifications";

export type SystemActivityModule = NotificationModule;

export type SystemActivityResult = "success" | "warning" | "error" | "neutral";

export type SystemActivityType =
  | "sale"
  | "refund"
  | "publish"
  | "update"
  | "campaign"
  | "payout"
  | "member"
  | "role"
  | "customer"
  | "report";

export interface SystemActivity {
  id: string;
  /** Team member who performed the action. */
  memberId: string;
  module: SystemActivityModule;
  type: SystemActivityType;
  action: string;
  resource: string;
  resourceHref?: string;
  /** ISO datetime. */
  date: string;
  result: SystemActivityResult;
}

export const systemActivityTypeLabels: Record<SystemActivityType, string> = {
  sale: "Sale",
  refund: "Refund",
  publish: "Publish",
  update: "Update",
  campaign: "Campaign",
  payout: "Payout",
  member: "Member",
  role: "Role",
  customer: "Customer",
  report: "Report",
};

// ---------------------------------------------------------------------------
// Deterministic helpers (same seeded generator used across the app).
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Seed activity — a system-wide view across modules, referencing real entities.
// ---------------------------------------------------------------------------

const ACTIVITY_SEED: SystemActivity[] = [
  { id: "sa-01", memberId: "m-6002", module: "products", type: "publish", action: "Published product", resource: "Nova UI Kit v2.4.0", resourceHref: "/products/p-2001", date: "2026-08-12T08:10:00", result: "success" },
  { id: "sa-02", memberId: "m-6004", module: "marketing", type: "campaign", action: "Activated campaign", resource: "August Drops Campaign", resourceHref: "/marketing/campaigns/camp-4008", date: "2026-08-12T07:45:00", result: "success" },
  { id: "sa-03", memberId: "m-6010", module: "orders", type: "refund", action: "Processed refund", resource: "#CT-2463", resourceHref: "/orders/o-3044", date: "2026-08-12T07:20:00", result: "success" },
  { id: "sa-04", memberId: "m-6001", module: "team", type: "member", action: "Invited team member", resource: "Amara Diallo", resourceHref: "/team/invitations", date: "2026-08-12T06:55:00", result: "success" },
  { id: "sa-05", memberId: "m-6005", module: "orders", type: "sale", action: "Completed order", resource: "#CT-2471", resourceHref: "/orders/o-3052", date: "2026-08-12T06:30:00", result: "success" },
  { id: "sa-06", memberId: "m-6008", module: "finance", type: "payout", action: "Payout completed", resource: "PO-2026-018", resourceHref: "/finance/payouts", date: "2026-08-12T06:00:00", result: "success" },
  { id: "sa-07", memberId: "m-6003", module: "marketing", type: "campaign", action: "Paused campaign", resource: "Spring Icon Pack Drop", resourceHref: "/marketing/campaigns/camp-4004", date: "2026-08-11T16:22:00", result: "warning" },
  { id: "sa-08", memberId: "m-6006", module: "products", type: "update", action: "Updated product", resource: "Aurora Design System v3.1.0", resourceHref: "/products/p-2002", date: "2026-08-11T15:10:00", result: "success" },
  { id: "sa-09", memberId: "m-6007", module: "finance", type: "report", action: "Generated report", resource: "July finance summary", resourceHref: "/finance", date: "2026-08-11T14:05:00", result: "neutral" },
  { id: "sa-10", memberId: "m-6009", module: "revenue", type: "report", action: "Published weekly report", resource: "Weekly revenue report", resourceHref: "/revenue", date: "2026-08-11T09:30:00", result: "success" },
  { id: "sa-11", memberId: "m-6011", module: "customers", type: "customer", action: "Updated customer", resource: "Emma Wilson", resourceHref: "/audience/c-1008", date: "2026-08-10T18:40:00", result: "success" },
  { id: "sa-12", memberId: "m-6001", module: "team", type: "role", action: "Changed member role", resource: "Tessa Okafor → Editor", resourceHref: "/team/members/m-6012", date: "2026-08-10T16:05:00", result: "success" },
  { id: "sa-13", memberId: "m-6002", module: "finance", type: "payout", action: "Payout payment declined", resource: "PO-2026-016", resourceHref: "/finance/payouts", date: "2026-08-09T11:15:00", result: "error" },
  { id: "sa-14", memberId: "m-6004", module: "marketing", type: "campaign", action: "Campaign under target", resource: "Member Appreciation", resourceHref: "/marketing/campaigns/camp-4006", date: "2026-08-09T10:20:00", result: "warning" },
  { id: "sa-15", memberId: "m-6006", module: "products", type: "publish", action: "Published product", resource: "Line Icons Pro", resourceHref: "/products/p-2008", date: "2026-08-08T14:50:00", result: "success" },
  { id: "sa-16", memberId: "m-6008", module: "orders", type: "sale", action: "Completed order", resource: "#CT-2431", resourceHref: "/orders/o-3012", date: "2026-08-08T09:12:00", result: "success" },
  { id: "sa-17", memberId: "m-6005", module: "customers", type: "customer", action: "Marked customer VIP", resource: "Sarah Kim", resourceHref: "/audience/c-1001", date: "2026-08-07T17:35:00", result: "success" },
  { id: "sa-18", memberId: "m-6001", module: "team", type: "role", action: "Updated role permissions", resource: "Manager role", resourceHref: "/team/roles/role-manager", date: "2026-08-07T15:00:00", result: "success" },
];

const GENERATED_DATES = [
  "2026-08-07T11:20:00",
  "2026-08-06T16:08:00",
  "2026-08-05T09:41:00",
  "2026-08-04T14:57:00",
  "2026-08-03T11:26:00",
  "2026-08-02T10:15:00",
  "2026-08-01T13:40:00",
  "2026-07-31T09:05:00",
];

const GENERATED_POOL: Array<Pick<SystemActivity, "module" | "type" | "action" | "resource" | "resourceHref" | "result">> = [
  { module: "orders", type: "sale", action: "Completed order", resource: "#CT-2428", resourceHref: "/orders/o-3009", result: "success" },
  { module: "orders", type: "sale", action: "Completed order", resource: "#CT-2436", resourceHref: "/orders/o-3017", result: "success" },
  { module: "products", type: "update", action: "Updated product", resource: "Vertex Dashboard UI v1.8.0", resourceHref: "/products/p-2003", result: "success" },
  { module: "products", type: "publish", action: "Published product", resource: "SaaS Landing Template", resourceHref: "/products/p-2004", result: "success" },
  { module: "marketing", type: "campaign", action: "Activated campaign", resource: "Font Fridays", resourceHref: "/marketing/campaigns/camp-4009", result: "success" },
  { module: "finance", type: "payout", action: "Payout completed", resource: "PO-2026-017", resourceHref: "/finance/payouts", result: "success" },
  { module: "customers", type: "customer", action: "Added customer note", resource: "c-1012", resourceHref: "/audience/c-1012", result: "neutral" },
  { module: "team", type: "member", action: "Invited team member", resource: "Grace Liu", resourceHref: "/team/invitations", result: "success" },
  { module: "revenue", type: "report", action: "Reviewed revenue", resource: "Revenue report", resourceHref: "/revenue", result: "neutral" },
];

export function getSystemActivity(): SystemActivity[] {
  const rnd = mulberry32(hashString("system-activity-v1"));
  const generated: SystemActivity[] = [];
  const memberPool = ["m-6002", "m-6003", "m-6004", "m-6006", "m-6008", "m-6011"];
  for (let i = 0; i < 8; i++) {
    const spec = GENERATED_POOL[Math.floor(rnd() * GENERATED_POOL.length)];
    generated.push({
      id: `sa-gen-${i + 1}`,
      memberId: memberPool[Math.floor(rnd() * memberPool.length)],
      ...spec,
      date: GENERATED_DATES[Math.floor(rnd() * GENERATED_DATES.length)],
    });
  }
  return [...ACTIVITY_SEED, ...generated].sort((a, b) => b.date.localeCompare(a.date));
}

// ---------------------------------------------------------------------------
// Filter helpers
// ---------------------------------------------------------------------------

export type ActivityDateRange = "all" | "today" | "7d" | "30d";

export function activityWithin(iso: string, range: ActivityDateRange, today: string = NOTIF_TODAY): boolean {
  if (range === "all") return true;
  const day = iso.slice(0, 10);
  if (range === "today") return day === today;
  const target = new Date(`${day}T00:00:00`).getTime();
  const ref = new Date(`${today}T00:00:00`).getTime();
  const days = Math.max(0, (ref - target) / 864e5);
  if (range === "7d") return days <= 7;
  return days <= 30;
}

export function moduleLabel(module: SystemActivityModule): string {
  return notificationModuleLabels[module];
}