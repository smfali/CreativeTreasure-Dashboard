"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, SearchX, Tag, Archive, Users, X } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import MetricCard from "@/components/MetricCard";
import CustomerGrowthChart from "@/components/audience/CustomerGrowthChart";
import { CustomerTable, type SortKey, type SortState } from "@/components/audience/CustomerTable";
import { CustomerCards } from "@/components/audience/CustomerCards";
import { CustomerFormDialog } from "@/components/audience/CustomerFormDialog";
import { ChangeStatusDialog } from "@/components/audience/ChangeStatusDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import TableSkeleton from "@/components/TableSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomers } from "@/contexts/CustomersContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatNumber } from "@/lib/format";
import { statusLabels, type Customer, type CustomerStatus } from "@/lib/data/customers";

const PAGE_SIZE = 8;
const ALL_STATUS = "all";

function compare(a: Customer, b: Customer, key: SortKey, dir: "asc" | "desc"): number {
  let res = 0;
  switch (key) {
    case "name":
      res = a.name.localeCompare(b.name);
      break;
    case "location":
      res = a.location.localeCompare(b.location);
      break;
    case "orders":
      res = a.orders - b.orders;
      break;
    case "totalSpent":
      res = a.totalSpent - b.totalSpent;
      break;
    case "lastActivity":
      res = a.lastActivity.localeCompare(b.lastActivity);
      break;
    case "joinedAt":
      res = a.joinedAt.localeCompare(b.joinedAt);
      break;
  }
  return dir === "asc" ? res : -res;
}

function MetricCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-4 w-14" />
      </div>
    </Card>
  );
}

export default function AudiencePage() {
  const { customers, addCustomer, updateCustomer, archiveCustomer } = useCustomers();
  const { symbol } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CustomerStatus | typeof ALL_STATUS>(ALL_STATUS);
  const [period, setPeriod] = useState("all");
  const [sort, setSort] = useState<SortState>({ key: "lastActivity", dir: "desc" });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [formOpen, setFormOpen] = useState(false);
  const [formCustomer, setFormCustomer] = useState<Customer | null>(null);
  const [statusTarget, setStatusTarget] = useState<Customer | null>(null);
  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<Customer | null>(null);
  const [bulkArchiveOpen, setBulkArchiveOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setPage(1);
    setSelected(new Set());
  }, [search, status, period, sort.key, sort.dir]);

  const activeCustomers = useMemo(() => customers.filter((c) => !c.archived), [customers]);

  const metrics = useMemo(() => {
    const now = Date.now();
    const thirtyDays = 30 * 864e5;
    const total = activeCustomers.length;
    const activeCount = activeCustomers.filter((c) => c.status === "active" || c.status === "vip").length;
    const newCount = activeCustomers.filter((c) => c.status === "new").length;
    const returning = activeCustomers.filter(
      (c) => c.orders > 0 && c.status !== "new" && now - new Date(c.lastActivity).getTime() <= thirtyDays
    ).length;
    return { total, activeCount, newCount, returning };
  }, [activeCustomers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const periodDays = period === "30" ? 30 : period === "90" ? 90 : 0;
    const cutoff = periodDays > 0 ? Date.now() - periodDays * 864e5 : null;

    return activeCustomers
      .filter((c) => {
        if (status !== ALL_STATUS && c.status !== status) return false;
        if (cutoff && new Date(c.joinedAt).getTime() < cutoff) return false;
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          (c.tags ?? []).some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => compare(a, b, sort.key, sort.dir));
  }, [activeCustomers, search, status, period, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const selectedCustomers = useMemo(
    () => activeCustomers.filter((c) => selected.has(c.id)),
    [activeCustomers, selected]
  );

  const allSelected =
    filtered.length > 0 && filtered.every((c) => selected.has(c.id));
  const someSelected = filtered.some((c) => selected.has(c.id));

  const hasFilters = search.trim() !== "" || status !== ALL_STATUS || period !== "all";

  function clearFilters() {
    setSearch("");
    setStatus(ALL_STATUS);
    setPeriod("all");
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) filtered.forEach((c) => next.delete(c.id));
      else filtered.forEach((c) => next.add(c.id));
      return next;
    });
  }

  function applyStatus(statusToSet: CustomerStatus) {
    if (statusTarget) {
      updateCustomer(statusTarget.id, { status: statusToSet });
    } else {
      selectedCustomers.forEach((c) => updateCustomer(c.id, { status: statusToSet }));
    }
  }

  function applyArchive() {
    if (archiveTarget) {
      archiveCustomer(archiveTarget.id);
      selected.delete(archiveTarget.id);
    } else {
      selectedCustomers.forEach((c) => archiveCustomer(c.id));
      setSelected(new Set());
    }
  }

  function openAdd() {
    setFormCustomer(null);
    setFormOpen(true);
  }

  function openEdit(c: Customer) {
    setFormCustomer(c);
    setFormOpen(true);
  }

  function openChangeStatus(c: Customer) {
    setStatusTarget(c);
    setBulkStatusOpen(true);
  }

  function openArchive(c: Customer) {
    setArchiveTarget(c);
    setBulkArchiveOpen(true);
  }

  const start = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, filtered.length);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Audience" }]} />
        <h1 className="heading-page">Audience</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
        <Card className="p-6">
          <Skeleton className="mb-4 h-3 w-40" />
          <Skeleton className="h-56 w-full" />
        </Card>
        <TableSkeleton rows={6} cols={6} />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <Breadcrumb segments={[{ label: "Home" }, { label: "Audience" }]} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="heading-page">Audience</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and understand the people who support your work.
          </p>
        </div>
        <Button variant="primary" onClick={openAdd} className="shrink-0">
          <Plus className="h-4 w-4" aria-hidden />
          Add customer
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard title="Total customers" value={formatNumber(metrics.total)} change="+12.4%" positive />
        <MetricCard title="Active customers" value={formatNumber(metrics.activeCount)} change="+8.2%" positive />
        <MetricCard title="New customers" value={formatNumber(metrics.newCount)} change="+5.1%" positive />
        <MetricCard title="Returning" value={formatNumber(metrics.returning)} change="+3.4%" positive />
      </div>

      <CustomerGrowthChart />

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
          <div className="relative md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers…"
              aria-label="Search customers"
              className="pl-9"
            />
          </div>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as CustomerStatus | typeof ALL_STATUS)}
            aria-label="Filter by status"
            className="md:w-44"
          >
            <option value={ALL_STATUS}>All statuses</option>
            {(Object.keys(statusLabels) as CustomerStatus[]).map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </Select>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            aria-label="Filter by join date"
            className="md:w-44"
          >
            <option value="all">All time</option>
            <option value="30">Joined last 30 days</option>
            <option value="90">Joined last 90 days</option>
          </Select>
          {hasFilters && (
            <Button variant="ghost" onClick={clearFilters} className="shrink-0">
              <X className="h-4 w-4" aria-hidden />
              Clear filters
            </Button>
          )}
        </CardContent>
      </Card>

      {selected.size > 0 && (
        <Card className="border-primary/40 bg-primary/5">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-foreground">
              {selected.size} selected
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setStatusTarget(null);
                  setBulkStatusOpen(true);
                }}
              >
                <Tag className="h-4 w-4" aria-hidden />
                Change status
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setArchiveTarget(null);
                  setBulkArchiveOpen(true);
                }}
              >
                <Archive className="h-4 w-4" aria-hidden />
                Archive
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
                Clear selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeCustomers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Add your first customer to start building your audience list."
          action={
            <Button variant="primary" onClick={openAdd}>
              Add customer
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No customers found"
          description="Try adjusting your search or filters."
          action={
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <div className="hidden md:block">
            <Card>
              <CustomerTable
                customers={pageRows}
                selected={selected}
                allSelected={allSelected}
                someSelected={someSelected}
                onToggleSelectAll={toggleSelectAll}
                onToggleSelect={toggleSelect}
                sort={sort}
                onSort={(key) =>
                  setSort((prev) =>
                    prev.key === key
                      ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
                      : { key, dir: "asc" }
                  )
                }
                symbol={symbol}
                onEdit={openEdit}
                onChangeStatus={openChangeStatus}
                onArchive={openArchive}
              />
              <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {start}–{end} of {filtered.length}
                </p>
                <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
              </div>
            </Card>
          </div>

          <div className="md:hidden">
            <CustomerCards
              customers={pageRows}
              symbol={symbol}
              onEdit={openEdit}
              onChangeStatus={openChangeStatus}
              onArchive={openArchive}
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {start}–{end} of {filtered.length}
              </p>
              <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
            </div>
          </div>
        </>
      )}

      <CustomerFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        customer={formCustomer ?? undefined}
        onSave={(values) => {
          if (formCustomer) {
            updateCustomer(formCustomer.id, values);
          } else {
            addCustomer(values);
          }
        }}
      />

      <ChangeStatusDialog
        open={bulkStatusOpen}
        onClose={() => setBulkStatusOpen(false)}
        customers={statusTarget ? [statusTarget] : selectedCustomers}
        onConfirm={applyStatus}
      />

      <ConfirmDialog
        open={bulkArchiveOpen}
        onClose={() => setBulkArchiveOpen(false)}
        title={archiveTarget ? `Archive ${archiveTarget.name}?` : `Archive ${selected.size} customers?`}
        description={
          archiveTarget
            ? "This customer will be hidden from your audience list. You can restore them anytime."
            : "These customers will be hidden from your audience list. You can restore them anytime."
        }
        confirmLabel="Archive"
        destructive
        onConfirm={applyArchive}
      />
    </div>
  );
}
