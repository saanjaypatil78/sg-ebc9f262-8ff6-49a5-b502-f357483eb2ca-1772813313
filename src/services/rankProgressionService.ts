import { supabase } from "@/integrations/supabase/client";

export interface RankInfo {
  rank: string;
  businessTarget: number;
  royaltyAddon: number;
  level1Rate: number;
  level2Rate: number;
  level3Rate: number;
  level4Rate: number;
  level5Rate: number;
  level6Rate: number;
}

export interface InvestorRank {
  userId: string;
  currentRank: string;
  currentRankTarget: number;
  qualifyingBusinessVolume3m: number;
  lifetimeTeamBusiness: number;
  previousRank: string | null;
  nextRank: string | null;
  nextRankTarget: number | null;
  progressToNext: number;
  lastEvaluatedAt?: string | null;
}

function toNumber(input: unknown): number {
  const n = typeof input === "number" ? input : parseFloat(String(input ?? "0"));
  return Number.isFinite(n) ? n : 0;
}

function upper(input: unknown, fallback: string): string {
  const s = String(input ?? "").trim();
  return (s ? s : fallback).toUpperCase();
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function computeRankFromVolume(ranks: RankInfo[], qualifyingVolume: number) {
  const sorted = [...ranks].sort((a, b) => a.businessTarget - b.businessTarget);
  const volume = toNumber(qualifyingVolume);

  let current = sorted[0] || {
    rank: "BASE",
    businessTarget: 0,
    royaltyAddon: 0,
    level1Rate: 0.2,
    level2Rate: 0.1,
    level3Rate: 0.07,
    level4Rate: 0.05,
    level5Rate: 0.02,
    level6Rate: 0.01,
  };

  for (const r of sorted) {
    if (volume >= r.businessTarget) current = r;
    else break;
  }

  const currentIdx = sorted.findIndex((r) => r.rank === current.rank);
  const next = currentIdx >= 0 ? sorted[currentIdx + 1] : null;

  const nextTarget = next ? next.businessTarget : null;
  const progressToNext =
    nextTarget && nextTarget > 0 ? clampPercent((volume / nextTarget) * 100) : 100;

  return {
    effectiveRank: upper(current.rank, "BASE"),
    currentTarget: toNumber(current.businessTarget),
    nextRank: next ? upper(next.rank, "") : null,
    nextTarget,
    progressToNext,
  };
}

export const rankProgressionService = {
  async getAllRanks(): Promise<RankInfo[]> {
    const { data, error } = await supabase
      .from("commission_rates")
      .select("*")
      .order("business_target", { ascending: true });

    if (error) throw error;

    return (data || []).map((rank) => ({
      rank: upper((rank as any).rank, "BASE"),
      businessTarget: toNumber((rank as any).business_target),
      royaltyAddon: toNumber((rank as any).royalty_addon),
      level1Rate: toNumber((rank as any).level_1_rate),
      level2Rate: toNumber((rank as any).level_2_rate),
      level3Rate: toNumber((rank as any).level_3_rate),
      level4Rate: toNumber((rank as any).level_4_rate),
      level5Rate: toNumber((rank as any).level_5_rate),
      level6Rate: toNumber((rank as any).level_6_rate),
    }));
  },

  async recalculateAndGetRank(userAuthId: string): Promise<{
    qualifyingVolume: number;
    previousRank: string | null;
    rawCurrentRank: string;
  }> {
    const { data, error } = await supabase.rpc("recalculate_user_rank", {
      p_user_auth_id: userAuthId,
    });

    if (error) throw error;

    const row = Array.isArray(data) ? data[0] : data;

    const qualifyingVolume = toNumber(
      (row as any)?.qualifying_volume ??
        (row as any)?.qualifying_business_volume_3m ??
        (row as any)?.business_volume_3m ??
        0
    );

    const previousRank = (row as any)?.previous_rank ? upper((row as any).previous_rank, "") : null;
    const rawCurrentRank = upper(
      (row as any)?.current_rank ?? (row as any)?.rank ?? (row as any)?.currentRank,
      "BASE"
    );

    return {
      qualifyingVolume,
      previousRank,
      rawCurrentRank,
    };
  },

  async getInvestorRank(userId: string): Promise<InvestorRank> {
    const [ranks, recalc] = await Promise.all([this.getAllRanks(), this.recalculateAndGetRank(userId)]);

    const { data: ubv } = await supabase
      .from("user_business_volume")
      .select("total_team_business, last_rank_evaluation, current_rank")
      .eq("user_id", userId)
      .maybeSingle();

    const computed = computeRankFromVolume(ranks, recalc.qualifyingVolume);

    const storedRank = ubv?.current_rank ? upper(ubv.current_rank, "BASE") : recalc.rawCurrentRank;
    const effectiveRank = computed.effectiveRank;

    return {
      userId,
      currentRank: effectiveRank,
      currentRankTarget: computed.currentTarget,
      qualifyingBusinessVolume3m: toNumber(recalc.qualifyingVolume),
      lifetimeTeamBusiness: toNumber(ubv?.total_team_business ?? 0),
      previousRank: recalc.previousRank && recalc.previousRank !== storedRank ? recalc.previousRank : null,
      nextRank: computed.nextRank,
      nextRankTarget: computed.nextTarget != null ? toNumber(computed.nextTarget) : null,
      progressToNext: computed.progressToNext,
      lastEvaluatedAt: (ubv as any)?.last_rank_evaluation ?? null,
    };
  },

  async checkAndUpgradeRank(userAuthId: string): Promise<boolean> {
    const before = await supabase
      .from("user_business_volume")
      .select("current_rank")
      .eq("user_id", userAuthId)
      .maybeSingle();

    await this.recalculateAndGetRank(userAuthId);

    const after = await supabase
      .from("user_business_volume")
      .select("current_rank")
      .eq("user_id", userAuthId)
      .maybeSingle();

    const beforeRank = before.data?.current_rank ? upper(before.data.current_rank, "BASE") : "BASE";
    const afterRank = after.data?.current_rank ? upper(after.data.current_rank, "BASE") : "BASE";

    return beforeRank !== afterRank;
  },

  getRankBadge(rank: string): { color: string; label: string; gradient: string } {
    const key = upper(rank, "BASE");
    const badges: Record<string, { color: string; label: string; gradient: string }> = {
      BASE: { color: "bg-gray-500", label: "BASE", gradient: "from-gray-500 to-gray-600" },
      BRONZE: { color: "bg-orange-600", label: "BRONZE", gradient: "from-orange-600 to-orange-700" },
      SILVER: { color: "bg-slate-400", label: "SILVER", gradient: "from-slate-400 to-slate-500" },
      GOLD: { color: "bg-yellow-500", label: "GOLD", gradient: "from-yellow-500 to-yellow-600" },
      PLATINUM: { color: "bg-cyan-400", label: "PLATINUM", gradient: "from-cyan-400 to-cyan-500" },
      DIAMOND: { color: "bg-blue-400", label: "DIAMOND", gradient: "from-blue-400 to-blue-500" },
      AMBASSADOR: { color: "bg-purple-500", label: "AMBASSADOR", gradient: "from-purple-500 to-pink-500" },
    };

    return badges[key] || badges.BASE;
  },

  formatCurrency(amount: number): string {
    const safe = Number.isFinite(amount) ? amount : 0;
    if (safe >= 10000000) return `₹${(safe / 10000000).toFixed(2)} Cr`;
    if (safe >= 100000) return `₹${(safe / 100000).toFixed(2)} L`;
    if (safe >= 1000) return `₹${(safe / 1000).toFixed(2)} K`;
    return `₹${safe.toLocaleString("en-IN")}`;
  },
};