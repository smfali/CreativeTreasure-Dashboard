"use client";

import { CalendarRange } from "lucide-react";
import { financeRangeOptions, type FinanceRange } from "@/lib/data/finance";
import { cn } from "@/lib/utils";

interface FinanceRangePickerProps {
  value: FinanceRange;
  onChange: (value: FinanceRange) => void;
  label?: string;
}

export function FinanceRangePicker({ value, onChange, label = "Report period" }: FinanceRangePickerProps) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <CalendarRange className="h-4 w-4 text-muted-foreground" aria-hidden />
      {financeRangeOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            value === option.value
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground hover:text-foreground"
          )}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}