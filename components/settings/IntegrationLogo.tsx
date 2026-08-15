import { cn } from "@/lib/utils";

interface IntegrationLogoProps {
  initials: string;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-9 w-9 rounded-lg text-xs",
  md: "h-11 w-11 rounded-xl text-sm",
  lg: "h-16 w-16 rounded-2xl text-xl",
} as const;

/** Brand-colored tile used for integration logos. */
export function IntegrationLogo({ initials, color, size = "md", className }: IntegrationLogoProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-bold text-white shadow-sm",
        sizes[size],
        className
      )}
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}