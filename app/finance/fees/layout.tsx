import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fees",
  description: "Fee breakdown and effective rates.",
};

export default function FeesLayout({ children }: { children: React.ReactNode }) {
  return children;
}