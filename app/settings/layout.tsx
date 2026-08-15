import type { Metadata } from "next";
import { SettingsNav } from "@/components/settings/SettingsNav";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your CreativeTreasury workspace settings, integrations and system administration.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <SettingsNav />
      {children}
    </div>
  );
}