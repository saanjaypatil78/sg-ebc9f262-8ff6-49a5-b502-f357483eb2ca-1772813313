import { supabase } from "@/integrations/supabase/client";
import { rankProgressionService } from "./rankProgressionService";

export interface CommissionCalculation {
  investorId: string;
  level: number;
  baseAmount: number;
  commissionRate: number;
  commissionAmount: number;
  adminCharge: number;
  netCommission: number;
  rank: string;
}

export interface WealthDistribution {
  totalInvestment: number;
  investorProfit: number;
  referralCommissions: CommissionCalculation[];
  totalCommissionPaid: number;
  adminCharges: number;
  netPayout: number;
}

export interface CommissionPreviewLine {
  level: number;
  ratePercent: number;
  grossCommission: number;
  adminCharge: number;
  netCommission: number;
}

const DEFAULT_LEVEL_RATES = [0.2, 0.1, 0.07, 0.05, 0.02, 0.01] as const;
const DEFAULT_ADMIN_CHARGE_RATE = 0.1;

function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function normalizeRate(rate: number): number {
  if (!Number.isFinite(rate) || rate <= 0) return 0;
  return rate > 1 ? rate / 100 : rate;
}

function toPercent(rate: number): number {
  return roundMoney(normalizeRate(rate) * 100);
}

function sumMoney(values: number[]): number {
  return roundMoney(values.reduce((a, b) => a + b, 0));
}

export const commissionService = {
  adminChargeRate: DEFAULT_ADMIN_CHARGE_RATE,

  calculateMonthlyROI(investmentAmount: number): number {
    return roundMoney(roundMoney(investmentAmount) * 0.15);
  },

  calculateCommissionPreview(params: {
    baseAmount: number;
    levelRates?: number[];
    adminChargeRate?: number;
  }): {
    baseAmount: number;
    adminChargeRate: number;
    lines: CommissionPreviewLine[];
    totals: {
      grossCommission: number;
      adminCharge: number;
      netCommission: number;
    };
  } {
    const baseAmount = roundMoney(params.baseAmount);
    const levelRates = (params.levelRates?.length ? params.levelRates : [...DEFAULT_LEVEL_RATES]).slice(0, 6);
    const adminChargeRate = normalizeRate(params.adminChargeRate ?? DEFAULT_ADMIN_CHARGE_RATE);

    const lines: CommissionPreviewLine[] = levelRates.map((rateRaw, idx) => {
      const rate = normalizeRate(rateRaw);
      const grossCommission = roundMoney(baseAmount * rate);
      const adminCharge = roundMoney(grossCommission * adminChargeRate);
      const netCommission = roundMoney(grossCommission - adminCharge);

      return {
        level: idx + 1,
        ratePercent: toPercent(rate),
        grossCommission,
        adminCharge,
        netCommission,
      };
    });

    const totals = {
      grossCommission: sumMoney(lines.map((l) => l.grossCommission)),
      adminCharge: sumMoney(lines.map((l) => l.adminCharge)),
      netCommission: sumMoney(lines.map((l) => l.netCommission)),
    };

    return { baseAmount, adminChargeRate, lines, totals };
  },

  async getCommissionRatesForRank(rank: string): Promise<number[]> {
    const safeRank = String(rank || "").trim().toUpperCase();
    if (!safeRank) return [...DEFAULT_LEVEL_RATES];

    const { data, error } = await supabase
      .from("commission_rates")
      .select("level_1_rate, level_2_rate, level_3_rate, level_4_rate, level_5_rate, level_6_rate")
      .eq("rank", safeRank)
      .maybeSingle();

    if (error || !data) return [...DEFAULT_LEVEL_RATES];

    const rates = [
      parseFloat(String((data as any).level_1_rate ?? 0)),
      parseFloat(String((data as any).level_2_rate ?? 0)),
      parseFloat(String((data as any).level_3_rate ?? 0)),
      parseFloat(String((data as any).level_4_rate ?? 0)),
      parseFloat(String((data as any).level_5_rate ?? 0)),
      parseFloat(String((data as any).level_6_rate ?? 0)),
    ].map((r) => normalizeRate(r));

    const hasAny = rates.some((r) => r > 0);
    return hasAny ? rates : [...DEFAULT_LEVEL_RATES];
  },

  async calculateLevelCommission(
    investorUserId: string,
    downlineInvestmentAmount: number,
    relationshipLevel: number
  ): Promise<CommissionCalculation> {
    const rankInfo = await rankProgressionService.getInvestorRank(investorUserId);
    const allRanks = await rankProgressionService.getAllRanks();
    const currentRankData = allRanks.find((r) => r.rank === rankInfo.currentRank);

    if (!currentRankData) {
      throw new Error(`Rank data not found for ${rankInfo.currentRank}`);
    }

    let rateRaw = 0;
    switch (relationshipLevel) {
      case 1:
        rateRaw = currentRankData.level1Rate;
        break;
      case 2:
        rateRaw = currentRankData.level2Rate;
        break;
      case 3:
        rateRaw = currentRankData.level3Rate;
        break;
      case 4:
        rateRaw = currentRankData.level4Rate;
        break;
      case 5:
        rateRaw = currentRankData.level5Rate;
        break;
      case 6:
        rateRaw = currentRankData.level6Rate;
        break;
      default:
        rateRaw = 0;
    }

    const commissionRate = normalizeRate(rateRaw);
    const baseAmount = roundMoney(downlineInvestmentAmount);
    const commissionAmount = roundMoney(baseAmount * commissionRate);
    const adminCharge = roundMoney(commissionAmount * DEFAULT_ADMIN_CHARGE_RATE);
    const netCommission = roundMoney(commissionAmount - adminCharge);

    return {
      investorId: investorUserId,
      level: relationshipLevel,
      baseAmount,
      commissionRate,
      commissionAmount,
      adminCharge,
      netCommission,
      rank: rankInfo.currentRank,
    };
  },

  async calculateWealthDistribution(
    primaryInvestorId: string,
    primaryInvestment: number,
    referrals: Array<{ userId: string; investment: number; level: number }>
  ): Promise<WealthDistribution> {
    const totalInvestment = roundMoney(primaryInvestment);
    const investorProfit = this.calculateMonthlyROI(totalInvestment);

    const referralCommissions: CommissionCalculation[] = [];
    for (const referral of referrals) {
      const commission = await this.calculateLevelCommission(
        primaryInvestorId,
        referral.investment,
        referral.level
      );
      referralCommissions.push(commission);
    }

    const totalCommissionPaid = sumMoney(referralCommissions.map((c) => c.commissionAmount));
    const adminCharges = sumMoney(referralCommissions.map((c) => c.adminCharge));

    const netPayout = roundMoney(investorProfit + (totalCommissionPaid - adminCharges));

    return {
      totalInvestment,
      investorProfit,
      referralCommissions,
      totalCommissionPaid,
      adminCharges,
      netPayout,
    };
  },

  async checkAndUpgradeRank(investorUserId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc("auto_upgrade_rank", {
      investor_user_id: investorUserId,
    });

    if (error) {
      console.error("Rank upgrade error:", error);
      return false;
    }

    return Boolean(data);
  },

  formatCurrency(amount: number): string {
    const safe = Number.isFinite(amount) ? amount : 0;
    if (safe >= 10000000) return `₹${(safe / 10000000).toFixed(2)} Cr`;
    if (safe >= 100000) return `₹${(safe / 100000).toFixed(2)} L`;
    if (safe >= 1000) return `₹${(safe / 1000).toFixed(2)} K`;
    return `₹${safe.toLocaleString("en-IN")}`;
  },

  getCommissionBreakdown(calculation: WealthDistribution): Array<{
    label: string;
    amount: number;
    percentage?: number;
  }> {
    return [
      {
        label: "Personal Investment ROI (15%)",
        amount: calculation.investorProfit,
        percentage: 15,
      },
      {
        label: "Referral Commissions (Gross)",
        amount: calculation.totalCommissionPaid,
      },
      {
        label: "Admin Charges (10% of commission)",
        amount: -calculation.adminCharges,
        percentage: -10,
      },
      {
        label: "Net Monthly Payout",
        amount: calculation.netPayout,
      },
    ];
  },
};