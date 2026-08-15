import { Badge, type BadgeProps } from "@/components/ui/badge";
import { memberStatusLabels, type MemberStatus } from "@/lib/data/team";

const variants: Record<MemberStatus, BadgeProps["variant"]> = {
  active: "success",
  invited: "info",
  suspended: "warning",
};

export function MemberStatusBadge({ status }: { status: MemberStatus }) {
  return (
    <Badge variant={variants[status]}>
      <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {memberStatusLabels[status]}
    </Badge>
  );
}