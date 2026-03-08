import { supabase } from "@/integrations/supabase/client";

export type CommissionStatus = "pending" | "approved" | "paid" | "cancelled";

export interface CommissionLedgerRow {
  id: string;
  userId: string;
  referralUserId: string | null;
  commissionType:
    | "referral_level_1"
    | "referral_level_2"
    | "referral_level_3"
    | "referral_level_4"
    | "referral_level_5"
    | "referral_level_6"
    | "royalty"
    | "bonus";
  commissionLevel: number | null;
  grossCommission: number;
  adminCharge: number;
  netCommission: number;
  royaltyBonus: number;
  sourceInvestmentId: string | null;
  sourceAmount: number;
  commissionRate: number;
  status: CommissionStatus;
  payoutBatchId: string | null;
  createdAt: string;
  processedAt: string | null;
}

export interface CommissionLedgerRowWithNames extends CommissionLedgerRow {
  referralName: string | null;
}

export type CommissionType = CommissionLedgerRow["commissionType"];

export interface NetworkCommissionLeaderboardRow {
  userId: string;
  fullName: string;
  netCommission: number;
  grossCommission: number;
  adminCharge: number;
  itemsCount: number;
}

export interface CommissionSummary {
  pendingNet: number;
  approvedNet: number;
  paidNet: number;
  cancelledNet: number;
  last30DaysNet: number;
  countByStatus: Record<CommissionStatus, number>;
}

function toNumber(input: unknown): number {
  const n = typeof input === "number" ? input : Number(input);
  return Number.isFinite(n) ? n : 0;
}

function safeStatus(input: unknown): CommissionStatus {
  const s = String(input || "").toLowerCase();
  if (s === "pending" || s === "approved" || s === "paid" || s === "cancelled") return s;
  return "pending";
}

function mapLedgerRow(row: any): CommissionLedgerRow {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    referralUserId: row.referral_user_id ? String(row.referral_user_id) : null,
    commissionType: row.commission_type,
    commissionLevel: row.commission_level === null || row.commission_level === undefined ? null : toNumber(row.commission_level),
    grossCommission: toNumber(row.gross_commission),
    adminCharge: toNumber(row.admin_charge),
    netCommission: toNumber(row.net_commission),
    royaltyBonus: toNumber(row.royalty_bonus),
    sourceInvestmentId: row.source_investment_id ? String(row.source_investment_id) : null,
    sourceAmount: toNumber(row.source_amount),
    commissionRate: toNumber(row.commission_rate),
    status: safeStatus(row.status),
    payoutBatchId: row.payout_batch_id ? String(row.payout_batch_id) : null,
    createdAt: String(row.created_at),
    processedAt: row.processed_at ? String(row.processed_at) : null,
  };
}

function sum(values: number[]): number {
  return Math.round((values.reduce((a, b) => a + b, 0) + Number.EPSILON) * 100) / 100;
}

async function getAuthUserId(): Promise<string | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user?.id ?? null;
}

async function hydrateReferralNames(rows: CommissionLedgerRow[]): Promise<CommissionLedgerRowWithNames[]> {
  const referralIds = Array.from(new Set(rows.map((r) => r.referralUserId).filter(Boolean))) as string[];
  const nameById: Record<string, string> = {};

  if (referralIds.length) {
    const { data, error } = await supabase.from("profiles").select("id, full_name").in("id", referralIds);
    if (!error) {
      (data || []).forEach((p: any) => {
        if (p?.id) nameById[String(p.id)] = p.full_name || "Unknown";
      });
    }
  }

  return rows.map((r) => ({
    ...r,
    referralName: r.referralUserId ? nameById[r.referralUserId] || "Unknown" : null,
  }));
}

export const commissionLedgerService = {
  async getMyCommissionFeed(params?: {
    status?: CommissionStatus | "all";
    level?: number | "all";
    type?: CommissionType | "all";
    fromDate?: string;
    toDate?: string;
    minNet?: number;
    maxNet?: number;
    limit?: number;
  }): Promise<CommissionLedgerRowWithNames[]> {
    const userId = await getAuthUserId();
    if (!userId) return [];

    const limit = Math.min(Math.max(params?.limit ?? 50, 1), 500);

    let query = supabase
      .from("commission_accumulation_ledger")
      .select(
        "id, user_id, referral_user_id, commission_type, commission_level, gross_commission, admin_charge, net_commission, royalty_bonus, source_investment_id, source_amount, commission_rate, status, payout_batch_id, created_at, processed_at"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (params?.status && params.status !== "all") query = query.eq("status", params.status);
    if (params?.level && params.level !== "all") query = query.eq("commission_level", params.level);
    if (params?.type && params.type !== "all") query = query.eq("commission_type", params.type);
    if (params?.fromDate) query = query.gte("created_at", params.fromDate);
    if (params?.toDate) query = query.lte("created_at", params.toDate);
    if (typeof params?.minNet === "number") query = query.gte("net_commission", params.minNet);
    if (typeof params?.maxNet === "number") query = query.lte("net_commission", params.maxNet);

    const { data, error } = await query;
    if (error) return [];

    const rows = (Array.isArray(data) ? data : []).map(mapLedgerRow);
    return hydrateReferralNames(rows);
  },

  async getMyCommissionSummary(): Promise<CommissionSummary | null> {
    const userId = await getAuthUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from("commission_accumulation_ledger")
      .select("net_commission, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(2000);

    if (error) return null;

    const rows = Array.isArray(data) ? data : [];
    const now = Date.now();
    const last30 = now - 30 * 24 * 60 * 60 * 1000;

    const netByStatus: Record<CommissionStatus, number[]> = {
      pending: [],
      approved: [],
      paid: [],
      cancelled: [],
    };

    const countByStatus: Record<CommissionStatus, number> = {
      pending: 0,
      approved: 0,
      paid: 0,
      cancelled: 0,
    };

    const last30Values: number[] = [];

    rows.forEach((r: any) => {
      const status = safeStatus(r.status);
      const net = toNumber(r.net_commission);
      netByStatus[status].push(net);
      countByStatus[status] += 1;

      const ts = Date.parse(String(r.created_at));
      if (Number.isFinite(ts) && ts >= last30) last30Values.push(net);
    });

    return {
      pendingNet: sum(netByStatus.pending),
      approvedNet: sum(netByStatus.approved),
      paidNet: sum(netByStatus.paid),
      cancelledNet: sum(netByStatus.cancelled),
      last30DaysNet: sum(last30Values),
      countByStatus,
    };
  },

  async adminListCommissions(params?: {
    status?: CommissionStatus | "all";
    type?: CommissionType | "all";
    fromDate?: string;
    toDate?: string;
    minNet?: number;
    maxNet?: number;
    limit?: number;
  }): Promise<CommissionLedgerRowWithNames[]> {
    const limit = Math.min(Math.max(params?.limit ?? 200, 1), 2000);

    let query = supabase
      .from("commission_accumulation_ledger")
      .select(
        "id, user_id, referral_user_id, commission_type, commission_level, gross_commission, admin_charge, net_commission, royalty_bonus, source_investment_id, source_amount, commission_rate, status, payout_batch_id, created_at, processed_at"
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (params?.status && params.status !== "all") query = query.eq("status", params.status);
    if (params?.type && params.type !== "all") query = query.eq("commission_type", params.type);
    if (params?.fromDate) query = query.gte("created_at", params.fromDate);
    if (params?.toDate) query = query.lte("created_at", params.toDate);
    if (typeof params?.minNet === "number") query = query.gte("net_commission", params.minNet);
    if (typeof params?.maxNet === "number") query = query.lte("net_commission", params.maxNet);

    const { data, error } = await query;
    if (error) return [];

    const rows = (Array.isArray(data) ? data : []).map(mapLedgerRow);
    return hydrateReferralNames(rows);
  },

  async adminMarkApproved(params: { ids: string[]; processedAtIso?: string }): Promise<boolean> {
    const ids = params.ids.filter(Boolean);
    if (!ids.length) return false;

    const processedAt = params.processedAtIso ?? new Date().toISOString();

    const { error } = await supabase
      .from("commission_accumulation_ledger")
      .update({
        status: "approved",
        processed_at: processedAt,
      })
      .in("id", ids)
      .eq("status", "pending");

    return !error;
  },

  async adminUpdateComputedFields(params: { id: string; adminCharge: number; netCommission: number }): Promise<boolean> {
    if (!params.id) return false;

    const { error } = await supabase
      .from("commission_accumulation_ledger")
      .update({
        admin_charge: params.adminCharge,
        net_commission: params.netCommission,
      })
      .eq("id", params.id);

    return !error;
  },

  async adminMarkPaid(params: { ids: string[]; payoutBatchId: string; processedAtIso?: string }): Promise<boolean> {
    const ids = params.ids.filter(Boolean);
    if (!ids.length) return false;

    const processedAt = params.processedAtIso ?? new Date().toISOString();

    const { error } = await supabase
      .from("commission_accumulation_ledger")
      .update({
        status: "paid",
        payout_batch_id: params.payoutBatchId,
        processed_at: processedAt,
      })
      .in("id", ids);

    return !error;
  },

  async getVisibleNetworkLeaderboard(params?: { days?: number; includeCancelled?: boolean }): Promise<NetworkCommissionLeaderboardRow[]> {
    const days = Math.min(Math.max(params?.days ?? 30, 1), 365);
    const includeCancelled = Boolean(params?.includeCancelled);

    const { data, error } = await supabase.rpc("get_visible_network_commission_leaderboard_v1", {
      p_days: days,
      p_include_cancelled: includeCancelled,
    });

    if (error) return [];

    const rows = Array.isArray(data) ? data : [];
    return rows.map((r: any) => ({
      userId: String(r.user_id),
      fullName: r.full_name ? String(r.full_name) : "Member",
      netCommission: toNumber(r.net_commission),
      grossCommission: toNumber(r.gross_commission),
      adminCharge: toNumber(r.admin_charge),
      itemsCount: toNumber(r.items_count),
    }));
  },
};