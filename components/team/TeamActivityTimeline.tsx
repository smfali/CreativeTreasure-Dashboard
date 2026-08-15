"use client";

import Link from "next/link";
import {
  LogIn,
  UserPlus,
  Package,
  ShoppingCart,
  Settings,
  Megaphone,
  ShieldCheck,
  Landmark,
  Users,
  type LucideIcon,
} from "lucide-react";
import { TeamActivityResultBadge } from "./TeamActivityResultBadge";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  teamActivityTypeLabels,
  type TeamActivity,
  type TeamActivityType,
  type TeamMember,
} from "@/lib/data/team";

const iconMeta: Record<TeamActivityType, { icon: LucideIcon; cls: string }> = {
  login: { icon: LogIn, cls: "bg-info/15 text-info" },
  member: { icon: UserPlus, cls: "bg-primary/15 text-primary" },
  product: { icon: Package, cls: "bg-success/15 text-success" },
  order: { icon: ShoppingCart, cls: "bg-warning/15 text-warning" },
  settings: { icon: Settings, cls: "bg-muted text-muted-foreground" },
  campaign: { icon: Megaphone, cls: "bg-info/15 text-info" },
  role: { icon: ShieldCheck, cls: "bg-primary/15 text-primary" },
  finance: { icon: Landmark, cls: "bg-success/15 text-success" },
  customer: { icon: Users, cls: "bg-muted text-muted-foreground" },
};

interface TeamActivityTimelineProps {
  activities: TeamActivity[];
  members: TeamMember[];
}

export function TeamActivityTimeline({ activities, members }: TeamActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">No activity recorded.</p>
    );
  }

  return (
    <ol className="relative space-y-5">
      <span aria-hidden className="absolute bottom-2 left-[19px] top-2 w-px bg-border" />
      {activities.map((event) => {
        const meta = iconMeta[event.type];
        const Icon = meta.icon;
        const member = members.find((m) => m.id === event.memberId);
        return (
          <li key={event.id} className="relative flex gap-4">
            <span
              className={cn(
                "z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                meta.cls
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
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
                <span className="font-medium">{event.resource}</span>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {teamActivityTypeLabels[event.type]} ·{" "}
                <time title={formatDate(event.date)}>{formatDate(event.date)}</time>
              </p>
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