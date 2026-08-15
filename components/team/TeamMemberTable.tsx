"use client";

import Link from "next/link";
import { ArrowUp, ArrowDown, MoreHorizontal, Pencil, UserCog, Ban, UserCheck, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuItem, DropdownMenuHeader } from "@/components/ui/dropdown-menu";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { MemberStatusBadge } from "./MemberStatusBadge";
import { RoleBadge } from "./RoleBadge";
import { formatDate, timeAgo } from "@/lib/format";
import type { Role, TeamMember } from "@/lib/data/team";

export type MemberSortKey = "name" | "role" | "department" | "lastActive" | "joinedAt";

export interface MemberSortState {
  key: MemberSortKey;
  dir: "asc" | "desc";
}

interface TeamMemberTableProps {
  members: TeamMember[];
  roles: Role[];
  selected: Set<string>;
  allSelected: boolean;
  someSelected: boolean;
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  sort: MemberSortState;
  onSort: (key: MemberSortKey) => void;
  onEdit: (member: TeamMember) => void;
  onChangeRole: (member: TeamMember) => void;
  onSuspend: (member: TeamMember) => void;
  onReactivate: (member: TeamMember) => void;
  onRemove: (member: TeamMember) => void;
}

function SortIndicator({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return null;
  return dir === "asc" ? (
    <ArrowUp className="h-3 w-3" aria-hidden />
  ) : (
    <ArrowDown className="h-3 w-3" aria-hidden />
  );
}

export function TeamMemberTable({
  members,
  roles,
  selected,
  allSelected,
  someSelected,
  onToggleSelectAll,
  onToggleSelect,
  sort,
  onSort,
  onEdit,
  onChangeRole,
  onSuspend,
  onReactivate,
  onRemove,
}: TeamMemberTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <Checkbox
              ref={(el) => {
                if (el) el.indeterminate = someSelected && !allSelected;
              }}
              checked={allSelected}
              onChange={onToggleSelectAll}
              aria-label="Select all members"
            />
          </TableHead>
          {(
            [
              { key: "name", label: "Member" },
              { key: "role", label: "Role" },
              { key: "department", label: "Department" },
              { key: "lastActive", label: "Last active" },
              { key: "joinedAt", label: "Joined" },
            ] as { key: MemberSortKey; label: string }[]
          ).map((col) => {
            const active = sort.key === col.key;
            return (
              <TableHead
                key={col.key}
                aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
              >
                <button
                  type="button"
                  onClick={() => onSort(col.key)}
                  className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {col.label}
                  <SortIndicator active={active} dir={sort.dir} />
                </button>
              </TableHead>
            );
          })}
          <TableHead>Status</TableHead>
          <TableHead className="text-right">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => {
          const role = roles.find((r) => r.id === member.roleId);
          const isOwner = role?.protected;
          return (
            <TableRow key={member.id} className="group hover:bg-muted/50">
              <TableCell>
                <Checkbox
                  checked={selected.has(member.id)}
                  onChange={() => onToggleSelect(member.id)}
                  aria-label={`Select ${member.name}`}
                  disabled={isOwner}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar name={member.name} className="h-9 w-9 text-xs" />
                  <div className="min-w-0">
                    <Link
                      href={`/team/members/${member.id}`}
                      className="block truncate text-sm font-medium text-foreground hover:text-primary"
                    >
                      {member.name}
                    </Link>
                    <span className="block truncate text-xs text-muted-foreground">{member.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <RoleBadge role={role} />
              </TableCell>
              <TableCell className="text-muted-foreground">{member.department}</TableCell>
              <TableCell className="text-muted-foreground" title={formatDate(member.lastActive)}>
                {timeAgo(member.lastActive)}
              </TableCell>
              <TableCell className="text-muted-foreground">{formatDate(member.joinedAt)}</TableCell>
              <TableCell>
                <MemberStatusBadge status={member.status} />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu
                  align="end"
                  triggerClassName="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  trigger={
                    <span className="inline-flex items-center justify-center">
                      <MoreHorizontal className="h-4 w-4" aria-hidden />
                      <span className="sr-only">Actions for {member.name}</span>
                    </span>
                  }
                >
                  <DropdownMenuHeader>{member.name}</DropdownMenuHeader>
                  <DropdownMenuItem onClick={() => onEdit(member)}>
                    <Pencil className="h-4 w-4" aria-hidden />
                    Edit member
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onChangeRole(member)} disabled={isOwner}>
                    <UserCog className="h-4 w-4" aria-hidden />
                    Change role
                  </DropdownMenuItem>
                  {member.status === "suspended" ? (
                    <DropdownMenuItem onClick={() => onReactivate(member)} disabled={isOwner}>
                      <UserCheck className="h-4 w-4" aria-hidden />
                      Reactivate
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => onSuspend(member)} disabled={isOwner}>
                      <Ban className="h-4 w-4" aria-hidden />
                      Suspend member
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => onRemove(member)}
                    disabled={isOwner}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                    Remove member
                  </DropdownMenuItem>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}