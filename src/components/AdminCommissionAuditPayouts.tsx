import { useEffect, useMemo, useState } from "react";
import { commissionLedgerService, CommissionLedgerRowWithNames, CommissionStatus } from "@/services/commissionLedgerService";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Download, RefreshCw, CheckCircle2, Wrench } from "lucide-react";

const ADMIN_CHARGE_RATE = 0.1;

function round2(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function formatINR(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(safe))}`;
}

function isoDate(iso: string): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "-";
  return new Date(t).toISOString().slice(0, 10);
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

function auditRow(row: CommissionLedgerRowWithNames): { ok: boolean; issues: string[]; expectedAdmin: number; expectedNet: number } {
  const expectedAdmin = round2(row.grossCommission * ADMIN_CHARGE_RATE);
  const expectedNet = round2(row.grossCommission - row.adminCharge + row.royaltyBonus);

  const issues: string[] = [];
  if (Math.abs(expectedAdmin - row.adminCharge) > 0.5) issues.push("admin_charge_mismatch");
  if (Math.abs(expectedNet - row.netCommission) > 0.5) issues.push("net_mismatch");

  if (row.commissionLevel && row.commissionType.startsWith("referral_level_")) {
    const expectedLevel = Number(row.commissionType.replace("referral_level_", ""));
    if (expectedLevel !== row.commissionLevel) issues.push("type_level_mismatch");
  }

  return { ok: issues.length === 0, issues, expectedAdmin, expectedNet };
}

function randomBatchId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `batch_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function parseMoneyInput(v: string): number | undefined {
  const cleaned = String(v || "").trim();
  if (!cleaned) return undefined;
  const n = Number(cleaned.replace(/,/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

export function AdminCommissionAuditPayouts() {
  const [rows, setRows] = useState<CommissionLedgerRowWithNames[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<CommissionStatus | "all">("ACCRUED");
  const [type, setType] = useState<any>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minNet, setMinNet] = useState("");
  const [maxNet, setMaxNet] = useState("");
  const [onlyMismatches, setOnlyMismatches] = useState(false);

  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const load = async () => {
    setLoading(true);
    try {
      const data = await commissionLedgerService.adminListCommissions({
        status,
        type: type === "all" ? "all" : type,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        minNet: parseMoneyInput(minNet),
        maxNet: parseMoneyInput(maxNet),
        limit: 800,
      });
      setRows(data);
      setSelected({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  const audited = useMemo(() => {
    return rows.map((r) => ({
      row: r,
      audit: auditRow(r),
    }));
  }, [rows]);

  const displayRows = useMemo(() => {
    if (!onlyMismatches) return audited;
    return audited.filter((a) => !a.audit.ok);
  }, [audited, onlyMismatches]);

  const selectedIds = useMemo(() => {
    return displayRows.filter((a) => selected[a.row.id]).map((a) => a.row.id);
  }, [displayRows, selected]);

  const selectedNet = useMemo(() => {
    return round2(
      displayRows
        .filter((a) => selected[a.row.id])
        .reduce((acc, a) => acc + a.row.netCommission, 0)
    );
  }, [displayRows, selected]);

  const exportCsv = () => {
    const csv = buildCsv(
      displayRows.map(({ row, audit }) => ({
        date: isoDate(row.createdAt),
        status: row.status,
        user_id: row.userId,
        from: row.referralName ?? "",
        type: row.commissionType,
        level: row.commissionLevel ?? "",
        source_amount: row.sourceAmount,
        gross: row.grossCommission,
        admin_charge: row.adminCharge,
        expected_admin: audit.expectedAdmin,
        royalty_bonus: row.royaltyBonus,
        net: row.netCommission,
        expected_net: audit.expectedNet,
        audit_ok: audit.ok,
        audit_issues: audit.issues.join("|"),
      }))
    );
    downloadText(`commission-audit-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const markSelectedApproved = async () => {
    if (!selectedIds.length) return;

    const ok = window.confirm(`Mark ${selectedIds.length} records as APPROVED?`);
    if (!ok) return;

    const success = await commissionLedgerService.adminMarkApproved({ ids: selectedIds });
    if (success) await load();
  };

  const markSelectedPaid = async () => {
    if (!selectedIds.length) return;

    const ok = window.confirm(
      `Mark ${selectedIds.length} commission records as PAID? Total net: ${formatINR(selectedNet)}`
    );
    if (!ok) return;

    const batchId = randomBatchId();
    const success = await commissionLedgerService.adminMarkPaid({
      ids: selectedIds,
      payoutBatchId: batchId,
    });

    if (success) await load();
  };

  const fixSelectedMismatches = async () => {
    if (!selectedIds.length) return;

    const targets = displayRows
      .filter((a) => selected[a.row.id] && !a.audit.ok)
      .map((a) => ({
        id: a.row.id,
        adminCharge: a.audit.expectedAdmin,
        netCommission: a.audit.expectedNet,
      }));

    if (!targets.length) {
      window.alert("No mismatches selected.");
      return;
    }

    const ok = window.confirm(`Fix computed fields for ${targets.length} mismatched rows?`);
    if (!ok) return;

    for (const t of targets) {
      await commissionLedgerService.adminUpdateComputedFields(t);
    }

    await load();
  };

  return (
    <div className="space-y-4">
      <Card className="border-slate-800 bg-slate-900/60 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-semibold text-white">Commission Audit & Payouts</div>
            <div className="text-xs text-slate-400">
              Audit ledger consistency, export batches, and mark payouts.
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="w-full sm:w-56">
              <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                <SelectTrigger className="border-slate-800 bg-slate-950/40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="ACCRUED">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="REJECTED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="border-slate-800" onClick={load}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>

            <Button variant="outline" className="border-slate-800" onClick={exportCsv}>
              <Download className="mr-2 h-4 w-4" />
              Export audit CSV
            </Button>

            <Button variant="outline" className="border-slate-800" onClick={() => setOnlyMismatches((v) => !v)}>
              {onlyMismatches ? "Show all" : "Mismatches only"}
            </Button>

            <Button
              className="bg-cyan-600 hover:bg-cyan-700"
              onClick={markSelectedApproved}
              disabled={!selectedIds.length}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve selected
            </Button>

            <Button
              className="bg-amber-600 hover:bg-amber-700"
              onClick={fixSelectedMismatches}
              disabled={!selectedIds.length}
            >
              <Wrench className="mr-2 h-4 w-4" />
              Fix mismatches
            </Button>

            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={markSelectedPaid}
              disabled={!selectedIds.length}
            >
              Mark selected paid
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-5">
          <div className="md:col-span-1">
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border-slate-800 bg-slate-950/40"
              placeholder="From"
            />
          </div>
          <div className="md:col-span-1">
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border-slate-800 bg-slate-950/40"
              placeholder="To"
            />
          </div>
          <div className="md:col-span-1">
            <Input
              inputMode="numeric"
              value={minNet}
              onChange={(e) => setMinNet(e.target.value)}
              className="border-slate-800 bg-slate-950/40"
              placeholder="Min net"
            />
          </div>
          <div className="md:col-span-1">
            <Input
              inputMode="numeric"
              value={maxNet}
              onChange={(e) => setMaxNet(e.target.value)}
              className="border-slate-800 bg-slate-950/40"
              placeholder="Max net"
            />
          </div>
          <div className="md:col-span-1">
            <Button className="w-full bg-slate-800 hover:bg-slate-700" onClick={load}>
              Apply filters
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <Badge className="bg-slate-500/15 text-slate-200 border border-slate-500/30">
            Rows: {displayRows.length}
          </Badge>
          <Badge className="bg-cyan-500/15 text-cyan-200 border border-cyan-500/30">
            Selected: {selectedIds.length}
          </Badge>
          <Badge className="bg-emerald-500/15 text-emerald-200 border border-emerald-500/30">
            Selected net: {formatINR(selectedNet)}
          </Badge>
        </div>
      </Card>

      <Card className="border-slate-800 bg-slate-900/60">
        <div className="p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Audit</TableHead>
                <TableHead>User</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Gross</TableHead>
                <TableHead className="text-right">Admin</TableHead>
                <TableHead className="text-right">Net</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayRows.map(({ row, audit }) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox
                      checked={Boolean(selected[row.id])}
                      onCheckedChange={(v) => setSelected((prev) => ({ ...prev, [row.id]: Boolean(v) }))}
                    />
                  </TableCell>
                  <TableCell className="text-slate-300">{isoDate(row.createdAt)}</TableCell>
                  <TableCell className="text-slate-200">{row.status}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        audit.ok
                          ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/30"
                          : "bg-rose-500/15 text-rose-200 border border-rose-500/30"
                      }
                    >
                      {audit.ok ? "OK" : audit.issues.join(",")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">{row.userId.slice(0, 8)}…</TableCell>
                  <TableCell className="text-slate-200">{row.referralName || "-"}</TableCell>
                  <TableCell className="text-slate-400">{row.commissionType}</TableCell>
                  <TableCell className="text-right text-slate-200">{formatINR(row.grossCommission)}</TableCell>
                  <TableCell className="text-right text-slate-400">{formatINR(row.adminCharge)}</TableCell>
                  <TableCell className="text-right font-semibold text-emerald-200">{formatINR(row.netCommission)}</TableCell>
                </TableRow>
              ))}
              {!displayRows.length && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-slate-400 py-10">
                    No commission records available (or you may not have Admin access).
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