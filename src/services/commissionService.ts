import { supabase } from "@/integrations/supabase/client";
import { rankProgressionService } from "./rankProgressionService";

export interface CommissionCalculation {
  investorId: string;
  level: number;
  baseAmount: number;
  commissionRate: number;
  commissionAmount: number;
  rank: string;
}

export interface WealthDistribution {
  totalInvestment: number;
  investorProfit: number; // 15% monthly
  referralCommissions: CommissionCalculation[];
  totalCommissionPaid: number;
  adminCharges: number; // 10% of commission
  netPayout: number;
}

export const commissionService = {
  /**
   * Calculate 15% monthly ROI for investor
   */
  calculateMonthlyROI(investmentAmount: number): number {
    return investmentAmount * 0.15;
  },

  /**
   * Calculate commission for a specific level based on downline's profit
   * Commission is calculated on the PROFIT (15% of investment), not the principal
   */
  async calculateLevelCommission(
    investorUserId: string,
    downlineProfit: number,
    relationshipLevel: number
  ): Promise<CommissionCalculation> {
    // Get investor's current rank
    const rankInfo = await rankProgressionService.getInvestorRank(investorUserId);
    const allRanks = await rankProgressionService.getAllRanks();
    const currentRankData = allRanks.find(r => r.rank === rankInfo.currentRank);

    if (!currentRankData) {
      throw new Error(`Rank data not found for ${rankInfo.currentRank}`);
    }

    // Get commission rate based on level
    let commissionRate = 0;
    switch (relationshipLevel) {
      case 1: commissionRate = currentRankData.level1Rate; break;
      case 2: commissionRate = currentRankData.level2Rate; break;
      case 3: commissionRate = currentRankData.level3Rate; break;
      case 4: commissionRate = currentRankData.level4Rate; break;
      case 5: commissionRate = currentRankData.level5Rate; break;
      case 6: commissionRate = currentRankData.level6Rate; break;
      default: commissionRate = 0;
    }

    const commissionAmount = downlineProfit * commissionRate;

    return {
      investorId: investorUserId,
      level: relationshipLevel,
      baseAmount: downlineProfit,
      commissionRate,
      commissionAmount,
      rank: rankInfo.currentRank,
    };
  },

  /**
   * Calculate complete wealth distribution for an investment scenario
   * Example: Mr. A invests ₹1L and refers 5 clients with ₹45L total
   */
  async calculateWealthDistribution(
    primaryInvestorId: string,
    primaryInvestment: number,
    referrals: Array<{ userId: string; investment: number; level: number }>
  ): Promise<WealthDistribution> {
    // 1. Calculate investor's own profit (15% monthly)
    const investorProfit = this.calculateMonthlyROI(primaryInvestment);

    // 2. Calculate referral commissions
    const referralCommissions: CommissionCalculation[] = [];
    
    for (const referral of referrals) {
      const downlineProfit = this.calculateMonthlyROI(referral.investment);
      const commission = await this.calculateLevelCommission(
        primaryInvestorId,
        downlineProfit,
        referral.level
      );
      referralCommissions.push(commission);
    }

    // 3. Calculate totals
    const totalCommissionPaid = referralCommissions.reduce(
      (sum, c) => sum + c.commissionAmount,
      0
    );

    // 4. Admin charges (10% of commission only)
    const adminCharges = totalCommissionPaid * 0.10;

    // 5. Net payout to investor
    const netPayout = investorProfit + totalCommissionPaid - adminCharges;

    return {
      totalInvestment: primaryInvestment,
      investorProfit,
      referralCommissions,
      totalCommissionPaid,
      adminCharges,
      netPayout,
    };
  },

  /**
   * Auto-upgrade rank when business volume threshold is reached
   */
  async checkAndUpgradeRank(investorUserId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('auto_upgrade_rank', {
      investor_user_id: investorUserId,
    });

    if (error) {
      console.error('Rank upgrade error:', error);
      return false;
    }

    return data; // Returns true if rank was upgraded
  },

  /**
   * Format currency for display
   */
  formatCurrency(amount: number): string {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(2)} K`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  },

  /**
   * Get commission breakdown for display
   */
  getCommissionBreakdown(calculation: WealthDistribution): Array<{
    label: string;
    amount: number;
    percentage?: number;
  }> {
    return [
      {
        label: 'Personal Investment ROI (15%)',
        amount: calculation.investorProfit,
        percentage: 15,
      },
      {
        label: 'Referral Commissions',
        amount: calculation.totalCommissionPaid,
      },
      {
        label: 'Admin Charges (10% of commission)',
        amount: -calculation.adminCharges,
        percentage: -10,
      },
      {
        label: 'Net Monthly Payout',
        amount: calculation.netPayout,
      },
    ];
  },
};