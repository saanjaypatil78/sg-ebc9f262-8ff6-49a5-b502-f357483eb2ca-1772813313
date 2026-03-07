-- Create rank progression system tables
CREATE TABLE IF NOT EXISTS investor_ranks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_rank TEXT NOT NULL DEFAULT 'BASE',
  total_business_volume NUMERIC DEFAULT 0,
  rank_achieved_at TIMESTAMPTZ DEFAULT NOW(),
  previous_rank TEXT,
  rank_upgraded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create commission rates configuration
CREATE TABLE IF NOT EXISTS commission_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rank TEXT NOT NULL UNIQUE,
  business_target NUMERIC NOT NULL,
  royalty_addon NUMERIC NOT NULL,
  level_1_rate NUMERIC NOT NULL,
  level_2_rate NUMERIC NOT NULL,
  level_3_rate NUMERIC NOT NULL,
  level_4_rate NUMERIC NOT NULL,
  level_5_rate NUMERIC NOT NULL,
  level_6_rate NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert commission rate structure
INSERT INTO commission_rates (rank, business_target, royalty_addon, level_1_rate, level_2_rate, level_3_rate, level_4_rate, level_5_rate, level_6_rate)
VALUES
  ('BASE', 0, 0.00, 0.20, 0.10, 0.07, 0.05, 0.02, 0.01),
  ('BRONZE', 10000000, 0.01, 0.21, 0.11, 0.08, 0.06, 0.03, 0.02),
  ('SILVER', 50000000, 0.0175, 0.2175, 0.1175, 0.0875, 0.0675, 0.0375, 0.0275),
  ('GOLD', 100000000, 0.0225, 0.2225, 0.1225, 0.0925, 0.0725, 0.0425, 0.0325),
  ('PLATINUM', 250000000, 0.026, 0.2260, 0.1260, 0.0960, 0.0760, 0.0460, 0.0360),
  ('DIAMOND', 500000000, 0.0285, 0.2285, 0.1285, 0.0985, 0.0785, 0.0485, 0.0385),
  ('AMBASSADOR', 1000000000, 0.03, 0.23, 0.13, 0.10, 0.08, 0.05, 0.04)
ON CONFLICT (rank) DO UPDATE SET
  business_target = EXCLUDED.business_target,
  royalty_addon = EXCLUDED.royalty_addon,
  level_1_rate = EXCLUDED.level_1_rate,
  level_2_rate = EXCLUDED.level_2_rate,
  level_3_rate = EXCLUDED.level_3_rate,
  level_4_rate = EXCLUDED.level_4_rate,
  level_5_rate = EXCLUDED.level_5_rate,
  level_6_rate = EXCLUDED.level_6_rate;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_investor_ranks_user ON investor_ranks(user_id);
CREATE INDEX IF NOT EXISTS idx_investor_ranks_rank ON investor_ranks(current_rank);
CREATE INDEX IF NOT EXISTS idx_commission_rates_rank ON commission_rates(rank);

COMMENT ON TABLE investor_ranks IS 'Tracks investor rank progression and total business volume';
COMMENT ON TABLE commission_rates IS 'Commission rate structure for each rank tier';