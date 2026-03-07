-- Fix user_attributes table structure
DROP TABLE IF EXISTS user_attributes CASCADE;

CREATE TABLE user_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  investment_amount DECIMAL(15, 2) DEFAULT 0,
  investment_tier VARCHAR(20) DEFAULT 'NONE', -- NONE, BASIC, PREMIUM, ELITE
  device_binding_required BOOLEAN DEFAULT FALSE,
  risk_level VARCHAR(20) DEFAULT 'LOW', -- LOW, MEDIUM, HIGH
  kyc_verified BOOLEAN DEFAULT FALSE,
  kyc_verified_at TIMESTAMPTZ,
  last_investment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_attributes_user ON user_attributes(user_id);
CREATE INDEX idx_user_attributes_tier ON user_attributes(investment_tier);

-- Now insert test investors with proper attributes
INSERT INTO users (email, password_hash, full_name, role, email_verified, created_at)
VALUES
  ('investor1@sunray.eco', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIq.Yq3rZS', 'Rajesh Kumar', 'INVESTOR', TRUE, NOW()),
  ('investor2@sunray.eco', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIq.Yq3rZS', 'Priya Sharma', 'INVESTOR', TRUE, NOW()),
  ('investor3@sunray.eco', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIq.Yq3rZS', 'Amit Patel', 'INVESTOR', TRUE, NOW()),
  ('investor4@sunray.eco', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIq.Yq3rZS', 'Sunita Gupta', 'INVESTOR', TRUE, NOW()),
  ('investor5@sunray.eco', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIq.Yq3rZS', 'Vikram Singh', 'INVESTOR', TRUE, NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert investment attributes
WITH investor_ids AS (
  SELECT id, email FROM users WHERE email LIKE 'investor%@sunray.eco'
)
INSERT INTO user_attributes (user_id, investment_amount, investment_tier, device_binding_required, risk_level, kyc_verified, last_investment_date)
SELECT 
  id,
  CASE email
    WHEN 'investor1@sunray.eco' THEN 80000000.00  -- 8 Cr (Elite - requires device binding)
    WHEN 'investor2@sunray.eco' THEN 60000000.00  -- 6 Cr (Elite - requires device binding)
    WHEN 'investor3@sunray.eco' THEN 40000000.00  -- 4 Cr (Premium)
    WHEN 'investor4@sunray.eco' THEN 20000000.00  -- 2 Cr (Premium)
    WHEN 'investor5@sunray.eco' THEN 5000000.00   -- 50 Lakh (Basic)
  END,
  CASE email
    WHEN 'investor1@sunray.eco' THEN 'ELITE'
    WHEN 'investor2@sunray.eco' THEN 'ELITE'
    WHEN 'investor3@sunray.eco' THEN 'PREMIUM'
    WHEN 'investor4@sunray.eco' THEN 'PREMIUM'
    WHEN 'investor5@sunray.eco' THEN 'BASIC'
  END,
  CASE 
    WHEN email IN ('investor1@sunray.eco', 'investor2@sunray.eco') THEN TRUE
    ELSE FALSE
  END,
  CASE email
    WHEN 'investor1@sunray.eco' THEN 'HIGH'
    WHEN 'investor2@sunray.eco' THEN 'HIGH'
    WHEN 'investor3@sunray.eco' THEN 'MEDIUM'
    WHEN 'investor4@sunray.eco' THEN 'MEDIUM'
    WHEN 'investor5@sunray.eco' THEN 'LOW'
  END,
  TRUE,
  NOW() - INTERVAL '30 days'
FROM investor_ids;

-- Verify investor data
SELECT 
  u.email,
  u.full_name,
  ua.investment_amount / 10000000 as investment_cr,
  ua.investment_tier,
  ua.device_binding_required,
  ua.risk_level
FROM users u
JOIN user_attributes ua ON u.id = ua.user_id
WHERE u.email LIKE '%investor@sunray.eco'
ORDER BY ua.investment_amount DESC;