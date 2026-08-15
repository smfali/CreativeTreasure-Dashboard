import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer",
  description: "Customer details and activity",
};

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
