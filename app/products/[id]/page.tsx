"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Copy,
  Send,
  Archive,
  RotateCcw,
  ShoppingCart,
  FileText,
  CheckCircle2,
  SearchX,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import EmptyState from "@/components/EmptyState";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { StatCard } from "@/components/StatCard";
import { ProductThumbnail } from "@/components/products/ProductThumbnail";
import { ProductStatusBadge } from "@/components/products/ProductStatusBadge";
import { ProductFormDialog } from "@/components/products/ProductFormDialog";
import ProductSalesChart from "@/components/products/ProductSalesChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useProducts } from "@/contexts/ProductsContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatMoney, formatNumber, formatDate, timeAgo } from "@/lib/format";
import {
  getProductOrders,
  getProductActivity,
  productTypeLabels,
  type ProductActivity,
} from "@/lib/data/products";

const activityMeta = {
  sale: { icon: ShoppingCart, className: "text-success bg-success/15" },
  update: { icon: FileText, className: "text-info bg-info/15" },
  publish: { icon: Send, className: "text-warning bg-warning/15" },
  review: { icon: CheckCircle2, className: "text-primary bg-primary/15" },
} as const;

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="break-all text-right text-sm font-medium text-foreground">{value || "—"}</dd>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { getProduct, updateProduct, duplicateProduct, archiveProduct, restoreProduct } =
    useProducts();
  const { symbol } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const product = id ? getProduct(id) : undefined;

  const orders = useMemo(() => (product ? getProductOrders(product.id) : []), [product]);
  const activity = useMemo(
    () => (product ? getProductActivity(product.id) : []),
    [product]
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-64" />
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8">
        <EmptyState
          icon={SearchX}
          title="Product not found"
          description="This product may have been removed."
          action={
            <Link href="/products">
              <Button variant="secondary">Back to products</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const record = product;
  const avgPrice = record.sales > 0 ? record.revenue / record.sales : record.price;

  function handleTogglePublish() {
    const next = record.status === "published" ? "draft" : "published";
    updateProduct(record.id, { status: next });
    setNotice(next === "published" ? "Product published." : "Product set to draft.");
  }

  function handleDuplicate() {
    duplicateProduct(record.id);
    setNotice(`“${record.name}” duplicated as draft.`);
  }

  function handleSaveForm(values: Parameters<typeof updateProduct>[1]) {
    updateProduct(record.id, values);
    setNotice("Product details updated.");
  }

  return (
    <div className="p-8 space-y-6">
      <Breadcrumb
        segments={[{ label: "Home" }, { label: "Products" }, { label: record.name }]}
      />

      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to products
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <ProductThumbnail name={record.name} type={record.type} className="h-14 w-14 rounded-xl [&>svg]:h-7 [&>svg]:w-7" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="heading-page mb-0 text-xl sm:text-2xl">{record.name}</h1>
                <ProductStatusBadge status={record.status} />
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {productTypeLabels[record.type]} · {record.category}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" aria-hidden />
              Edit
            </Button>
            <Button variant="secondary" onClick={handleDuplicate}>
              <Copy className="h-4 w-4" aria-hidden />
              Duplicate
            </Button>
            <Button variant="secondary" onClick={handleTogglePublish}>
              <Send className="h-4 w-4" aria-hidden />
              {record.status === "published" ? "Unpublish" : "Publish"}
            </Button>
            {record.archived ? (
              <Button variant="secondary" onClick={() => restoreProduct(record.id)}>
                <RotateCcw className="h-4 w-4" aria-hidden />
                Restore
              </Button>
            ) : (
              <Button variant="destructive" onClick={() => setArchiveOpen(true)}>
                <Archive className="h-4 w-4" aria-hidden />
                Archive
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {notice && <Alert variant="success">{notice}</Alert>}

      {record.archived && (
        <Alert variant="info">
          This product is archived and hidden from the products list. Restore it to make it visible
          again.
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sales" value={String(record.sales)} />
        <StatCard label="Revenue" value={formatMoney(record.revenue, symbol)} />
        <StatCard label="Average price" value={formatMoney(avgPrice, symbol)} />
        <StatCard
          label="Conversion rate"
          value={`${record.sales > 0 ? (record.sales * 0.38).toFixed(1) : "0.0"}%`}
          hint="Simulated estimate"
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>About this product</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">{record.description}</p>
                <dl className="mt-4 divide-y divide-border border-t border-border">
                  <InfoRow label="Status" value={record.archived ? "Archived" : productTypeLabels[record.type]} />
                  <InfoRow label="Category" value={record.category} />
                  <InfoRow label="Type" value={productTypeLabels[record.type]} />
                  <InfoRow label="Price" value={formatMoney(record.price, symbol)} />
                  <InfoRow label="Version" value={record.version ?? "—"} />
                  <InfoRow label="File size" value={record.fileSize ?? "—"} />
                  <InfoRow label="File format" value={record.fileType ?? "—"} />
                  <InfoRow label="Created" value={formatDate(record.createdAt)} />
                  <InfoRow label="Last updated" value={formatDate(record.lastUpdated)} />
                  <div className="flex items-start justify-between gap-4 py-2.5">
                    <dt className="shrink-0 text-sm text-muted-foreground">Tags</dt>
                    <dd className="text-right">
                      {record.tags.length > 0 ? (
                        <span className="inline-flex flex-wrap justify-end gap-1.5">
                          {record.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-foreground">—</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent sales</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No sales recorded for this product yet.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.slice(0, 4).map((o) => (
                        <TableRow key={o.id}>
                          <TableCell className="text-foreground">{o.customer}</TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(o.date)}</TableCell>
                          <TableCell className="text-foreground">
                            {formatMoney(o.amount, symbol)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                o.status === "Paid"
                                  ? "success"
                                  : o.status === "Processing"
                                    ? "warning"
                                    : "destructive"
                              }
                            >
                              {o.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard label="Total downloads" value={formatNumber(record.sales + record.sales / 3)} hint="Simulated estimate" />
              <StatCard label="Units sold" value={formatNumber(record.sales)} />
              <StatCard label="Revenue per unit" value={formatMoney(avgPrice, symbol)} />
            </div>
            <ProductSalesChart product={record} />
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardContent className="p-6">
              {activity.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No activity recorded.
                </p>
              ) : (
                <ol className="relative space-y-6 border-l border-border pl-6">
                  {activity.map((event: ProductActivity) => {
                    const meta = activityMeta[event.type];
                    const Icon = meta.icon;
                    return (
                      <li key={event.id} className="relative">
                        <span
                          className={`absolute -left-[35px] flex h-7 w-7 items-center justify-center rounded-full ${meta.className}`}
                        >
                          <Icon className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                          <p className="text-sm font-medium text-foreground">{event.title}</p>
                          <time className="text-xs text-muted-foreground" title={formatDate(event.date)}>
                            {timeAgo(event.date)}
                          </time>
                        </div>
                        {event.description && (
                          <p className="mt-0.5 text-sm text-muted-foreground">{event.description}</p>
                        )}
                      </li>
                    );
                  })}
                </ol>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ProductFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        product={record}
        onSave={handleSaveForm}
      />

      <ConfirmDialog
        open={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        title={`Archive ${record.name}?`}
        description="This product will be hidden from your products list. You can restore it anytime."
        confirmLabel="Archive"
        destructive
        onConfirm={() => archiveProduct(record.id)}
      />
    </div>
  );
}
