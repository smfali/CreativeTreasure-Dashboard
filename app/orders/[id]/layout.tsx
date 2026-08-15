import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order · CreativeTreasury",
  description: "Order details, items and timeline.",
};

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}