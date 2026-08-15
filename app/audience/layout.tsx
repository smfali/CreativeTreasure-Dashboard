import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audience",
  description: "Understand your audience growth and engagement",
};

export default function AudienceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
