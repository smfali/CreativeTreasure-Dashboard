import { Landmark } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { PayoutStatusBadge } from "./PayoutStatusBadge";
import { SignedAmount } from "./SignedAmount";
import { formatMoney, formatDate } from "@/lib/format";
import type { Payout } from "@/lib/data/finance";

interface PayoutTableProps {
  payouts: Payout[];
  symbol: string;
}

export function PayoutTable({ payouts, symbol }: PayoutTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Payout</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payouts.map((p) => (
          <TableRow key={p.id}>
            <TableCell>
              <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Landmark className="h-4 w-4 text-muted-foreground" aria-hidden />
                {p.id}
              </span>
            </TableCell>
            <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
              {formatDate(p.datetime)}
            </TableCell>
            <TableCell className="text-right">
              <SignedAmount value={p.amount} symbol={symbol} income />
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">{p.destination}</TableCell>
            <TableCell>
              <PayoutStatusBadge status={p.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}