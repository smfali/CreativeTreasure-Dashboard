import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product · CreativeTreasury",
  description: "Product details and analytics.",
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
