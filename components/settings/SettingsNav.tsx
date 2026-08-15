"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SlidersHorizontal,
  User,
  Palette,
  Store,
  Bell,
  ShieldCheck,
  Plug,
  Code2,
  Server,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/settings", label: "General", icon: SlidersHorizontal },
  { href: "/settings/profile", label: "Profile", icon: User },
  { href: "/settings/appearance", label: "Appearance", icon: Palette },
  { href: "/settings/commerce", label: "Commerce", icon: Store },
  { href: "/settings/notifications", label: "Notifications", icon: Bell },
  { href: "/settings/security", label: "Security", icon: ShieldCheck },
  { href: "/settings/integrations", label: "Integrations", icon: Plug },
  { href: "/settings/developers", label: "Developers", icon: Code2 },
  { href: "/settings/system", label: "System", icon: Server },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Settings sections" className="flex flex-wrap items-center gap-1">
      {links.map((link) => {
        const active =
          link.href === "/settings"
            ? pathname === "/settings"
            : pathname === link.href || pathname.startsWith(link.href + "/");
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <link.icon className="h-4 w-4" aria-hidden />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}