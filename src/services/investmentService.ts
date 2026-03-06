import { supabase } from "@/integrations/supabase/client";

export interface InvestmentAgreement {
  id: string;
  agreement_number: number;
  investor_id: string;
  agreement_value: number;
  investment_date: string;
  maturity_date: string;
  status: 'active' | 'matured' | 'cancelled';
  monthly_payout_rate: number;
  total_paid_out: number;
  next_payout_date: string | null;
}

export interface MonthlyPayout {
  id: string;
  agreement_id: string;
  investor_id: string;
  payout_month: string;
  principal_amount: number;
  payout_percentage: number;
  payout_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_method: string;
  transaction_id: string | null;
  processed_at: string | null;
}

export const investmentService = {
  /**
   * Calculate agreement value (₹12 Cr / 28 contracts)
   */
  calculateAgreementValue(): number {
    const totalCorpus = 120000000; // ₹12 Crore
    const totalContracts = 28;
    const baseValue = totalCorpus / totalContracts;
    // Round to nearest lakh for clean figures
    return Math.round(baseValue / 100000) * 100000;
  },

  /**
   * Create new investment agreement
   */
  async createAgreement(investorId: string, customValue?: number): Promise<InvestmentAgreement> {
    const agreementValue = customValue || this.calculateAgreementValue();
    
    // Get next agreement number
    const { data: lastAgreement } = await supabase
      .from('investment_agreements')
      .select('agreement_number')
      .order('agreement_number', { ascending: false })
      .limit(1)
      .single();

    const agreementNumber = (lastAgreement?.agreement_number || 0) + 1;

    // Calculate maturity (1 year from now)
    const maturityDate = new Date();
    maturityDate.setFullYear(maturityDate.getFullYear() + 1);

    const { data, error } = await supabase
      .from('investment_agreements')
      .insert({
        agreement_number: agreementNumber,
        investor_id: investorId,
        agreement_value: agreementValue,
        maturity_date: maturityDate.toISOString(),
        monthly_payout_rate: 0.15, // 15%
        next_payout_date: this.calculateNextPayoutDate()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Calculate next payout date (1st-5th of month, excluding holidays)
   */
  calculateNextPayoutDate(): string {
    const now = new Date();
    const currentDay = now.getDate();
    
    const payoutDate = new Date(now);
    
    // If we're past the 5th, move to next month
    if (currentDay > 5) {
      payoutDate.setMonth(payoutDate.getMonth() + 1);
    }
    
    // Set to 1st of the month
    payoutDate.setDate(1);
    
    // TODO: Integrate Google Calendar API to skip holidays
    // For now, just return the 1st
    return payoutDate.toISOString().split('T')[0];
  },

  /**
   * Calculate monthly payout (15% of principal)
   */
  calculateMonthlyPayout(principalAmount: number): number {
    return principalAmount * 0.15;
  },

  /**
   * Get investor's active agreements
   */
  async getInvestorAgreements(investorId: string): Promise<InvestmentAgreement[]> {
    const { data, error } = await supabase
      .from('investment_agreements')
      .select('*')
      .eq('investor_id', investorId)
      .eq('status', 'active')
      .order('investment_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get payout history
   */
  async getPayoutHistory(investorId: string): Promise<MonthlyPayout[]> {
    const { data, error } = await supabase
      .from('monthly_payouts')
      .select('*')
      .eq('investor_id', investorId)
      .order('payout_month', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Create monthly payout record
   */
  async createMonthlyPayout(agreementId: string, investorId: string, month: string): Promise<MonthlyPayout> {
    // Get agreement details
    const { data: agreement } = await supabase
      .from('investment_agreements')
      .select('*')
      .eq('id', agreementId)
      .single();

    if (!agreement) throw new Error('Agreement not found');

    const payoutAmount = this.calculateMonthlyPayout(agreement.agreement_value);

    const { data, error } = await supabase
      .from('monthly_payouts')
      .insert({
        agreement_id: agreementId,
        investor_id: investorId,
        payout_month: month,
        principal_amount: agreement.agreement_value,
        payout_percentage: agreement.monthly_payout_rate,
        payout_amount: payoutAmount,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get total portfolio value for investor
   */
  async getPortfolioSummary(investorId: string) {
    const agreements = await this.getInvestorAgreements(investorId);
    const payouts = await this.getPayoutHistory(investorId);

    const totalInvested = agreements.reduce((sum, a) => sum + a.agreement_value, 0);
    const totalReceived = payouts
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.payout_amount, 0);

    const monthlyReturn = agreements.reduce(
      (sum, a) => sum + this.calculateMonthlyPayout(a.agreement_value),
      0
    );

    return {
      totalInvested,
      totalReceived,
      monthlyReturn,
      activeAgreements: agreements.length,
      totalPayouts: payouts.length,
      roi: totalInvested > 0 ? (totalReceived / totalInvested) * 100 : 0
    };
  }
};