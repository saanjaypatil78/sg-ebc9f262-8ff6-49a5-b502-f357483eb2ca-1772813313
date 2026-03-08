import { Card } from "@/components/ui/card";
import type { CommissionLedgerRowWithNames, CommissionStatus } from "@/services/commissionLedgerService";

function toNumber(input: unknown): number {
  const n = typeof input === "number" ? input : Number(input);
  return Number.isFinite(n) ? n : 0;
}

function formatINR(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(safe))}`;
}

function statusLabel(s: CommissionStatus): string {
  if (s === "pending") return "Pending";
  if (s === "approved") return "Approved";
  if (s === "paid") return "Paid";
  return "Cancelled";
}

export function CommissionCharts(props: { rows: CommissionLedgerRowWithNames[] }) {
  const rows = props.rows;

  const monthMap: Record<string, number> = {};
  rows.forEach((r) => {
    const key = String(r.createdAt || "").slice(0, 7);
    if (!/^\d{4}-\d{2}$/.test(key)) return;
    monthMap[key] = (monthMap[key] || 0) + toNumber(r.netCommission);
  });

  const months = Object.keys(monthMap).sort().slice(-6);
  const monthValues = months.map((m) => ({ month: m, net: monthMap[m] || 0 }));
  const maxNet = Math.max(...monthValues.map((m) => m.net), 1);

  const statusNet: Record<CommissionStatus, number> = {
    pending: 0,
    approved: 0,
    paid: 0,
    cancelled: 0,
  };

  rows.forEach((r) => {
    statusNet[r.status] += toNumber(r.netCommission);
  });

  const statusItems = (Object.keys(statusNet) as CommissionStatus[]).map((s) => ({
    status: s,
    net: statusNet[s],
  }));

  const totalStatusNet = Math.max(statusItems.reduce((a, b) => a + b.net, 0), 1);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="border-slate-800 bg-slate-900/60 p-5">
        <div className="text-sm font-semibold text-slate-100">Monthly net commissions</div>
        <div className="text-xs text-slate-400">Based on your current filtered ledger rows.</div>

        <div className="mt-4 grid grid-cols-6 gap-2 items-end h-40">
          {monthValues.map((m) => {
            const h = Math.max(6, Math.round((m.net / maxNet) * 160));
            return (
              <div key={m.month} className="flex flex-col items-center gap-2">
                <div className="w-full rounded bg-cyan-500/20 border border-cyan-500/30 relative overflow-hidden" style={{ height: 170 }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500/70 to-indigo-500/40"
                    style={{ height: `${h}px` }}
                    aria-label={`${m.month} net ${formatINR(m.net)}`}
                  />
                </div>
                <div className="text-[11px] text-slate-400">{m.month}</div>
              </div>
            );
          })}
          {!monthValues.length && (
            <div className="col-span-6 text-center text-sm text-slate-400 py-10">
              Not enough data to render charts yet.
            </div>
          )}
        </div>

        {monthValues.length > 0 && (
          <div className="mt-4 text-xs text-slate-400">
            Peak month:{" "}
            <span className="text-slate-200 font-medium">
              {monthValues.slice().sort((a, b) => b.net - a.net)[0]?.month}
            </span>
          </div>
        )}
      </Card>

      <Card className="border-slate-800 bg-slate-900/60 p-5">
        <div className="text-sm font-semibold text-slate-100">Net by status</div>
        <div className="text-xs text-slate-400">How your net commissions distribute by workflow status.</div>

        <div className="mt-4 space-y-3">
          {statusItems.map((s) => {
            const pct = Math.round((s.net / totalStatusNet) * 100);
            const bar =
              s.status === "paid"
                ? "from-emerald-500/70 to-emerald-500/20"
                : s.status === "approved"
                  ? "from-cyan-500/70 to-cyan-500/20"
                  : s.status === "pending"
                    ? "from-amber-500/70 to-amber-500/20"
                    : "from-slate-500/70 to-slate-500/20";

            return (
              <div key={s.status} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{statusLabel(s.status)}</span>
                  <span className="text-slate-200">{formatINR(s.net)} ({pct}%)</span>
                </div>
                <div className="h-2 rounded bg-slate-800 overflow-hidden border border-slate-700">
                  <div className={`h-full bg-gradient-to-r ${bar}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}