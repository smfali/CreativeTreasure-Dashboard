import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketing",
  description: "Campaigns, promotions, audience segments and marketing analytics for CreativeTreasury.",
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return children;
}