"use client";

import { RotateCcw, Save, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormActionsProps {
  dirty: boolean;
  submitting?: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onReset?: () => void;
  saveLabel?: string;
  className?: string;
}

/** Shared Save / Discard / Reset footer used by every settings form. */
export function FormActions({
  dirty,
  submitting,
  onSave,
  onDiscard,
  onReset,
  saveLabel = "Save changes",
  className,
}: FormActionsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Button variant="primary" onClick={onSave} disabled={!dirty} loading={submitting}>
        <Save className="h-4 w-4" aria-hidden />
        {saveLabel}
      </Button>
      <Button variant="secondary" onClick={onDiscard} disabled={!dirty}>
        <Undo2 className="h-4 w-4" aria-hidden />
        Discard
      </Button>
      {onReset && (
        <Button variant="ghost" onClick={onReset}>
          <RotateCcw className="h-4 w-4" aria-hidden />
          Reset to defaults
        </Button>
      )}
    </div>
  );
}