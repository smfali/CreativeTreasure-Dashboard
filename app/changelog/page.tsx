import Breadcrumb from "@/components/Breadcrumb";
import { Badge } from "@/components/ui/badge";

const releases = [
  { version: "v1.1.0", date: "Coming Soon", status: "Upcoming", changes: ["Real-time analytics", "Team collaboration", "API access"] },
  { version: "v1.0.0", date: "Jul 15, 2026", status: "Live", changes: ["Initial release", "Revenue dashboard", "Subscriber metrics", "Growth charts"] },
];

export default function ChangelogPage() {
  return (
    <div className="p-8">
      <Breadcrumb segments={[{ label: "Home" }, { label: "Changelog" }]} />
      <h1 className="heading-page mb-6">Changelog</h1>
      <div className="space-y-8 max-w-2xl">
        {releases.map((r) => (
          <div key={r.version} className="border-l-2 border-border pl-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg font-semibold text-foreground">{r.version}</span>
              <span className="text-xs text-muted-foreground">{r.date}</span>
              {r.status === "Upcoming" && <Badge variant="info">Upcoming</Badge>}
              {r.status === "Live" && <Badge variant="success">Live</Badge>}
            </div>
            <ul className="space-y-1">
              {r.changes.map((c) => (
                <li key={c} className="text-sm text-muted-foreground">- {c}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
