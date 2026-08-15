import { Landmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PayoutStatusBadge } from "./PayoutStatusBadge";
import { SignedAmount } from "./SignedAmount";
import { formatDate } from "@/lib/format";
import type { Payout } from "@/lib/data/finance";

interface PayoutCardsProps {
  payouts: Payout[];
  symbol: string;
}

export function PayoutCards({ payouts, symbol }: PayoutCardsProps) {
  return (
    <ul className="space-y-3">
      {payouts.map((p) => (
        <li key={p.id}>
          <Card className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Landmark className="h-4 w-4 text-muted-foreground" aria-hidden />
                {p.id}
              </span>
              <PayoutStatusBadge status={p.status} />
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">{formatDate(p.datetime)}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{p.destination}</p>
              </div>
              <SignedAmount value={p.amount} symbol={symbol} income />
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}