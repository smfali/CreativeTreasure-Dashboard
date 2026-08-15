import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { TeamActivityResult } from "@/lib/data/team";

const variants: Record<TeamActivityResult, BadgeProps["variant"]> = {
  success: "success",
  warning: "warning",
  error: "destructive",
  neutral: "default",
};

const labels: Record<TeamActivityResult, string> = {
  success: "Success",
  warning: "Warning",
  error: "Error",
  neutral: "Info",
};

export function TeamActivityResultBadge({ result }: { result: TeamActivityResult }) {
  return <Badge variant={variants[result]}>{labels[result]}</Badge>;
}