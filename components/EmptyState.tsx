import { Database, type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon = Database,
  title = "No data available",
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card
      className={`flex flex-col items-center justify-center gap-4 border-dashed bg-muted/40 p-12 ${className ?? ""}`}
    >
      <Icon className="h-10 w-10 text-muted-foreground/60" />
      <div className="text-center">
        <p className="text-sm text-muted-foreground">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action ?? <Button variant="primary">Connect Platform</Button>}
    </Card>
  );
}
