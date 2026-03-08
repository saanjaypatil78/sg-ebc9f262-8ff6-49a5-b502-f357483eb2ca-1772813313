import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CommissionStatus, CommissionType } from "@/services/commissionLedgerService";

export interface CommissionFilters {
  status: CommissionStatus | "all";
  level: number | "all";
  type: CommissionType | "all";
  fromDate: string;
  toDate: string;
  minNet: string;
  maxNet: string;
}

function toIsoDate(d: Date): string {
  const t = Date.parse(d.toISOString());
  if (!Number.isFinite(t)) return "";
  return d.toISOString().slice(0, 10);
}

export function CommissionFiltersBar(props: {
  value: CommissionFilters;
  onChange: (next: CommissionFilters) => void;
  onReset?: () => void;
}) {
  const v = props.value;

  const set = (patch: Partial<CommissionFilters>) => {
    props.onChange({ ...v, ...patch });
  };

  const setLastDays = (days: number) => {
    const now = new Date();
    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    set({ fromDate: toIsoDate(from), toDate: toIsoDate(now) });
  };

  return (
    <Card className="border-slate-800 bg-slate-900/60 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="border-slate-800" onClick={() => setLastDays(7)}>
            Last 7d
          </Button>
          <Button variant="outline" className="border-slate-800" onClick={() => setLastDays(30)}>
            Last 30d
          </Button>
          <Button variant="outline" className="border-slate-800" onClick={() => setLastDays(90)}>
            Last 90d
          </Button>
          <div className="flex-1" />
          <Button
            variant="outline"
            className="border-slate-800"
            onClick={() => {
              props.onReset?.();
            }}
          >
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
          <div className="md:col-span-2">
            <Label className="text-slate-300">Status</Label>
            <Select value={v.status} onValueChange={(val) => set({ status: val as any })}>
              <SelectTrigger className="mt-1 border-slate-800 bg-slate-950/40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label className="text-slate-300">Level</Label>
            <Select value={String(v.level)} onValueChange={(val) => set({ level: val === "all" ? "all" : Number(val) })}>
              <SelectTrigger className="mt-1 border-slate-800 bg-slate-950/40">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="1">Level 1</SelectItem>
                <SelectItem value="2">Level 2</SelectItem>
                <SelectItem value="3">Level 3</SelectItem>
                <SelectItem value="4">Level 4</SelectItem>
                <SelectItem value="5">Level 5</SelectItem>
                <SelectItem value="6">Level 6</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label className="text-slate-300">Type</Label>
            <Select value={v.type} onValueChange={(val) => set({ type: val as any })}>
              <SelectTrigger className="mt-1 border-slate-800 bg-slate-950/40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="referral_level_1">Referral level 1</SelectItem>
                <SelectItem value="referral_level_2">Referral level 2</SelectItem>
                <SelectItem value="referral_level_3">Referral level 3</SelectItem>
                <SelectItem value="referral_level_4">Referral level 4</SelectItem>
                <SelectItem value="referral_level_5">Referral level 5</SelectItem>
                <SelectItem value="referral_level_6">Referral level 6</SelectItem>
                <SelectItem value="royalty">Royalty</SelectItem>
                <SelectItem value="bonus">Bonus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label className="text-slate-300">From</Label>
            <Input
              type="date"
              value={v.fromDate}
              onChange={(e) => set({ fromDate: e.target.value })}
              className="mt-1 border-slate-800 bg-slate-950/40"
            />
          </div>

          <div className="md:col-span-2">
            <Label className="text-slate-300">To</Label>
            <Input
              type="date"
              value={v.toDate}
              onChange={(e) => set({ toDate: e.target.value })}
              className="mt-1 border-slate-800 bg-slate-950/40"
            />
          </div>

          <div className="md:col-span-1">
            <Label className="text-slate-300">Min net</Label>
            <Input
              inputMode="numeric"
              value={v.minNet}
              onChange={(e) => set({ minNet: e.target.value })}
              placeholder="0"
              className="mt-1 border-slate-800 bg-slate-950/40"
            />
          </div>

          <div className="md:col-span-1">
            <Label className="text-slate-300">Max net</Label>
            <Input
              inputMode="numeric"
              value={v.maxNet}
              onChange={(e) => set({ maxNet: e.target.value })}
              placeholder="∞"
              className="mt-1 border-slate-800 bg-slate-950/40"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}