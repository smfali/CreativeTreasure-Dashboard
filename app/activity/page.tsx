"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity as ActivityIcon, Copy, Search } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import TableSkeleton from "@/components/TableSkeleton";
import { SystemActivityTimeline } from "@/components/notifications/SystemActivityTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeam } from "@/contexts/TeamContext";
import {
  activityWithin,
  getSystemActivity,
  moduleLabel,
  systemActivityTypeLabels,
  type ActivityDateRange,
  type SystemActivityType,
} from "@/lib/data/activity";
import { notificationModuleLabels, type NotificationModule } from "@/lib/data/notifications";

const ALL = "all";

const dateOptions: { value: ActivityDateRange; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

const moduleOptions = Object.keys(notificationModuleLabels) as NotificationModule[];
const typeOptions = Object.keys(systemActivityTypeLabels) as SystemActivityType[];

export default function ActivityPage() {
  const { members } = useTeam();

  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [module, setModule] = useState<string>(ALL);
  const [type, setType] = useState<string>(ALL);
  const [member, setMember] = useState<string>(ALL);
  const [dateRange, setDateRange] = useState<string>(ALL);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const activity = useMemo(() => getSystemActivity(), []);

  const memberNameById = useMemo(() => {
    const map = new Map<string, string>();
    members.forEach((m) => map.set(m.id, m.name));
    return map;
  }, [members]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activity.filter((event) => {
      if (module !== ALL && event.module !== module) return false;
      if (type !== ALL && event.type !== type) return false;
      if (member !== ALL && event.memberId !== member) return false;
      if (dateRange !== ALL && !activityWithin(event.date, dateRange as ActivityDateRange)) return false;
      if (q) {
        const haystack =
          `${event.action} ${event.resource} ${memberNameById.get(event.memberId) ?? ""} ${moduleLabel(event.module)} ${systemActivityTypeLabels[event.type]}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [activity, module, type, member, dateRange, query, memberNameById]);

  const filtersActive =
    query !== "" || module !== ALL || type !== ALL || member !== ALL || dateRange !== ALL;

  function clearFilters() {
    setQuery("");
    setModule(ALL);
    setType(ALL);
    setMember(ALL);
    setDateRange(ALL);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Activity" }]} />
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
        <Breadcrumb segments={[{ label: "Home" }, { label: "Activity" }]} />
        <div className="mt-2">
          <h1 className="heading-page">Activity centre</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            System-wide actions across products, orders, finance, marketing, customers and your team.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search activity..."
              aria-label="Search activity"
              className="pl-9"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select value={module} onChange={(e) => setModule(e.target.value)} aria-label="Filter by module">
              <option value={ALL}>All modules</option>
              {moduleOptions.map((m) => (
                <option key={m} value={m}>
                  {notificationModuleLabels[m]}
                </option>
              ))}
            </Select>
            <Select value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by activity type">
              <option value={ALL}>All activity types</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {systemActivityTypeLabels[t]}
                </option>
              ))}
            </Select>
            <Select value={member} onChange={(e) => setMember(e.target.value)} aria-label="Filter by member">
              <option value={ALL}>All members</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
            <Select value={dateRange} onChange={(e) => setDateRange(e.target.value)} aria-label="Filter by date">
              {dateOptions.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </Select>
          </div>
          {filtersActive && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
                {[
                  query !== "" && "Search",
                  module !== ALL && notificationModuleLabels[module as NotificationModule],
                  type !== ALL && systemActivityTypeLabels[type as SystemActivityType],
                  member !== ALL && memberNameById.get(member),
                  dateRange !== ALL && dateOptions.find((d) => d.value === dateRange)?.label,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} of {activity.length} events
          </p>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <EmptyState
              icon={ActivityIcon}
              title="No activity matches"
              description="Try a different search or filter."
              action={
                filtersActive ? (
                  <Button variant="secondary" onClick={clearFilters}>
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <SystemActivityTimeline activities={filtered.slice(0, 30)} members={members} />
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        <Copy className="h-3.5 w-3.5" aria-hidden />
        Demo workspace — activity is simulated and resets on reload.
      </div>
    </div>
  );
}