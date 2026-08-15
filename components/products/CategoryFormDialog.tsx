"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import type { ProductCategory } from "@/lib/data/products";

interface CategoryFormValues {
  name: string;
  description: string;
}

interface CategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  category?: ProductCategory;
  onSave: (values: CategoryFormValues) => void;
}

export function CategoryFormDialog({ open, onClose, category, onSave }: CategoryFormDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(category?.name ?? "");
    setDescription(category?.description ?? "");
    setError("");
  }, [open, category]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }
    onSave({ name: name.trim(), description: description.trim() });
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={category ? "Edit category" : "Add category"}
      description={
        category
          ? `Update the ${category.name} category.`
          : "Create a new product category. Changes are local to this session."
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="category-form" data-autofocus>
            {category ? "Save changes" : "Add category"}
          </Button>
        </>
      }
    >
      <form id="category-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div>
          <Label htmlFor="cat-name">Category name</Label>
          <Input
            id="cat-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Icon Packs"
            autoComplete="off"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="cat-desc">Description</Label>
          <Input
            id="cat-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description"
            autoComplete="off"
            className="mt-1.5"
          />
        </div>
      </form>
    </Dialog>
  );
}
