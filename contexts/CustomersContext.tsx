"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { customers as seed, type Customer, type CustomerStatus } from "@/lib/data/customers";

export interface NewCustomer {
  name: string;
  email: string;
  location: string;
  phone?: string;
  status: CustomerStatus;
  tags?: string[];
}

interface CustomersContextValue {
  customers: Customer[];
  getCustomer: (id: string) => Customer | undefined;
  addCustomer: (input: NewCustomer) => Customer;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  archiveCustomer: (id: string) => void;
  restoreCustomer: (id: string) => void;
}

const CustomersContext = createContext<CustomersContextValue | null>(null);

export function CustomersProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(seed);

  function getCustomer(id: string) {
    return customers.find((c) => c.id === id);
  }

  function addCustomer(input: NewCustomer): Customer {
    const today = new Date().toISOString().slice(0, 10);
    const record: Customer = {
      id: `c-${Date.now()}`,
      name: input.name,
      email: input.email,
      location: input.location,
      phone: input.phone,
      orders: 0,
      totalSpent: 0,
      lastActivity: today,
      status: input.status,
      joinedAt: today,
      tags: input.tags,
      archived: false,
    };
    setCustomers((prev) => [record, ...prev]);
    return record;
  }

  function updateCustomer(id: string, patch: Partial<Customer>) {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function archiveCustomer(id: string) {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, archived: true } : c)));
  }

  function restoreCustomer(id: string) {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, archived: false } : c)));
  }

  return (
    <CustomersContext.Provider
      value={{ customers, getCustomer, addCustomer, updateCustomer, archiveCustomer, restoreCustomer }}
    >
      {children}
    </CustomersContext.Provider>
  );
}

export function useCustomers() {
  const ctx = useContext(CustomersContext);
  if (!ctx) throw new Error("useCustomers must be used within CustomersProvider");
  return ctx;
}
