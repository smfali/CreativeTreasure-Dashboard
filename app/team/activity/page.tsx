"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity as ActivityIcon, Copy } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import TableSkeleton from "@/components/TableSkeleton";
import { TeamNav } from "@/components/team/TeamNav";
import { TeamActivityTimeline } from "@/components/team/TeamActivityTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeam } from "@/contexts/TeamContext";
import { getTeamActivity, teamActivityTypeLabels, type TeamActivityType } from "@/lib/data/team";

const ALL = "all";

export default function ActivityPage() {
  const { members } = useTeam();

  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<string>(ALL);
  const [member, setMember] = useState<string>(ALL);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const activity = useMemo(() => getTeamActivity(members), [members]);

  const filtered = useMemo(
    () =>
      activity.filter((event) => {
        if (type !== ALL && event.type !== type) return false;
        if (member !== ALL && event.memberId !== member) return false;
        return true;
      }),
    [activity, type, member]
  );

  const typeOptions = Object.keys(teamActivityTypeLabels) as TeamActivityType[];

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Team", href: "/team" }, { label: "Activity" }]} />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-14" />
        <TableSkeleton rows={6} cols={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Team", href: "/team" }, { label: "Activity" }]} />
        <div className="mt-2">
          <h1 className="heading-page">Team activity</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A live view of actions taken across your workspace by team members.
          </p>
        </div>
      </div>

      <TeamNav />

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="Filter by activity type"
            className="sm:w-52"
          >
            <option value={ALL}>All activity types</option>
            {typeOptions.map((t) => (
              <option key={t} value={t}>
                {teamActivityTypeLabels[t]}
              </option>
            ))}
          </Select>
          <Select
            value={member}
            onChange={(e) => setMember(e.target.value)}
            aria-label="Filter by team member"
            className="sm:w-56"
          >
            <option value={ALL}>All members</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </Select>
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
              description="Try a different activity type or member."
            />
          ) : (
            <TeamActivityTimeline activities={filtered.slice(0, 30)} members={members} />
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