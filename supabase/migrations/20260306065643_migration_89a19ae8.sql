-- Commission Ledger with Payout-First Logic
CREATE TABLE IF NOT EXISTS commission_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  source_payout_id UUID REFERENCES monthly_payouts(id),
  commission_type TEXT NOT NULL CHECK (commission_type IN ('direct_referral', 'team_leader_bonus', 'rank_bonus')),
  base_payout_amount DECIMAL(15,2) NOT NULL,
  commission_rate DECIMAL(5,4) NOT NULL,
  commission_amount DECIMAL(15,2) NOT NULL,
  referral_level INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Rankings Table
CREATE TABLE IF NOT EXISTS user_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  current_rank TEXT NOT NULL DEFAULT 'grey' CHECK (current_rank IN ('grey', 'orange', 'bronze', 'silver', 'gold', 'platinum', 'diamond')),
  rank_color TEXT NOT NULL DEFAULT 'grey' CHECK (rank_color IN ('grey', 'orange', 'green', 'dark_green')),
  total_commission_earned DECIMAL(15,2) DEFAULT 0,
  bronze_timer_start TIMESTAMPTZ,
  bronze_timer_expires TIMESTAMPTZ,
  rank_achieved_at TIMESTAMPTZ,
  is_team_leader BOOLEAN DEFAULT FALSE,
  team_leader_activated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral Network Tree
CREATE TABLE IF NOT EXISTS referral_tree (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referrer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  referral_level INTEGER DEFAULT 1,
  is_active_investor BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Public Payout Ledger (for transparency)
CREATE TABLE IF NOT EXISTS public_payout_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month TEXT NOT NULL,
  total_payouts DECIMAL(15,2) NOT NULL,
  total_investors INTEGER NOT NULL,
  payout_date DATE NOT NULL,
  is_holiday BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_commission_user ON commission_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_commission_payout ON commission_ledger(source_payout_id);
CREATE INDEX IF NOT EXISTS idx_rankings_user ON user_rankings(user_id);
CREATE INDEX IF NOT EXISTS idx_rankings_rank ON user_rankings(current_rank);
CREATE INDEX IF NOT EXISTS idx_referral_user ON referral_tree(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_referrer ON referral_tree(referrer_id);