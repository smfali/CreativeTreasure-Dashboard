export type ProductStatus = "published" | "draft";

export type ProductType = "digital" | "course" | "membership";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  type: ProductType;
  price: number;
  sales: number;
  revenue: number;
  status: ProductStatus;
  createdAt: string;
  lastUpdated: string;
  tags: string[];
  version?: string;
  fileSize?: string;
  fileType?: string;
  archived?: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  status: "active" | "hidden";
  createdAt: string;
}

export interface ProductOrder {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: "Paid" | "Processing" | "Refunded";
}

export interface ProductActivity {
  id: string;
  type: "sale" | "update" | "publish" | "review";
  title: string;
  description?: string;
  date: string;
}

export const productTypeLabels: Record<ProductType, string> = {
  digital: "Digital Download",
  course: "Course",
  membership: "Membership",
};

export const productStatusLabels: Record<ProductStatus, string> = {
  published: "Published",
  draft: "Draft",
};

export const categories: ProductCategory[] = [
  { id: "cat-ui", name: "UI Kits", description: "Interface kits and component libraries", status: "active", createdAt: "2024-01-10" },
  { id: "cat-tpl", name: "Templates", description: "Ready-to-use templates and layouts", status: "active", createdAt: "2024-01-10" },
  { id: "cat-icons", name: "Icons", description: "Icon sets and packs", status: "active", createdAt: "2024-02-04" },
  { id: "cat-ill", name: "Illustrations", description: "Illustration packs and scenes", status: "active", createdAt: "2024-03-22" },
  { id: "cat-fonts", name: "Fonts", description: "Typefaces and font families", status: "active", createdAt: "2024-04-15" },
  { id: "cat-gfx", name: "Graphics", description: "Graphics and mockup kits", status: "active", createdAt: "2024-05-30" },
  { id: "cat-courses", name: "Courses", description: "Video courses and lessons", status: "active", createdAt: "2024-06-18" },
  { id: "cat-res", name: "Resources", description: "Toolkits and reference materials", status: "hidden", createdAt: "2024-07-02" },
];

export const products: Product[] = [
  {
    id: "p-2001",
    name: "Nova UI Kit",
    description: "A premium UI kit with 320+ components, light and dark variants, and a full design system for modern product teams.",
    category: "UI Kits",
    type: "digital",
    price: 49,
    sales: 1240,
    revenue: 60760,
    status: "published",
    createdAt: "2025-01-12",
    lastUpdated: "2026-08-10",
    tags: ["Figma", "Design System", "Components"],
    version: "2.4.0",
    fileSize: "84 MB",
    fileType: ".fig",
  },
  {
    id: "p-2002",
    name: "Aurora Design System",
    description: "Enterprise-grade design system with tokens, theming, and accessibility-first components.",
    category: "UI Kits",
    type: "digital",
    price: 79,
    sales: 486,
    revenue: 38394,
    status: "published",
    createdAt: "2025-03-08",
    lastUpdated: "2026-08-02",
    tags: ["Figma", "Tokens", "Enterprise"],
    version: "3.1.0",
    fileSize: "120 MB",
    fileType: ".fig",
  },
  {
    id: "p-2003",
    name: "Vertex Dashboard UI",
    description: "Data-dense dashboard components with charts, tables, and layout grids for analytics products.",
    category: "UI Kits",
    type: "digital",
    price: 59,
    sales: 812,
    revenue: 47908,
    status: "published",
    createdAt: "2025-06-20",
    lastUpdated: "2026-07-28",
    tags: ["Dashboard", "Analytics", "Recharts"],
    version: "1.8.0",
    fileSize: "96 MB",
    fileType: ".fig",
  },
  {
    id: "p-2004",
    name: "SaaS Landing Template",
    description: "Conversion-focused landing page template with 12 section blocks and copywriting guidance.",
    category: "Templates",
    type: "digital",
    price: 29,
    sales: 2150,
    revenue: 62350,
    status: "published",
    createdAt: "2025-02-02",
    lastUpdated: "2026-08-11",
    tags: ["Next.js", "Landing", "Marketing"],
    version: "1.3.0",
    fileSize: "42 MB",
    fileType: ".zip",
  },
  {
    id: "p-2005",
    name: "Resume Template Bundle",
    description: "ATS-friendly resume and cover letter templates in Figma, Word, and PDF formats.",
    category: "Templates",
    type: "digital",
    price: 19,
    sales: 3320,
    revenue: 63080,
    status: "published",
    createdAt: "2024-11-05",
    lastUpdated: "2026-07-15",
    tags: ["Resume", "Career", "PDF"],
    version: "2.0.0",
    fileSize: "18 MB",
    fileType: ".zip",
  },
  {
    id: "p-2006",
    name: "Notion Starter Templates",
    description: "A curated pack of Notion templates for creators, projects, and personal productivity.",
    category: "Templates",
    type: "digital",
    price: 24,
    sales: 1450,
    revenue: 34800,
    status: "draft",
    createdAt: "2026-03-14",
    lastUpdated: "2026-08-05",
    tags: ["Notion", "Productivity"],
    version: "1.0.0",
    fileSize: "6 MB",
    fileType: ".notion",
  },
  {
    id: "p-2007",
    name: "Minimal Icon Set",
    description: "1,200 minimal outline icons with 24px grid, stroke styles, and Figma + SVG exports.",
    category: "Icons",
    type: "digital",
    price: 15,
    sales: 4210,
    revenue: 63150,
    status: "published",
    createdAt: "2024-08-19",
    lastUpdated: "2026-08-08",
    tags: ["Icons", "SVG", "Minimal"],
    version: "3.0.0",
    fileSize: "28 MB",
    fileType: ".zip",
  },
  {
    id: "p-2008",
    name: "Line Icons Pro",
    description: "Premium line icon family with 2,400 glyphs and variable stroke weights.",
    category: "Icons",
    type: "digital",
    price: 29,
    sales: 1890,
    revenue: 54810,
    status: "published",
    createdAt: "2025-04-27",
    lastUpdated: "2026-07-30",
    tags: ["Icons", "Line", "Variable"],
    version: "1.5.0",
    fileSize: "34 MB",
    fileType: ".zip",
  },
  {
    id: "p-2009",
    name: "Duotone Icon Pack",
    description: "Duotone icon pack with 600 icons and editable gradient layers.",
    category: "Icons",
    type: "digital",
    price: 19,
    sales: 980,
    revenue: 18620,
    status: "draft",
    createdAt: "2026-05-11",
    lastUpdated: "2026-08-01",
    tags: ["Icons", "Duotone", "Gradient"],
    version: "0.9.0",
    fileSize: "22 MB",
    fileType: ".zip",
  },
  {
    id: "p-2010",
    name: "Character Illustration Vol.1",
    description: "20 diverse character illustrations with full-body and portrait variants.",
    category: "Illustrations",
    type: "digital",
    price: 39,
    sales: 764,
    revenue: 29796,
    status: "published",
    createdAt: "2025-05-03",
    lastUpdated: "2026-07-22",
    tags: ["Illustration", "Characters"],
    version: "1.0.0",
    fileSize: "150 MB",
    fileType: ".zip",
  },
  {
    id: "p-2011",
    name: "Isometric Scene Pack",
    description: "Modular isometric building blocks and scenes for diagrams and landing pages.",
    category: "Illustrations",
    type: "digital",
    price: 45,
    sales: 320,
    revenue: 14400,
    status: "published",
    createdAt: "2025-09-17",
    lastUpdated: "2026-08-06",
    tags: ["Isometric", "Scenes"],
    version: "2.1.0",
    fileSize: "210 MB",
    fileType: ".zip",
  },
  {
    id: "p-2012",
    name: "Grotesk Sans Family",
    description: "A modern grotesque typeface family with 8 weights and italics, including variable font.",
    category: "Fonts",
    type: "digital",
    price: 59,
    sales: 540,
    revenue: 31860,
    status: "published",
    createdAt: "2025-07-08",
    lastUpdated: "2026-08-09",
    tags: ["Font", "Grotesk", "Variable"],
    version: "1.2.0",
    fileSize: "12 MB",
    fileType: ".ttf",
  },
  {
    id: "p-2013",
    name: "Mono Typeface",
    description: "Programming-friendly monospace typeface with ligatures and code-styled alternates.",
    category: "Fonts",
    type: "digital",
    price: 45,
    sales: 610,
    revenue: 27450,
    status: "published",
    createdAt: "2025-10-01",
    lastUpdated: "2026-07-19",
    tags: ["Font", "Mono", "Code"],
    version: "1.1.0",
    fileSize: "8 MB",
    fileType: ".otf",
  },
  {
    id: "p-2014",
    name: "Mockup Scene Kit",
    description: "Device mockups with realistic shadows and studio-style presentation scenes.",
    category: "Graphics",
    type: "digital",
    price: 35,
    sales: 1120,
    revenue: 39200,
    status: "published",
    createdAt: "2025-08-12",
    lastUpdated: "2026-07-25",
    tags: ["Mockups", "Devices"],
    version: "1.4.0",
    fileSize: "95 MB",
    fileType: ".zip",
  },
  {
    id: "p-2015",
    name: "Social Media Graphics Kit",
    description: "Templates for social posts, stories, and covers with resizable grid presets.",
    category: "Graphics",
    type: "digital",
    price: 25,
    sales: 2080,
    revenue: 52000,
    status: "published",
    createdAt: "2025-11-23",
    lastUpdated: "2026-08-03",
    tags: ["Social", "Templates", "Marketing"],
    version: "2.2.0",
    fileSize: "60 MB",
    fileType: ".zip",
  },
  {
    id: "p-2016",
    name: "UI Design Fundamentals",
    description: "A self-paced video course covering layout, color, typography, and component design.",
    category: "Courses",
    type: "course",
    price: 99,
    sales: 430,
    revenue: 42570,
    status: "published",
    createdAt: "2025-12-01",
    lastUpdated: "2026-08-12",
    tags: ["Course", "UI", "Video"],
    version: "1.0.0",
    fileSize: "3.2 GB",
    fileType: "video",
  },
  {
    id: "p-2017",
    name: "Motion Design Masterclass",
    description: "Advanced motion design course with 60 lessons and project files.",
    category: "Courses",
    type: "course",
    price: 129,
    sales: 260,
    revenue: 33540,
    status: "draft",
    createdAt: "2026-02-09",
    lastUpdated: "2026-07-28",
    tags: ["Course", "Motion", "After Effects"],
    version: "0.8.0",
    fileSize: "4.5 GB",
    fileType: "video",
  },
  {
    id: "p-2018",
    name: "Creator Economy Crash Course",
    description: "Learn how to build, price, and sell digital products as an independent creator.",
    category: "Courses",
    type: "course",
    price: 79,
    sales: 720,
    revenue: 56880,
    status: "published",
    createdAt: "2025-04-16",
    lastUpdated: "2026-08-07",
    tags: ["Course", "Business", "Creator"],
    version: "2.0.0",
    fileSize: "2.1 GB",
    fileType: "video",
  },
  {
    id: "p-2019",
    name: "Figma Community Toolkit",
    description: "Free-style toolkit with reusable autolayout frames, styles, and plugins guide.",
    category: "Resources",
    type: "digital",
    price: 12,
    sales: 2650,
    revenue: 31800,
    status: "published",
    createdAt: "2024-12-10",
    lastUpdated: "2026-08-04",
    tags: ["Figma", "Toolkit", "Plugins"],
    version: "1.6.0",
    fileSize: "15 MB",
    fileType: ".fig",
  },
  {
    id: "p-2020",
    name: "Brand Style Guide Template",
    description: "A structured brand guidelines template covering logos, color, type, and usage rules.",
    category: "Resources",
    type: "digital",
    price: 18,
    sales: 1560,
    revenue: 28080,
    status: "published",
    createdAt: "2025-01-28",
    lastUpdated: "2026-08-01",
    tags: ["Branding", "Template"],
    version: "1.1.0",
    fileSize: "9 MB",
    fileType: ".fig",
  },
];

export const revenueOverTime = [
  { month: "Mar", revenue: 42100, sales: 1180 },
  { month: "Apr", revenue: 45800, sales: 1290 },
  { month: "May", revenue: 47200, sales: 1340 },
  { month: "Jun", revenue: 53100, sales: 1480 },
  { month: "Jul", revenue: 57600, sales: 1620 },
  { month: "Aug", revenue: 62400, sales: 1750 },
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

export interface TrendPoint {
  month: string;
  revenue: number;
  sales: number;
}

export function getProductTrend(id: string): TrendPoint[] {
  const product = products.find((p) => p.id === id);
  const rnd = mulberry32(hashString(`${id}-trend`));
  const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  const scale = product ? product.revenue : 1000;
  return months.map((month, i) => {
    const growth = 0.85 + i * 0.05 + rnd() * 0.1;
    const revenue = Math.max(50, Math.round((scale / 6) * growth));
    const sales = Math.max(2, Math.round(revenue / (product?.price || 30)));
    return { month, revenue, sales };
  });
}

export function getProductOrders(id: string): ProductOrder[] {
  const product = products.find((p) => p.id === id);
  if (!product) return [];
  const rnd = mulberry32(hashString(`${id}-orders`));
  const customers = [
    "Sarah Kim", "Marcus Lee", "Aria Chen", "Jordan Blake", "Taylor Reed",
    "Priya Nair", "Diego Torres", "Emma Wilson", "Ethan Park", "Zara Ahmed",
    "Grace Liu", "Lucas Silva", "Isabella Rossi", "Ava Thompson", "Chloe Martin",
  ];
  const statuses: ProductOrder["status"][] = ["Paid", "Processing", "Refunded"];
  const count = Math.min(product.sales, 6);
  const list: ProductOrder[] = [];
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(rnd() * 90);
    const date = new Date(Date.now() - daysAgo * 864e5).toISOString().slice(0, 10);
    const r = rnd();
    list.push({
      id: `${id}-s${i}`,
      customer: customers[Math.floor(rnd() * customers.length)],
      date,
      amount: product.price,
      status: r < 0.75 ? "Paid" : r < 0.9 ? "Processing" : "Refunded",
    });
  }
  return list.sort((a, b) => b.date.localeCompare(a.date));
}

export function getProductActivity(id: string): ProductActivity[] {
  const product = products.find((p) => p.id === id);
  if (!product) return [];
  const rnd = mulberry32(hashString(`${id}-activity`));
  const date = (offset: number) => new Date(Date.now() - offset * 864e5).toISOString().slice(0, 10);

  const events: ProductActivity[] = [
    { id: `${id}-e0`, type: "update", title: "Version updated", description: `Released v${product.version ?? "1.0.0"}`, date: product.lastUpdated },
  ];

  const sales = getProductOrders(id).slice(0, 3).map((o, i) => ({
    id: `${id}-sale${i}`,
    type: "sale" as const,
    title: `New sale to ${o.customer}`,
    description: `Order ${o.id} · ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(o.amount)}`,
    date: o.date,
  }));

  events.push(...sales);

  const updates: ProductActivity[] = [
    { id: `${id}-u1`, type: "publish", title: product.status === "published" ? "Product published" : "Product set to draft", date: date(Math.floor(rnd() * 60)) },
    { id: `${id}-u2`, type: "review", title: "New 5-star review", description: "“Exactly what I needed for my workflow.”", date: date(Math.floor(rnd() * 30)) },
    { id: `${id}-u3`, type: "update", title: "Description updated", date: date(Math.floor(rnd() * 45)) },
    { id: `${id}-u4`, type: "update", title: "Product created", description: `Created ${product.category}`, date: product.createdAt },
  ];

  return [...events, ...updates, ...sales.slice(0, 2)]
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((e, i, arr) => arr.findIndex((x) => x.title === e.title && x.date === e.date) === i);
}
