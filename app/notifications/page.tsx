"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  BellOff,
  CheckCheck,
  Copy,
  MailOpen,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import TableSkeleton from "@/components/TableSkeleton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { NotificationNav } from "@/components/notifications/NotificationNav";
import { NotificationRow } from "@/components/notifications/NotificationRow";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/contexts/NotificationsContext";
import { notificationModuleLabels, type NotificationModule } from "@/lib/data/notifications";

const ALL = "all";
type Tab = "all" | "unread" | "read" | "important";

const moduleOptions = Object.keys(notificationModuleLabels) as NotificationModule[];

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    importantCount,
    markRead,
    markUnread,
    markAllRead,
    deleteNotification,
    deleteNotifications,
    toggleImportant,
  } = useNotifications();

  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [module, setModule] = useState<string>(ALL);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSelected(new Set());
  }, [tab, module, query]);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    };
  }, []);

  function showNotice(message: string) {
    setNotice(message);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 3000);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notifications.filter((n) => {
      if (tab === "unread" && n.read) return false;
      if (tab === "read" && !n.read) return false;
      if (tab === "important" && !n.important) return false;
      if (module !== ALL && n.module !== module) return false;
      if (q) {
        const haystack = `${n.title} ${n.description} ${n.resource} ${notificationModuleLabels[n.module]}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [notifications, tab, module, query]);

  const readCount = notifications.length - unreadCount;
  const filtersActive = query !== "" || module !== ALL;
  const allSelected = filtered.length > 0 && filtered.every((n) => selected.has(n.id));

  function toggleSelectAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map((n) => n.id)));
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function bulkMarkRead() {
    selected.forEach((id) => markRead(id));
    const count = selected.size;
    setSelected(new Set());
    showNotice(`Marked ${count} notification${count === 1 ? "" : "s"} as read.`);
  }

  function bulkMarkUnread() {
    selected.forEach((id) => markUnread(id));
    const count = selected.size;
    setSelected(new Set());
    showNotice(`Marked ${count} notification${count === 1 ? "" : "s"} as unread.`);
  }

  function openDelete() {
    setPendingDelete(Array.from(selected));
    setConfirmOpen(true);
  }

  function confirmDelete() {
    const count = pendingDelete.length;
    deleteNotifications(pendingDelete);
    setSelected(new Set());
    setPendingDelete([]);
    showNotice(`Deleted ${count} notification${count === 1 ? "" : "s"}.`);
  }

  function deleteSingle(id: string) {
    deleteNotification(id);
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showNotice("Notification deleted.");
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Notifications" }]} />
        <Skeleton className="h-9 w-52" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-14" />
        <TableSkeleton rows={6} cols={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Notifications" }]} />
        <div className="mt-2">
          <h1 className="heading-page">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Activity from orders, products, finance, marketing and your team.
          </p>
        </div>
      </div>

      <NotificationNav />

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList aria-label="Notification views">
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="read">Read ({readCount})</TabsTrigger>
            <TabsTrigger value="important">
              <Star className="mr-1 h-3.5 w-3.5" aria-hidden />
              Important ({importantCount})
            </TabsTrigger>
          </TabsList>
          <Button
            variant="outline"
            onClick={() => {
              markAllRead();
              showNotice("All notifications marked as read.");
            }}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="h-4 w-4" aria-hidden />
            Mark all as read
          </Button>
        </div>

        <Card className="mt-4">
          <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notifications..."
                aria-label="Search notifications"
                className="pl-9"
              />
            </div>
            <Select
              value={module}
              onChange={(e) => setModule(e.target.value)}
              aria-label="Filter by module"
              className="lg:w-52"
            >
              <option value={ALL}>All modules</option>
              {moduleOptions.map((m) => (
                <option key={m} value={m}>
                  {notificationModuleLabels[m]}
                </option>
              ))}
            </Select>
          </CardContent>
        </Card>

        {selected.size > 0 && (
          <Card className="border-primary/40 bg-primary/5">
            <CardContent className="flex flex-wrap items-center gap-2 p-3">
              <span className="mr-1 text-sm font-medium text-foreground">
                {selected.size} selected
              </span>
              <Button variant="secondary" size="sm" onClick={bulkMarkRead}>
                <CheckCheck className="h-4 w-4" aria-hidden />
                Mark read
              </Button>
              <Button variant="secondary" size="sm" onClick={bulkMarkUnread}>
                <MailOpen className="h-4 w-4" aria-hidden />
                Mark unread
              </Button>
              <Button variant="destructive" size="sm" onClick={openDelete}>
                <Trash2 className="h-4 w-4" aria-hidden />
                Delete
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
                Clear
              </Button>
            </CardContent>
          </Card>
        )}

        {notice && <Alert variant="success">{notice}</Alert>}

        {notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="There are no notifications right now. New activity will appear here."
          />
        ) : filtered.length === 0 ? (
          tab === "unread" && unreadCount === 0 && !filtersActive ? (
            <EmptyState
              icon={BellOff}
              title="You're all caught up"
              description="No unread notifications right now. New activity will appear here."
            />
          ) : (
            <EmptyState
              icon={Search}
              title="No matching notifications"
              description="Try a different search or filter."
              action={
                filtersActive ? (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setQuery("");
                      setModule(ALL);
                    }}
                  >
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          )
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>
                {tab === "all" && "All notifications"}
                {tab === "unread" && "Unread notifications"}
                {tab === "read" && "Read notifications"}
                {tab === "important" && "Important notifications"}
              </CardTitle>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox checked={allSelected} onChange={toggleSelectAll} aria-label="Select all notifications" />
                Select all
              </label>
            </CardHeader>
            <CardContent className="p-0">
              {unreadCount === 0 && notifications.length > 0 && (
                <div className="border-b border-border px-4 py-3">
                  <Alert variant="success" className="border-0 bg-transparent px-0 py-0">
                    You're all caught up — no unread notifications.
                  </Alert>
                </div>
              )}
              <ul aria-label="Notifications" className="max-h-[540px] overflow-y-auto">
                {filtered.map((n) => (
                  <NotificationRow
                    key={n.id}
                    notification={n}
                    selected={selected.has(n.id)}
                    onToggleSelect={() => toggleSelect(n.id)}
                    onMarkRead={() => {
                      markRead(n.id);
                      showNotice("Notification marked as read.");
                    }}
                    onMarkUnread={() => {
                      markUnread(n.id);
                      showNotice("Notification marked as unread.");
                    }}
                    onToggleImportant={() => toggleImportant(n.id)}
                    onDelete={() => deleteSingle(n.id)}
                  />
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </Tabs>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        <Copy className="h-3.5 w-3.5" aria-hidden />
        Demo workspace — notifications are local and reset on reload.
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete notifications"
        description={`Delete ${pendingDelete.length} selected notification${pendingDelete.length === 1 ? "" : "s"}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}