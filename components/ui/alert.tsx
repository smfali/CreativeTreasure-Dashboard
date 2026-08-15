import type { HTMLAttributes, ReactNode } from "react";
import { CheckCircle2, Info, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  info: { icon: Info, cls: "border-info/30 bg-info/10 text-info" },
  success: { icon: CheckCircle2, cls: "border-success/30 bg-success/10 text-success" },
  warning: { icon: AlertTriangle, cls: "border-warning/30 bg-warning/10 text-warning" },
  destructive: { icon: XCircle, cls: "border-destructive/30 bg-destructive/10 text-destructive" },
} as const;

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
  action?: ReactNode;
}

export function Alert({
  className,
  variant = "info",
  action,
  children,
  ...props
}: AlertProps) {
  const { icon: Icon, cls } = variants[variant];

  return (
    <div
      role="alert"
      className={cn(
        "flex items-center gap-3 rounded-lg border px-5 py-3 text-sm",
        cls,
        className
      )}
      {...props}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <div className="flex-1">{children}</div>
      {action}
    </div>
  );
}
