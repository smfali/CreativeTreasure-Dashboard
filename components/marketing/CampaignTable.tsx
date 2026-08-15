"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, MoreHorizontal, Eye, Pencil, Copy, Archive } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CampaignStatusBadge } from "@/components/marketing/CampaignStatusBadge";
import {
  campaignChannelLabels,
  campaignObjectiveLabels,
  type Campaign,
} from "@/lib/data/marketing";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";

export type CampaignSortKey = "name" | "status" | "startDate" | "reach" | "conversions" | "revenue" | "roi";

export interface CampaignSortState {
  key: CampaignSortKey;
  dir: "asc" | "desc";
}

interface CampaignTableProps {
  campaigns: Campaign[];
  symbol: string;
  sort: CampaignSortState;
  onSort: (key: CampaignSortKey) => void;
  onDuplicate: (id: string) => void;
  onArchive: (id: string) => void;
}

function SortableHead({
  label,
  sortKey,
  sort,
  onSort,
  className,
}: {
  label: string;
  sortKey: CampaignSortKey;
  sort: CampaignSortState;
  onSort: (key: CampaignSortKey) => void;
  className?: string;
}) {
  const active = sort.key === sortKey;
  const dir = active ? sort.dir : "asc";
  return (
    <TableHead className={className}>
      <button
        onClick={() => onSort(sortKey)}
        aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
        className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {label}
        {active ? (
          dir === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" aria-hidden />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5" aria-hidden />
        )}
      </button>
    </TableHead>
  );
}

function formatRoi(roi: number): string {
  return roi > 0 ? `${roi.toFixed(1)}×` : "—";
}

export function CampaignTable({ campaigns, symbol, sort, onSort, onDuplicate, onArchive }: CampaignTableProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortableHead label="Campaign" sortKey="name" sort={sort} onSort={onSort} />
          <TableHead>Channel</TableHead>
          <SortableHead label="Status" sortKey="status" sort={sort} onSort={onSort} />
          <TableHead>Audience</TableHead>
          <SortableHead label="Start date" sortKey="startDate" sort={sort} onSort={onSort} />
          <SortableHead label="Reach" sortKey="reach" sort={sort} onSort={onSort} className="text-right" />
          <SortableHead label="Conversions" sortKey="conversions" sort={sort} onSort={onSort} className="text-right" />
          <SortableHead label="Revenue" sortKey="revenue" sort={sort} onSort={onSort} className="text-right" />
          <SortableHead label="ROI" sortKey="roi" sort={sort} onSort={onSort} className="text-right" />
          <TableHead className="text-right">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign) => (
          <TableRow key={campaign.id}>
            <TableCell>
              <div className="min-w-0">
                <Link
                  href={`/marketing/campaigns/${campaign.id}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  {campaign.name}
                  <ExternalLink className="h-3 w-3" aria-hidden />
                </Link>
                <p className="text-xs text-muted-foreground">{campaignObjectiveLabels[campaign.objective]}</p>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{campaignChannelLabels[campaign.channel]}</Badge>
            </TableCell>
            <TableCell>
              <CampaignStatusBadge status={campaign.status} />
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">{campaign.audience}</TableCell>
            <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
              {formatDate(campaign.startDate)}
            </TableCell>
            <TableCell className="text-right text-sm font-medium text-foreground">
              {campaign.reach > 0 ? formatNumber(campaign.reach) : "—"}
            </TableCell>
            <TableCell className="text-right text-sm font-medium text-foreground">
              {campaign.conversions > 0 ? formatNumber(campaign.conversions) : "—"}
            </TableCell>
            <TableCell className="text-right text-sm font-medium text-foreground">
              {campaign.revenue > 0 ? formatMoney(campaign.revenue, symbol) : "—"}
            </TableCell>
            <TableCell className="text-right text-sm font-medium text-foreground">
              {formatRoi(campaign.roi)}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu
                align="end"
                triggerClassName="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                trigger={
                  <span className="inline-flex items-center justify-center">
                    <MoreHorizontal className="h-4 w-4" aria-hidden />
                    <span className="sr-only">Actions for {campaign.name}</span>
                  </span>
                }
              >
                <DropdownMenuItem onClick={() => router.push(`/marketing/campaigns/${campaign.id}`)}>
                  <Eye className="h-4 w-4" aria-hidden />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/marketing/campaigns/${campaign.id}/edit`)}>
                  <Pencil className="h-4 w-4" aria-hidden />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(campaign.id)}>
                  <Copy className="h-4 w-4" aria-hidden />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive hover:text-destructive" onClick={() => onArchive(campaign.id)}>
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