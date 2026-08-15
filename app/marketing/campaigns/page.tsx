"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Megaphone, Search, SearchX, X, CheckCircle2 } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import TableSkeleton from "@/components/TableSkeleton";
import EmptyState from "@/components/EmptyState";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { CampaignTable, type CampaignSortKey, type CampaignSortState } from "@/components/marketing/CampaignTable";
import { CampaignCards } from "@/components/marketing/CampaignCards";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { Pagination } from "@/components/ui/pagination";
import { useMarketing } from "@/contexts/MarketingContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  campaignChannelLabels,
  campaignStatusLabels,
  type Campaign,
  type CampaignChannel,
  type CampaignStatus,
} from "@/lib/data/marketing";
import { formatNumber } from "@/lib/format";

const ALL = "all";
const PAGE_SIZE = 8;

function ArchiveNotice({ onNotice }: { onNotice: (message: string) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const archived = searchParams.get("archived");
    if (!archived) return;
    onNotice(`Archived ${archived}.`);
    const url = new URL(window.location.href);
    url.searchParams.delete("archived");
    window.history.replaceState({}, "", url.toString());
  }, [searchParams, onNotice]);
  return null;
}

export default function CampaignsPage() {
  const { campaigns, deleteCampaign, duplicateCampaign } = useMarketing();
  const { symbol } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CampaignStatus | typeof ALL>(ALL);
  const [channel, setChannel] = useState<CampaignChannel | typeof ALL>(ALL);
  const [sort, setSort] = useState<CampaignSortState>({ key: "startDate", dir: "desc" });
  const [page, setPage] = useState(1);
  const [archiveTarget, setArchiveTarget] = useState<Campaign | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    setPage(1);
  }, [search, status, channel, sort]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return campaigns
      .filter((c) => {
        if (status !== ALL && c.status !== status) return false;
        if (channel !== ALL && c.channel !== channel) return false;
        if (!query) return true;
        return (
          c.name.toLowerCase().includes(query) ||
          c.audience.toLowerCase().includes(query) ||
          campaignStatusLabels[c.status].toLowerCase().includes(query) ||
          campaignChannelLabels[c.channel].toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const key = sort.key;
        const dir = sort.dir === "asc" ? 1 : -1;
        const av = a[key];
        const bv = b[key];
        const cmp = typeof av === "string" ? av.localeCompare(String(bv)) : Number(av) - Number(bv);
        return cmp * dir;
      });
  }, [campaigns, search, status, channel, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const filterCount = (status !== ALL ? 1 : 0) + (channel !== ALL ? 1 : 0) + (search.trim() ? 1 : 0);

  function clearFilters() {
    setSearch("");
    setStatus(ALL);
    setChannel(ALL);
  }

  function handleSort(key: CampaignSortKey) {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  }

  function handleDuplicate(id: string) {
    const copy = duplicateCampaign(id);
    if (copy) setNotice(`Duplicated ${copy.name} as a draft.`);
  }

  function handleArchive() {
    if (!archiveTarget) return;
    deleteCampaign(archiveTarget.id);
    setNotice(`Archived ${archiveTarget.name}.`);
    setArchiveTarget(null);
  }

  if (loading) {
    return (
      <div className="p-4 space-y-6 sm:p-8">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Marketing" }, { label: "Campaigns" }]} />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-14" />
        <TableSkeleton rows={6} cols={9} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <ArchiveNotice onNotice={setNotice} />
      </Suspense>
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Marketing" }, { label: "Campaigns" }]} />
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="heading-page">Campaigns</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Plan, run and track marketing campaigns for CreativeTreasury.
            </p>
          </div>
          <Link href="/marketing/campaigns/new">
            <Button className="gap-2">
              <Megaphone className="h-4 w-4" aria-hidden />
              New campaign
            </Button>
          </Link>
        </div>
      </div>

      <MarketingNav />

      {notice && (
        <Alert variant="success">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            {notice}
          </span>
        </Alert>
      )}

      <Card>
        <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative sm:col-span-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search campaigns"
              placeholder="Search by name, audience or objective…"
              className="pl-9"
            />
          </div>
          <Select value={status} onChange={(e) => setStatus(e.target.value as CampaignStatus | typeof ALL)} aria-label="Filter by status">
            <option value={ALL}>All statuses</option>
            {(Object.keys(campaignStatusLabels) as CampaignStatus[]).map((s) => (
              <option key={s} value={s}>
                {campaignStatusLabels[s]}
              </option>
            ))}
          </Select>
          <Select value={channel} onChange={(e) => setChannel(e.target.value as CampaignChannel | typeof ALL)} aria-label="Filter by channel">
            <option value={ALL}>All channels</option>
            {(Object.keys(campaignChannelLabels) as CampaignChannel[]).map((ch) => (
              <option key={ch} value={ch}>
                {campaignChannelLabels[ch]}
              </option>
            ))}
          </Select>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing {formatNumber(filtered.length)} {filtered.length === 1 ? "campaign" : "campaigns"}
        </p>
        <div className="flex items-center gap-3">
          {filterCount > 0 && (
            <span
              className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
              aria-label={`${filterCount} active filter${filterCount === 1 ? "" : "s"}`}
            >
              {filterCount} active
            </span>
          )}
          {filterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4" aria-hidden />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {campaigns.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No campaigns yet"
          description="Create your first campaign to start driving revenue."
          action={
            <Link href="/marketing/campaigns/new">
              <Button variant="primary">Create campaign</Button>
            </Link>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No campaigns found"
          description="Try adjusting your search or filters."
          action={
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <div className="hidden xl:block">
            <Card>
              <CampaignTable
                campaigns={pageRows}
                symbol={symbol}
                sort={sort}
                onSort={handleSort}
                onDuplicate={handleDuplicate}
                onArchive={(id) => {
                  const target = campaigns.find((c) => c.id === id);
                  if (target) setArchiveTarget(target);
                }}
              />
              <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, filtered.length)} of {formatNumber(filtered.length)}
                </p>
                <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
              </div>
            </Card>
          </div>

          <div className="xl:hidden">
            <CampaignCards campaigns={pageRows} symbol={symbol} onDuplicate={handleDuplicate} onArchive={(id) => {
              const target = campaigns.find((c) => c.id === id);
              if (target) setArchiveTarget(target);
            }} />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, filtered.length)} of {formatNumber(filtered.length)}
              </p>
              <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={Boolean(archiveTarget)}
        onClose={() => setArchiveTarget(null)}
        title="Archive campaign"
        description={`Archive "${archiveTarget?.name}"? It will be removed from your campaign list. This is a local demo action and cannot be undone.`}
        confirmLabel="Archive campaign"
        destructive
        onConfirm={handleArchive}
      />
    </div>
  );
}