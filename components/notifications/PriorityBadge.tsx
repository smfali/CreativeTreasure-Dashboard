import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { notificationPriorityLabels, type NotificationPriority } from "@/lib/data/notifications";

export function PriorityBadge({ priority }: { priority: NotificationPriority }) {
  if (priority !== "high") return null;
  return (
    <Badge variant="destructive" title={`${notificationPriorityLabels[priority]} priority`}>
      <AlertTriangle className="h-3 w-3" aria-hidden />
      High priority
    </Badge>
  );
}