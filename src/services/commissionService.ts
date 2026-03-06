import { supabase } from "@/integrations/supabase/client";

export interface CommissionRecord {
  id: string;
  user_id: string;
  source_payout_id: string;
  commission_type: 'direct_referral' | 'team_leader_bonus' | 'rank_bonus';
  base_payout_amount: number;
  commission_rate: number;
  commission_amount: number;
  referral_level: number | null;
  created_at: string;
}

export interface UserRanking {
  id: string;
  user_id: string;
  current_rank: 'grey' | 'orange' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  rank_color: 'grey' | 'orange' | 'green' | 'dark_green';
  total_commission_earned: number;
  bronze_timer_start: string | null;
  bronze_timer_expires: string | null;
  rank_achieved_at: string | null;
  is_team_leader: boolean;
  team_leader_activated_by: string | null;
}

export const COMMISSION_RATES = {
  DIRECT_REFERRAL: 0.20, // 20% on investor payout
  TEAM_LEADER_BONUS: 0.20, // 20% on sub-referral payouts (pre-Bronze)
  BRONZE_THRESHOLD: 10000000, // ₹1 Crore in total commission
  BRONZE_COUNTDOWN_DAYS: 90,
} as const;

export const commissionService = {
  /**
   * STEP 1: Process investor payout FIRST
   * STEP 2: Calculate referral commissions AFTER payout
   * 
   * This is the core logic: Payout → Commission → Deductions
   */
  async processPayoutAndCommissions(payoutId: string): Promise<void> {
    // Get the payout details
    const { data: payout } = await supabase
      .from('monthly_payouts')
      .select('*, investment_agreements(*)')
      .eq('id', payoutId)
      .single();

    if (!payout) throw new Error('Payout not found');

    // STEP 1: Mark payout as processed (investor receives money FIRST)
    await supabase
      .from('monthly_payouts')
      .update({ 
        status: 'completed',
        processed_at: new Date().toISOString()
      })
      .eq('id', payoutId);

    // STEP 2: Now calculate commissions on the PAYOUT amount
    await this.calculateReferralCommissions(payout);
  },

  /**
   * Calculate 20% commission on investor PAYOUT (not investment)
   */
  async calculateReferralCommissions(payout: any): Promise<void> {
    const investorId = payout.investor_id;
    const payoutAmount = parseFloat(payout.payout_amount);

    // Get the referrer (direct upline)
    const { data: referralData } = await supabase
      .from('referral_tree')
      .select('referrer_id, referral_level')
      .eq('user_id', investorId)
      .single();

    if (!referralData?.referrer_id) return; // No referrer

    const referrerId = referralData.referrer_id;

    // Check if referrer is a Team Leader (pre-Bronze)
    const { data: ranking } = await supabase
      .from('user_rankings')
      .select('*')
      .eq('user_id', referrerId)
      .single();

    const isTeamLeader = ranking?.is_team_leader && ranking.current_rank === 'grey';

    // Calculate commission (20% of payout)
    const commissionAmount = payoutAmount * COMMISSION_RATES.DIRECT_REFERRAL;

    // Record the commission
    await supabase
      .from('commission_ledger')
      .insert({
        user_id: referrerId,
        source_payout_id: payout.id,
        commission_type: isTeamLeader ? 'team_leader_bonus' : 'direct_referral',
        base_payout_amount: payoutAmount,
        commission_rate: COMMISSION_RATES.DIRECT_REFERRAL,
        commission_amount: commissionAmount,
        referral_level: 1
      });

    // Update total commission earned
    await this.updateTotalCommission(referrerId, commissionAmount);

    // If Team Leader, also process sub-referrals
    if (isTeamLeader) {
      await this.processTeamLeaderBonus(referrerId, payout);
    }
  },

  /**
   * Team Leader Bonus: Treat all sub-referrals as direct referrals
   * Generate 20% on their payouts too
   */
  async processTeamLeaderBonus(teamLeaderId: string, originalPayout: any): Promise<void> {
    // Get all sub-referrals (referrals of the direct referral)
    const { data: subReferrals } = await supabase
      .from('referral_tree')
      .select('user_id')
      .eq('referrer_id', originalPayout.investor_id);

    if (!subReferrals || subReferrals.length === 0) return;

    // For each sub-referral's payout, give Team Leader 20%
    for (const subRef of subReferrals) {
      const { data: subPayouts } = await supabase
        .from('monthly_payouts')
        .select('*')
        .eq('investor_id', subRef.user_id)
        .eq('status', 'completed')
        .gte('processed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

      if (!subPayouts) continue;

      for (const subPayout of subPayouts) {
        const bonusAmount = parseFloat(subPayout.payout_amount) * COMMISSION_RATES.TEAM_LEADER_BONUS;

        await supabase
          .from('commission_ledger')
          .insert({
            user_id: teamLeaderId,
            source_payout_id: subPayout.id,
            commission_type: 'team_leader_bonus',
            base_payout_amount: parseFloat(subPayout.payout_amount),
            commission_rate: COMMISSION_RATES.TEAM_LEADER_BONUS,
            commission_amount: bonusAmount,
            referral_level: 2
          });

        await this.updateTotalCommission(teamLeaderId, bonusAmount);
      }
    }
  },

  /**
   * Update user's total commission and check for rank upgrades
   */
  async updateTotalCommission(userId: string, additionalCommission: number): Promise<void> {
    const { data: ranking } = await supabase
      .from('user_rankings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!ranking) {
      // Create initial ranking
      await supabase
        .from('user_rankings')
        .insert({
          user_id: userId,
          current_rank: 'grey',
          rank_color: 'grey',
          total_commission_earned: additionalCommission
        });
      return;
    }

    const newTotal = parseFloat(ranking.total_commission_earned.toString()) + additionalCommission;

    await supabase
      .from('user_rankings')
      .update({ 
        total_commission_earned: newTotal,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    // Check for Bronze qualification (₹1 Cr)
    if (newTotal >= COMMISSION_RATES.BRONZE_THRESHOLD && ranking.current_rank === 'grey') {
      await this.startBronzeCountdown(userId);
    }
  },

  /**
   * Start 90-day countdown timer for Bronze qualification
   */
  async startBronzeCountdown(userId: string): Promise<void> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + COMMISSION_RATES.BRONZE_COUNTDOWN_DAYS * 24 * 60 * 60 * 1000);

    await supabase
      .from('user_rankings')
      .update({
        bronze_timer_start: now.toISOString(),
        bronze_timer_expires: expiresAt.toISOString(),
        updated_at: now.toISOString()
      })
      .eq('user_id', userId);

    // Send email notification to Super Admin
    await this.notifySuperAdminBronzeQualification(userId);
  },

  /**
   * Notify Super Admin at 007saanjaypatil@gmail.com
   */
  async notifySuperAdminBronzeQualification(userId: string): Promise<void> {
    const { data: user } = await supabase
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('id', userId)
      .single();

    // TODO: Integrate email service (SendGrid, Resend, etc.)
    console.log('Email notification to 007saanjaypatil@gmail.com:', {
      subject: 'Bronze Tier Qualification - 90 Day Countdown Started',
      user: user,
      message: 'User has achieved ₹1 Cr in commission and qualifies for Bronze tier'
    });
  },

  /**
   * Activate Orange status (passive referral) - Super Admin only
   */
  async activateOrangeStatus(userId: string, superAdminId: string): Promise<void> {
    await supabase
      .from('user_rankings')
      .update({
        rank_color: 'orange',
        is_team_leader: true,
        team_leader_activated_by: superAdminId,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
  },

  /**
   * Upgrade to Bronze after 90-day countdown expires
   */
  async upgradeToBronze(userId: string): Promise<void> {
    await supabase
      .from('user_rankings')
      .update({
        current_rank: 'bronze',
        rank_color: 'green',
        is_team_leader: false, // No longer needs Team Leader bonus
        rank_achieved_at: new Date().toISOString(),
        bronze_timer_start: null,
        bronze_timer_expires: null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
  },

  /**
   * Get user's commission summary
   */
  async getCommissionSummary(userId: string) {
    const { data: commissions } = await supabase
      .from('commission_ledger')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const { data: ranking } = await supabase
      .from('user_rankings')
      .select('*')
      .eq('user_id', userId)
      .single();

    const totalEarned = ranking?.total_commission_earned || 0;
    const bronzeProgress = (totalEarned / COMMISSION_RATES.BRONZE_THRESHOLD) * 100;

    return {
      commissions: commissions || [],
      ranking: ranking,
      totalEarned,
      bronzeProgress,
      daysUntilBronze: ranking?.bronze_timer_expires 
        ? Math.ceil((new Date(ranking.bronze_timer_expires).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
        : null
    };
  }
};