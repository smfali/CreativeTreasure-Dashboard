"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoreHorizontal, Eye, Pencil, Copy, Send, Archive } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ProductThumbnail } from "./ProductThumbnail";
import { ProductStatusBadge } from "./ProductStatusBadge";
import { formatMoney, formatDate } from "@/lib/format";
import { productTypeLabels, type Product } from "@/lib/data/products";

interface ProductCardsProps {
  products: Product[];
  symbol: string;
  onEdit: (p: Product) => void;
  onDuplicate: (p: Product) => void;
  onTogglePublish: (p: Product) => void;
  onArchive: (p: Product) => void;
}

export function ProductCards({
  products,
  symbol,
  onEdit,
  onDuplicate,
  onTogglePublish,
  onArchive,
}: ProductCardsProps) {
  const router = useRouter();

  return (
    <div className="space-y-3">
      {products.map((p) => (
        <Card key={p.id} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <ProductThumbnail name={p.name} type={p.type} />
              <div className="min-w-0">
                <Link
                  href={`/products/${p.id}`}
                  className="block truncate text-sm font-medium text-foreground hover:text-primary"
                >
                  {p.name}
                </Link>
                <span className="block truncate text-xs text-muted-foreground">{p.description}</span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <ProductStatusBadge status={p.status} />
              <DropdownMenu
                align="end"
                triggerClassName="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                trigger={
                  <span className="inline-flex items-center justify-center">
                    <MoreHorizontal className="h-4 w-4" aria-hidden />
                    <span className="sr-only">Actions for {p.name}</span>
                  </span>
                }
              >
                <DropdownMenuItem onClick={() => router.push(`/products/${p.id}`)}>
                  <Eye className="h-4 w-4" aria-hidden />
                  View product
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(p)}>
                  <Pencil className="h-4 w-4" aria-hidden />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(p)}>
                  <Copy className="h-4 w-4" aria-hidden />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTogglePublish(p)}>
                  <Send className="h-4 w-4" aria-hidden />
                  {p.status === "published" ? "Unpublish" : "Publish"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onArchive(p)}
                  className="text-destructive hover:text-destructive"
                >
                  <Archive className="h-4 w-4" aria-hidden />
                  Archive
                </DropdownMenuItem>
              </DropdownMenu>
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs text-muted-foreground">Category</dt>
              <dd className="mt-0.5">
                <Badge variant="outline">{p.category}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Type</dt>
              <dd className="mt-0.5 text-foreground">{productTypeLabels[p.type]}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Price</dt>
              <dd className="mt-0.5 text-foreground">{formatMoney(p.price, symbol)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Sales</dt>
              <dd className="mt-0.5 text-foreground">{p.sales}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Revenue</dt>
              <dd className="mt-0.5 text-foreground">{formatMoney(p.revenue, symbol)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Last updated</dt>
              <dd className="mt-0.5 text-foreground">{formatDate(p.lastUpdated)}</dd>
            </div>
          </dl>
        </Card>
      ))}
    </div>
  );
}
