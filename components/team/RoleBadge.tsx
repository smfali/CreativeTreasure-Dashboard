import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { Role } from "@/lib/data/team";

const roleTone: Record<string, BadgeProps["variant"]> = {
  "role-owner": "primary",
  "role-admin": "info",
  "role-manager": "success",
  "role-editor": "warning",
  "role-analyst": "outline",
  "role-support": "default",
};

export function RoleBadge({ role }: { role: Role | undefined }) {
  return (
    <Badge variant={role ? roleTone[role.id] ?? "outline" : "outline"}>
      {role?.name ?? "Unknown role"}
    </Badge>
  );
}