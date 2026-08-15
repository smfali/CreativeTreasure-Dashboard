import { Badge, type BadgeProps } from "@/components/ui/badge";
import { invitationStatusLabels, type InvitationStatus } from "@/lib/data/team";

const variants: Record<InvitationStatus, BadgeProps["variant"]> = {
  pending: "info",
  expired: "warning",
  cancelled: "default",
};

export function InvitationStatusBadge({ status }: { status: InvitationStatus }) {
  return <Badge variant={variants[status]}>{invitationStatusLabels[status]}</Badge>;
}