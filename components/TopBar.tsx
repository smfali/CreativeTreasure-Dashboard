"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, Menu, Bell, Palette, Sun, Moon, CheckCheck } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { useTheme } from "next-themes";
import { useAccent, accentOptions } from "@/contexts/AccentContext";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { NotificationIcon } from "@/components/notifications/NotificationIcon";
import { notificationTime } from "@/lib/data/notifications";
import {
  DropdownMenu,
  DropdownMenuHeader,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

export default function TopBar({ searchQuery = "", onSearchChange }: TopBarProps) {
  const { setSidebarOpen } = useSidebar();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { accent, setAccent } = useAccent();
  const { currency, setCurrency } = useCurrency();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  const recent = notifications.slice(0, 5);

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur transition-colors duration-300">
      <div className="flex h-16 items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-muted-foreground" />
          </Button>
          <div className="relative w-full min-w-0 flex-1 md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search..."
              className="h-9 w-full rounded-full border border-border bg-muted pl-9 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-card px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground sm:block">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            className="hidden h-9 items-center gap-2 rounded-full border border-border bg-muted px-3.5 text-sm text-muted-foreground transition-colors hover:text-foreground lg:flex"
          >
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </button>
          <DropdownMenu
            trigger={
              <span className="rounded-full px-2.5 text-sm text-muted-foreground">
                {currency}
              </span>
            }
            triggerClassName="hidden h-9 items-center rounded-full border border-border bg-muted transition-colors hover:text-foreground md:flex"
            triggerAriaLabel="Change currency"
          >
            {(["USD", "EUR", "GBP"] as const).map((opt) => (
              <DropdownMenuItem
                key={opt}
                className={currency === opt ? "bg-muted font-medium" : undefined}
                onClick={() => setCurrency(opt)}
              >
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenu>
          <Button variant="secondary" className="hidden xl:inline-flex">
            Connect Platform
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {!mounted ? (
              <span className="h-5 w-5" aria-hidden />
            ) : isDark ? (
              <Sun className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
          <DropdownMenu
            align="end"
            triggerAriaLabel="Change accent colour"
            trigger={<Palette className="h-5 w-5 text-muted-foreground" />}
            triggerClassName="rounded-md p-1.5 transition-colors hover:bg-muted"
            contentClassName="w-36"
          >
            <div className="grid grid-cols-3 gap-2 p-2">
              {accentOptions.map((c) => (
                <button
                  key={c.rgb}
                  type="button"
                  role="menuitem"
                  aria-label={`Set accent to ${c.label}`}
                  onClick={() => setAccent(c.rgb)}
                  className={`flex items-center justify-center rounded-md p-1 transition ${
                    accent === c.rgb ? "bg-muted" : "hover:bg-muted"
                  }`}
                >
                  <span
                    className="h-6 w-6 rounded-full transition-transform hover:scale-110"
                    style={{ backgroundColor: `rgb(${c.rgb})` }}
                  />
                </button>
              ))}
            </div>
          </DropdownMenu>
          <DropdownMenu
            align="end"
            triggerAriaLabel={`Notifications, ${unreadCount} unread`}
            trigger={
              <span className="relative flex">
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
                    {unreadCount}
                  </span>
                )}
              </span>
            }
            triggerClassName="relative rounded-md p-1 transition-colors hover:bg-muted"
            contentClassName="w-80"
          >
            <DropdownMenuHeader className="flex items-center justify-between gap-2 pr-2">
              <span>
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    {unreadCount} new
                  </span>
                )}
              </span>
            </DropdownMenuHeader>
            {unreadCount > 0 && (
              <DropdownMenuItem
                onClick={markAllRead}
                className="text-xs font-medium text-muted-foreground"
              >
                <CheckCheck className="h-3.5 w-3.5" aria-hidden />
                Mark all as read
              </DropdownMenuItem>
            )}
            <div className="max-h-80 overflow-y-auto">
              {recent.length === 0 ? (
                <DropdownMenuItem disabled className="justify-center text-sm text-muted-foreground">
                  No notifications
                </DropdownMenuItem>
              ) : (
                recent.map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    className="items-start gap-2.5"
                    onClick={() => {
                      markRead(n.id);
                      router.push(n.resourceHref ?? "/notifications");
                    }}
                  >
                    <span className="relative">
                      <NotificationIcon module={n.module} />
                      {!n.read && (
                        <span
                          aria-hidden
                          className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-card bg-primary"
                        />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {!n.read && <span className="sr-only">Unread — </span>}
                        {n.title}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {n.resource} · {notificationTime(n.createdAt)}
                      </span>
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </div>
            <DropdownMenuItem
              onClick={() => router.push("/notifications")}
              className="justify-center border-t border-border text-xs font-medium text-primary"
            >
              View all notifications
            </DropdownMenuItem>
          </DropdownMenu>
          <Avatar name="Alex Taylor" />
        </div>
      </div>
    </header>
  );
}
