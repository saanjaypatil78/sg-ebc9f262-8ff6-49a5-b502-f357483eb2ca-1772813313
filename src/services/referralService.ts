import { supabase } from "@/integrations/supabase/client";

export interface NetworkMember {
  userId: string;
  fullName: string;
  email: string;
  level: number;
  investmentTotal: number;
  directReferrals: number;
  joinedAt: string;
}

export interface NetworkStats {
  totalNetworkSize: number;
  level1Count: number;
  level2Count: number;
  level3Count: number;
  level4Count: number;
  level5Count: number;
  level6Count: number;
  totalNetworkInvestment: number;
  totalCommissionsEarned: number;
  rank: string;
  rankProgress: number;
}

export interface CommissionRecord {
  id: string;
  fromUserName: string;
  commissionLevel: number;
  investmentAmount: number;
  commissionAmount: number;
  netCommission: number;
  status: string;
  createdAt: string;
}

export const referralService = {
  // Get network tree for visualization
  async getNetworkTree(userId: string): Promise<NetworkMember[]> {
    const { data, error } = await supabase.rpc("get_network_tree", {
      p_user_id: userId,
      p_max_level: 6,
    });

    if (error) {
      console.error("Error fetching network tree:", error);
      return [];
    }

    return (data || []).map((member: any) => ({
      userId: member.user_id,
      fullName: member.full_name,
      email: member.email,
      level: member.level,
      investmentTotal: parseFloat(member.investment_total || 0),
      directReferrals: member.direct_referrals || 0,
      joinedAt: member.joined_at,
    }));
  },

  // Get network statistics
  async getNetworkStats(userId: string): Promise<NetworkStats | null> {
    const { data, error } = await supabase
      .from("network_stats")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching network stats:", error);
      return null;
    }

    return {
      totalNetworkSize: data.total_network_size,
      level1Count: data.level_1_count,
      level2Count: data.level_2_count,
      level3Count: data.level_3_count,
      level4Count: data.level_4_count,
      level5Count: data.level_5_count,
      level6Count: data.level_6_count,
      totalNetworkInvestment: parseFloat(data.total_network_investment || 0),
      totalCommissionsEarned: parseFloat(data.total_commissions_earned || 0),
      rank: data.rank,
      rankProgress: parseFloat(data.rank_progress || 0),
    };
  },

  // Get commission history
  async getCommissionHistory(userId: string): Promise<CommissionRecord[]> {
    const { data, error } = await supabase
      .from("commission_ledger")
      .select(
        `
        id,
        commission_level,
        investment_amount,
        commission_amount,
        net_commission,
        status,
        created_at,
        from_user:from_user_id (full_name)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching commission history:", error);
      return [];
    }

    return (data || []).map((record: any) => ({
      id: record.id,
      fromUserName: record.from_user?.full_name || "Unknown",
      commissionLevel: record.commission_level,
      investmentAmount: parseFloat(record.investment_amount),
      commissionAmount: parseFloat(record.commission_amount),
      netCommission: parseFloat(record.net_commission),
      status: record.status,
      createdAt: record.created_at,
    }));
  },

  // Get referral link (user_id = referral code)
  getReferralLink(userId: string): string {
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://bravecom.info";
    return `${baseUrl}/auth/register?ref=${userId}`;
  },

  // Validate referral code (user_id)
  async validateReferralCode(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    return !error && !!data;
  },

  // Calculate commission breakdown preview
  calculateCommissionBreakdown(investmentAmount: number) {
    const rates = [0.2, 0.1, 0.07, 0.05, 0.02, 0.01]; // 6 levels
    const adminFee = 0.1; // 10% admin fee

    return rates.map((rate, index) => {
      const grossCommission = investmentAmount * rate;
      const adminDeduction = grossCommission * adminFee;
      const netCommission = grossCommission - adminDeduction;

      return {
        level: index + 1,
        rate: rate * 100,
        grossCommission,
        adminFee: adminDeduction,
        netCommission,
      };
    });
  },
};