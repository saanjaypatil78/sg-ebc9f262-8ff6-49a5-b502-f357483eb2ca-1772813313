import { useEffect, useMemo, useState } from "react";
import { commissionLedgerService, NetworkCommissionLeaderboardRow } from "@/services/commissionLedgerService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

function formatINR(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(safe))}`;
}

function buildCsv(rows: Array<Record<string, unknown>>): string {
  const headers = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    const needs = /[",\n]/.test(s);
    return needs ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  rows.forEach((r) => {
    lines.push(headers.map((h) => escape(r[h])).join(","));
  });
  return lines.join("\n");
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function NetworkLeaderboard() {
  const [days, setDays] = useState("30");
  const [includeCancelled, setIncludeCancelled] = useState(false);
  const [rows, setRows] = useState<NetworkCommissionLeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [myUserId, setMyUserId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.auth.getUser();
      setMyUserId(data.user?.id ?? null);

      const dataRows = await commissionLedgerService.getVisibleNetworkLeaderboard({
        days: Number(days),
        includeCancelled,
      });
      setRows(dataRows);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [days, includeCancelled]);

  const myRank = useMemo(() => {
    if (!myUserId) return null;
    const idx = rows.findIndex((r) => r.userId === myUserId);
    return idx >= 0 ? idx + 1 : null;
  }, [rows, myUserId]);

  const exportCsv = () => {
    const csv = buildCsv(
      rows.map((r, idx) => ({
        rank: idx + 1,
        member: r.fullName,
        net_commission: r.netCommission,
        gross_commission: r.grossCommission,
        admin_charge: r.adminCharge,
        items_count: r.itemsCount,
      }))
    );
    downloadText(`network-commission-leaderboard-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  return (
    <div className="space-y-4">
      <Card className="border-slate-800 bg-slate-900/60 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-100">Network commission leaderboard</div>
            <div className="text-xs text-slate-400">
              Shows commission totals only for the network you’re allowed to view.
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="w-full sm:w-48">
              <Select value={days} onValueChange={setDays}>
                <SelectTrigger className="border-slate-800 bg-slate-950/40">
                  <SelectValue placeholder="Window" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="180">Last 180 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="border-slate-800"
              onClick={() => setIncludeCancelled((v) => !v)}
            >
              {includeCancelled ? "Exclude cancelled" : "Include cancelled"}
            </Button>

            <Button variant="outline" className="border-slate-800" onClick={load}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>

            <Button variant="outline" className="border-slate-800" onClick={exportCsv} disabled={!rows.length}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <Badge className="bg-slate-500/15 text-slate-200 border border-slate-500/30">
            Members: {rows.length}
          </Badge>
          {myRank && (
            <Badge className="bg-cyan-500/15 text-cyan-200 border border-cyan-500/30">
              Your rank: #{myRank}
            </Badge>
          )}
        </div>
      </Card>

      <Card className="border-slate-800 bg-slate-900/60">
        <div className="p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">#</TableHead>
                <TableHead>Member</TableHead>
                <TableHead className="text-right">Net</TableHead>
                <TableHead className="text-right">Gross</TableHead>
                <TableHead className="text-right">Admin</TableHead>
                <TableHead className="text-right">Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-10">
                    Loading leaderboard…
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                rows.map((r, idx) => (
                  <TableRow key={r.userId}>
                    <TableCell className="text-slate-400">{idx + 1}</TableCell>
                    <TableCell className="text-slate-200">
                      {r.fullName}{" "}
                      {myUserId && r.userId === myUserId && (
                        <Badge className="ml-2 bg-emerald-500/15 text-emerald-200 border border-emerald-500/30">
                          You
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-cyan-200">{formatINR(r.netCommission)}</TableCell>
                    <TableCell className="text-right text-slate-300">{formatINR(r.grossCommission)}</TableCell>
                    <TableCell className="text-right text-slate-400">{formatINR(r.adminCharge)}</TableCell>
                    <TableCell className="text-right text-slate-300">{r.itemsCount}</TableCell>
                  </TableRow>
                ))}

              {!loading && !rows.length && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-10">
                    No data available for your current visibility window.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}