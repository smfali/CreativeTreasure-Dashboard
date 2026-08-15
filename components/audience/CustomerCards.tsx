"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoreHorizontal, Eye, Pencil, Tag, Archive } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CustomerStatusBadge } from "./CustomerStatusBadge";
import { formatMoney, formatDate, timeAgo } from "@/lib/format";
import type { Customer } from "@/lib/data/customers";

interface CustomerCardsProps {
  customers: Customer[];
  symbol: string;
  onEdit: (c: Customer) => void;
  onChangeStatus: (c: Customer) => void;
  onArchive: (c: Customer) => void;
}

export function CustomerCards({
  customers,
  symbol,
  onEdit,
  onChangeStatus,
  onArchive,
}: CustomerCardsProps) {
  const router = useRouter();

  return (
    <div className="space-y-3">
      {customers.map((c) => (
        <Card key={c.id} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={c.name} className="h-10 w-10 text-xs" />
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
            <div className="flex shrink-0 items-center gap-2">
              <CustomerStatusBadge status={c.status} />
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
                <DropdownMenuItem onClick={() => router.push(`/audience/${c.id}`)}>
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
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Location</dt>
              <dd className="mt-0.5 text-foreground">{c.location}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Orders</dt>
              <dd className="mt-0.5 text-foreground">{c.orders}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Total spent</dt>
              <dd className="mt-0.5 text-foreground">{formatMoney(c.totalSpent, symbol)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Last activity</dt>
              <dd className="mt-0.5 text-foreground">{timeAgo(c.lastActivity)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Joined</dt>
              <dd className="mt-0.5 text-foreground">{formatDate(c.joinedAt)}</dd>
            </div>
          </dl>
        </Card>
      ))}
    </div>
  );
}
