import Link from "next/link";
import { useEffect, useState } from "react";
import { commissionLedgerService, CommissionSummary } from "@/services/commissionLedgerService";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function formatINR(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(safe))}`;
}

export function CommissionSnapshotBar() {
  const [summary, setSummary] = useState<CommissionSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const s = await commissionLedgerService.getMyCommissionSummary();
        if (alive) setSummary(s);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <Card className="border-slate-800 bg-slate-900/60 px-4 py-3">
        <div className="h-4 w-64 animate-pulse rounded bg-slate-800" />
      </Card>
    );
  }

  if (!summary) return null;

  return (
    <Card className="border-slate-800 bg-slate-900/60 px-4 py-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-200">
          <span className="font-semibold">Commissions</span>
          <Badge className="bg-amber-500/15 text-amber-200 border border-amber-500/30">
            Pending: {formatINR(summary.pendingNet)}
          </Badge>
          <Badge className="bg-cyan-500/15 text-cyan-200 border border-cyan-500/30">
            Approved: {formatINR(summary.approvedNet)}
          </Badge>
          <Badge className="bg-emerald-500/15 text-emerald-200 border border-emerald-500/30">
            Paid: {formatINR(summary.paidNet)}
          </Badge>
          <span className="text-slate-400">Last 30d: {formatINR(summary.last30DaysNet)}</span>
        </div>

        <Link
          href="/dashboard/investor/commissions"
          className="text-sm font-medium text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
        >
          View details
        </Link>
      </div>
    </Card>
  );
}