"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  products as seedProducts,
  categories as seedCategories,
  type Product,
  type ProductCategory,
  type ProductStatus,
  type ProductType,
} from "@/lib/data/products";

export interface NewProduct {
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

export interface NewCategory {
  name: string;
  description: string;
}

interface ProductsContextValue {
  products: Product[];
  categories: ProductCategory[];
  getProduct: (id: string) => Product | undefined;
  getCategory: (name: string) => ProductCategory | undefined;
  addProduct: (input: NewProduct) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  duplicateProduct: (id: string) => Product | undefined;
  archiveProduct: (id: string) => void;
  restoreProduct: (id: string) => void;
  addCategory: (input: NewCategory) => ProductCategory;
  updateCategory: (id: string, patch: Partial<ProductCategory>) => void;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [categories, setCategories] = useState<ProductCategory[]>(seedCategories);

  function getProduct(id: string) {
    return products.find((p) => p.id === id);
  }

  function getCategory(name: string) {
    return categories.find((c) => c.name === name);
  }

  function addProduct(input: NewProduct): Product {
    const today = new Date().toISOString().slice(0, 10);
    const record: Product = {
      id: `p-${Date.now()}`,
      name: input.name,
      description: input.description,
      category: input.category,
      type: input.type,
      price: input.price,
      sales: 0,
      revenue: 0,
      status: input.status,
      createdAt: today,
      lastUpdated: today,
      tags: input.tags,
      version: input.version,
      fileSize: input.fileSize,
      fileType: input.fileType,
      archived: false,
    };
    setProducts((prev) => [record, ...prev]);
    return record;
  }

  function updateProduct(id: string, patch: Partial<Product>) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...patch, lastUpdated: new Date().toISOString().slice(0, 10) } : p
      )
    );
  }

  function duplicateProduct(id: string): Product | undefined {
    const source = products.find((p) => p.id === id);
    if (!source) return undefined;
    const copy: Product = {
      ...source,
      id: `p-${Date.now()}`,
      name: `${source.name} (Copy)`,
      sales: 0,
      revenue: 0,
      status: "draft",
      createdAt: new Date().toISOString().slice(0, 10),
      lastUpdated: new Date().toISOString().slice(0, 10),
      archived: false,
    };
    setProducts((prev) => [copy, ...prev]);
    return copy;
  }

  function archiveProduct(id: string) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, archived: true } : p)));
  }

  function restoreProduct(id: string) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, archived: false } : p)));
  }

  function addCategory(input: NewCategory): ProductCategory {
    const record: ProductCategory = {
      id: `cat-${Date.now()}`,
      name: input.name,
      description: input.description,
      status: "active",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setCategories((prev) => [...prev, record]);
    return record;
  }

  function updateCategory(id: string, patch: Partial<ProductCategory>) {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
        getProduct,
        getCategory,
        addProduct,
        updateProduct,
        duplicateProduct,
        archiveProduct,
        restoreProduct,
        addCategory,
        updateCategory,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
