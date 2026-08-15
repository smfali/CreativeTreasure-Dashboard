"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Vault, LayoutDashboard, BarChart3, Users, Package, ShoppingCart, Settings, DollarSign, FileText, History, X, Landmark, Megaphone, ShieldCheck, Bell, Activity } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

const navItems = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Revenue", href: "/revenue", icon: BarChart3 },
  { label: "Audience", href: "/audience", icon: Users },
  { label: "Products", href: "/products", icon: Package },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Finance", href: "/finance", icon: Landmark },
  { label: "Marketing", href: "/marketing", icon: Megaphone },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Pricing", href: "/pricing", icon: DollarSign },
  { label: "Docs", href: "/docs", icon: FileText },
  { label: "Changelog", href: "/changelog", icon: History },
  { label: "Team", href: "/team", icon: ShieldCheck },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
      active
        ? "bg-muted text-foreground border-l-2"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    }`;

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card hidden md:flex flex-col transition-colors duration-300">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-border">
          <Vault className="w-6 h-6" style={{ color: "rgb(var(--accent))" }} />
          <span className="text-lg font-semibold text-foreground">
                  CreativeTreasury
          </span>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href + "/"));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`${linkClass(active)} ${active ? "border-l-2" : ""}`}
                style={active ? { borderLeftColor: "rgb(var(--accent))" } : undefined}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60" />
          <aside
            onClick={(e) => e.stopPropagation()}
            className="relative w-64 h-full bg-card border-r border-border flex flex-col animate-slide-in-left"
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-border">
              <div className="flex items-center gap-3">
                <Vault className="w-6 h-6" style={{ color: "rgb(var(--accent))" }} />
                <span className="text-lg font-semibold text-foreground">
            CreativeTreasury
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-md transition-colors hover:bg-muted"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <nav className="flex-1 py-4">
              {navItems.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href + "/"));
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`${linkClass(active)} min-h-16 ${active ? "border-l-2" : ""}`}
                    style={active ? { borderLeftColor: "rgb(var(--accent))" } : undefined}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
