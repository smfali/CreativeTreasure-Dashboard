import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audience Segments",
  description: "Targetable audience segments derived from CreativeTreasury customer data.",
};

export default function SegmentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}