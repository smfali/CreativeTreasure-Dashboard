import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coupons & Promotions",
  description: "Create and manage coupon codes and promotions for CreativeTreasury.",
};

export default function PromotionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}