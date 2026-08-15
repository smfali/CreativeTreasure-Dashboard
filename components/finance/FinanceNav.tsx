"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/finance", label: "Overview" },
  { href: "/finance/transactions", label: "Transactions" },
  { href: "/finance/payouts", label: "Payouts" },
  { href: "/finance/fees", label: "Fees" },
  { href: "/finance/refunds", label: "Refunds" },
];

export function FinanceNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Finance sections" className="flex flex-wrap items-center gap-1">
      {links.map((link) => {
        const active =
          link.href === "/finance"
            ? pathname === "/finance"
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