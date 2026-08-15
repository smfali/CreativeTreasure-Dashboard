"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function AlertBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <Alert
      variant="success"
      className="mx-8 mt-6"
      action={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss notification"
          className="h-7 w-7"
        >
          <X className="h-4 w-4" />
        </Button>
      }
    >
      New payout available: <span className="font-semibold">$340</span>
    </Alert>
  );
}
