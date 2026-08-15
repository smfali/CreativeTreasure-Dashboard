"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { permissionGroups } from "@/lib/data/team";
import { cn } from "@/lib/utils";

interface PermissionMatrixProps {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}

export function PermissionMatrix({ value, onChange, disabled }: PermissionMatrixProps) {
  function togglePermission(key: string) {
    if (disabled) return;
    onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key]);
  }

  function toggleGroup(groupKeys: string[]) {
    if (disabled) return;
    const allSelected = groupKeys.every((k) => value.includes(k));
    const others = value.filter((k) => !groupKeys.includes(k));
    onChange(allSelected ? others : [...others, ...groupKeys]);
  }

  return (
    <div className="space-y-4">
      {permissionGroups.map((group) => {
        const groupKeys = group.permissions.map((p) => p.key);
        const granted = groupKeys.filter((k) => value.includes(k)).length;
        const allSelected = granted === groupKeys.length;
        const someSelected = granted > 0 && !allSelected;

        return (
          <div
            key={group.id}
            className="rounded-lg border border-border bg-muted/30 p-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={() => toggleGroup(groupKeys)}
                  disabled={disabled}
                  aria-label={`Select all ${group.label} permissions`}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{group.label}</p>
                  <p className="text-xs text-muted-foreground">{group.description}</p>
                </div>
              </div>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 self-start rounded-full border px-2.5 py-0.5 text-xs font-medium sm:self-auto",
                  allSelected
                    ? "border-success/30 bg-success/10 text-success"
                    : granted > 0
                      ? "border-warning/30 bg-warning/10 text-warning"
                      : "border-border bg-muted text-muted-foreground"
                )}
              >
                <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                {granted}/{groupKeys.length}
              </span>
            </div>

            <ul className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2">
              {group.permissions.map((permission) => {
                const checked = value.includes(permission.key);
                return (
                  <li key={permission.key}>
                    <label
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-md border border-transparent p-2.5 transition-colors hover:bg-muted/60",
                        disabled && "cursor-not-allowed opacity-60"
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        onChange={() => togglePermission(permission.key)}
                        disabled={disabled}
                        aria-label={permission.label}
                        className="mt-0.5"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-foreground">
                          {permission.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {permission.description}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}