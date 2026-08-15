import { ChevronRight } from "lucide-react";

interface Segment {
  label: string;
  href?: string;
}

export default function Breadcrumb({ segments }: { segments: Segment[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm">
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        return (
          <span key={seg.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
            {isLast ? (
              <span aria-current="page" className="font-medium text-foreground">
                {seg.label}
              </span>
            ) : (
              <span className="text-muted-foreground">{seg.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
