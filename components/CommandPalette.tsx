"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const navLinks = [
  { label: "Overview", href: "/" },
  { label: "Revenue", href: "/revenue" },
  { label: "Audience", href: "/audience" },
  { label: "Products", href: "/products" },
  { label: "Orders", href: "/orders" },
  { label: "Finance", href: "/finance" },
  { label: "Marketing", href: "/marketing" },
  { label: "Notifications", href: "/notifications" },
  { label: "Activity", href: "/activity" },
  { label: "Team", href: "/team" },
  { label: "Settings", href: "/settings" },
  { label: "Settings - Profile", href: "/settings/profile" },
  { label: "Settings - Appearance", href: "/settings/appearance" },
  { label: "Settings - Commerce", href: "/settings/commerce" },
  { label: "Settings - Security", href: "/settings/security" },
  { label: "Settings - Integrations", href: "/settings/integrations" },
  { label: "Settings - Developers", href: "/settings/developers" },
  { label: "Settings - System", href: "/settings/system" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const filtered = navLinks.filter((l) =>
    l.label.toLowerCase().includes(query.toLowerCase())
  );

  function navigate(href: string) {
    router.push(href);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search pages"
        className="w-96 rounded-xl border border-border bg-card p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <div className="mt-2 space-y-1">
          {filtered.map((l) => (
            <button
              key={l.href}
              onClick={() => navigate(l.href)}
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
            >
              {l.label}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-3 py-2 text-sm text-muted-foreground">No results</p>
          )}
        </div>
      </div>
    </div>
  );
}
