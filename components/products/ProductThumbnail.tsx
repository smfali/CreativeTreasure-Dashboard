import { Layers, Presentation, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductType } from "@/lib/data/products";

const gradients: Record<ProductType, string> = {
  digital: "from-indigo-500 to-violet-500",
  course: "from-emerald-500 to-teal-500",
  membership: "from-amber-500 to-orange-500",
};

const icons = {
  digital: Layers,
  course: Presentation,
  membership: Users,
} as const;

interface ProductThumbnailProps {
  name: string;
  type: ProductType;
  className?: string;
}

export function ProductThumbnail({ name, type, className }: ProductThumbnailProps) {
  const Icon = icons[type];
  return (
    <span
      role="img"
      aria-label={`${name} thumbnail`}
      title={name}
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white",
        gradients[type],
        className
      )}
    >
      <Icon className="h-5 w-5" aria-hidden />
    </span>
  );
}
