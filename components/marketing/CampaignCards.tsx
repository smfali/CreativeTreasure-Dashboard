"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Eye, Pencil, Copy, Archive, Megaphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CampaignStatusBadge } from "@/components/marketing/CampaignStatusBadge";
import { campaignChannelLabels, campaignObjectiveLabels, type Campaign } from "@/lib/data/marketing";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";

interface CampaignCardsProps {
  campaigns: Campaign[];
  symbol: string;
  onDuplicate: (id: string) => void;
  onArchive: (id: string) => void;
}

function formatRoi(roi: number): string {
  return roi > 0 ? `${roi.toFixed(1)}×` : "—";
}

export function CampaignCards({ campaigns, symbol, onDuplicate, onArchive }: CampaignCardsProps) {
  const router = useRouter();

  return (
    <div className="space-y-3">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={`/marketing/campaigns/${campaign.id}`}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {campaign.name}
              </Link>
              <p className="mt-0.5 text-xs text-muted-foreground">{campaignObjectiveLabels[campaign.objective]}</p>
            </div>
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
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <CampaignStatusBadge status={campaign.status} />
            <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-foreground">
              <Megaphone className="h-3 w-3" aria-hidden />
              {campaignChannelLabels[campaign.channel]}
            </span>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            {formatDate(campaign.startDate)}
            {campaign.endDate ? ` – ${formatDate(campaign.endDate)}` : ""} · {campaign.audience}
          </p>

          <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs text-muted-foreground">Reach</dt>
              <dd className="font-medium text-foreground">{campaign.reach > 0 ? formatNumber(campaign.reach) : "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Conversions</dt>
              <dd className="font-medium text-foreground">{campaign.conversions > 0 ? formatNumber(campaign.conversions) : "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Revenue</dt>
              <dd className="font-medium text-foreground">{campaign.revenue > 0 ? formatMoney(campaign.revenue, symbol) : "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">ROI</dt>
              <dd className="font-medium text-foreground">{formatRoi(campaign.roi)}</dd>
            </div>
          </dl>
        </Card>
      ))}
    </div>
  );
}