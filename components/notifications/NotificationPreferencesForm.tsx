"use client";

import { useRef, useState } from "react";
import { RotateCcw, Save, Undo2 } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useNotifications } from "@/contexts/NotificationsContext";
import {
  categoryIsOff,
  defaultNotificationPreferences,
  notificationPreferenceCategories,
  type NotificationPreferences,
} from "@/lib/data/notifications";

function clonePrefs(prefs: NotificationPreferences): NotificationPreferences {
  return JSON.parse(JSON.stringify(prefs)) as NotificationPreferences;
}

export function NotificationPreferencesForm() {
  const { preferences, savePreferences } = useNotifications();

  const [draft, setDraft] = useState<NotificationPreferences>(() => clonePrefs(preferences));
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showNotice(message: string) {
    setNotice(message);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 3000);
  }

  function setToggle(categoryId: string, key: string, value: boolean) {
    setDraft((prev) => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], [key]: value },
    }));
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(preferences);

  function save() {
    savePreferences(draft);
    showNotice("Notification preferences saved.");
  }

  function discard() {
    setDraft(clonePrefs(preferences));
  }

  function resetDefaults() {
    setDraft(clonePrefs(defaultNotificationPreferences));
    showNotice("Preferences reset to defaults — save to apply.");
  }

  return (
    <div className="space-y-6">
      {notice && <Alert variant="success">{notice}</Alert>}

      {dirty && (
        <Alert variant="warning">You have unsaved changes to your notification preferences.</Alert>
      )}

      <div className="grid gap-4">
        {notificationPreferenceCategories.map((category) => {
          const off = categoryIsOff(draft, category.id);
          return (
            <Card key={category.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle>{category.label}</CardTitle>
                  <CardDescription className="mt-0.5">{category.description}</CardDescription>
                </div>
                {off && (
                  <span className="rounded-full bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
                    All off
                  </span>
                )}
              </CardHeader>
              <CardContent className="divide-y divide-border">
                {category.options.map((option) => {
                  const checked = Boolean(draft[category.id]?.[option.key]);
                  return (
                    <div
                      key={option.key}
                      className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <div>
                        <label
                          htmlFor={`pref-${category.id}-${option.key}`}
                          className="text-sm font-medium text-foreground"
                        >
                          {option.label}
                        </label>
                        <p className="mt-0.5 text-sm text-muted-foreground">{option.description}</p>
                      </div>
                      <Switch
                        id={`pref-${category.id}-${option.key}`}
                        checked={checked}
                        onCheckedChange={(value) => setToggle(category.id, option.key, value)}
                        aria-label={`${option.label} notifications`}
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" onClick={save} disabled={!dirty}>
          <Save className="h-4 w-4" aria-hidden />
          Save changes
        </Button>
        <Button variant="secondary" onClick={discard} disabled={!dirty}>
          <Undo2 className="h-4 w-4" aria-hidden />
          Discard
        </Button>
        <Button variant="ghost" onClick={resetDefaults}>
          <RotateCcw className="h-4 w-4" aria-hidden />
          Reset to defaults
        </Button>
      </div>
    </div>
  );
}