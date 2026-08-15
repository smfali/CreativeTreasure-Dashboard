"use client";

import { Pencil, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import type { ProductCategory } from "@/lib/data/products";

interface CategoryCardsProps {
  categories: ProductCategory[];
  productCount: (name: string) => number;
  categoryRevenue: (name: string) => number;
  symbol: string;
  onEdit: (c: ProductCategory) => void;
  onToggleHidden: (c: ProductCategory) => void;
}

export function CategoryCards({
  categories,
  productCount,
  categoryRevenue,
  symbol,
  onEdit,
  onToggleHidden,
}: CategoryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((c) => {
        const count = productCount(c.name);
        return (
          <Card key={c.id} className="flex flex-col p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="heading-section text-foreground">{c.name}</h3>
                <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
              </div>
              <Badge variant={c.status === "active" ? "success" : "outline"}>
                {c.status === "active" ? "Active" : "Hidden"}
              </Badge>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Products</dt>
                <dd className="mt-0.5 text-foreground">{count}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Revenue</dt>
                <dd className="mt-0.5 text-foreground">{formatMoney(categoryRevenue(c.name), symbol)}</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
              <Button variant="secondary" size="sm" onClick={() => onEdit(c)}>
                <Pencil className="h-4 w-4" aria-hidden />
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onToggleHidden(c)}>
                {c.status === "active" ? (
                  <>
                    <EyeOff className="h-4 w-4" aria-hidden />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" aria-hidden />
                    Unhide
                  </>
                )}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
