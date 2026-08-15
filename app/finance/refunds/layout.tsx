import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refunds",
  description: "Refund activity and refundable orders.",
};

export default function RefundsLayout({ children }: { children: React.ReactNode }) {
  return children;
}