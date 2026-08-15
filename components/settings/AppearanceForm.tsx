"use client";

import { useEffect, useState } from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { SectionCard } from "@/components/settings/SectionCard";
import { useAccent, accentOptions } from "@/contexts/AccentContext";
import { cn } from "@/lib/utils";

const themeOptions = [
  { value: "light", label: "Light", description: "Use the light theme", icon: Sun },
  { value: "dark", label: "Dark", description: "Use the dark theme", icon: Moon },
  { value: "system", label: "System", description: "Follow your device setting", icon: Monitor },
] as const;

export function AppearanceForm() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { accent, setAccent } = useAccent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const activeTheme = mounted && theme ? theme : "dark";

  return (
    <SectionCard
      title="Appearance"
      description="Customise how the dashboard looks. Changes apply instantly across the whole app."
    >
      <fieldset>
        <legend className="text-label">Theme</legend>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {themeOptions.map((opt) => {
            const selected = activeTheme === opt.value;
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setTheme(opt.value)}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors",
                  selected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted"
                )}
              >
                <span className="flex w-full items-center justify-between">
                  <Icon className="h-5 w-5 text-muted-foreground" aria-hidden />
                  {selected && <Check className="h-4 w-4 text-primary" aria-hidden />}
                </span>
                <span className="heading-section text-foreground">{opt.label}</span>
                <span className="text-sm text-muted-foreground">{opt.description}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <p className="text-label">Accent colour</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {accentOptions.map((c) => {
            const selected = accent === c.rgb;
            return (
              <button
                key={c.rgb}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={`Set accent to ${c.label}`}
                onClick={() => setAccent(c.rgb)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition",
                  selected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:scale-110"
                )}
                style={{ backgroundColor: `rgb(${c.rgb})` }}
              >
                {selected && <Check className="h-4 w-4 text-white" aria-hidden />}
              </button>
            );
          })}
          <span className="sr-only" aria-live="polite">
            Accent colour set to {accentOptions.find((c) => c.rgb === accent)?.label ?? "custom"}
          </span>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted/40 p-4">
        <p className="heading-section text-foreground">Preview</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Currently {resolvedTheme === "dark" ? "dark" : "light"} mode with an accent dot below.
        </p>
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <span
            className="h-8 w-8 rounded-full"
            style={{ backgroundColor: `rgb(${accent})` }}
            aria-hidden
          />
          <div className="flex-1 space-y-1.5">
            <span className="block h-2 w-32 rounded-full bg-muted-foreground/30" />
            <span className="block h-2 w-20 rounded-full bg-muted-foreground/20" />
          </div>
          <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
            {mounted ? resolvedTheme : "dark"}
          </span>
        </div>
      </div>
    </SectionCard>
  );
}