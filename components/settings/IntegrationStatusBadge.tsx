import { Badge } from "@/components/ui/badge";

export function IntegrationStatusBadge({ status }: { status: "connected" | "disconnected" }) {
  return status === "connected" ? (
    <Badge variant="success">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      Connected
    </Badge>
  ) : (
    <Badge variant="default" className="text-muted-foreground">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
      Not connected
    </Badge>
  );
}