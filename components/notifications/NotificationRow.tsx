"use client";

import Link from "next/link";
import { CheckCheck, MailOpen, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ModuleBadge } from "./ModuleBadge";
import { NotificationIcon } from "./NotificationIcon";
import { PriorityBadge } from "./PriorityBadge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { notificationTime, type AppNotification } from "@/lib/data/notifications";

interface NotificationRowProps {
  notification: AppNotification;
  selected: boolean;
  onToggleSelect: () => void;
  onMarkRead: () => void;
  onMarkUnread: () => void;
  onToggleImportant: () => void;
  onDelete: () => void;
}

export function NotificationRow({
  notification,
  selected,
  onToggleSelect,
  onMarkRead,
  onMarkUnread,
  onToggleImportant,
  onDelete,
}: NotificationRowProps) {
  const unread = !notification.read;

  return (
    <li
      aria-label={`${unread ? "Unread" : "Read"} notification: ${notification.title}`}
      className={cn(
        "group flex gap-3 border-b border-border p-3 transition-colors sm:p-4",
        unread ? "bg-muted/40 hover:bg-muted/60" : "hover:bg-muted/40"
      )}
    >
      <div className="flex items-start pt-1.5">
        <Checkbox
          checked={selected}
          onChange={onToggleSelect}
          aria-label={`Select ${notification.title}`}
        />
      </div>

      <NotificationIcon module={notification.module} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {unread && (
            <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
              New
            </span>
          )}
          {notification.resourceHref ? (
            <Link
              href={notification.resourceHref}
              onClick={onMarkRead}
              className={cn(
                "min-w-0 text-sm transition-colors hover:text-primary",
                unread ? "font-semibold text-foreground" : "font-medium text-foreground/90"
              )}
            >
              {notification.title}
            </Link>
          ) : (
            <span className="min-w-0 text-sm font-medium text-foreground/90">
              {notification.title}
            </span>
          )}
          <button
            type="button"
            onClick={onToggleImportant}
            aria-pressed={notification.important}
            aria-label={
              notification.important
                ? `Remove ${notification.title} from important`
                : `Mark ${notification.title} as important`
            }
            title={notification.important ? "Remove from important" : "Mark as important"}
            className="rounded-md p-1 transition-colors hover:bg-muted"
          >
            <Star
              className={cn(
                "h-4 w-4",
                notification.important ? "fill-warning text-warning" : "text-muted-foreground"
              )}
              aria-hidden
            />
          </button>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{notification.description}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <ModuleBadge module={notification.module} />
          <span className="font-medium text-foreground/80">{notification.resource}</span>
          <span aria-hidden>·</span>
          <time title={formatDate(notification.createdAt)} dateTime={notification.createdAt}>
            {notificationTime(notification.createdAt)}
          </time>
          <PriorityBadge priority={notification.priority} />
        </div>
      </div>

      <div className="flex shrink-0 items-start gap-1 pt-1">
        {unread ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMarkRead}
            aria-label={`Mark ${notification.title} as read`}
            title="Mark as read"
            className="h-8 w-8"
          >
            <CheckCheck className="h-4 w-4" aria-hidden />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMarkUnread}
            aria-label={`Mark ${notification.title} as unread`}
            title="Mark as unread"
            className="h-8 w-8"
          >
            <MailOpen className="h-4 w-4" aria-hidden />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          aria-label={`Delete ${notification.title}`}
          title="Delete"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </li>
  );
}