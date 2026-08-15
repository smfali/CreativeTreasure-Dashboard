import { Badge, type BadgeProps } from "@/components/ui/badge";
import { productStatusLabels, type ProductStatus } from "@/lib/data/products";

const variants: Record<ProductStatus, BadgeProps["variant"]> = {
  published: "success",
  draft: "warning",
};

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return <Badge variant={variants[status]}>{productStatusLabels[status]}</Badge>;
}
