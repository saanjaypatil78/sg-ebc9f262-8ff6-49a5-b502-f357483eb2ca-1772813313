-- Update investment terms to 12-month fixed agreement
CREATE TABLE IF NOT EXISTS investment_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id UUID NOT NULL REFERENCES investments(id) ON DELETE CASCADE,
  agreement_number VARCHAR(50) UNIQUE NOT NULL,
  agreement_date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL, -- Exactly 12 months from start
  monthly_roi_rate DECIMAL(5,2) DEFAULT 15.00,
  total_months INTEGER DEFAULT 12,
  principal_amount DECIMAL(15,2) NOT NULL,
  total_expected_profit DECIMAL(15,2) NOT NULL, -- 180% of principal
  total_expected_payout DECIMAL(15,2) NOT NULL, -- Principal + Profit
  notarized_by VARCHAR(200),
  notarization_date DATE,
  advocate_name VARCHAR(200),
  advocate_license VARCHAR(100),
  agreement_status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, COMPLETED, TERMINATED
  early_termination_allowed BOOLEAN DEFAULT FALSE,
  early_termination_penalty DECIMAL(5,2) DEFAULT 50.00, -- 50% penalty
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_investment_agreements_investment ON investment_agreements(investment_id);
CREATE INDEX idx_investment_agreements_status ON investment_agreements(agreement_status);
CREATE INDEX idx_investment_agreements_end_date ON investment_agreements(end_date);

COMMENT ON TABLE investment_agreements IS 'Legally binding 12-month investment agreements (notarized before Advocate)';