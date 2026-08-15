"use client";

import Link from "next/link";
import { TeamActivityResultBadge } from "@/components/team/TeamActivityResultBadge";
import { NotificationIcon } from "./NotificationIcon";
import { ModuleBadge } from "./ModuleBadge";
import { formatDate } from "@/lib/format";
import type { SystemActivity } from "@/lib/data/activity";
import type { TeamMember } from "@/lib/data/team";

interface SystemActivityTimelineProps {
  activities: SystemActivity[];
  members: TeamMember[];
}

export function SystemActivityTimeline({ activities, members }: SystemActivityTimelineProps) {
  if (activities.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No activity recorded.</p>;
  }

  return (
    <ol className="relative space-y-5">
      <span aria-hidden className="absolute bottom-2 left-[19px] top-2 w-px bg-border" />
      {activities.map((event) => {
        const member = members.find((m) => m.id === event.memberId);
        return (
          <li key={event.id} className="relative flex gap-4">
            <span className="z-10 shrink-0">
              <NotificationIcon module={event.module} />
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-foreground">
                {member ? (
                  <Link
                    href={`/team/members/${member.id}`}
                    className="font-semibold text-foreground hover:text-primary"
                  >
                    {member.name}
                  </Link>
                ) : (
                  <span className="font-semibold">Unknown member</span>
                )}
                <span className="text-muted-foreground">{event.action}</span>
                {event.resourceHref ? (
                  <Link
                    href={event.resourceHref}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {event.resource}
                  </Link>
                ) : (
                  <span className="font-medium">{event.resource}</span>
                )}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <ModuleBadge module={event.module} />
                <span aria-hidden>·</span>
                <time title={formatDate(event.date)} dateTime={event.date}>
                  {formatDate(event.date)}
                </time>
              </div>
            </div>
            <div className="shrink-0 self-start pt-1">
              <TeamActivityResultBadge result={event.result} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}