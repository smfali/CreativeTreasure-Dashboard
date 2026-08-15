"use client";

import { Alert } from "@/components/ui/alert";
import type { SettingsNotice } from "@/hooks/useSettingsForm";

/** Renders the transient success/unsaved-change notices for settings forms. */
export function SettingsNotices({
  notice,
  dirty,
}: {
  notice: SettingsNotice | null;
  dirty: boolean;
}) {
  return (
    <>
      {notice && (
        <Alert role="status" variant={notice.variant === "success" ? "success" : "warning"}>
          {notice.message}
        </Alert>
      )}
      {dirty && (
        <Alert variant="warning">You have unsaved changes to these settings.</Alert>
      )}
    </>
  );
}