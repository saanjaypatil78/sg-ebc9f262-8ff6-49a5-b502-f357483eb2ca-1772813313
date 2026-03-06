-- ============================================================================
-- HYBRID RBAC-ABAC SECURITY SYSTEM FOR FINANCIAL APPLICATION
-- ============================================================================
-- Phase 1: ABAC Attributes & Device Management
-- ============================================================================

-- User Attributes (ABAC Layer)
CREATE TABLE IF NOT EXISTS user_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Financial Attributes
  total_investment DECIMAL(15, 2) DEFAULT 0,
  investment_tier VARCHAR(20) DEFAULT 'BASIC', -- BASIC, PREMIUM, ELITE (>5 Cr)
  risk_level VARCHAR(20) DEFAULT 'LOW', -- LOW, MEDIUM, HIGH
  
  -- Location Attributes
  allowed_countries TEXT[] DEFAULT ARRAY['IN'], -- ISO country codes
  allowed_ip_ranges TEXT[] DEFAULT ARRAY[]::TEXT[], -- CIDR notation
  
  -- Time Attributes
  access_start_time TIME DEFAULT '09:00:00',
  access_end_time TIME DEFAULT '18:00:00',
  timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
  
  -- Device Attributes
  require_device_binding BOOLEAN DEFAULT FALSE,
  max_concurrent_sessions INTEGER DEFAULT 3,
  session_timeout_minutes INTEGER DEFAULT 30,
  
  -- Transaction Attributes
  max_transaction_amount DECIMAL(15, 2),
  require_dual_approval_above DECIMAL(15, 2),
  
  -- Security Attributes
  require_2fa BOOLEAN DEFAULT FALSE,
  require_email_verification BOOLEAN DEFAULT TRUE,
  suspicious_activity_count INTEGER DEFAULT 0,
  last_suspicious_activity TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_attributes_user_id ON user_attributes(user_id);
CREATE INDEX idx_user_attributes_tier ON user_attributes(investment_tier);
CREATE INDEX idx_user_attributes_risk ON user_attributes(risk_level);

-- ============================================================================
-- Device Fingerprinting & Trusted Devices
-- ============================================================================

CREATE TABLE IF NOT EXISTS trusted_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Device Fingerprint
  device_fingerprint TEXT NOT NULL,
  device_name VARCHAR(200),
  device_type VARCHAR(50), -- desktop, mobile, tablet
  
  -- Browser Info
  browser_name VARCHAR(100),
  browser_version VARCHAR(50),
  os_name VARCHAR(100),
  os_version VARCHAR(50),
  
  -- Hardware Info
  screen_resolution VARCHAR(50),
  timezone VARCHAR(50),
  language VARCHAR(10),
  
  -- Network Info
  last_ip_address INET,
  last_location JSONB, -- {city, region, country}
  
  -- Trust Status
  is_trusted BOOLEAN DEFAULT FALSE,
  trust_expires_at TIMESTAMPTZ,
  
  -- Usage Stats
  first_seen TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  login_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trusted_devices_user_id ON trusted_devices(user_id);
CREATE INDEX idx_trusted_devices_fingerprint ON trusted_devices(device_fingerprint);
CREATE UNIQUE INDEX idx_trusted_devices_unique ON trusted_devices(user_id, device_fingerprint);

-- ============================================================================
-- Active Sessions (Concurrent Login Monitoring)
-- ============================================================================

CREATE TABLE IF NOT EXISTS active_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Session Info
  session_token TEXT UNIQUE NOT NULL,
  device_fingerprint TEXT,
  device_id UUID REFERENCES trusted_devices(id),
  
  -- Location & Network
  ip_address INET NOT NULL,
  user_agent TEXT,
  location JSONB,
  
  -- Activity Tracking
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Security Flags
  is_suspicious BOOLEAN DEFAULT FALSE,
  suspicious_reason TEXT,
  killed_at TIMESTAMPTZ,
  killed_by UUID REFERENCES users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_active_sessions_user_id ON active_sessions(user_id);
CREATE INDEX idx_active_sessions_token ON active_sessions(session_token);
CREATE INDEX idx_active_sessions_active ON active_sessions(is_active);
CREATE INDEX idx_active_sessions_expires ON active_sessions(expires_at);

-- Auto-cleanup expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  UPDATE active_sessions 
  SET is_active = FALSE, killed_at = NOW()
  WHERE expires_at < NOW() AND is_active = TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Login History (Audit Trail)
-- ============================================================================

CREATE TABLE IF NOT EXISTS login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Login Attempt Info
  email VARCHAR(255) NOT NULL,
  login_status VARCHAR(20) NOT NULL, -- SUCCESS, FAILED, BLOCKED
  failure_reason TEXT,
  
  -- Device & Location
  device_fingerprint TEXT,
  device_name VARCHAR(200),
  ip_address INET,
  user_agent TEXT,
  location JSONB,
  
  -- Context
  is_new_device BOOLEAN DEFAULT FALSE,
  is_new_location BOOLEAN DEFAULT FALSE,
  risk_score INTEGER DEFAULT 0, -- 0-100
  
  -- 2FA Info
  required_2fa BOOLEAN DEFAULT FALSE,
  passed_2fa BOOLEAN,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_login_history_user_id ON login_history(user_id);
CREATE INDEX idx_login_history_email ON login_history(email);
CREATE INDEX idx_login_history_status ON login_history(login_status);
CREATE INDEX idx_login_history_created ON login_history(created_at DESC);

-- ============================================================================
-- 2FA (Two-Factor Authentication)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_2fa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- TOTP Secret
  secret_key TEXT NOT NULL, -- Base32 encoded
  backup_codes TEXT[], -- Array of one-time backup codes
  
  -- Status
  is_enabled BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  
  -- Recovery
  recovery_email VARCHAR(255),
  recovery_phone VARCHAR(20),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_2fa_user_id ON user_2fa(user_id);

-- ============================================================================
-- Email Verification
-- ============================================================================

CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX idx_email_tokens_token ON email_verification_tokens(token);

-- ============================================================================
-- Password Reset Tokens
-- ============================================================================

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_password_reset_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);

-- ============================================================================
-- ABAC Security Policies (Dynamic Rules Engine)
-- ============================================================================

CREATE TABLE IF NOT EXISTS security_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Policy Identity
  policy_name VARCHAR(200) UNIQUE NOT NULL,
  policy_type VARCHAR(50) NOT NULL, -- INVESTMENT_TIER, TIME_WINDOW, IP_RESTRICTION, etc.
  description TEXT,
  
  -- Target
  applies_to_roles TEXT[], -- Array of role names
  applies_to_tiers TEXT[], -- Array of investment tiers
  
  -- Condition (JSON-based rule)
  condition JSONB NOT NULL,
  -- Example: {"investment_amount": {">": 50000000}, "time": {"between": ["09:00", "18:00"]}}
  
  -- Action
  action VARCHAR(50) NOT NULL, -- ALLOW, DENY, REQUIRE_2FA, REQUIRE_APPROVAL
  enforcement_level VARCHAR(20) DEFAULT 'STRICT', -- STRICT, WARNING, AUDIT
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 100, -- Lower = higher priority
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_security_policies_active ON security_policies(is_active);
CREATE INDEX idx_security_policies_priority ON security_policies(priority);

-- ============================================================================
-- Initialize User Attributes for Existing Users
-- ============================================================================

INSERT INTO user_attributes (user_id, investment_tier, require_device_binding, require_2fa)
SELECT 
  id,
  CASE 
    WHEN role IN ('SUPER_ADMIN', 'ADMIN', 'FINANCE', 'COMPLIANCE') THEN 'ADMIN'
    WHEN role = 'INVESTOR' THEN 'BASIC'
    WHEN role = 'VENDOR' THEN 'BASIC'
    ELSE 'BASIC'
  END,
  CASE 
    WHEN role IN ('SUPER_ADMIN', 'ADMIN', 'FINANCE', 'COMPLIANCE') THEN TRUE
    ELSE FALSE
  END,
  CASE 
    WHEN role IN ('SUPER_ADMIN', 'ADMIN', 'FINANCE', 'COMPLIANCE') THEN TRUE
    ELSE FALSE
  END
FROM users
WHERE NOT EXISTS (SELECT 1 FROM user_attributes WHERE user_attributes.user_id = users.id);

-- ============================================================================
-- Default Security Policies for Financial App
-- ============================================================================

INSERT INTO security_policies (policy_name, policy_type, applies_to_roles, applies_to_tiers, condition, action, priority)
VALUES
  -- Elite Investors (>5 Cr) MUST use trusted devices
  ('elite_investor_device_binding', 'DEVICE_BINDING', ARRAY['INVESTOR'], ARRAY['ELITE'], 
   '{"investment_amount": {">": 50000000}}'::jsonb, 
   'REQUIRE_DEVICE', 10),
  
  -- Admin roles require 2FA always
  ('admin_require_2fa', 'AUTHENTICATION', ARRAY['SUPER_ADMIN', 'ADMIN', 'FINANCE', 'COMPLIANCE'], ARRAY[]::TEXT[], 
   '{}'::jsonb, 
   'REQUIRE_2FA', 5),
  
  -- High-value transactions (>1 Cr) require dual approval
  ('high_value_approval', 'TRANSACTION_LIMIT', ARRAY['INVESTOR', 'VENDOR'], ARRAY['PREMIUM', 'ELITE'], 
   '{"transaction_amount": {">": 10000000}}'::jsonb, 
   'REQUIRE_APPROVAL', 20),
  
  -- Business hours only for elite investors
  ('elite_business_hours', 'TIME_WINDOW', ARRAY['INVESTOR'], ARRAY['ELITE'], 
   '{"time": {"between": ["09:00:00", "18:00:00"]}, "timezone": "Asia/Kolkata"}'::jsonb, 
   'DENY', 15),
  
  -- Suspicious activity threshold
  ('suspicious_activity_block', 'SECURITY', ARRAY[]::TEXT[], ARRAY[]::TEXT[], 
   '{"failed_login_attempts": {">": 5}}'::jsonb, 
   'DENY', 1);

-- ============================================================================
-- Helper Functions
-- ============================================================================

-- Function: Get user's ABAC attributes
CREATE OR REPLACE FUNCTION get_user_abac_attributes(p_user_id UUID)
RETURNS TABLE(
  investment_tier TEXT,
  require_device_binding BOOLEAN,
  require_2fa BOOLEAN,
  total_investment DECIMAL,
  max_concurrent_sessions INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ua.investment_tier::TEXT,
    ua.require_device_binding,
    ua.require_2fa,
    ua.total_investment,
    ua.max_concurrent_sessions
  FROM user_attributes ua
  WHERE ua.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Record login attempt
CREATE OR REPLACE FUNCTION record_login_attempt(
  p_email VARCHAR,
  p_user_id UUID,
  p_status VARCHAR,
  p_ip_address INET,
  p_device_fingerprint TEXT,
  p_user_agent TEXT
)
RETURNS UUID AS $$
DECLARE
  v_login_id UUID;
BEGIN
  INSERT INTO login_history (
    user_id, email, login_status, ip_address, device_fingerprint, user_agent
  ) VALUES (
    p_user_id, p_email, p_status, p_ip_address, p_device_fingerprint, p_user_agent
  ) RETURNING id INTO v_login_id;
  
  RETURN v_login_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Test: Verify Schema
-- ============================================================================

SELECT 
  'ABAC System Ready' as status,
  (SELECT COUNT(*) FROM user_attributes) as user_attributes,
  (SELECT COUNT(*) FROM trusted_devices) as trusted_devices,
  (SELECT COUNT(*) FROM active_sessions) as active_sessions,
  (SELECT COUNT(*) FROM login_history) as login_history,
  (SELECT COUNT(*) FROM security_policies) as security_policies;