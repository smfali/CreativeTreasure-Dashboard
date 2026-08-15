"use client";

import { useState } from "react";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/input";
import { SectionCard } from "@/components/settings/SectionCard";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useSettings } from "@/contexts/SettingsContext";
import { demoRecoveryCodes, twoFactorMethods } from "@/lib/data/settings";

export function TwoFactorPanel() {
  const { twoFactorEnabled, setTwoFactorEnabled } = useSettings();
  const [setupOpen, setSetupOpen] = useState(false);
  const [method, setMethod] = useState<string>(twoFactorMethods[0].key);
  const [disableOpen, setDisableOpen] = useState(false);
  const [showCodes, setShowCodes] = useState(false);

  function handleEnable() {
    setTwoFactorEnabled(true);
    setSetupOpen(false);
    setShowCodes(true);
  }

  return (
    <SectionCard
      title="Two-factor authentication"
      description="Add an extra layer of security to your demo account sign-in."
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 p-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              twoFactorEnabled ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
            }`}
          >
            {twoFactorEnabled ? <ShieldCheck className="h-5 w-5" aria-hidden /> : <ShieldOff className="h-5 w-5" aria-hidden />}
          </span>
          <div>
            <p className="heading-section text-foreground">
              Two-factor authentication
              {twoFactorEnabled && (
                <span className="ml-2">
                  <Badge variant="success">Enabled</Badge>
                </span>
              )}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {twoFactorEnabled
                ? "A second verification step is required on every sign-in."
                : "Protect your account with a second verification step."}
            </p>
          </div>
        </div>
        <Button
          variant={twoFactorEnabled ? "secondary" : "primary"}
          onClick={() => (twoFactorEnabled ? setDisableOpen(true) : setSetupOpen(true))}
        >
          {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
        </Button>
      </div>

      {twoFactorEnabled && showCodes && (
        <div className="rounded-lg border border-border p-4">
          <p className="heading-section text-foreground">Recovery codes (demo)</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Store these somewhere safe. Each code can be used once to regain access.
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {demoRecoveryCodes.map((code) => (
              <li
                key={code}
                className="rounded-md border border-border bg-muted px-3 py-2 text-center font-mono text-xs text-muted-foreground"
              >
                {code}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Dialog
        open={setupOpen}
        onClose={() => setSetupOpen(false)}
        title="Set up two-factor authentication"
        description="Choose a verification method for this demo. No real codes are generated."
        footer={
          <>
            <Button variant="secondary" onClick={() => setSetupOpen(false)} data-autofocus>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEnable}>
              Enable 2FA
            </Button>
          </>
        }
      >
        <fieldset className="space-y-3">
          <legend className="sr-only">Two-factor verification method</legend>
          {twoFactorMethods.map((opt) => (
            <label
              key={opt.key}
              htmlFor={`2fa-${opt.key}`}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 has-[:checked]:border-primary"
            >
              <input
                id={`2fa-${opt.key}`}
                type="radio"
                name="2fa-method"
                value={opt.key}
                checked={method === opt.key}
                onChange={() => setMethod(opt.key)}
                className="mt-1 h-4 w-4 accent-[rgb(var(--accent))]"
              />
              <span>
                <Label htmlFor={`2fa-${opt.key}`}>{opt.label}</Label>
                <span className="mt-0.5 block text-sm text-muted-foreground">{opt.description}</span>
              </span>
            </label>
          ))}
        </fieldset>
      </Dialog>

      <ConfirmDialog
        open={disableOpen}
        onClose={() => setDisableOpen(false)}
        title="Disable two-factor authentication?"
        description="Your account will no longer require a second verification step. This is a local demo action."
        confirmLabel="Disable 2FA"
        destructive
        onConfirm={() => {
          setTwoFactorEnabled(false);
          setShowCodes(false);
        }}
      />
    </SectionCard>
  );
}