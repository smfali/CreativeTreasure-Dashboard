import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campaigns",
  description: "Plan, run and track marketing campaigns for CreativeTreasury.",
};

export default function CampaignsLayout({ children }: { children: React.ReactNode }) {
  return children;
}