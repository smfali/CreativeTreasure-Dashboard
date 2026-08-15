"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SearchX, X, CheckCircle2, Tag, Plus } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import TableSkeleton from "@/components/TableSkeleton";
import EmptyState from "@/components/EmptyState";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { CouponTable } from "@/components/marketing/CouponTable";
import { CouponCards } from "@/components/marketing/CouponCards";
import { CouponFormDialog } from "@/components/marketing/CouponFormDialog";
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
  couponStatusLabels,
  type Coupon,
  type CouponStatus,
} from "@/lib/data/marketing";
import { formatNumber } from "@/lib/format";

const ALL = "all";
const PAGE_SIZE = 6;

export default function PromotionsPage() {
  const { coupons, createCoupon, updateCoupon, deleteCoupon, toggleCoupon } = useMarketing();
  const { symbol } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CouponStatus | typeof ALL>(ALL);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
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
  }, [search, status]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return coupons
      .filter((c) => {
        if (status !== ALL && c.status !== status) return false;
        if (!query) return true;
        return (
          c.code.toLowerCase().includes(query) ||
          (c.description ?? "").toLowerCase().includes(query)
        );
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [coupons, search, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const filterCount = (status !== ALL ? 1 : 0) + (search.trim() ? 1 : 0);

  function clearFilters() {
    setSearch("");
    setStatus(ALL);
  }

  function openCreate() {
    setEditing(undefined);
    setDialogOpen(true);
  }

  function openEdit(coupon: Coupon) {
    setEditing(coupon);
    setDialogOpen(true);
  }

  function handleToggle(id: string) {
    const target = coupons.find((c) => c.id === id);
    if (!target) return;
    const result = toggleCoupon(id);
    if (result) {
      setNotice(result.status === "active" ? `${result.code} activated.` : `${result.code} deactivated.`);
    }
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteCoupon(deleteTarget.id);
    setNotice(`Deleted ${deleteTarget.code}.`);
    setDeleteTarget(null);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-14" />
        <TableSkeleton rows={5} cols={7} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb segments={[{ label: "Home" }, { label: "Marketing" }, { label: "Coupons & Promotions" }]} />
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="heading-page">Coupons &amp; Promotions</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and manage coupon codes. Local demo only — no real codes are issued.
            </p>
          </div>
          <Button className="gap-2" onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden />
            New coupon
          </Button>
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
        <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search coupons"
              placeholder="Search by code or description…"
              className="pl-9"
            />
          </div>
          <Select value={status} onChange={(e) => setStatus(e.target.value as CouponStatus | typeof ALL)} aria-label="Filter by status">
            <option value={ALL}>All statuses</option>
            {(Object.keys(couponStatusLabels) as CouponStatus[]).map((s) => (
              <option key={s} value={s}>
                {couponStatusLabels[s]}
              </option>
            ))}
          </Select>
          <div className="flex items-center justify-end">
            {filterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4" aria-hidden />
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Showing {formatNumber(filtered.length)} {filtered.length === 1 ? "coupon" : "coupons"}
      </p>

      {coupons.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="No coupons yet"
          description="Create your first coupon code to start promoting products."
          action={
            <Button variant="primary" onClick={openCreate}>
              Create coupon
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No coupons found"
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
              <CouponTable
                coupons={pageRows}
                symbol={symbol}
                onEdit={openEdit}
                onToggle={handleToggle}
                onDelete={(id) => {
                  const target = coupons.find((c) => c.id === id);
                  if (target) setDeleteTarget(target);
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
            <CouponCards
              coupons={pageRows}
              symbol={symbol}
              onEdit={openEdit}
              onToggle={handleToggle}
              onDelete={(id) => {
                const target = coupons.find((c) => c.id === id);
                if (target) setDeleteTarget(target);
              }}
            />
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

      <CouponFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode={editing ? "edit" : "create"}
        initial={editing}
        symbol={symbol}
        onSubmit={(input) => {
          if (editing) {
            const updated = updateCoupon(editing.id, input);
            if (updated) setNotice(`Updated ${updated.code}.`);
          } else {
            const created = createCoupon(input);
            setNotice(`Created ${created.code}.`);
          }
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.code}?`}
        description={`Delete coupon "${deleteTarget?.code}"? This is a local demo action and cannot be undone.`}
        confirmLabel="Delete coupon"
        destructive
        onConfirm={handleDelete}
      />
    </div>
  );
}