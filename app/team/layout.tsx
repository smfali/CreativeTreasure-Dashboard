import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
  description: "Members, invitations, roles and permissions for your CreativeTreasury workspace.",
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return children;
}