"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, KeyRound } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import type { ApiKey } from "@/lib/data/settings";

interface CreateApiKeyDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => ApiKey;
}

export function CreateApiKeyDialog({ open, onClose, onCreate }: CreateApiKeyDialogProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<ApiKey | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setError(null);
      setCreated(null);
      setCopied(false);
    }
  }, [open]);

  function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please give this key a name.");
      return;
    }
    if (trimmed.length < 3) {
      setError("Key name must be at least 3 characters.");
      return;
    }
    setError(null);
    setCreated(onCreate(trimmed));
  }

  function handleCopy() {
    if (!created) return;
    navigator.clipboard?.writeText(created.masked).catch(() => undefined);
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
  }

  function handleClose() {
    setCopied(false);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={created ? "API key created" : "Create an API key"}
      description={
        created
          ? "Copy this demo key now — you will not see it again."
          : "Create a new API key for the demo workspace."
      }
      footer={
        created ? (
          <>
            <Button variant="secondary" onClick={handleClose} data-autofocus>
              Done
            </Button>
            <Button variant="primary" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
              {copied ? "Copied" : "Copy key"}
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={handleClose} data-autofocus>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              <KeyRound className="h-4 w-4" aria-hidden />
              Create key
            </Button>
          </>
        )
      }
    >
      {created ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="new-api-key">API key (masked demo value)</Label>
            <div className="mt-1.5 flex items-center gap-2 rounded-md border border-input bg-muted px-3 py-2.5">
              <code className="flex-1 break-all font-mono text-sm text-foreground">{created.masked}</code>
            </div>
          </div>
          <Alert variant="info">
            This is a masked, frontend-only demo key. No real secret was generated.
          </Alert>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="api-key-name">Key name</Label>
            <Input
              id="api-key-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
              }}
              placeholder="e.g. Reporting dashboard"
              className="mt-1.5"
              aria-invalid={!!error}
              aria-describedby={error ? "api-key-error" : undefined}
            />
            {error && (
              <p id="api-key-error" className="mt-1.5 text-sm text-destructive">
                {error}
              </p>
            )}
          </div>
          <Alert variant="info">
            The key value shown after creation will be masked — this demo never stores real secrets.
          </Alert>
        </div>
      )}
    </Dialog>
  );
}