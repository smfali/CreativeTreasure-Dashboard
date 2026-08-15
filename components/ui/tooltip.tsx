"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: ReactNode;
  contentClassName?: string;
}

export function Tooltip({ content, children, contentClassName }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          id={id}
          role="tooltip"
          className={cn(
            "pointer-events-none absolute bottom-full left-0 z-10 mb-2 w-56 rounded-lg border border-border bg-foreground px-3 py-2 text-xs text-background shadow-md",
            contentClassName
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
