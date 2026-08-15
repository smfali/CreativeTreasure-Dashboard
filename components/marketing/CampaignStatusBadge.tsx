import { PenLine, CalendarClock, PlayCircle, PauseCircle, CheckCircle2 } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { campaignStatusLabels, type CampaignStatus } from "@/lib/data/marketing";

const meta: Record<CampaignStatus, { variant: BadgeProps["variant"]; icon: typeof PlayCircle }> = {
  draft: { variant: "outline", icon: PenLine },
  scheduled: { variant: "info", icon: CalendarClock },
  active: { variant: "success", icon: PlayCircle },
  paused: { variant: "warning", icon: PauseCircle },
  completed: { variant: "default", icon: CheckCircle2 },
};

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const { variant, icon: Icon } = meta[status];
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" aria-hidden />
      <span className="sr-only">Campaign status:</span>
      {campaignStatusLabels[status]}
    </Badge>
  );
}