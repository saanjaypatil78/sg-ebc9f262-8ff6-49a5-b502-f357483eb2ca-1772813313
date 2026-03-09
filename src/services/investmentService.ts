import { supabase } from "@/integrations/supabase/client";

export interface InvestmentAgreement {
  id: string;
  investmentId: string;
  agreementNumber: string;
  agreementDate: string;
  startDate: string;
  endDate: string;
  monthlyRoiRate: number;
  totalMonths: number;
  principalAmount: number;
  totalExpectedProfit: number;
  totalExpectedPayout: number;
  notarizedBy?: string;
  notarizationDate?: string;
  advocateName?: string;
  advocateLicense?: string;
  agreementStatus: "ACTIVE" | "COMPLETED" | "TERMINATED";
  earlyTerminationAllowed: boolean;
  earlyTerminationPenalty: number;
}

export interface MonthlyPayoutSchedule {
  month: number;
  payoutDate: string;
  payoutAmount: number;
  isPrincipalIncluded: boolean;
  status: 'PENDING' | 'PROCESSED' | 'COMPLETED';
}

export const investmentService = {
  async resolveUserProfileId(inputId: string): Promise<string | null> {
    const candidate = String(inputId || "").trim();
    if (!candidate) return null;

    const { data: byUserId, error: byUserIdError } = await (supabase.from("user_profiles") as any)
      .select("id")
      .eq("user_id", candidate)
      .maybeSingle();

    if (!byUserIdError && byUserId?.id) return byUserId.id;

    const { data: byProfileId, error: byProfileIdError } = await (supabase.from("user_profiles") as any)
      .select("id")
      .eq("id", candidate)
      .maybeSingle();

    if (!byProfileIdError && byProfileId?.id) return byProfileId.id;

    return null;
  },

  /**
   * Create new investment and trigger notarized agreement generation
   */
  async createAgreement(userId: string, amount: number): Promise<boolean> {
    try {
      const profileId = await this.resolveUserProfileId(userId);
      if (!profileId) throw new Error("User profile not found");

      const { error } = await (supabase.from("investments") as any).insert({
        user_id: profileId,
        amount,
        investment_amount: amount,
        payment_status: "PENDING",
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Failed to create agreement:", error);
      return false;
    }
  },

  /**
   * Calculate 12-month payout schedule
   */
  async calculatePayoutSchedule(
    principalAmount: number,
    startDate: Date
  ): Promise<MonthlyPayoutSchedule[]> {
    const monthlyProfit = principalAmount * 0.15; // 15% monthly
    const schedule: MonthlyPayoutSchedule[] = [];

    // First payout: 45 days after investment
    const firstPayoutDate = new Date(startDate);
    firstPayoutDate.setDate(firstPayoutDate.getDate() + 45);

    schedule.push({
      month: 1,
      payoutDate: firstPayoutDate.toISOString().split('T')[0],
      payoutAmount: monthlyProfit,
      isPrincipalIncluded: false,
      status: 'PENDING',
    });

    // Months 2-11: Every 30 days
    for (let month = 2; month <= 11; month++) {
      const payoutDate = new Date(firstPayoutDate);
      payoutDate.setDate(payoutDate.getDate() + (30 * (month - 1)));

      schedule.push({
        month,
        payoutDate: payoutDate.toISOString().split('T')[0],
        payoutAmount: monthlyProfit,
        isPrincipalIncluded: false,
        status: 'PENDING',
      });
    }

    // Month 12: Final payout includes principal
    const finalPayoutDate = new Date(firstPayoutDate);
    finalPayoutDate.setDate(finalPayoutDate.getDate() + (30 * 11));

    schedule.push({
      month: 12,
      payoutDate: finalPayoutDate.toISOString().split('T')[0],
      payoutAmount: principalAmount + monthlyProfit, // Principal + last month profit
      isPrincipalIncluded: true,
      status: 'PENDING',
    });

    return schedule;
  },

  /**
   * Get investment agreement details
   */
  async getAgreement(investmentId: string): Promise<InvestmentAgreement | null> {
    try {
      const { data, error } = await (supabase.from("investment_agreements") as any)
        .select('*')
        .eq("investment_id", investmentId)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        investmentId: data.investment_id,
        agreementNumber: data.agreement_number,
        agreementDate: data.agreement_date,
        startDate: data.start_date,
        endDate: data.end_date,
        monthlyRoiRate: data.monthly_roi_rate,
        totalMonths: data.total_months,
        principalAmount: data.principal_amount,
        totalExpectedProfit: data.total_expected_profit,
        totalExpectedPayout: data.total_expected_payout,
        notarizedBy: data.notarized_by,
        notarizationDate: data.notarization_date,
        advocateName: data.advocate_name,
        advocateLicense: data.advocate_license,
        agreementStatus: (String(data.agreement_status || "ACTIVE").toUpperCase() as InvestmentAgreement["agreementStatus"]),
        earlyTerminationAllowed: data.early_termination_allowed,
        earlyTerminationPenalty: data.early_termination_penalty,
      };
    } catch (error) {
      console.error('Failed to fetch agreement:', error);
      return null;
    }
  },

  /**
   * Check if agreement term has ended
   */
  async checkAgreementStatus(investmentId: string): Promise<{
    isCompleted: boolean;
    daysRemaining: number;
    endDate: string;
  }> {
    const agreement = await this.getAgreement(investmentId);
    
    if (!agreement) {
      return {
        isCompleted: false,
        daysRemaining: 0,
        endDate: '',
      };
    }

    const endDate = new Date(agreement.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      isCompleted: diffDays <= 0,
      daysRemaining: Math.max(0, diffDays),
      endDate: agreement.endDate,
    };
  },

  /**
   * Calculate total returns
   */
  calculateTotalReturns(principalAmount: number): {
    monthlyProfit: number;
    totalMonthlyPayouts: number;
    totalProfit: number;
    finalPayout: number;
    roi: number;
  } {
    const monthlyProfit = principalAmount * 0.15;
    const totalMonthlyPayouts = 12;
    const totalProfit = monthlyProfit * totalMonthlyPayouts; // 180% of principal
    const finalPayout = principalAmount + totalProfit; // 280% total return

    return {
      monthlyProfit,
      totalMonthlyPayouts,
      totalProfit,
      finalPayout,
      roi: 180, // 180% profit over 12 months
    };
  },

  /**
   * Format currency
   */
  formatCurrency(amount: number): string {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  },
};