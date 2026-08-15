import { getPermissionSummary } from "@/lib/data/team";

export function PermissionSummary({ keys, className }: { keys: string[]; className?: string }) {
  const groups = getPermissionSummary(keys);
  const granted = keys.length;
  const total = groups.reduce((sum, g) => sum + g.total, 0);

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-1.5">
        {groups.map((group) => {
          const complete = group.granted === group.total;
          const partial = group.granted > 0;
          return (
            <span
              key={group.id}
              title={`${group.label}: ${group.granted}/${group.total}`}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                complete
                  ? "border-success/30 bg-success/10 text-success"
                  : partial
                    ? "border-warning/30 bg-warning/10 text-warning"
                    : "border-border bg-muted text-muted-foreground"
              }`}
            >
              <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              {group.label} {group.granted}/{group.total}
            </span>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {granted} of {total} permissions granted
      </p>
    </div>
  );
}