import { products } from "./products";
import { customers, customerGrowth, type Customer } from "./customers";

export type CampaignStatus = "draft" | "scheduled" | "active" | "paused" | "completed";
export type CampaignChannel = "email" | "social" | "ads" | "content" | "affiliate";
export type CampaignObjective = "awareness" | "traffic" | "engagement" | "conversions" | "retention";
export type DiscountType = "percentage" | "fixed";
export type CouponStatus = "active" | "scheduled" | "expired" | "inactive";

export const campaignStatusLabels: Record<CampaignStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  active: "Active",
  paused: "Paused",
  completed: "Completed",
};

export const campaignChannelLabels: Record<CampaignChannel, string> = {
  email: "Email",
  social: "Social",
  ads: "Ads",
  content: "Content",
  affiliate: "Affiliate",
};

export const campaignObjectiveLabels: Record<CampaignObjective, string> = {
  awareness: "Brand awareness",
  traffic: "Web traffic",
  engagement: "Engagement",
  conversions: "Conversions",
  retention: "Retention",
};

export const couponStatusLabels: Record<CouponStatus, string> = {
  active: "Active",
  scheduled: "Scheduled",
  expired: "Expired",
  inactive: "Inactive",
};

export const discountTypeLabels: Record<DiscountType, string> = {
  percentage: "Percentage",
  fixed: "Fixed amount",
};

/** Reference "today" for the marketing module, aligned with the rest of the app (2026-08-12). */
export const MARKETING_TODAY = "2026-08-12";

export interface Campaign {
  id: string;
  name: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  objective: CampaignObjective;
  audience: string;
  segmentId?: string;
  productIds: string[];
  budget: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  reach: number;
  engagement: number;
  clicks: number;
  conversions: number;
  revenue: number;
  roi: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  usage: number;
  usageLimit: number;
  minOrder?: number;
  startDate: string;
  expiryDate?: string;
  status: CouponStatus;
  description?: string;
  createdAt: string;
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  criteria: string;
  customerIds: string[];
  count: number;
  revenue: number;
  aov: number;
  lastActivity: string;
}

export interface CampaignActivity {
  id: string;
  type: "created" | "scheduled" | "launched" | "paused" | "resumed" | "completed" | "milestone";
  title: string;
  description?: string;
  date: string;
}

export interface MonthlyMarketingPoint {
  month: string;
  conversions: number;
  revenue: number;
}

export interface ChannelPerformance {
  channel: CampaignChannel;
  label: string;
  campaigns: number;
  reach: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
}

export interface MarketingSummary {
  totalCampaigns: number;
  activeCampaigns: number;
  totalReach: number;
  totalConversions: number;
  conversionRate: number;
  marketingRevenue: number;
  campaignRoi: number;
  customersAcquired: number;
  budgetSpent: number;
}

const MONTHS = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];

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

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

interface CampaignSpec {
  id: string;
  name: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  objective: CampaignObjective;
  audience: string;
  segmentId?: string;
  productIds: string[];
  startIdx: number;
  endIdx: number;
  plannedBudget?: number;
  factor?: number;
  aov?: number;
  convRate?: number;
  ctr?: number;
  engRate?: number;
  roiTarget?: number;
}

const CAMPAIGN_SPECS: CampaignSpec[] = [
  { id: "camp-4001", name: "Summer UI Kit Sale", channel: "ads", status: "completed", objective: "conversions", audience: "All site visitors", productIds: ["p-2001", "p-2003"], startIdx: 0, endIdx: 0, roiTarget: 3.4 },
  { id: "camp-4002", name: "New Designer Welcome", channel: "email", status: "completed", objective: "retention", audience: "New customers", segmentId: "seg-new", productIds: ["p-2019", "p-2020"], startIdx: 1, endIdx: 1, roiTarget: 4.1 },
  { id: "camp-4003", name: "Creator Masterclass Launch", channel: "affiliate", status: "completed", objective: "conversions", audience: "Frequent buyers", segmentId: "seg-frequent", productIds: ["p-2018", "p-2016"], startIdx: 2, endIdx: 2, roiTarget: 2.9 },
  { id: "camp-4004", name: "Spring Icon Pack Drop", channel: "social", status: "paused", objective: "engagement", audience: "Icon enthusiasts", productIds: ["p-2007", "p-2008"], startIdx: 3, endIdx: 4, roiTarget: 2.4 },
  { id: "camp-4005", name: "Logo Bundle Blast", channel: "ads", status: "completed", objective: "conversions", audience: "All site visitors", productIds: ["p-2010", "p-2014"], startIdx: 3, endIdx: 3, roiTarget: 3.8 },
  { id: "camp-4006", name: "Member Appreciation", channel: "email", status: "active", objective: "retention", audience: "High-value customers", segmentId: "seg-high-value", productIds: ["p-2016", "p-2012"], startIdx: 4, endIdx: 5, roiTarget: 3.2 },
  { id: "camp-4007", name: "Back to School Templates", channel: "content", status: "active", objective: "traffic", audience: "All site visitors", productIds: ["p-2004", "p-2005", "p-2015"], startIdx: 4, endIdx: 5, roiTarget: 2.6 },
  { id: "camp-4008", name: "August Drops Campaign", channel: "social", status: "active", objective: "awareness", audience: "All site visitors", productIds: ["p-2002", "p-2011"], startIdx: 5, endIdx: 5, roiTarget: 2.1 },
  { id: "camp-4009", name: "Font Fridays", channel: "email", status: "active", objective: "engagement", audience: "Design newsletter", productIds: ["p-2012", "p-2013"], startIdx: 5, endIdx: 5, roiTarget: 3.6 },
  { id: "camp-4010", name: "Launch Week Push", channel: "social", status: "scheduled", objective: "conversions", audience: "All site visitors", productIds: ["p-2017", "p-2006"], startIdx: 6, endIdx: 6, plannedBudget: 640 },
  { id: "camp-4011", name: "Holiday Early Access", channel: "email", status: "scheduled", objective: "conversions", audience: "Frequent buyers", segmentId: "seg-frequent", productIds: ["p-2005", "p-2020", "p-2008"], startIdx: 6, endIdx: 6, plannedBudget: 300 },
  { id: "camp-4012", name: "Graphics Pack Teaser", channel: "ads", status: "draft", objective: "awareness", audience: "All site visitors", productIds: ["p-2015", "p-2014"], startIdx: 6, endIdx: 6, plannedBudget: 420 },
];

const DATES = [
  "2026-03-02",
  "2026-04-05",
  "2026-05-04",
  "2026-06-08",
  "2026-07-06",
  "2026-08-01",
  "2026-09-07",
];

function buildCampaigns(): Campaign[] {
  const rnd = mulberry32(hashString("marketing-campaigns-v1"));
  return CAMPAIGN_SPECS.map((spec, i) => {
    const startDate = DATES[spec.startIdx];
    const endDate = DATES[spec.endIdx];

    const launched = spec.status === "completed" || spec.status === "active" || spec.status === "paused";
    let budget = spec.plannedBudget ?? 0;
    let reach = 0;
    let engagement = 0;
    let clicks = 0;
    let conversions = 0;
    let revenue = 0;
    let roi = 0;

    if (launched) {
      const promotedRevenue = spec.productIds.reduce(
        (sum, pid) => sum + (products.find((p) => p.id === pid)?.revenue ?? 0),
        0
      );
      const factor = spec.factor ?? 0.04 + rnd() * 0.08;
      const aov = spec.aov ?? 38 + rnd() * 34;
      const convRate = spec.convRate ?? 0.02 + rnd() * 0.05;
      const ctr = spec.ctr ?? 0.04 + rnd() * 0.06;
      const engRate = spec.engRate ?? 0.16 + rnd() * 0.14;
      const roiTarget = spec.roiTarget ?? 1.6 + rnd() * 2.4;

      revenue = round2(promotedRevenue * factor);
      conversions = Math.max(1, Math.round(revenue / aov));
      clicks = Math.max(conversions, Math.ceil(conversions / convRate));
      reach = Math.max(clicks, Math.ceil(clicks / ctr));
      engagement = Math.max(clicks, Math.round(reach * engRate));
      budget = Math.max(50, Math.round(revenue / roiTarget));
      roi = round2(revenue / budget);
    }

    return {
      id: spec.id,
      name: spec.name,
      channel: spec.channel,
      status: spec.status,
      objective: spec.objective,
      audience: spec.audience,
      segmentId: spec.segmentId,
      productIds: spec.productIds,
      budget,
      startDate,
      endDate,
      createdAt: startDate,
      updatedAt: launched ? endDate : MARKETING_TODAY,
      reach,
      engagement,
      clicks,
      conversions,
      revenue,
      roi,
    };
  });
}

function buildCoupons(): Coupon[] {
  const specs: Array<Omit<Coupon, "id"> & { id: string }> = [
    { id: "cp-4101", code: "WELCOME15", type: "percentage", value: 15, usage: 320, usageLimit: 500, minOrder: 30, startDate: "2026-03-01", expiryDate: "2026-12-31", status: "active", description: "15% off for new subscribers", createdAt: "2026-03-01" },
    { id: "cp-4102", code: "CREATOR20", type: "percentage", value: 20, usage: 250, usageLimit: 250, minOrder: 40, startDate: "2026-05-01", expiryDate: "2026-08-31", status: "active", description: "Creator community discount", createdAt: "2026-04-28" },
    { id: "cp-4103", code: "SUMMER10", type: "percentage", value: 10, usage: 410, usageLimit: 1000, startDate: "2026-06-01", expiryDate: "2026-08-31", status: "active", description: "Summer sale", createdAt: "2026-05-29" },
    { id: "cp-4104", code: "VIP25", type: "percentage", value: 25, usage: 63, usageLimit: 100, minOrder: 50, startDate: "2026-01-01", expiryDate: "2026-12-31", status: "active", description: "VIP members only", createdAt: "2026-01-01" },
    { id: "cp-4105", code: "LAUNCH20", type: "fixed", value: 20, usage: 118, usageLimit: 200, minOrder: 60, startDate: "2026-07-15", expiryDate: "2026-09-15", status: "active", description: "Launch week discount", createdAt: "2026-07-10" },
    { id: "cp-4106", code: "STUDENT15", type: "percentage", value: 15, usage: 87, usageLimit: 0, minOrder: 20, startDate: "2026-02-01", expiryDate: "2026-12-31", status: "active", description: "Verified student discount", createdAt: "2026-02-01" },
    { id: "cp-4107", code: "BLACKFRIDAY30", type: "percentage", value: 30, usage: 0, usageLimit: 2000, minOrder: 50, startDate: "2026-11-24", expiryDate: "2026-11-30", status: "scheduled", description: "Black Friday flash sale", createdAt: "2026-08-01" },
    { id: "cp-4108", code: "THANKYOU10", type: "percentage", value: 10, usage: 100, usageLimit: 100, startDate: "2026-03-01", expiryDate: "2026-06-30", status: "expired", description: "Customer appreciation", createdAt: "2026-02-25" },
    { id: "cp-4109", code: "NEWFAN15", type: "fixed", value: 15, usage: 0, usageLimit: 50, minOrder: 25, startDate: "2026-08-01", expiryDate: "2026-10-31", status: "inactive", description: "Early bird gift for new fans", createdAt: "2026-07-28" },
  ];
  return specs;
}

function buildSegments(): Segment[] {
  const today = MARKETING_TODAY;
  const isNew = (c: Customer) => c.status === "new" || c.joinedAt >= "2026-05-15";
  const isReturning = (c: Customer) => c.orders >= 2 && c.status !== "new";
  const isHighValue = (c: Customer) => c.totalSpent >= 1500;
  const isInactive = (c: Customer) => c.status === "inactive" || c.lastActivity < "2026-06-15";
  const isFrequent = (c: Customer) => c.orders >= 10;

  const rules: Array<{ id: string; name: string; description: string; criteria: string; match: (c: Customer) => boolean }> = [
    { id: "seg-new", name: "New customers", description: "Shoppers who joined in the last 90 days or are marked as new.", criteria: "Joined after May 15, 2026", match: isNew },
    { id: "seg-returning", name: "Returning customers", description: "Customers who placed two or more orders.", criteria: "2+ orders", match: isReturning },
    { id: "seg-high-value", name: "High-value customers", description: "Top spenders by lifetime revenue.", criteria: "Lifetime spend ≥ $1,500", match: isHighValue },
    { id: "seg-inactive", name: "Inactive customers", description: "Customers with no activity for over 60 days.", criteria: "No activity since June 15, 2026", match: isInactive },
    { id: "seg-frequent", name: "Frequent buyers", description: "Loyal customers who buy often.", criteria: "10+ orders", match: isFrequent },
  ];

  return rules.map((rule) => {
    const members = customers.filter(rule.match);
    const revenue = members.reduce((s, c) => s + c.totalSpent, 0);
    const lastActivity = members.reduce((max, c) => (c.lastActivity > max ? c.lastActivity : max), "");
    return {
      id: rule.id,
      name: rule.name,
      description: rule.description,
      criteria: rule.criteria,
      customerIds: members.map((c) => c.id),
      count: members.length,
      revenue: round2(revenue),
      aov: members.length > 0 ? round2(revenue / members.length) : 0,
      lastActivity,
    };
  });
}

export const campaigns: Campaign[] = buildCampaigns();
export const coupons: Coupon[] = buildCoupons();
export const segments: Segment[] = buildSegments();

export function findCampaign(id: string): Campaign | undefined {
  return campaigns.find((c) => c.id === id);
}

export function findCoupon(id: string): Coupon | undefined {
  return coupons.find((c) => c.id === id);
}

export function findSegment(id: string): Segment | undefined {
  return segments.find((s) => s.id === id);
}

export function campaignProducts(campaign: Campaign) {
  return campaign.productIds
    .map((pid) => products.find((p) => p.id === pid))
    .filter((p): p is (typeof products)[number] => Boolean(p));
}

export function getCampaignSummary(list: Campaign[]): MarketingSummary {
  const launched = list.filter((c) => c.reach > 0 || c.revenue > 0);
  const totalReach = launched.reduce((s, c) => s + c.reach, 0);
  const totalConversions = launched.reduce((s, c) => s + c.conversions, 0);
  const totalClicks = launched.reduce((s, c) => s + c.clicks, 0);
  const marketingRevenue = round2(launched.reduce((s, c) => s + c.revenue, 0));
  const budgetSpent = round2(launched.reduce((s, c) => s + c.budget, 0));
  const customersAcquired = customerGrowth.reduce((s, m) => s + m.new, 0);

  return {
    totalCampaigns: list.length,
    activeCampaigns: list.filter((c) => c.status === "active").length,
    totalReach,
    totalConversions,
    conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
    marketingRevenue,
    campaignRoi: budgetSpent > 0 ? round2(marketingRevenue / budgetSpent) : 0,
    customersAcquired,
    budgetSpent,
  };
}

/** Monthly conversions + revenue, attributed across the campaigns' active months. */
export function getMonthlySeries(list: Campaign[]): MonthlyMarketingPoint[] {
  const buckets = MONTHS.map((month) => ({ month, conversions: 0, revenue: 0 }));
  for (const campaign of list) {
    if (campaign.revenue <= 0 && campaign.conversions <= 0) continue;
    const sIdx = Math.max(0, DATES.indexOf(campaign.startDate));
    const eIdx = Math.min(MONTHS.length - 1, Math.max(sIdx, DATES.indexOf(campaign.endDate ?? campaign.startDate)));
    const span = eIdx - sIdx + 1;
    const rnd = mulberry32(hashString(`${campaign.id}-months`));
    const weights: number[] = [];
    let wsum = 0;
    for (let i = 0; i < span; i++) {
      const w = 0.6 + rnd() * 0.9;
      weights.push(w);
      wsum += w;
    }
    for (let i = 0; i < span; i++) {
      const bucket = buckets[sIdx + i];
      bucket.revenue += round2((campaign.revenue * weights[i]) / wsum);
      bucket.conversions += Math.round((campaign.conversions * weights[i]) / wsum);
    }
  }
  return buckets.map((b) => ({ ...b, revenue: round2(b.revenue) }));
}

export function getChannelPerformance(list: Campaign[]): ChannelPerformance[] {
  const channels = Object.keys(campaignChannelLabels) as CampaignChannel[];
  return channels
    .map((channel) => {
      const members = list.filter((c) => c.channel === channel);
      const launched = members.filter((c) => c.clicks > 0);
      const reach = launched.reduce((s, c) => s + c.reach, 0);
      const clicks = launched.reduce((s, c) => s + c.clicks, 0);
      const conversions = launched.reduce((s, c) => s + c.conversions, 0);
      const revenue = round2(launched.reduce((s, c) => s + c.revenue, 0));
      return {
        channel,
        label: campaignChannelLabels[channel],
        campaigns: members.length,
        reach,
        clicks,
        conversions,
        revenue,
        ctr: reach > 0 ? (clicks / reach) * 100 : 0,
        conversionRate: clicks > 0 ? (conversions / clicks) * 100 : 0,
      };
    })
    .filter((c) => c.campaigns > 0);
}

export function getCampaignActivity(campaign: Campaign): CampaignActivity[] {
  if (campaign.status === "draft") {
    return [
      { id: `${campaign.id}-a0`, type: "created", title: "Campaign created", description: `Drafted by the marketing team`, date: campaign.createdAt },
      { id: `${campaign.id}-a1`, type: "milestone", title: "Awaiting approval", description: "Ready to be scheduled", date: campaign.updatedAt },
    ];
  }

  const rnd = mulberry32(hashString(`${campaign.id}-activity`));
  const events: CampaignActivity[] = [
    { id: `${campaign.id}-a0`, type: "created", title: "Campaign created", description: `Objective: ${campaignObjectiveLabels[campaign.objective]}`, date: campaign.createdAt },
  ];

  const startEvent: CampaignActivity =
    campaign.status === "scheduled"
      ? { id: `${campaign.id}-a1`, type: "scheduled", title: "Campaign scheduled", description: `Scheduled to run from ${campaign.startDate}`, date: campaign.createdAt }
      : { id: `${campaign.id}-a1`, type: "launched", title: "Campaign launched", description: `Went live on ${campaign.startDate}`, date: campaign.startDate };
  events.push(startEvent);

  if (campaign.reach > 0) {
    const milestonePool: Array<{ type: "milestone"; title: string }> = [
      { type: "milestone", title: "Reached a quarter of the target audience" },
      { type: "milestone", title: "First 100 conversions recorded" },
      { type: "milestone", title: "Crossed 50% budget utilization" },
      { type: "milestone", title: "Best engagement day this week" },
      { type: "milestone", title: "CTR above channel average" },
      { type: "milestone", title: "Crossed $1,000 attributed revenue" },
    ];
    const picks = 2 + Math.floor(rnd() * 2);
    for (let i = 0; i < picks; i++) {
      const idx = Math.floor(rnd() * milestonePool.length);
      events.push({
        id: `${campaign.id}-m${i}`,
        type: "milestone",
        title: milestonePool[idx].title,
        date: i % 2 === 0 ? campaign.startDate : campaign.endDate ?? campaign.startDate,
      });
    }
  }

  if (campaign.status === "paused") {
    events.push({ id: `${campaign.id}-p0`, type: "paused", title: "Campaign paused", description: "Paused by the marketing team", date: campaign.updatedAt });
  } else if (campaign.status === "completed") {
    events.push({ id: `${campaign.id}-c0`, type: "completed", title: "Campaign completed", description: `Closed with ${campaign.conversions} conversions`, date: campaign.endDate ?? campaign.startDate });
  }

  return events.sort((a, b) => a.date.localeCompare(b.date));
}

export function getCampaignMetrics(campaign: Campaign) {
  const reach = campaign.reach;
  const clicks = campaign.clicks;
  return {
    engagementRate: reach > 0 ? (campaign.engagement / reach) * 100 : 0,
    ctr: reach > 0 ? (clicks / reach) * 100 : 0,
    conversionRate: clicks > 0 ? (campaign.conversions / clicks) * 100 : 0,
    costPerConversion: campaign.conversions > 0 ? campaign.budget / campaign.conversions : 0,
    revenuePerConversion: campaign.conversions > 0 ? campaign.revenue / campaign.conversions : 0,
  };
}

export function getCouponUsageLabel(coupon: Coupon): string {
  return coupon.usageLimit > 0 ? `${coupon.usage} / ${coupon.usageLimit}` : `${coupon.usage} / ∞`;
}

export function getCouponRedeemedRatio(coupon: Coupon): number {
  return coupon.usageLimit > 0 ? Math.min(1, coupon.usage / coupon.usageLimit) : 0;
}