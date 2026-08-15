"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  campaigns as baseCampaigns,
  coupons as baseCoupons,
  segments as baseSegments,
  getCampaignSummary,
  getMonthlySeries,
  getChannelPerformance,
  MARKETING_TODAY,
  type Campaign,
  type CampaignChannel,
  type CampaignObjective,
  type CampaignStatus,
  type Coupon,
  type CouponStatus,
  type DiscountType,
  type Segment,
  type MarketingSummary,
  type MonthlyMarketingPoint,
  type ChannelPerformance,
} from "@/lib/data/marketing";

export interface CampaignInput {
  name: string;
  channel: CampaignChannel;
  objective: CampaignObjective;
  status: CampaignStatus;
  audience: string;
  segmentId?: string;
  productIds: string[];
  budget: number;
  startDate: string;
  endDate?: string;
}

export interface CouponInput {
  code: string;
  type: DiscountType;
  value: number;
  usageLimit: number;
  minOrder?: number;
  startDate: string;
  expiryDate?: string;
  status: CouponStatus;
  description?: string;
}

interface MarketingContextValue {
  campaigns: Campaign[];
  coupons: Coupon[];
  segments: Segment[];
  summary: MarketingSummary;
  monthly: MonthlyMarketingPoint[];
  channels: ChannelPerformance[];
  createCampaign: (input: CampaignInput) => Campaign;
  updateCampaign: (id: string, input: CampaignInput) => Campaign | null;
  deleteCampaign: (id: string) => boolean;
  duplicateCampaign: (id: string) => Campaign | null;
  createCoupon: (input: CouponInput) => Coupon;
  updateCoupon: (id: string, input: CouponInput) => Coupon | null;
  deleteCoupon: (id: string) => boolean;
  toggleCoupon: (id: string) => Coupon | null;
}

const MarketingContext = createContext<MarketingContextValue | null>(null);

function nextCampaignId(list: Campaign[]): string {
  const nums = list.map((c) => Number(c.id.replace("camp-", "")) || 4000);
  return `camp-${Math.max(...nums) + 1}`;
}

function nextCouponId(list: Coupon[]): string {
  const nums = list.map((c) => Number(c.id.replace("cp-", "")) || 4100);
  return `cp-${Math.max(...nums) + 1}`;
}

export function MarketingProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(baseCampaigns);
  const [coupons, setCoupons] = useState<Coupon[]>(baseCoupons);

  const segments = useMemo(() => baseSegments, []);
  const summary = useMemo(() => getCampaignSummary(campaigns), [campaigns]);
  const monthly = useMemo(() => getMonthlySeries(campaigns), [campaigns]);
  const channels = useMemo(() => getChannelPerformance(campaigns), [campaigns]);

  function createCampaign(input: CampaignInput): Campaign {
    const campaign: Campaign = {
      id: nextCampaignId(campaigns),
      name: input.name,
      channel: input.channel,
      status: input.status,
      objective: input.objective,
      audience: input.audience,
      segmentId: input.segmentId,
      productIds: input.productIds,
      budget: input.budget,
      startDate: input.startDate,
      endDate: input.endDate,
      createdAt: MARKETING_TODAY,
      updatedAt: MARKETING_TODAY,
      reach: 0,
      engagement: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      roi: 0,
    };
    setCampaigns((prev) => [...prev, campaign]);
    return campaign;
  }

  function updateCampaign(id: string, input: CampaignInput): Campaign | null {
    let updated: Campaign | null = null;
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        updated = {
          ...c,
          name: input.name,
          channel: input.channel,
          objective: input.objective,
          status: input.status,
          audience: input.audience,
          segmentId: input.segmentId,
          productIds: input.productIds,
          budget: input.budget,
          startDate: input.startDate,
          endDate: input.endDate,
          updatedAt: MARKETING_TODAY,
        };
        return updated;
      })
    );
    return updated;
  }

  function deleteCampaign(id: string): boolean {
    const exists = campaigns.some((c) => c.id === id);
    if (exists) setCampaigns((prev) => prev.filter((c) => c.id !== id));
    return exists;
  }

  function duplicateCampaign(id: string): Campaign | null {
    const source = campaigns.find((c) => c.id === id);
    if (!source) return null;
    const copy: Campaign = {
      ...source,
      id: nextCampaignId(campaigns),
      name: `${source.name} (Copy)`,
      status: "draft",
      createdAt: MARKETING_TODAY,
      updatedAt: MARKETING_TODAY,
      reach: 0,
      engagement: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      roi: 0,
    };
    setCampaigns((prev) => [...prev, copy]);
    return copy;
  }

  function createCoupon(input: CouponInput): Coupon {
    const coupon: Coupon = {
      id: nextCouponId(coupons),
      code: input.code,
      type: input.type,
      value: input.value,
      usage: 0,
      usageLimit: input.usageLimit,
      minOrder: input.minOrder,
      startDate: input.startDate,
      expiryDate: input.expiryDate,
      status: input.status,
      description: input.description,
      createdAt: MARKETING_TODAY,
    };
    setCoupons((prev) => [...prev, coupon]);
    return coupon;
  }

  function updateCoupon(id: string, input: CouponInput): Coupon | null {
    let updated: Coupon | null = null;
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        updated = {
          ...c,
          code: input.code,
          type: input.type,
          value: input.value,
          usageLimit: input.usageLimit,
          minOrder: input.minOrder,
          startDate: input.startDate,
          expiryDate: input.expiryDate,
          status: input.status,
          description: input.description,
        };
        return updated;
      })
    );
    return updated;
  }

  function deleteCoupon(id: string): boolean {
    const exists = coupons.some((c) => c.id === id);
    if (exists) setCoupons((prev) => prev.filter((c) => c.id !== id));
    return exists;
  }

  function toggleCoupon(id: string): Coupon | null {
    let toggled: Coupon | null = null;
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        toggled = { ...c, status: c.status === "inactive" ? "active" : "inactive" };
        return toggled;
      })
    );
    return toggled;
  }

  return (
    <MarketingContext.Provider
      value={{
        campaigns,
        coupons,
        segments,
        summary,
        monthly,
        channels,
        createCampaign,
        updateCampaign,
        deleteCampaign,
        duplicateCampaign,
        createCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCoupon,
      }}
    >
      {children}
    </MarketingContext.Provider>
  );
}

export function useMarketing() {
  const ctx = useContext(MarketingContext);
  if (!ctx) throw new Error("useMarketing must be used within MarketingProvider");
  return ctx;
}