"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/input";
import { statusLabels, type Customer, type CustomerStatus } from "@/lib/data/customers";

interface ChangeStatusDialogProps {
  open: boolean;
  onClose: () => void;
  customers: Customer[];
  onConfirm: (status: CustomerStatus) => void;
}

export function ChangeStatusDialog({
  open,
  onClose,
  customers,
  onConfirm,
}: ChangeStatusDialogProps) {
  const [status, setStatus] = useState<CustomerStatus>("active");

  const count = customers.length;
  const name = count === 1 ? customers[0]?.name : undefined;

  function handleConfirm() {
    onConfirm(status);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={name ? `Change status · ${name}` : "Change customer status"}
      description={
        count === 1
          ? "Update this customer's account status."
          : `Update the status for ${count} selected customers.`
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm} data-autofocus>
            Save status
          </Button>
        </>
      }
    >
      <div>
        <Label htmlFor="new-status">New status</Label>
        <Select
          id="new-status"
          className="mt-1.5"
          value={status}
          onChange={(e) => setStatus(e.target.value as CustomerStatus)}
        >
          {(Object.keys(statusLabels) as CustomerStatus[]).map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </Select>
      </div>
    </Dialog>
  );
}
