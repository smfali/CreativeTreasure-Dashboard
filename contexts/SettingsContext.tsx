"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  seedApiKeys,
  seedIntegrations,
  defaultGeneralSettings,
  defaultCommerceSettings,
  defaultProfileSettings,
  defaultTwoFactorEnabled,
  generateMaskedKey,
  SETTINGS_TODAY,
  type ApiKey,
  type CommerceSettings,
  type GeneralSettings,
  type Integration,
  type ProfileSettings,
} from "@/lib/data/settings";

interface SettingsContextValue {
  general: GeneralSettings;
  saveGeneral: (settings: GeneralSettings) => void;
  commerce: CommerceSettings;
  saveCommerce: (settings: CommerceSettings) => void;
  profile: ProfileSettings;
  saveProfile: (settings: ProfileSettings) => void;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
  integrations: Integration[];
  getIntegration: (id: string) => Integration | undefined;
  connectIntegration: (id: string) => void;
  disconnectIntegration: (id: string) => void;
  apiKeys: ApiKey[];
  getApiKey: (id: string) => ApiKey | undefined;
  createApiKey: (name: string) => ApiKey;
  revokeApiKey: (id: string) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function nextApiKeyId(list: ApiKey[]): string {
  const nums = list.map((k) => Number(k.id.replace("ak-", "")) || 100);
  return `ak-${Math.max(...nums) + 1}`;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [general, setGeneral] = useState<GeneralSettings>({ ...defaultGeneralSettings });
  const [commerce, setCommerce] = useState<CommerceSettings>({ ...defaultCommerceSettings });
  const [profile, setProfile] = useState<ProfileSettings>({ ...defaultProfileSettings });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(defaultTwoFactorEnabled);
  const [integrations, setIntegrations] = useState<Integration[]>(() =>
    seedIntegrations.map((i) => ({ ...i, fields: i.fields.map((f) => ({ ...f })) }))
  );
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(() => seedApiKeys.map((k) => ({ ...k })));

  function saveGeneral(settings: GeneralSettings) {
    setGeneral({ ...settings });
  }

  function saveCommerce(settings: CommerceSettings) {
    setCommerce({ ...settings });
  }

  function saveProfile(settings: ProfileSettings) {
    setProfile({ ...settings });
  }

  function getIntegration(id: string) {
    return integrations.find((i) => i.id === id);
  }

  function connectIntegration(id: string) {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: "connected" as const, lastSynced: SETTINGS_TODAY } : i
      )
    );
  }

  function disconnectIntegration(id: string) {
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "disconnected" as const } : i))
    );
  }

  function getApiKey(id: string) {
    return apiKeys.find((k) => k.id === id);
  }

  function createApiKey(name: string): ApiKey {
    const key: ApiKey = {
      id: nextApiKeyId(apiKeys),
      name,
      createdAt: SETTINGS_TODAY,
      lastUsed: "Never",
      status: "active",
      masked: generateMaskedKey(name),
    };
    setApiKeys((prev) => [...prev, key]);
    return key;
  }

  function revokeApiKey(id: string) {
    setApiKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: "revoked" as const } : k)));
  }

  const value = useMemo(
    () => ({
      general,
      saveGeneral,
      commerce,
      saveCommerce,
      profile,
      saveProfile,
      twoFactorEnabled,
      setTwoFactorEnabled,
      integrations,
      getIntegration,
      connectIntegration,
      disconnectIntegration,
      apiKeys,
      getApiKey,
      createApiKey,
      revokeApiKey,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [general, commerce, integrations, apiKeys, profile, twoFactorEnabled]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}