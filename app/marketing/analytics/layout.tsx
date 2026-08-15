import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketing Analytics",
  description: "Campaign performance, conversions and channel insights for CreativeTreasury.",
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return children;
}