"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  seedNotifications,
  defaultNotificationPreferences,
  type AppNotification,
  type NotificationPreferences,
} from "@/lib/data/notifications";

interface NotificationsContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  importantCount: number;
  getNotification: (id: string) => AppNotification | undefined;
  markRead: (id: string) => void;
  markUnread: (id: string) => void;
  toggleRead: (id: string) => void;
  markAllRead: () => void;
  deleteNotification: (id: string) => void;
  deleteNotifications: (ids: string[]) => void;
  toggleImportant: (id: string) => void;
  preferences: NotificationPreferences;
  setPreference: (category: string, key: string, value: boolean) => void;
  savePreferences: (prefs: NotificationPreferences) => void;
  resetPreferences: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    seedNotifications.map((n) => ({ ...n }))
  );
  const [preferences, setPreferences] = useState<NotificationPreferences>(() =>
    JSON.parse(JSON.stringify(defaultNotificationPreferences)) as NotificationPreferences
  );

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const importantCount = useMemo(() => notifications.filter((n) => n.important).length, [notifications]);

  function getNotification(id: string) {
    return notifications.find((n) => n.id === id);
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function markUnread(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: false } : n)));
  }

  function toggleRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function deleteNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function deleteNotifications(ids: string[]) {
    const set = new Set(ids);
    setNotifications((prev) => prev.filter((n) => !set.has(n.id)));
  }

  function toggleImportant(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, important: !n.important } : n))
    );
  }

  function setPreference(category: string, key: string, value: boolean) {
    setPreferences((prev) => ({
      ...prev,
      [category]: { ...prev[category], [key]: value },
    }));
  }

  function savePreferences(prefs: NotificationPreferences) {
    setPreferences(JSON.parse(JSON.stringify(prefs)) as NotificationPreferences);
  }

  function resetPreferences() {
    setPreferences(JSON.parse(JSON.stringify(defaultNotificationPreferences)) as NotificationPreferences);
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        importantCount,
        getNotification,
        markRead,
        markUnread,
        toggleRead,
        markAllRead,
        deleteNotification,
        deleteNotifications,
        toggleImportant,
        preferences,
        setPreference,
        savePreferences,
        resetPreferences,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}