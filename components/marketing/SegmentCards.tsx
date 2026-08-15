"use client";

import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney, formatNumber, timeAgo } from "@/lib/format";
import type { Segment } from "@/lib/data/marketing";

export function SegmentCards({ segments, symbol }: { segments: Segment[]; symbol: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {segments.map((segment) => (
        <Card key={segment.id} className="flex flex-col">
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" aria-hidden />
              {segment.name}
            </CardTitle>
            <Badge variant="outline">{formatNumber(segment.count)} customers</Badge>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <p className="text-sm text-muted-foreground">{segment.description}</p>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Criteria:</span> {segment.criteria}
            </p>
            <dl className="grid grid-cols-3 gap-3 rounded-lg border border-border bg-muted/40 p-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Revenue</dt>
                <dd className="font-semibold text-foreground">{formatMoney(segment.revenue, symbol)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Avg order value</dt>
                <dd className="font-semibold text-foreground">{formatMoney(segment.aov, symbol)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Last activity</dt>
                <dd className="font-semibold text-foreground">{timeAgo(segment.lastActivity)}</dd>
              </div>
            </dl>
            <div className="mt-auto pt-1">
              <Link href="/audience">
                <Button variant="secondary" size="sm" className="w-full gap-2">
                  Open audience
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}