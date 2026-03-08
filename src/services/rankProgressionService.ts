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

export const rankProgressionService = {
  async getAllRanks(): Promise<RankInfo[]> {
    const { data, error } = await supabase
      .from("commission_rates")
      .select("*")
      .order("business_target", { ascending: true });

    if (error) throw error;

    return (data || []).map((rank) => ({
      rank: String(rank.rank).toUpperCase(),
      businessTarget: toNumber(rank.business_target),
      royaltyAddon: toNumber(rank.royalty_addon),
      level1Rate: toNumber(rank.level_1_rate),
      level2Rate: toNumber(rank.level_2_rate),
      level3Rate: toNumber(rank.level_3_rate),
      level4Rate: toNumber(rank.level_4_rate),
      level5Rate: toNumber(rank.level_5_rate),
      level6Rate: toNumber(rank.level_6_rate),
    }));
  },

  async recalculateAndGetRank(userAuthId: string): Promise<{
    currentRank: string;
    currentRankTarget: number;
    qualifyingVolume: number;
    nextRank: string | null;
    nextRankTarget: number | null;
    progressToNext: number;
    previousRank: string | null;
  }> {
    const { data, error } = await supabase.rpc("recalculate_user_rank", {
      p_user_auth_id: userAuthId,
    });

    if (error) throw error;

    const row = Array.isArray(data) ? data[0] : data;

    const currentRank = String(row?.current_rank || "BASE").toUpperCase();
    const currentRankTarget = toNumber(row?.current_rank_target ?? 0);
    const qualifyingVolume = toNumber(row?.qualifying_volume ?? 0);
    const nextRank = row?.next_rank ? String(row.next_rank).toUpperCase() : null;
    const nextRankTarget = row?.next_rank_target != null ? toNumber(row.next_rank_target) : null;
    const progressToNext = toNumber(row?.progress_to_next ?? row?.progress_to_next ?? 0);
    const previousRank = row?.previous_rank ? String(row.previous_rank).toUpperCase() : null;

    return {
      currentRank,
      currentRankTarget,
      qualifyingVolume,
      nextRank,
      nextRankTarget,
      progressToNext,
      previousRank,
    };
  },

  async getInvestorRank(userId: string): Promise<InvestorRank> {
    const recalc = await this.recalculateAndGetRank(userId);

    const { data: ubv } = await supabase
      .from("user_business_volume")
      .select("total_team_business, last_rank_evaluation")
      .eq("user_id", userId)
      .maybeSingle();

    return {
      userId,
      currentRank: recalc.currentRank,
      currentRankTarget: recalc.currentRankTarget,
      qualifyingBusinessVolume3m: recalc.qualifyingVolume,
      lifetimeTeamBusiness: toNumber(ubv?.total_team_business ?? 0),
      previousRank: recalc.previousRank,
      nextRank: recalc.nextRank,
      nextRankTarget: recalc.nextRankTarget,
      progressToNext: recalc.progressToNext,
      lastEvaluatedAt: ubv?.last_rank_evaluation ?? null,
    };
  },

  async checkAndUpgradeRank(userAuthId: string): Promise<boolean> {
    const recalc = await this.recalculateAndGetRank(userAuthId);
    const prev = (recalc.previousRank || "").toUpperCase();
    const curr = (recalc.currentRank || "").toUpperCase();
    return Boolean(prev && curr && prev !== curr);
  },

  getRankBadge(rank: string): { color: string; label: string; gradient: string } {
    const key = String(rank || "BASE").toUpperCase();
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