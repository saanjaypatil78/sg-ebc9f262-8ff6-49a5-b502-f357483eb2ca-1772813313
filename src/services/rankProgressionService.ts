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
  totalBusinessVolume: number;
  rankAchievedAt: string;
  previousRank: string | null;
  rankUpgradedAt: string | null;
  nextRank: string | null;
  nextRankTarget: number | null;
  progressToNext: number;
}

export const rankProgressionService = {
  // Get all rank tiers with commission rates
  async getAllRanks(): Promise<RankInfo[]> {
    const { data, error } = await supabase
      .from("commission_rates")
      .select("*")
      .order("business_target", { ascending: true });

    if (error) throw error;

    return data.map((rank) => ({
      rank: rank.rank,
      businessTarget: rank.business_target,
      royaltyAddon: rank.royalty_addon,
      level1Rate: rank.level_1_rate,
      level2Rate: rank.level_2_rate,
      level3Rate: rank.level_3_rate,
      level4Rate: rank.level_4_rate,
      level5Rate: rank.level_5_rate,
      level6Rate: rank.level_6_rate,
    }));
  },

  // Get investor's current rank and progress
  async getInvestorRank(userId: string): Promise<InvestorRank> {
    // First, trigger auto-upgrade
    const { data: upgradeData, error: upgradeError } = await supabase.rpc(
      "auto_upgrade_rank",
      { investor_user_id: userId }
    );

    if (upgradeError) throw upgradeError;

    // Get updated rank info
    const { data: rankData, error: rankError } = await supabase
      .from("investor_ranks")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (rankError) throw rankError;

    // Get all ranks to find next target
    const allRanks = await this.getAllRanks();
    const currentRankIndex = allRanks.findIndex(
      (r) => r.rank === rankData.current_rank
    );
    const nextRankInfo =
      currentRankIndex < allRanks.length - 1
        ? allRanks[currentRankIndex + 1]
        : null;

    // Calculate progress to next rank
    const progressToNext = nextRankInfo
      ? Math.min(
          (rankData.total_business_volume / nextRankInfo.businessTarget) * 100,
          100
        )
      : 100;

    return {
      userId: rankData.user_id,
      currentRank: rankData.current_rank,
      totalBusinessVolume: rankData.total_business_volume,
      rankAchievedAt: rankData.rank_achieved_at,
      previousRank: rankData.previous_rank,
      rankUpgradedAt: rankData.rank_upgraded_at,
      nextRank: nextRankInfo?.rank || null,
      nextRankTarget: nextRankInfo?.businessTarget || null,
      progressToNext,
    };
  },

  // Calculate commission with progressive rates
  async calculateCommission(
    investorUserId: string,
    downlineProfit: number,
    relationshipLevel: number
  ): Promise<number> {
    const { data, error } = await supabase.rpc("calculate_commission_with_rank", {
      investor_user_id: investorUserId,
      downline_profit: downlineProfit,
      relationship_level: relationshipLevel,
    });

    if (error) throw error;
    return data;
  },

  // Get rank badge styling
  getRankBadge(rank: string): { color: string; label: string; gradient: string } {
    const badges: Record<string, { color: string; label: string; gradient: string }> = {
      BASE: {
        color: "bg-gray-500",
        label: "BASE",
        gradient: "from-gray-500 to-gray-600",
      },
      BRONZE: {
        color: "bg-orange-600",
        label: "BRONZE",
        gradient: "from-orange-600 to-orange-700",
      },
      SILVER: {
        color: "bg-slate-400",
        label: "SILVER",
        gradient: "from-slate-400 to-slate-500",
      },
      GOLD: {
        color: "bg-yellow-500",
        label: "GOLD",
        gradient: "from-yellow-500 to-yellow-600",
      },
      PLATINUM: {
        color: "bg-cyan-400",
        label: "PLATINUM",
        gradient: "from-cyan-400 to-cyan-500",
      },
      DIAMOND: {
        color: "bg-blue-400",
        label: "DIAMOND",
        gradient: "from-blue-400 to-blue-500",
      },
      AMBASSADOR: {
        color: "bg-purple-500",
        label: "AMBASSADOR",
        gradient: "from-purple-500 to-pink-500",
      },
    };

    return badges[rank] || badges.BASE;
  },

  // Format currency for display
  formatCurrency(amount: number): string {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString("en-IN")}`;
  },

  async checkAndUpgradeRank(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('auto_upgrade_rank', { p_user_id: userId });
      if (error) throw error;
      return data === true;
    } catch (error) {
      console.error('Error auto-upgrading rank:', error);
      return false;
    }
  },
};