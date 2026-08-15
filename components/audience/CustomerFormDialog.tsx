"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { statusLabels, type Customer, type CustomerStatus } from "@/lib/data/customers";

interface CustomerFormDialogProps {
  open: boolean;
  onClose: () => void;
  customer?: Customer;
  onSave: (values: {
    name: string;
    email: string;
    location: string;
    phone: string;
    status: CustomerStatus;
  }) => void;
}

export function CustomerFormDialog({ open, onClose, customer, onSave }: CustomerFormDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<CustomerStatus>("active");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(customer?.name ?? "");
    setEmail(customer?.email ?? "");
    setLocation(customer?.location ?? "");
    setPhone(customer?.phone ?? "");
    setStatus(customer?.status ?? "active");
    setError("");
  }, [open, customer]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    onSave({ name: name.trim(), email: email.trim(), location: location.trim(), phone: phone.trim(), status });
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={customer ? "Edit customer" : "Add customer"}
      description={
        customer
          ? `Update details for ${customer.name}.`
          : "Create a new customer record. Changes are saved locally in this session."
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="customer-form" data-autofocus>
            {customer ? "Save changes" : "Add customer"}
          </Button>
        </>
      }
    >
      <form id="customer-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div>
          <Label htmlFor="cust-name">Name</Label>
          <Input
            id="cust-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            autoComplete="off"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="cust-email">Email</Label>
          <Input
            id="cust-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            autoComplete="off"
            className="mt-1.5"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="cust-location">Location</Label>
            <Input
              id="cust-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
              autoComplete="off"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="cust-phone">Phone</Label>
            <Input
              id="cust-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Optional"
              autoComplete="off"
              className="mt-1.5"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="cust-status">Status</Label>
          <select
            id="cust-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as CustomerStatus)}
            className="mt-1.5 h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            {(Object.keys(statusLabels) as CustomerStatus[]).map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        </div>
      </form>
    </Dialog>
  );
}
