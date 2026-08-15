"use client";

import { useTheme } from "next-themes";

export function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return {
    dark,
    gridStroke: dark ? "#27272a" : "#e4e4e7",
    tickFill: dark ? "#a1a1aa" : "#71717a",
    axisStroke: dark ? "#27272a" : "#e4e4e7",
    tooltipStyle: dark
      ? { backgroundColor: "#18181b", border: "1px solid #3f3f46", color: "#f4f4f5" }
      : { backgroundColor: "#ffffff", border: "1px solid #e4e4e7", color: "#18181b" },
    colors: {
      primary: "#6366f1",
      success: "#10b981",
      warning: "#f59e0b",
      pink: "#ec4899",
      muted: dark ? "#52525b" : "#a1a1aa",
      faintMuted: dark ? "#3f3f46" : "#d4d4d8",
    },
  };
}
