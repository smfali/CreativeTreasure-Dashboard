"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUp, ArrowDown, MoreHorizontal, Eye, Pencil, Tag, Archive } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { CustomerStatusBadge } from "./CustomerStatusBadge";
import { formatMoney, formatDate, timeAgo } from "@/lib/format";
import type { Customer } from "@/lib/data/customers";

export type SortKey = "name" | "location" | "orders" | "totalSpent" | "lastActivity" | "joinedAt";

export interface SortState {
  key: SortKey;
  dir: "asc" | "desc";
}

interface CustomerTableProps {
  customers: Customer[];
  selected: Set<string>;
  allSelected: boolean;
  someSelected: boolean;
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  sort: SortState;
  onSort: (key: SortKey) => void;
  symbol: string;
  onEdit: (c: Customer) => void;
  onChangeStatus: (c: Customer) => void;
  onArchive: (c: Customer) => void;
}

function SortIndicator({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return null;
  return dir === "asc" ? (
    <ArrowUp className="h-3 w-3" aria-hidden />
  ) : (
    <ArrowDown className="h-3 w-3" aria-hidden />
  );
}

export function CustomerTable({
  customers,
  selected,
  allSelected,
  someSelected,
  onToggleSelectAll,
  onToggleSelect,
  sort,
  onSort,
  symbol,
  onEdit,
  onChangeStatus,
  onArchive,
}: CustomerTableProps) {
  const router = useRouter();

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
              aria-label="Select all customers"
            />
          </TableHead>
          {(
            [
              { key: "name", label: "Customer" },
              { key: "location", label: "Location" },
              { key: "orders", label: "Orders" },
              { key: "totalSpent", label: "Total spent" },
              { key: "lastActivity", label: "Last activity" },
            ] as { key: SortKey; label: string }[]
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
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((c) => (
          <TableRow key={c.id} className="group hover:bg-muted/50">
            <TableCell>
              <Checkbox
                checked={selected.has(c.id)}
                onChange={() => onToggleSelect(c.id)}
                aria-label={`Select ${c.name}`}
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar name={c.name} className="h-9 w-9 text-xs" />
                <div className="min-w-0">
                  <Link
                    href={`/audience/${c.id}`}
                    className="block truncate text-sm font-medium text-foreground hover:text-primary"
                  >
                    {c.name}
                  </Link>
                  <span className="block truncate text-xs text-muted-foreground">{c.email}</span>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{c.location}</TableCell>
            <TableCell className="text-foreground">{c.orders}</TableCell>
            <TableCell className="text-foreground">{formatMoney(c.totalSpent, symbol)}</TableCell>
            <TableCell className="text-muted-foreground" title={formatDate(c.lastActivity)}>
              {timeAgo(c.lastActivity)}
            </TableCell>
            <TableCell>
              <CustomerStatusBadge status={c.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">{formatDate(c.joinedAt)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu
                align="end"
                triggerClassName="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                trigger={
                  <span className="inline-flex items-center justify-center">
                    <MoreHorizontal className="h-4 w-4" aria-hidden />
                    <span className="sr-only">Actions for {c.name}</span>
                  </span>
                }
              >
                <DropdownMenuItem
                  onClick={() => router.push(`/audience/${c.id}`)}
                  className="text-foreground"
                >
                  <Eye className="h-4 w-4" aria-hidden />
                  View customer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(c)}>
                  <Pencil className="h-4 w-4" aria-hidden />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onChangeStatus(c)}>
                  <Tag className="h-4 w-4" aria-hidden />
                  Change status
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onArchive(c)}
                  className="text-destructive hover:text-destructive"
                >
                  <Archive className="h-4 w-4" aria-hidden />
                  Archive
                </DropdownMenuItem>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
