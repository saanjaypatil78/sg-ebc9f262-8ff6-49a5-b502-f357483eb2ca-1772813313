-- Create investor_network table
CREATE TABLE IF NOT EXISTS investor_network (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  investor_level INTEGER NOT NULL DEFAULT 2,
  investment_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  referral_code TEXT NOT NULL UNIQUE,
  referred_by TEXT,
  is_team_leader BOOLEAN DEFAULT FALSE,
  location TEXT NOT NULL,
  total_payout NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_investor_network_level ON investor_network(investor_level);
CREATE INDEX IF NOT EXISTS idx_investor_network_referral ON investor_network(referral_code);
CREATE INDEX IF NOT EXISTS idx_investor_network_referred_by ON investor_network(referred_by);

-- Add currency column to payout_history if it doesn't exist
ALTER TABLE payout_history ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'INR';

-- Add month_year column to payout_history if it doesn't exist
ALTER TABLE payout_history ADD COLUMN IF NOT EXISTS month_year TEXT;

-- Enable RLS
ALTER TABLE investor_network ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Level-based access
CREATE POLICY "Level-based network access" ON investor_network
  FOR SELECT USING (
    -- Team Leaders (Level 1) see all investors under their referral code
    (EXISTS (
      SELECT 1 FROM investor_network self
      WHERE self.user_id = auth.uid()
      AND self.is_team_leader = TRUE
      AND investor_network.referred_by = self.referral_code
    ))
    OR
    -- Level 2 sees Level 2 only
    (EXISTS (
      SELECT 1 FROM investor_network self
      WHERE self.user_id = auth.uid()
      AND self.investor_level = 2
      AND investor_network.investor_level = 2
    ))
    OR
    -- Level 3+ sees current level + 2 ahead
    (EXISTS (
      SELECT 1 FROM investor_network self
      WHERE self.user_id = auth.uid()
      AND self.investor_level >= 3
      AND investor_network.investor_level >= self.investor_level
      AND investor_network.investor_level <= (self.investor_level + 2)
    ))
    OR
    -- Users can always see their own profile
    investor_network.user_id = auth.uid()
  );

COMMENT ON TABLE investor_network IS 'Investor network with level-based visibility and referral hierarchy';