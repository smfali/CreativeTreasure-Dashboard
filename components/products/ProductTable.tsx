"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUp, ArrowDown, MoreHorizontal, Eye, Pencil, Copy, Send, Archive } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ProductThumbnail } from "./ProductThumbnail";
import { ProductStatusBadge } from "./ProductStatusBadge";
import { formatMoney, formatDate } from "@/lib/format";
import { productTypeLabels, type Product } from "@/lib/data/products";

export type ProductSortKey = "name" | "price" | "sales" | "revenue" | "lastUpdated";

export interface ProductSortState {
  key: ProductSortKey;
  dir: "asc" | "desc";
}

interface ProductTableProps {
  products: Product[];
  selected: Set<string>;
  allSelected: boolean;
  someSelected: boolean;
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  sort: ProductSortState;
  onSort: (key: ProductSortKey) => void;
  symbol: string;
  onEdit: (p: Product) => void;
  onDuplicate: (p: Product) => void;
  onTogglePublish: (p: Product) => void;
  onArchive: (p: Product) => void;
}

function SortIndicator({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return null;
  return dir === "asc" ? (
    <ArrowUp className="h-3 w-3" aria-hidden />
  ) : (
    <ArrowDown className="h-3 w-3" aria-hidden />
  );
}

export function ProductTable({
  products,
  selected,
  allSelected,
  someSelected,
  onToggleSelectAll,
  onToggleSelect,
  sort,
  onSort,
  symbol,
  onEdit,
  onDuplicate,
  onTogglePublish,
  onArchive,
}: ProductTableProps) {
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
              aria-label="Select all products"
            />
          </TableHead>
          {(
            [
              { key: "name", label: "Product" },
              { key: "price", label: "Price" },
              { key: "sales", label: "Sales" },
              { key: "revenue", label: "Revenue" },
              { key: "lastUpdated", label: "Last updated" },
            ] as { key: ProductSortKey; label: string }[]
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
          <TableHead>Category</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((p) => (
          <TableRow key={p.id} className="group hover:bg-muted/50">
            <TableCell>
              <Checkbox
                checked={selected.has(p.id)}
                onChange={() => onToggleSelect(p.id)}
                aria-label={`Select ${p.name}`}
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <ProductThumbnail name={p.name} type={p.type} />
                <div className="min-w-0">
                  <Link
                    href={`/products/${p.id}`}
                    className="block max-w-[220px] truncate text-sm font-medium text-foreground hover:text-primary"
                  >
                    {p.name}
                  </Link>
                  <span className="block max-w-[220px] truncate text-xs text-muted-foreground">
                    {p.description}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-foreground">{formatMoney(p.price, symbol)}</TableCell>
            <TableCell className="text-foreground">{p.sales}</TableCell>
            <TableCell className="text-foreground">{formatMoney(p.revenue, symbol)}</TableCell>
            <TableCell className="text-muted-foreground" title={formatDate(p.lastUpdated)}>
              {formatDate(p.lastUpdated)}
            </TableCell>
            <TableCell>
              <Badge variant="outline">{p.category}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{productTypeLabels[p.type]}</TableCell>
            <TableCell>
              <ProductStatusBadge status={p.status} />
            </TableCell>
            <TableCell className="text-right">
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
