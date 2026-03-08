import { useEffect, useMemo, useState } from "react";
import { commissionLedgerService, type CommissionLedgerRowWithNames, type CommissionStatus, type CommissionType, type CommissionSummary } from "@/services/commissionLedgerService";
import { investorNetworkService, type InvestorNetworkMember } from "@/services/investorNetworkService";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Download, Filter, BarChart3, Users } from "lucide-react";
import { CommissionFiltersBar, type CommissionFilters } from "@/components/commissions/CommissionFiltersBar";
import { CommissionCharts } from "@/components/commissions/CommissionCharts";
import { NetworkLeaderboard } from "@/components/commissions/NetworkLeaderboard";

function formatINR(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(safe))}`;
}

function isoDate(iso: string): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "-";
  return new Date(t).toISOString().slice(0, 10);
}

function statusBadge(status: CommissionStatus): { cls: string; label: string } {
  if (status === "paid") return { cls: "bg-emerald-500/15 text-emerald-200 border border-emerald-500/30", label: "Paid" };
  if (status === "approved") return { cls: "bg-cyan-500/15 text-cyan-200 border border-cyan-500/30", label: "Approved" };
  if (status === "cancelled") return { cls: "bg-slate-500/15 text-slate-200 border border-slate-500/30", label: "Cancelled" };
  return { cls: "bg-amber-500/15 text-amber-200 border border-amber-500/30", label: "Pending" };
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

function parseMoneyInput(v: string): number | undefined {
  const cleaned = String(v || "").trim();
  if (!cleaned) return undefined;
  const n = Number(cleaned.replace(/,/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

const DEFAULT_FILTERS: CommissionFilters = {
  status: "all",
  level: "all",
  type: "all",
  fromDate: "",
  toDate: "",
  minNet: "",
  maxNet: "",
};

export function CommissionsDashboard() {
  const [summary, setSummary] = useState<CommissionSummary | null>(null);
  const [feed, setFeed] = useState<CommissionLedgerRowWithNames[]>([]);
  const [network, setNetwork] = useState<InvestorNetworkMember[]>([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<"earnings" | "charts" | "network">("earnings");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const [status, setStatus] = useState<CommissionStatus | "all">("all");
  const [level, setLevel] = useState<number | "all">("all");
  const [type, setType] = useState<CommissionType | "all">("all");

  const [filters, setFilters] = useState<CommissionFilters>(DEFAULT_FILTERS);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const [s, f, n] = await Promise.all([
          commissionLedgerService.getMyCommissionSummary(),
          commissionLedgerService.getMyCommissionFeed({
            status,
            level,
            type,
            fromDate: filters.fromDate || undefined,
            toDate: filters.toDate || undefined,
            minNet: parseMoneyInput(filters.minNet),
            maxNet: parseMoneyInput(filters.maxNet),
            limit: 500,
          }),
          investorNetworkService.getNetworkMembers().catch(() => []),
        ]);
        if (!alive) return;
        setSummary(s);
        setFeed(f);
        setNetwork(n);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [status, level, type, filters.fromDate, filters.toDate, filters.minNet, filters.maxNet]);

  const filteredFeed = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return feed;
    return feed.filter((r) => {
      const name = (r.referralName || "").toLowerCase();
      const t = String(r.commissionType || "").toLowerCase();
      return name.includes(q) || t.includes(q) || String(r.commissionLevel || "").includes(q);
    });
  }, [feed, search]);

  const topNetworkByPayout = useMemo(() => {
    const rows = [...network];
    rows.sort((a, b) => Number(b.total_payout) - Number(a.total_payout));
    return rows.slice(0, 10);
  }, [network]);

  const exportMyCsv = () => {
    const csv = buildCsv(
      filteredFeed.map((r) => ({
        date: isoDate(r.createdAt),
        status: r.status,
        commission_type: r.commissionType,
        level: r.commissionLevel ?? "",
        from: r.referralName ?? "",
        source_amount: r.sourceAmount,
        gross: r.grossCommission,
        admin_charge: r.adminCharge,
        royalty_bonus: r.royaltyBonus,
        net: r.netCommission,
      }))
    );
    downloadText(`my-commissions-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  if (loading) {
    return (
      <Card className="border-slate-800 bg-slate-900/60 p-6">
        <div className="space-y-3">
          <div className="h-6 w-56 animate-pulse rounded bg-slate-800" />
          <div className="h-4 w-80 animate-pulse rounded bg-slate-800" />
          <div className="h-40 w-full animate-pulse rounded bg-slate-800" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border-slate-800 bg-slate-900/60 p-5">
          <div className="text-xs text-slate-400">Pending</div>
          <div className="mt-2 text-2xl font-bold text-amber-200">{formatINR(summary?.pendingNet ?? 0)}</div>
          <div className="mt-1 text-xs text-slate-500">{summary?.countByStatus.pending ?? 0} items</div>
        </Card>
        <Card className="border-slate-800 bg-slate-900/60 p-5">
          <div className="text-xs text-slate-400">Approved</div>
          <div className="mt-2 text-2xl font-bold text-cyan-200">{formatINR(summary?.approvedNet ?? 0)}</div>
          <div className="mt-1 text-xs text-slate-500">{summary?.countByStatus.approved ?? 0} items</div>
        </Card>
        <Card className="border-slate-800 bg-slate-900/60 p-5">
          <div className="text-xs text-slate-400">Paid</div>
          <div className="mt-2 text-2xl font-bold text-emerald-200">{formatINR(summary?.paidNet ?? 0)}</div>
          <div className="mt-1 text-xs text-slate-500">{summary?.countByStatus.paid ?? 0} items</div>
        </Card>
        <Card className="border-slate-800 bg-slate-900/60 p-5">
          <div className="text-xs text-slate-400">Last 30 days</div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{formatINR(summary?.last30DaysNet ?? 0)}</div>
          <div className="mt-1 text-xs text-slate-500">Net commissions</div>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={filtersOpen ? "default" : "outline"}
          className={filtersOpen ? "bg-slate-800 hover:bg-slate-700" : "border-slate-800"}
          onClick={() => setFiltersOpen((v) => !v)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Add filters to commissions
        </Button>

        <Button
          variant={tab === "charts" ? "default" : "outline"}
          className={tab === "charts" ? "bg-slate-800 hover:bg-slate-700" : "border-slate-800"}
          onClick={() => setTab("charts")}
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          Visualize commission data
        </Button>

        <Button
          variant={tab === "network" ? "default" : "outline"}
          className={tab === "network" ? "bg-slate-800 hover:bg-slate-700" : "border-slate-800"}
          onClick={() => setTab("network")}
        >
          <Users className="mr-2 h-4 w-4" />
          Enhance comparison features
        </Button>

        <div className="flex-1" />

        <Button variant="outline" className="border-slate-800" onClick={exportMyCsv}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {filtersOpen && (
        <CommissionFiltersBar
          value={filters}
          onChange={setFilters}
          onReset={() => {
            setFilters(DEFAULT_FILTERS);
            setStatus("all");
            setLevel("all");
            setType("all");
            setSearch("");
          }}
        />
      )}

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList className="bg-slate-900/60 border border-slate-800">
          <TabsTrigger value="earnings" onClick={() => setTab("earnings")}>
            Earnings
          </TabsTrigger>
          <TabsTrigger value="charts" onClick={() => setTab("charts")}>
            Charts
          </TabsTrigger>
          <TabsTrigger value="network" onClick={() => setTab("network")}>
            Network comparison
          </TabsTrigger>
        </TabsList>

        <TabsContent value="earnings" className="mt-4 space-y-4">
          <Card className="border-slate-800 bg-slate-900/60 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="w-full md:w-56">
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by member/type/level"
                    className="border-slate-800 bg-slate-950/40"
                  />
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge className="bg-slate-500/15 text-slate-200 border border-slate-500/30">
                    Rows: {filteredFeed.length}
                  </Badge>
                  <Badge className="bg-cyan-500/15 text-cyan-200 border border-cyan-500/30">
                    Filter: {status}/{String(level)}/{type}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="border-slate-800" onClick={() => setStatus("all")}>
                  Status: All
                </Button>
                <Button variant="outline" className="border-slate-800" onClick={() => setLevel("all")}>
                  Level: All
                </Button>
                <Button variant="outline" className="border-slate-800" onClick={() => setType("all")}>
                  Type: All
                </Button>
              </div>
            </div>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60">
            <div className="p-4 border-b border-slate-800">
              <div className="text-sm font-semibold text-slate-100">Commission ledger</div>
              <div className="text-xs text-slate-400">Your earnings by referral level and status.</div>
            </div>

            <div className="p-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead className="text-right">Source</TableHead>
                    <TableHead className="text-right">Gross</TableHead>
                    <TableHead className="text-right">Admin</TableHead>
                    <TableHead className="text-right">Net</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeed.map((r) => {
                    const sb = statusBadge(r.status);
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="text-slate-300">{isoDate(r.createdAt)}</TableCell>
                        <TableCell>
                          <Badge className={sb.cls}>{sb.label}</Badge>
                        </TableCell>
                        <TableCell className="text-slate-200">{r.referralName || "-"}</TableCell>
                        <TableCell className="text-slate-400">{r.commissionType}</TableCell>
                        <TableCell className="text-slate-300">{r.commissionLevel ?? "-"}</TableCell>
                        <TableCell className="text-right text-slate-300">{formatINR(r.sourceAmount)}</TableCell>
                        <TableCell className="text-right text-slate-200">{formatINR(r.grossCommission)}</TableCell>
                        <TableCell className="text-right text-slate-400">{formatINR(r.adminCharge)}</TableCell>
                        <TableCell className="text-right font-semibold text-emerald-200">{formatINR(r.netCommission)}</TableCell>
                      </TableRow>
                    );
                  })}
                  {!filteredFeed.length && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-slate-400 py-10">
                        No commissions found for the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="mt-4 space-y-4">
          <CommissionCharts rows={filteredFeed} />
        </TabsContent>

        <TabsContent value="network" className="mt-4 space-y-4">
          <NetworkLeaderboard />

          <Card className="border-slate-800 bg-slate-900/60 p-5">
            <div className="text-sm font-semibold text-slate-100">Top network by total payout (proxy)</div>
            <div className="text-xs text-slate-400">
              This uses your existing network visibility. If commission ledger visibility is restricted, this remains a reliable comparison proxy.
            </div>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60">
            <div className="p-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead className="text-right">Investment</TableHead>
                    <TableHead className="text-right">Total payout</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topNetworkByPayout.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="text-slate-200">{m.full_name}</TableCell>
                      <TableCell className="text-slate-400">{m.investor_level}</TableCell>
                      <TableCell className="text-right text-slate-300">{formatINR(Number(m.investment_amount) || 0)}</TableCell>
                      <TableCell className="text-right font-semibold text-cyan-200">{formatINR(Number(m.total_payout) || 0)}</TableCell>
                    </TableRow>
                  ))}
                  {!topNetworkByPayout.length && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-slate-400 py-10">
                        No network data available yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}