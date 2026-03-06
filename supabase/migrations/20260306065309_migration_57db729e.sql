-- Investment Agreements Table
CREATE TABLE IF NOT EXISTS investment_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_number INTEGER UNIQUE NOT NULL,
  investor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  agreement_value DECIMAL(15,2) NOT NULL DEFAULT 4300000.00,
  investment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  maturity_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'matured', 'cancelled')),
  monthly_payout_rate DECIMAL(5,4) NOT NULL DEFAULT 0.15,
  total_paid_out DECIMAL(15,2) DEFAULT 0,
  next_payout_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Monthly Payouts Table
CREATE TABLE IF NOT EXISTS monthly_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id UUID REFERENCES investment_agreements(id) ON DELETE CASCADE,
  investor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  payout_month DATE NOT NULL,
  principal_amount DECIMAL(15,2) NOT NULL,
  payout_percentage DECIMAL(5,4) NOT NULL,
  payout_amount DECIMAL(15,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payment_method TEXT DEFAULT 'phonepe',
  transaction_id TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commission Ledger Table
CREATE TABLE IF NOT EXISTS commission_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  source_payout_id UUID REFERENCES monthly_payouts(id) ON DELETE CASCADE,
  commission_type TEXT NOT NULL CHECK (commission_type IN ('direct_referral', 'team_leader', 'level_1', 'level_2', 'level_3')),
  base_amount DECIMAL(15,2) NOT NULL,
  commission_rate DECIMAL(5,4) NOT NULL,
  commission_amount DECIMAL(15,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ranking System Table
CREATE TABLE IF NOT EXISTS user_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  current_rank TEXT NOT NULL DEFAULT 'grey' CHECK (current_rank IN ('grey', 'orange', 'bronze', 'silver', 'gold', 'platinum', 'diamond')),
  rank_color TEXT NOT NULL DEFAULT '#6B7280',
  total_network_commission DECIMAL(15,2) DEFAULT 0,
  direct_referrals INTEGER DEFAULT 0,
  total_team_size INTEGER DEFAULT 0,
  is_team_leader BOOLEAN DEFAULT FALSE,
  is_active_investor BOOLEAN DEFAULT FALSE,
  investment_count INTEGER DEFAULT 0,
  payout_months_received INTEGER DEFAULT 0,
  bronze_countdown_start TIMESTAMPTZ,
  bronze_countdown_end TIMESTAMPTZ,
  rank_upgraded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Public Payout Ledger (for transparency)
CREATE TABLE IF NOT EXISTS public_payout_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payout_month DATE NOT NULL,
  total_investors INTEGER NOT NULL,
  total_payout_amount DECIMAL(15,2) NOT NULL,
  average_payout DECIMAL(15,2),
  payout_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fundraising Adjustments Table
CREATE TABLE IF NOT EXISTS fundraising_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  adjusted_by UUID REFERENCES profiles(id),
  adjustment_type TEXT NOT NULL CHECK (adjustment_type IN ('contract_allocation', 'payout_adjustment', 'commission_override', 'rank_upgrade')),
  entity_id UUID NOT NULL,
  old_value JSONB,
  new_value JSONB,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PhonePe Transactions Table
CREATE TABLE IF NOT EXISTS phonepe_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('investment', 'payout', 'commission')),
  amount DECIMAL(15,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('initiated', 'pending', 'success', 'failed', 'refunded')),
  phonepe_order_id TEXT,
  phonepe_transaction_id TEXT,
  callback_data JSONB,
  initiated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- IPO Milestones Table
CREATE TABLE IF NOT EXISTS ipo_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_stage TEXT NOT NULL CHECK (milestone_stage IN ('pre_ipo', 'ipo_filing', 'ipo_approval', 'nse_mainboard')),
  target_date DATE NOT NULL,
  completion_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  criteria_met JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_agreements_investor ON investment_agreements(investor_id);
CREATE INDEX IF NOT EXISTS idx_payouts_investor ON monthly_payouts(investor_id);
CREATE INDEX IF NOT EXISTS idx_payouts_month ON monthly_payouts(payout_month);
CREATE INDEX IF NOT EXISTS idx_commission_user ON commission_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_rankings_user ON user_rankings(user_id);
CREATE INDEX IF NOT EXISTS idx_rankings_rank ON user_rankings(current_rank);
CREATE INDEX IF NOT EXISTS idx_phonepe_user ON phonepe_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_phonepe_status ON phonepe_transactions(status);