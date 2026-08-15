"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  SearchX,
  X,
  Package,
  Send,
  Archive,
  FolderPlus,
  LayoutGrid,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { StatCard } from "@/components/StatCard";
import EmptyState from "@/components/EmptyState";
import TableSkeleton from "@/components/TableSkeleton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  ProductTable,
  type ProductSortKey,
  type ProductSortState,
} from "@/components/products/ProductTable";
import { ProductCards } from "@/components/products/ProductCards";
import { ProductFormDialog } from "@/components/products/ProductFormDialog";
import { CategoryFormDialog } from "@/components/products/CategoryFormDialog";
import { CategoryCards } from "@/components/products/CategoryCards";
import RevenueOverTimeChart from "@/components/products/RevenueOverTimeChart";
import SalesByCategoryChart from "@/components/products/SalesByCategoryChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductThumbnail } from "@/components/products/ProductThumbnail";
import { ProductStatusBadge } from "@/components/products/ProductStatusBadge";
import { useProducts } from "@/contexts/ProductsContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatMoney, formatNumber } from "@/lib/format";
import {
  productStatusLabels,
  type Product,
  type ProductCategory,
  type ProductStatus,
} from "@/lib/data/products";

const PAGE_SIZE = 8;
const ALL_STATUS = "all";
const ALL_CATEGORY = "all";

function compare(a: Product, b: Product, key: ProductSortKey, dir: "asc" | "desc"): number {
  let res = 0;
  switch (key) {
    case "name":
      res = a.name.localeCompare(b.name);
      break;
    case "price":
      res = a.price - b.price;
      break;
    case "sales":
      res = a.sales - b.sales;
      break;
    case "revenue":
      res = a.revenue - b.revenue;
      break;
    case "lastUpdated":
      res = a.lastUpdated.localeCompare(b.lastUpdated);
      break;
  }
  return dir === "asc" ? res : -res;
}

function MetricCardSkeleton() {
  return (
    <Card className="p-5">
      <div className="space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    </Card>
  );
}

export default function ProductsPage() {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    duplicateProduct,
    archiveProduct,
    addCategory,
    updateCategory,
  } = useProducts();
  const { symbol } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("products");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProductStatus | typeof ALL_STATUS>(ALL_STATUS);
  const [category, setCategory] = useState<string>(ALL_CATEGORY);
  const [sort, setSort] = useState<ProductSortState>({ key: "lastUpdated", dir: "desc" });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [formOpen, setFormOpen] = useState(false);
  const [formProduct, setFormProduct] = useState<Product | null>(null);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [categoryFormCategory, setCategoryFormCategory] = useState<ProductCategory | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<Product | null>(null);
  const [bulkArchiveOpen, setBulkArchiveOpen] = useState(false);
  const [bulkPublishOpen, setBulkPublishOpen] = useState(false);
  const [bulkPublishStatus, setBulkPublishStatus] = useState<ProductStatus>("published");
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setPage(1);
    setSelected(new Set());
  }, [search, status, category, sort.key, sort.dir]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  const activeProducts = useMemo(() => products.filter((p) => !p.archived), [products]);

  const metrics = useMemo(() => {
    const published = activeProducts.filter((p) => p.status === "published").length;
    const drafts = activeProducts.filter((p) => p.status === "draft").length;
    const best = activeProducts.reduce<Product | null>(
      (best, p) => (best === null || p.revenue > best.revenue ? p : best),
      null
    );
    return { total: activeProducts.length, published, drafts, best };
  }, [activeProducts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return activeProducts
      .filter((p) => {
        if (status !== ALL_STATUS && p.status !== status) return false;
        if (category !== ALL_CATEGORY && p.category !== category) return false;
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => compare(a, b, sort.key, sort.dir));
  }, [activeProducts, search, status, category, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const selectedProducts = useMemo(
    () => activeProducts.filter((p) => selected.has(p.id)),
    [activeProducts, selected]
  );

  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));
  const someSelected = filtered.some((p) => selected.has(p.id));

  const salesByCategory = useMemo(() => {
    return categories
      .map((c) => {
        const list = activeProducts.filter((p) => p.category === c.name);
        return {
          name: c.name,
          revenue: list.reduce((sum, p) => sum + p.revenue, 0),
          sales: list.reduce((sum, p) => sum + p.sales, 0),
        };
      })
      .filter((c) => c.sales > 0)
      .sort((a, b) => b.revenue - a.revenue);
  }, [categories, activeProducts]);

  const topProducts = useMemo(
    () => [...activeProducts].sort((a, b) => b.revenue - a.revenue).slice(0, 5),
    [activeProducts]
  );

  const hasFilters = search.trim() !== "" || status !== ALL_STATUS || category !== ALL_CATEGORY;

  function clearFilters() {
    setSearch("");
    setStatus(ALL_STATUS);
    setCategory(ALL_CATEGORY);
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
      if (allSelected) filtered.forEach((p) => next.delete(p.id));
      else filtered.forEach((p) => next.add(p.id));
      return next;
    });
  }

  function openAdd() {
    setFormProduct(null);
    setFormOpen(true);
  }

  function openEdit(p: Product) {
    setFormProduct(p);
    setFormOpen(true);
  }

  function handleSaveForm(values: {
    name: string;
    description: string;
    category: string;
    type: "digital" | "course" | "membership";
    price: number;
    status: ProductStatus;
    tags: string[];
    version?: string;
    fileSize?: string;
    fileType?: string;
  }) {
    if (formProduct) {
      updateProduct(formProduct.id, values);
      setNotice(`“${values.name}” updated.`);
    } else {
      const created = addProduct(values);
      setNotice(`“${created.name}” created.`);
    }
  }

  function handleDuplicate(p: Product) {
    duplicateProduct(p.id);
    setNotice(`“${p.name}” duplicated as draft.`);
  }

  function handleTogglePublish(p: Product) {
    const next: ProductStatus = p.status === "published" ? "draft" : "published";
    updateProduct(p.id, { status: next });
    setNotice(`“${p.name}” ${next === "published" ? "published" : "unpublished"}.`);
  }

  function applyArchive() {
    const ids = archiveTarget ? [archiveTarget.id] : selectedProducts.map((p) => p.id);
    ids.forEach((id) => archiveProduct(id));
    if (archiveTarget) {
      selected.delete(archiveTarget.id);
    } else {
      setSelected(new Set());
    }
    setNotice(`${ids.length} product${ids.length === 1 ? "" : "s"} archived.`);
  }

  function applyBulkPublish() {
    selectedProducts.forEach((p) => updateProduct(p.id, { status: bulkPublishStatus }));
    setNotice(
      `${selectedProducts.length} product${selectedProducts.length === 1 ? "" : "s"} set to ${
        productStatusLabels[bulkPublishStatus].toLowerCase()
      }.`
    );
    setSelected(new Set());
  }

  const start = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, filtered.length);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Breadcrumb segments={[{ label: "Home" }, { label: "Products" }]} />
        <h1 className="heading-page">Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
        <TableSkeleton rows={6} cols={7} />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <Breadcrumb segments={[{ label: "Home" }, { label: "Products" }]} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="heading-page">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your digital products, courses, and memberships.
          </p>
        </div>
        <Button variant="primary" onClick={openAdd} className="shrink-0">
          <Plus className="h-4 w-4" aria-hidden />
          Add product
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total products" value={formatNumber(metrics.total)} />
        <StatCard label="Published" value={formatNumber(metrics.published)} />
        <StatCard label="Drafts" value={formatNumber(metrics.drafts)} />
        <StatCard
          label="Best seller"
          value={metrics.best ? metrics.best.name : "—"}
          hint={metrics.best ? formatMoney(metrics.best.revenue, symbol) : undefined}
        />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="products">All products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="space-y-6">
            {notice && (
              <Alert variant="success">
                {notice}
              </Alert>
            )}

            <Card>
              <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
                <div className="relative lg:w-72">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products…"
                    aria-label="Search products"
                    className="pl-9"
                  />
                </div>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProductStatus | typeof ALL_STATUS)}
                  aria-label="Filter by status"
                  className="lg:w-44"
                >
                  <option value={ALL_STATUS}>All statuses</option>
                  {(Object.keys(productStatusLabels) as ProductStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {productStatusLabels[s]}
                    </option>
                  ))}
                </Select>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  aria-label="Filter by category"
                  className="lg:w-44"
                >
                  <option value={ALL_CATEGORY}>All categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
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
                  <p className="text-sm font-medium text-foreground">{selected.size} selected</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setBulkPublishStatus("published");
                        setBulkPublishOpen(true);
                      }}
                    >
                      <Send className="h-4 w-4" aria-hidden />
                      Publish
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setBulkPublishStatus("draft");
                        setBulkPublishOpen(true);
                      }}
                    >
                      <LayoutGrid className="h-4 w-4" aria-hidden />
                      Set as draft
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

            {activeProducts.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No products yet"
                description="Add your first product to start selling."
                action={
                  <Button variant="primary" onClick={openAdd}>
                    Add product
                  </Button>
                }
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="No products found"
                description="Try adjusting your search or filters."
                action={
                  <Button variant="secondary" onClick={clearFilters}>
                    Clear filters
                  </Button>
                }
              />
            ) : (
              <>
                <div className="hidden lg:block">
                  <Card>
                    <ProductTable
                      products={pageRows}
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
                      onDuplicate={handleDuplicate}
                      onTogglePublish={handleTogglePublish}
                      onArchive={(p) => {
                        setArchiveTarget(p);
                        setBulkArchiveOpen(true);
                      }}
                    />
                    <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-muted-foreground">
                        Showing {start}–{end} of {filtered.length}
                      </p>
                      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
                    </div>
                  </Card>
                </div>

                <div className="lg:hidden">
                  <ProductCards
                    products={pageRows}
                    symbol={symbol}
                    onEdit={openEdit}
                    onDuplicate={handleDuplicate}
                    onTogglePublish={handleTogglePublish}
                    onArchive={(p) => {
                      setArchiveTarget(p);
                      setBulkArchiveOpen(true);
                    }}
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
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <RevenueOverTimeChart />
              <SalesByCategoryChart data={salesByCategory} />
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Top products</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <ProductThumbnail name={p.name} type={p.type} />
                            <div className="min-w-0">
                              <span className="block max-w-[220px] truncate text-sm font-medium text-foreground">
                                {p.name}
                              </span>
                              <span className="block max-w-[220px] truncate text-xs text-muted-foreground">
                                {formatMoney(p.price, symbol)}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{p.category}</Badge>
                        </TableCell>
                        <TableCell className="text-foreground">{p.sales}</TableCell>
                        <TableCell className="text-foreground">
                          {formatMoney(p.revenue, symbol)}
                        </TableCell>
                        <TableCell>
                          <ProductStatusBadge status={p.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {categories.length} categories · revenue counts only published products
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setCategoryFormCategory(null);
                  setCategoryFormOpen(true);
                }}
              >
                <FolderPlus className="h-4 w-4" aria-hidden />
                Add category
              </Button>
            </div>
            <CategoryCards
              categories={categories}
              productCount={(name) => activeProducts.filter((p) => p.category === name).length}
              categoryRevenue={(name) =>
                activeProducts
                  .filter((p) => p.category === name && p.status === "published")
                  .reduce((sum, p) => sum + p.revenue, 0)
              }
              symbol={symbol}
              onEdit={(c) => {
                setCategoryFormCategory(c);
                setCategoryFormOpen(true);
              }}
              onToggleHidden={(c) => {
                updateCategory(c.id, { status: c.status === "active" ? "hidden" : "active" });
                setNotice(
                  c.status === "active" ? `“${c.name}” hidden.` : `“${c.name}” unhidden.`
                );
              }}
            />
          </div>
        </TabsContent>
      </Tabs>

      <ProductFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        product={formProduct ?? undefined}
        onSave={handleSaveForm}
      />

      <CategoryFormDialog
        open={categoryFormOpen}
        onClose={() => setCategoryFormOpen(false)}
        category={categoryFormCategory ?? undefined}
        onSave={(values) => {
          if (categoryFormCategory) {
            updateCategory(categoryFormCategory.id, values);
            setNotice(`“${values.name}” updated.`);
          } else {
            const created = addCategory(values);
            setNotice(`“${created.name}” created.`);
          }
        }}
      />

      <ConfirmDialog
        open={bulkArchiveOpen}
        onClose={() => setBulkArchiveOpen(false)}
        title={
          archiveTarget
            ? `Archive ${archiveTarget.name}?`
            : `Archive ${selected.size} products?`
        }
        description={
          archiveTarget
            ? "This product will be hidden from your products list. You can restore it from its detail page."
            : "These products will be hidden from your products list. You can restore them individually."
        }
        confirmLabel="Archive"
        destructive
        onConfirm={applyArchive}
      />

      <ConfirmDialog
        open={bulkPublishOpen}
        onClose={() => setBulkPublishOpen(false)}
        title={
          bulkPublishStatus === "published"
            ? `Publish ${selected.size} products?`
            : `Set ${selected.size} products to draft?`
        }
        description={
          bulkPublishStatus === "published"
            ? "These products will become publicly visible in your store."
            : "These products will be hidden from your store until published."
        }
        confirmLabel={bulkPublishStatus === "published" ? "Publish" : "Set as draft"}
        onConfirm={applyBulkPublish}
      />
    </div>
  );
}
