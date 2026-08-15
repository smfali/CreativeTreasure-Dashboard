import { TEAM_TODAY } from "./team";

/** Deterministic "today" for the settings module, aligned with the app. */
export const SETTINGS_TODAY = TEAM_TODAY;

// ---------------------------------------------------------------------------
// General settings
// ---------------------------------------------------------------------------

export interface GeneralSettings {
  businessName: string;
  description: string;
  contactEmail: string;
  website: string;
  defaultCurrency: string;
  timezone: string;
  language: string;
  dateFormat: string;
}

export const defaultGeneralSettings: GeneralSettings = {
  businessName: "Creative Treasury",
  description: "Premium digital products for creators and designers.",
  contactEmail: "support@creativetreasury.com",
  website: "https://creativetreasury.com",
  defaultCurrency: "USD",
  timezone: "America/Los_Angeles",
  language: "English (US)",
  dateFormat: "MMM d, yyyy",
};

export const currencyOptions = ["USD", "EUR", "GBP"] as const;

export const timezoneOptions = [
  "UTC",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
] as const;

export const languageOptions = [
  "English (US)",
  "English (UK)",
  "Español",
  "Français",
  "Deutsch",
  "日本語",
  "Português (Brasil)",
] as const;

export const dateFormatOptions = [
  { value: "MMM d, yyyy", label: "Aug 12, 2026" },
  { value: "MM/dd/yyyy", label: "08/12/2026" },
  { value: "dd/MM/yyyy", label: "12/08/2026" },
  { value: "yyyy-MM-dd", label: "2026-08-12" },
  { value: "MMMM d, yyyy", label: "August 12, 2026" },
] as const;

// ---------------------------------------------------------------------------
// Profile settings
// ---------------------------------------------------------------------------

export interface ProfileSettings {
  name: string;
  email: string;
  role: string;
  jobTitle: string;
  bio: string;
}

export const defaultProfileSettings: ProfileSettings = {
  name: "Alex Rivera",
  email: "alex@creativetreasury.com",
  role: "Owner",
  jobTitle: "Founder & Creative Director",
  bio: "Founder of Creative Treasury. I build premium digital products for creators and designers.",
};

export const profileRoleOptions = ["Owner", "Administrator", "Manager", "Editor", "Analyst", "Support"] as const;

export const profileJobTitleOptions = [
  "Founder & Creative Director",
  "Product Designer",
  "Developer",
  "Marketing Lead",
  "Support Lead",
  "Finance Analyst",
  "Content Strategist",
] as const;

// ---------------------------------------------------------------------------
// Security — demo policy, 2FA and recovery codes
// ---------------------------------------------------------------------------

export const defaultTwoFactorEnabled = false;

export const passwordPolicy = {
  minLength: 8,
  hint: "At least 8 characters with a mix of letters and numbers.",
} as const;

export const demoRecoveryCodes = [
  "CT-8H2K-Q9R4",
  "CT-3P7L-W6A1",
  "CT-5N8M-Z2B3",
  "CT-7K1J-X4C5",
  "CT-2V6B-Y8D9",
  "CT-9G4F-U3E7",
] as const;

export const twoFactorMethods = [
  { key: "app", label: "Authenticator app", description: "Time-based one-time codes from an app like Google Authenticator." },
  { key: "sms", label: "Text message (SMS)", description: "Codes delivered by SMS to a verified phone number." },
] as const;

// ---------------------------------------------------------------------------
// Commerce settings
// ---------------------------------------------------------------------------

export type TaxDisplay = "exclusive" | "inclusive" | "hidden";
export type PricingBehavior = "manual" | "cost-plus" | "competitor-aware";

export interface CommerceSettings {
  defaultCurrency: string;
  taxDisplay: TaxDisplay;
  pricingBehavior: PricingBehavior;
  orderNumberPrefix: string;
  orderNumberStart: number;
  invoicePrefix: string;
  invoiceFooter: string;
  refundPolicy: string;
  businessName: string;
  businessAddress: string;
  businessEmail: string;
}

export const defaultCommerceSettings: CommerceSettings = {
  defaultCurrency: "USD",
  taxDisplay: "inclusive",
  pricingBehavior: "manual",
  orderNumberPrefix: "CT",
  orderNumberStart: 2421,
  invoicePrefix: "INV",
  invoiceFooter: "Thank you for your purchase!",
  refundPolicy: "Full refunds within 14 days of purchase for unused products.",
  businessName: "Creative Treasury",
  businessAddress: "1120 NW 5th Ave, Portland, OR 97209",
  businessEmail: "billing@creativetreasury.com",
};

export const taxDisplayOptions: { value: TaxDisplay; label: string; description: string }[] = [
  { value: "inclusive", label: "Inclusive", description: "Show prices with tax already included." },
  { value: "exclusive", label: "Exclusive", description: "Add tax at checkout on top of the price." },
  { value: "hidden", label: "Hidden", description: "Absorb tax into the price without displaying it." },
];

export const pricingBehaviorOptions: { value: PricingBehavior; label: string; description: string }[] = [
  { value: "manual", label: "Manual pricing", description: "Set every product price by hand." },
  { value: "cost-plus", label: "Cost plus margin", description: "Suggest prices from cost with a fixed margin." },
  { value: "competitor-aware", label: "Competitor-aware", description: "Suggest prices from comparable market ranges." },
];

// ---------------------------------------------------------------------------
// Integrations
// ---------------------------------------------------------------------------

export type IntegrationCategory = "payments" | "analytics" | "email" | "communication" | "automation";

export interface IntegrationConfigField {
  key: string;
  label: string;
  placeholder: string;
  value?: string;
  masked?: boolean;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory;
  /** Hex colour used for the logo tile. */
  color: string;
  initials: string;
  status: "connected" | "disconnected";
  scopes: string[];
  fields: IntegrationConfigField[];
  lastSynced?: string;
  website: string;
}

export const integrationCategoryLabels: Record<IntegrationCategory, string> = {
  payments: "Payments",
  analytics: "Analytics",
  email: "Email marketing",
  communication: "Communication",
  automation: "Automation",
};

export const integrationCategories = (Object.keys(integrationCategoryLabels) as IntegrationCategory[]).map(
  (value) => ({ value, label: integrationCategoryLabels[value] })
);

export const seedIntegrations: Integration[] = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Accept payments and manage subscriptions with Stripe.",
    category: "payments",
    color: "#635BFF",
    initials: "ST",
    status: "connected",
    scopes: ["View payments", "Create refunds", "Read customers"],
    fields: [
      { key: "secretKey", label: "Secret key", placeholder: "sk_live_...", value: "sk_live_••••••••••••••••", masked: true },
      { key: "webhook", label: "Webhook URL", placeholder: "https://...", value: "https://api.creativetreasury.com/hooks/stripe" },
    ],
    lastSynced: "2026-08-12T06:45:00",
    website: "https://stripe.com",
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Let customers check out with PayPal wallets and cards.",
    category: "payments",
    color: "#003087",
    initials: "PP",
    status: "disconnected",
    scopes: ["Process payments", "Read transactions"],
    fields: [
      { key: "clientId", label: "Client ID", placeholder: "AT-xxxxxxxx", value: "AT-••••••••••••••••", masked: true },
      { key: "secret", label: "Secret", placeholder: "••••••••", value: "••••••••••••••••", masked: true },
    ],
    website: "https://paypal.com",
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Track store traffic and attribution with GA4.",
    category: "analytics",
    color: "#E37400",
    initials: "GA",
    status: "connected",
    scopes: ["View analytics", "Read traffic data"],
    fields: [
      { key: "property", label: "Property ID", placeholder: "G-XXXXXXXX", value: "G-9F2KQ7L3" },
      { key: "stream", label: "Data stream", placeholder: "Stream name", value: "Web — creativetreasury.com" },
    ],
    lastSynced: "2026-08-12T07:00:00",
    website: "https://analytics.google.com",
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Sync customers into audiences and run email campaigns.",
    category: "email",
    color: "#FFE01B",
    initials: "MC",
    status: "disconnected",
    scopes: ["Read audiences", "Send campaigns"],
    fields: [
      { key: "apiKey", label: "API key", placeholder: "xxxxxxxx-us17", value: "••••••••-us17", masked: true },
      { key: "audience", label: "Default audience", placeholder: "Audience name", value: "Newsletter subscribers" },
    ],
    website: "https://mailchimp.com",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Post order and finance notifications to your workspace.",
    category: "communication",
    color: "#4A154B",
    initials: "SL",
    status: "connected",
    scopes: ["Post messages", "Read channels"],
    fields: [
      { key: "channel", label: "Channel", placeholder: "#channel", value: "#sales-alerts" },
      { key: "workspace", label: "Workspace", placeholder: "Workspace name", value: "creative-treasury" },
    ],
    lastSynced: "2026-08-12T06:30:00",
    website: "https://slack.com",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect the dashboard to 5,000+ apps with Zaps.",
    category: "automation",
    color: "#FF4F00",
    initials: "ZA",
    status: "disconnected",
    scopes: ["Trigger workflows", "Read triggers"],
    fields: [
      { key: "webhook", label: "Webhook URL", placeholder: "https://hooks.zapier.com/...", value: "https://hooks.zapier.com/••••••/••••••" },
      { key: "zap", label: "Active Zap", placeholder: "Zap name", value: "New order → Sheets" },
    ],
    website: "https://zapier.com",
  },
];

// ---------------------------------------------------------------------------
// API keys
// ---------------------------------------------------------------------------

export interface ApiKey {
  id: string;
  name: string;
  createdAt: string;
  lastUsed: string;
  status: "active" | "revoked";
  masked: string;
}

export const seedApiKeys: ApiKey[] = [
  { id: "ak-1", name: "Production", createdAt: "2026-03-14", lastUsed: "2026-08-12", status: "active", masked: "ct_live_4f8a••••••••••••9d02" },
  { id: "ak-2", name: "Test environment", createdAt: "2026-05-02", lastUsed: "2026-08-09", status: "active", masked: "ct_test_1b3c••••••••••••77aa" },
  { id: "ak-3", name: "Legacy CLI", createdAt: "2025-11-20", lastUsed: "2026-06-30", status: "revoked", masked: "ct_live_9e0f••••••••••••c41b" },
];

export const apiKeyStatusLabels: Record<ApiKey["status"], string> = {
  active: "Active",
  revoked: "Revoked",
};

/** Human-friendly date-time label for deterministic mock timestamps. */
export function formatSettingsDateTime(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · ${time}`;
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

/** Deterministic masked demo value for a freshly created key. */
export function generateMaskedKey(name: string): string {
  const rnd = mulberry32(hashString(`api-key-${name}-${Date.now()}`));
  const prefix = rnd() < 0.5 ? "ct_live" : "ct_test";
  const head = Array.from({ length: 4 }, () => "0123456789abcdef"[Math.floor(rnd() * 16)]).join("");
  const tail = Array.from({ length: 4 }, () => "0123456789abcdef"[Math.floor(rnd() * 16)]).join("");
  return `${prefix}_${head}••••••••••••${tail}`;
}

// ---------------------------------------------------------------------------
// Security — active sessions & login history
// ---------------------------------------------------------------------------

export interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export interface LoginEvent {
  id: string;
  device: string;
  location: string;
  date: string;
  result: "success" | "error";
}

export const seedSessions: ActiveSession[] = [
  { id: "sess-1", device: "Chrome on Windows · This device", location: "Portland, US", lastActive: "2026-08-12T08:04:00", current: true },
  { id: "sess-2", device: "Firefox on macOS", location: "Berlin, DE", lastActive: "2026-08-11T19:22:00", current: false },
  { id: "sess-3", device: "Safari on iPhone", location: "Seattle, US", lastActive: "2026-08-09T12:10:00", current: false },
];

export const seedLoginHistory: LoginEvent[] = [
  { id: "lh-1", device: "Chrome on Windows", location: "Portland, US", date: "2026-08-12T08:04:00", result: "success" },
  { id: "lh-2", device: "Firefox on macOS", location: "Berlin, DE", date: "2026-08-11T19:22:00", result: "success" },
  { id: "lh-3", device: "Safari on iPhone", location: "Seattle, US", date: "2026-08-09T12:10:00", result: "success" },
  { id: "lh-4", device: "Chrome on Android", location: "Unknown", date: "2026-08-07T03:41:00", result: "error" },
  { id: "lh-5", device: "Chrome on Windows", location: "Portland, US", date: "2026-08-06T09:15:00", result: "success" },
];

// ---------------------------------------------------------------------------
// System information
// ---------------------------------------------------------------------------

export const systemInfo = {
  appName: "CreativeTreasury",
  version: "2.6.0",
  environment: "Production",
  lastDeployment: "2026-08-10T14:22:00",
  dataStatus: "Seeded demo data",
  seededAt: "2026-08-12T00:00:00",
  framework: "Next.js",
  frameworkVersion: "16.3.0",
} as const;

export const systemInfoRows = [
  { key: "appName", label: "Application", value: systemInfo.appName },
  { key: "version", label: "Version", value: systemInfo.version },
  { key: "environment", label: "Environment", value: systemInfo.environment },
  { key: "lastDeployment", label: "Last deployment", value: systemInfo.lastDeployment },
  { key: "dataStatus", label: "Data status", value: systemInfo.dataStatus },
  { key: "seededAt", label: "Seeded at", value: systemInfo.seededAt },
  { key: "framework", label: "Framework", value: `${systemInfo.framework} ${systemInfo.frameworkVersion}` },
] as const;