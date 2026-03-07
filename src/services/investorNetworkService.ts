import { supabase } from "@/integrations/supabase/client";

export interface InvestorNetworkMember {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  investor_level: number;
  investment_amount: number;
  currency: string;
  total_payout: number;
  referral_code: string;
  referred_by: string | null;
  is_team_leader: boolean;
  location: string;
  created_at: string;
}

export interface PayoutHistoryRecord {
  id: string;
  user_id: string;
  payout_amount: number;
  currency: string;
  payout_date: string;
  month_year: string;
  status: string;
}

export const investorNetworkService = {
  /**
   * Get investor network based on logged-in user's level and role
   */
  async getNetworkMembers(): Promise<InvestorNetworkMember[]> {
    // Get current user's investor profile
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: currentInvestor } = await supabase
      .from('investor_network')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!currentInvestor) throw new Error('Investor profile not found');

    let query = supabase.from('investor_network').select('*');

    // Team Leader: See all referrals under their code only
    if (currentInvestor.is_team_leader) {
      query = query.or(`referral_code.eq.${currentInvestor.referral_code},referred_by.eq.${currentInvestor.referral_code}`);
    } 
    // Level 2: See only Level 2
    else if (currentInvestor.investor_level === 2) {
      query = query.eq('investor_level', 2);
    }
    // Level 3+: See current level + 2 ahead
    else {
      const maxLevel = currentInvestor.investor_level + 2;
      query = query
        .gte('investor_level', currentInvestor.investor_level)
        .lte('investor_level', maxLevel);
    }

    const { data, error } = await query.order('total_payout', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get payout history for a specific investor
   */
  async getPayoutHistory(userId: string): Promise<PayoutHistoryRecord[]> {
    const { data, error } = await supabase
      .from('payout_history')
      .select('*')
      .eq('user_id', userId)
      .order('payout_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get current user's investor profile
   */
  async getCurrentInvestorProfile(): Promise<InvestorNetworkMember | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('investor_network')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching investor profile:', error);
      return null;
    }

    return data;
  },

  /**
   * Format currency based on type
   */
  formatCurrency(amount: number, currency: string): string {
    const symbols: Record<string, string> = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
      AUD: 'A$',
      SGD: 'S$',
    };

    const symbol = symbols[currency] || currency;
    const formatted = amount.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    });

    return `${symbol}${formatted}`;
  },

  /**
   * Get level badge details
   */
  getLevelBadge(level: number): { color: string; label: string } {
    const badges: Record<number, { color: string; label: string }> = {
      1: { color: 'bg-purple-500', label: 'Team Leader' },
      2: { color: 'bg-gray-500', label: 'Level 2' },
      3: { color: 'bg-orange-500', label: 'Level 3' },
      4: { color: 'bg-amber-500', label: 'Level 4' },
      5: { color: 'bg-yellow-500', label: 'Level 5' },
      6: { color: 'bg-green-500', label: 'Level 6' },
      7: { color: 'bg-cyan-500', label: 'Level 7' },
      8: { color: 'bg-blue-500', label: 'Level 8' },
      9: { color: 'bg-indigo-500', label: 'Level 9' },
      10: { color: 'bg-pink-500', label: 'Level 10' },
    };

    return badges[level] || { color: 'bg-gray-500', label: `Level ${level}` };
  },
};