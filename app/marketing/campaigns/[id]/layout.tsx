import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campaign",
  description: "Campaign overview, performance, activity and promoted products.",
};

export default function CampaignDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}