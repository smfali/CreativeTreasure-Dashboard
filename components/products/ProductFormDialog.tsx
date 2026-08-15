"use client";

import { useEffect, useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ProductThumbnail } from "./ProductThumbnail";
import {
  productStatusLabels,
  productTypeLabels,
  type Product,
  type ProductStatus,
  type ProductType,
} from "@/lib/data/products";
import { useProducts } from "@/contexts/ProductsContext";

interface ProductFormValues {
  name: string;
  description: string;
  category: string;
  type: ProductType;
  price: number;
  status: ProductStatus;
  tags: string[];
  version?: string;
  fileSize?: string;
  fileType?: string;
}

interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  product?: Product;
  onSave: (values: ProductFormValues) => void;
}

export function ProductFormDialog({ open, onClose, product, onSave }: ProductFormDialogProps) {
  const { categories } = useProducts();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<ProductType>("digital");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<ProductStatus>("draft");
  const [tags, setTags] = useState("");
  const [version, setVersion] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setName(product?.name ?? "");
    setDescription(product?.description ?? "");
    setCategory(product?.category ?? categories[0]?.name ?? "");
    setType(product?.type ?? "digital");
    setPrice(product ? String(product.price) : "");
    setStatus(product?.status ?? "draft");
    setTags(product?.tags?.join(", ") ?? "");
    setVersion(product?.version ?? "");
    setFileSize(product?.fileSize ?? "");
    setFileType(product?.fileType ?? "");
    setFileName(product?.fileSize ? `${product.name} (${product.fileSize})` : "");
    setErrors({});
    setSaving(false);
  }, [open, product, categories]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeMb = file.size / (1024 * 1024);
    setFileName(`${file.name} (${sizeMb < 1 ? `${Math.round(sizeMb * 1000)} KB` : `${sizeMb.toFixed(1)} MB`})`);
    const nameParts = file.name.split(".");
    setFileType(nameParts.length > 1 ? `.${nameParts.pop()}` : "file");
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Product name is required.";
    if (!category) next.category = "Please choose a category.";
    const parsedPrice = Number(price);
    if (price === "" || Number.isNaN(parsedPrice) || parsedPrice < 0) {
      next.price = "Enter a valid price (0 or more).";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      onSave({
        name: name.trim(),
        description: description.trim(),
        category,
        type,
        price: Math.round(Number(price) * 100) / 100,
        status,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        version: version.trim() || undefined,
        fileSize: fileSize.trim() || undefined,
        fileType: fileType.trim() || undefined,
      });
      onClose();
    }, 600);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={product ? "Edit product" : "Add product"}
      description={
        product
          ? `Update details for ${product.name}.`
          : "Create a new digital product. File upload is simulated for this preview."
      }
      className="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="product-form"
            loading={saving}
            disabled={saving}
            data-autofocus
          >
            {product ? "Save changes" : "Create product"}
          </Button>
        </>
      }
    >
      <form id="product-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="flex items-center gap-4">
          <ProductThumbnail name={name || "Product"} type={type} className="h-16 w-16 rounded-xl [&>svg]:h-8 [&>svg]:w-8" />
          <div className="flex-1">
            <Label htmlFor="prod-file" className="mb-1.5 block">
              Product file
            </Label>
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload product file"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border bg-muted/40 px-4 py-4 text-center transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-ring"
            >
              <UploadCloud className="h-5 w-5 text-muted-foreground" aria-hidden />
              {fileName ? (
                <span className="text-sm font-medium text-foreground">{fileName}</span>
              ) : (
                <>
                  <span className="text-sm text-muted-foreground">Drop a file or click to browse</span>
                  <span className="text-xs text-muted-foreground/70">
                    Upload is simulated — no file is actually sent
                  </span>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              aria-hidden
              onChange={handleFileChange}
              disabled={saving}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="prod-name">Product name</Label>
          <Input
            id="prod-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Aurora UI Kit"
            autoComplete="off"
            aria-invalid={Boolean(errors.name)}
            className={`mt-1.5 ${errors.name ? "border-destructive focus:border-destructive" : ""}`}
          />
          {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="prod-desc">Description</Label>
          <Textarea
            id="prod-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this product include?"
            rows={3}
            className="mt-1.5"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="prod-category">Category</Label>
            <Select
              id="prod-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-invalid={Boolean(errors.category)}
              className={`mt-1.5 ${errors.category ? "border-destructive focus:border-destructive" : ""}`}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </Select>
            {errors.category && <p className="mt-1 text-sm text-destructive">{errors.category}</p>}
          </div>
          <div>
            <Label htmlFor="prod-type">Type</Label>
            <Select
              id="prod-type"
              value={type}
              onChange={(e) => setType(e.target.value as ProductType)}
              className="mt-1.5"
            >
              {(Object.keys(productTypeLabels) as ProductType[]).map((t) => (
                <option key={t} value={t}>
                  {productTypeLabels[t]}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="prod-price">Price (USD)</Label>
            <Input
              id="prod-price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="49.00"
              aria-invalid={Boolean(errors.price)}
              className={`mt-1.5 ${errors.price ? "border-destructive focus:border-destructive" : ""}`}
            />
            {errors.price && <p className="mt-1 text-sm text-destructive">{errors.price}</p>}
          </div>
          <div>
            <Label htmlFor="prod-status">Status</Label>
            <Select
              id="prod-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProductStatus)}
              className="mt-1.5"
            >
              {(Object.keys(productStatusLabels) as ProductStatus[]).map((s) => (
                <option key={s} value={s}>
                  {productStatusLabels[s]}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="prod-tags">Tags</Label>
          <Input
            id="prod-tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Figma, Design System, Components"
            autoComplete="off"
            className="mt-1.5"
          />
          <p className="mt-1 text-xs text-muted-foreground">Comma-separated list.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="prod-version">Version</Label>
            <Input
              id="prod-version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0.0"
              autoComplete="off"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="prod-size">File size</Label>
            <Input
              id="prod-size"
              value={fileSize}
              onChange={(e) => setFileSize(e.target.value)}
              placeholder="e.g. 24 MB"
              autoComplete="off"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="prod-format">File format</Label>
            <Input
              id="prod-format"
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              placeholder=".zip"
              autoComplete="off"
              className="mt-1.5"
            />
          </div>
        </div>

        {fileName && (
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
            <span className="truncate text-foreground">{fileName}</span>
            <button
              type="button"
              onClick={() => {
                setFileName("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              aria-label="Remove uploaded file"
              className="ml-2 shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </form>
    </Dialog>
  );
}
