import { Check, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { permissionGroups } from "@/lib/data/team";

interface PermissionGroupsReadonlyProps {
  keys: string[];
}

export function PermissionGroupsReadonly({ keys }: PermissionGroupsReadonlyProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {permissionGroups.map((group) => {
        const grantedCount = group.permissions.filter((p) => keys.includes(p.key)).length;
        const allGranted = grantedCount === group.permissions.length;
        return (
          <div key={group.id} className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground">{group.label}</p>
              <Badge variant={allGranted ? "success" : grantedCount > 0 ? "warning" : "outline"}>
                {grantedCount}/{group.permissions.length}
              </Badge>
            </div>
            <ul className="mt-3 space-y-1.5">
              {group.permissions.map((permission) => {
                const granted = keys.includes(permission.key);
                return (
                  <li key={permission.key} className="flex items-center gap-2 text-sm">
                    <span className={granted ? "text-success" : "text-muted-foreground"} aria-hidden>
                      {granted ? <Check className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                    </span>
                    <span className={granted ? "text-foreground" : "text-muted-foreground"}>
                      {permission.label}
                    </span>
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