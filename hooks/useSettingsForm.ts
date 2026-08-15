"use client";

import { useCallback, useMemo, useRef, useState } from "react";

export interface SettingsNotice {
  variant: "success" | "warning";
  message: string;
}

/**
 * Reusable draft/validation lifecycle for settings forms.
 * Keeps a "saved" snapshot so forms can report unsaved changes and
 * support Save, Discard and Reset-to-defaults without real persistence.
 */
export function useSettingsForm<T>(savedValue: T, defaults: T) {
  const [draft, setDraft] = useState<T>(() => JSON.parse(JSON.stringify(savedValue)) as T);
  const [saved, setSaved] = useState<T>(() => JSON.parse(JSON.stringify(savedValue)) as T);
  const [notice, setNotice] = useState<SettingsNotice | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(saved),
    [draft, saved]
  );

  function showNotice(next: SettingsNotice, duration = 3000) {
    setNotice(next);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), duration);
  }

  const setField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const patch = useCallback((partial: Partial<T>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  }, []);

  function save(onSave: (value: T) => void) {
    setSubmitting(true);
    window.setTimeout(() => {
      setSaved(JSON.parse(JSON.stringify(draft)) as T);
      onSave(JSON.parse(JSON.stringify(draft)) as T);
      setSubmitting(false);
      showNotice({ variant: "success", message: "Settings saved." });
    }, 400);
  }

  function discard() {
    setDraft(JSON.parse(JSON.stringify(saved)) as T);
    setNotice(null);
  }

  function resetDefaults() {
    setDraft(JSON.parse(JSON.stringify(defaults)) as T);
    showNotice({ variant: "warning", message: "Reset to defaults — save to apply." });
  }

  return {
    draft,
    setField,
    patch,
    dirty,
    notice,
    showNotice,
    submitting,
    save,
    discard,
    resetDefaults,
  };
}