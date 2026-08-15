"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/notifications", label: "Notification centre" },
  { href: "/notifications/preferences", label: "Preferences" },
];

export function NotificationNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Notification sections" className="flex flex-wrap items-center gap-1">
      {links.map((link) => {
        const active =
          link.href === "/notifications"
            ? pathname === "/notifications"
            : pathname === link.href || pathname.startsWith(link.href + "/");
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}