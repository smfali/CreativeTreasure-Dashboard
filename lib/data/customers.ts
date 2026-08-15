export type CustomerStatus = "active" | "new" | "vip" | "inactive";

export interface Customer {
  id: string;
  name: string;
  email: string;
  location: string;
  phone?: string;
  orders: number;
  totalSpent: number;
  lastActivity: string;
  status: CustomerStatus;
  joinedAt: string;
  tags?: string[];
  notes?: string;
  archived?: boolean;
}

export interface CustomerOrder {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: "Paid" | "Processing" | "Pending" | "Refunded";
}

export interface ActivityEvent {
  id: string;
  type: "purchase" | "account" | "support" | "email";
  title: string;
  description?: string;
  date: string;
}

export const statusLabels: Record<CustomerStatus, string> = {
  active: "Active",
  new: "New",
  vip: "VIP",
  inactive: "Inactive",
};

export const customers: Customer[] = [
  {
    id: "c-1001",
    name: "Sarah Kim",
    email: "sarah.kim@example.com",
    location: "Los Angeles, US",
    phone: "+1 (310) 555-0142",
    orders: 24,
    totalSpent: 12480.5,
    lastActivity: "2026-08-12",
    status: "vip",
    joinedAt: "2024-03-18",
    tags: ["Newsletter", "Merch"],
    notes: "Prefers weekend shipping. Ask about the Limited collection restock.",
  },
  {
    id: "c-1002",
    name: "Marcus Lee",
    email: "marcus.lee@example.com",
    location: "New York, US",
    phone: "+1 (212) 555-0198",
    orders: 12,
    totalSpent: 4530,
    lastActivity: "2026-08-11",
    status: "active",
    joinedAt: "2024-07-02",
    tags: ["YouTube"],
  },
  {
    id: "c-1003",
    name: "Aria Chen",
    email: "aria.chen@example.com",
    location: "Toronto, CA",
    orders: 8,
    totalSpent: 2140.75,
    lastActivity: "2026-08-10",
    status: "active",
    joinedAt: "2025-01-21",
  },
  {
    id: "c-1004",
    name: "Jordan Blake",
    email: "jordan.blake@example.com",
    location: "London, UK",
    phone: "+44 20 7946 0813",
    orders: 31,
    totalSpent: 18920,
    lastActivity: "2026-08-12",
    status: "vip",
    joinedAt: "2023-11-05",
    tags: ["Annual", "Patron"],
    notes: "Contact first before shipping international orders.",
  },
  {
    id: "c-1005",
    name: "Taylor Reed",
    email: "taylor.reed@example.com",
    location: "Austin, US",
    orders: 3,
    totalSpent: 540,
    lastActivity: "2026-08-08",
    status: "new",
    joinedAt: "2026-07-30",
  },
  {
    id: "c-1006",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    location: "Mumbai, IN",
    orders: 6,
    totalSpent: 1320,
    lastActivity: "2026-07-29",
    status: "active",
    joinedAt: "2024-12-14",
  },
  {
    id: "c-1007",
    name: "Diego Torres",
    email: "diego.torres@example.com",
    location: "Mexico City, MX",
    orders: 9,
    totalSpent: 2680.25,
    lastActivity: "2026-08-05",
    status: "active",
    joinedAt: "2025-02-27",
  },
  {
    id: "c-1008",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    location: "Sydney, AU",
    orders: 15,
    totalSpent: 6340,
    lastActivity: "2026-08-09",
    status: "vip",
    joinedAt: "2024-05-11",
  },
  {
    id: "c-1009",
    name: "Liam O'Connor",
    email: "liam.oconnor@example.com",
    location: "Dublin, IE",
    orders: 2,
    totalSpent: 310,
    lastActivity: "2026-07-20",
    status: "inactive",
    joinedAt: "2026-03-03",
  },
  {
    id: "c-1010",
    name: "Nina Petrova",
    email: "nina.petrova@example.com",
    location: "Berlin, DE",
    phone: "+49 30 901820",
    orders: 11,
    totalSpent: 3850,
    lastActivity: "2026-08-07",
    status: "active",
    joinedAt: "2025-04-19",
  },
  {
    id: "c-1011",
    name: "Omar Haddad",
    email: "omar.haddad@example.com",
    location: "Dubai, AE",
    orders: 4,
    totalSpent: 1290,
    lastActivity: "2026-08-01",
    status: "active",
    joinedAt: "2025-09-08",
  },
  {
    id: "c-1012",
    name: "Chloe Martin",
    email: "chloe.martin@example.com",
    location: "Paris, FR",
    orders: 7,
    totalSpent: 1980.4,
    lastActivity: "2026-07-25",
    status: "inactive",
    joinedAt: "2024-10-16",
  },
  {
    id: "c-1013",
    name: "Noah Williams",
    email: "noah.williams@example.com",
    location: "Chicago, US",
    orders: 1,
    totalSpent: 89,
    lastActivity: "2026-08-11",
    status: "new",
    joinedAt: "2026-08-02",
  },
  {
    id: "c-1014",
    name: "Isabella Rossi",
    email: "isabella.rossi@example.com",
    location: "Milan, IT",
    orders: 5,
    totalSpent: 1430,
    lastActivity: "2026-08-03",
    status: "active",
    joinedAt: "2025-06-12",
  },
  {
    id: "c-1015",
    name: "Ethan Park",
    email: "ethan.park@example.com",
    location: "Seoul, KR",
    orders: 18,
    totalSpent: 8120,
    lastActivity: "2026-08-10",
    status: "vip",
    joinedAt: "2024-01-29",
    tags: ["Patron"],
  },
  {
    id: "c-1016",
    name: "Mia Johansson",
    email: "mia.johansson@example.com",
    location: "Stockholm, SE",
    orders: 3,
    totalSpent: 720,
    lastActivity: "2026-06-30",
    status: "inactive",
    joinedAt: "2025-08-22",
  },
  {
    id: "c-1017",
    name: "Lucas Silva",
    email: "lucas.silva@example.com",
    location: "São Paulo, BR",
    orders: 10,
    totalSpent: 2960,
    lastActivity: "2026-08-06",
    status: "active",
    joinedAt: "2025-03-15",
  },
  {
    id: "c-1018",
    name: "Ava Thompson",
    email: "ava.thompson@example.com",
    location: "Vancouver, CA",
    orders: 0,
    totalSpent: 0,
    lastActivity: "2026-08-09",
    status: "new",
    joinedAt: "2026-08-05",
  },
  {
    id: "c-1019",
    name: "Henry Adams",
    email: "henry.adams@example.com",
    location: "Boston, US",
    orders: 14,
    totalSpent: 5470,
    lastActivity: "2026-07-18",
    status: "active",
    joinedAt: "2024-09-04",
  },
  {
    id: "c-1020",
    name: "Zara Ahmed",
    email: "zara.ahmed@example.com",
    location: "Singapore, SG",
    phone: "+65 6123 4567",
    orders: 22,
    totalSpent: 9850,
    lastActivity: "2026-08-12",
    status: "vip",
    joinedAt: "2023-12-20",
    tags: ["Annual"],
  },
  {
    id: "c-1021",
    name: "Felix Berg",
    email: "felix.berg@example.com",
    location: "Zurich, CH",
    orders: 2,
    totalSpent: 460,
    lastActivity: "2026-05-14",
    status: "inactive",
    joinedAt: "2025-10-01",
  },
  {
    id: "c-1022",
    name: "Grace Liu",
    email: "grace.liu@example.com",
    location: "Taipei, TW",
    orders: 6,
    totalSpent: 1750,
    lastActivity: "2026-08-04",
    status: "active",
    joinedAt: "2025-07-23",
  },
  {
    id: "c-1023",
    name: "Samuel Johnson",
    email: "samuel.johnson@example.com",
    location: "Atlanta, US",
    orders: 4,
    totalSpent: 980,
    lastActivity: "2026-07-12",
    status: "inactive",
    joinedAt: "2025-05-30",
  },
  {
    id: "c-1024",
    name: "Lily Nakamura",
    email: "lily.nakamura@example.com",
    location: "Osaka, JP",
    orders: 1,
    totalSpent: 199,
    lastActivity: "2026-08-12",
    status: "new",
    joinedAt: "2026-08-11",
  },
];

export const customerGrowth = [
  { month: "Mar", new: 98, returning: 512 },
  { month: "Apr", new: 121, returning: 548 },
  { month: "May", new: 110, returning: 584 },
  { month: "Jun", new: 143, returning: 631 },
  { month: "Jul", new: 168, returning: 689 },
  { month: "Aug", new: 146, returning: 731 },
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

const orderStatuses: CustomerOrder["status"][] = ["Paid", "Processing", "Pending", "Refunded"];

function pickOrderStatus(rnd: () => number): CustomerOrder["status"] {
  const r = rnd();
  if (r < 0.65) return "Paid";
  if (r < 0.85) return "Processing";
  if (r < 0.95) return "Pending";
  return "Refunded";
}

export function getCustomerOrders(id: string, count?: number): CustomerOrder[] {
  const customer = customers.find((c) => c.id === id);
  const n = count ?? customer?.orders ?? 3;
  const rnd = mulberry32(hashString(id));
  const list: CustomerOrder[] = [];

  for (let i = 0; i < n; i++) {
    const daysAgo = Math.floor(rnd() * 360);
    const date = new Date(Date.now() - daysAgo * 864e5);
    list.push({
      id: `${id}-o${i}`,
      number: `CT-${2026}-${1000 + Math.floor(rnd() * 9000)}`,
      date: date.toISOString().slice(0, 10),
      amount: Math.round((25 + rnd() * 775) * 100) / 100,
      status: i % 7 === 0 ? orderStatuses[Math.floor(rnd() * 4)] : pickOrderStatus(rnd),
    });
  }

  return list.sort((a, b) => b.date.localeCompare(a.date));
}

export function getCustomerActivity(id: string): ActivityEvent[] {
  const customer = customers.find((c) => c.id === id);
  if (!customer) return [];

  const rnd = mulberry32(hashString(`${id}-activity`));
  const daysAgo = () => Math.floor(rnd() * 180);
  const date = (offset: number) => new Date(Date.now() - offset * 864e5).toISOString().slice(0, 10);

  const events: ActivityEvent[] = [
    {
      id: `${id}-a0`,
      type: "account",
      title: "Account created",
      description: "Signed up and verified email",
      date: customer.joinedAt,
    },
  ];

  const support: ActivityEvent[] = [
    { id: `${id}-a1`, type: "support", title: "Support ticket resolved", description: "Billing question answered", date: date(daysAgo()) },
    { id: `${id}-a2`, type: "email", title: "Opened newsletter", description: "Issue #142 · Summer Drop", date: date(daysAgo()) },
    { id: `${id}-a3`, type: "email", title: "Clicked product link", description: "Limited Edition Hoodie", date: date(daysAgo()) },
    { id: `${id}-a4`, type: "account", title: "Profile updated", description: "Changed shipping address", date: date(daysAgo()) },
    { id: `${id}-a5`, type: "support", title: "Support ticket opened", description: "Asked about order tracking", date: date(daysAgo()) },
    { id: `${id}-a6`, type: "email", title: "Subscribed to newsletter", date: date(daysAgo()) },
  ];

  const purchases = getCustomerOrders(id, Math.min(customer.orders, 4)).map((o, i) => ({
    id: `${id}-p${i}`,
    type: "purchase" as const,
    title: `Order placed ${o.number}`,
    description: `Total ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(o.amount)}`,
    date: o.date,
  }));

  const pool = [...support, ...purchases];
  for (let i = 0; i < 6; i++) {
    const idx = Math.floor(rnd() * pool.length);
    events.push(pool[idx]);
  }

  events.push({ id: `${id}-a7`, type: "account", title: "Account status changed", description: `Marked as ${statusLabels[customer.status]}`, date: date(daysAgo()) });

  return events
    .filter(
      (e, i, arr) => arr.findIndex((x) => x.title === e.title && x.date === e.date) === i
    )
    .sort((a, b) => b.date.localeCompare(a.date));
}
