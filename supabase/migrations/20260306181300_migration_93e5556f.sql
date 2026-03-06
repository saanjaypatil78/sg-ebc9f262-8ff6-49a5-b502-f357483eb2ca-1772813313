-- ============================================================================
-- SUNRAY ECOSYSTEM - RBAC DATABASE SCHEMA
-- Fast Authentication with Role-Based Access Control
-- ============================================================================

-- 1. Create users table with RBAC support
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'CLIENT',
  
  -- Additional fields
  phone TEXT,
  kyc_status TEXT DEFAULT 'PENDING',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- 2. Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at);

-- 3. Create test users for all roles
INSERT INTO users (email, password_hash, full_name, role, email_verified, is_active)
VALUES
  -- Super Admin
  ('admin@sunray.eco', 'hashed_admin_password', 'Super Administrator', 'SUPER_ADMIN', true, true),
  ('superadmin@sunray.eco', 'hashed_superadmin_password', 'System Super Admin', 'SUPER_ADMIN', true, true),
  
  -- Admin
  ('admin1@sunray.eco', 'hashed_admin_password', 'Admin User', 'ADMIN', true, true),
  
  -- Finance
  ('finance@sunray.eco', 'hashed_finance_password', 'Finance Manager', 'FINANCE', true, true),
  
  -- Compliance
  ('compliance@sunray.eco', 'hashed_compliance_password', 'Compliance Officer', 'COMPLIANCE', true, true),
  
  -- BDM
  ('bdm@sunray.eco', 'hashed_bdm_password', 'Business Development Manager', 'BDM', true, true),
  
  -- Vendor
  ('vendor@sunray.eco', 'hashed_vendor_password', 'Vendor User', 'VENDOR', true, true),
  
  -- Investor
  ('investor@sunray.eco', 'hashed_investor_password', 'Investor User', 'INVESTOR', true, true),
  
  -- Client
  ('client@sunray.eco', 'hashed_client_password', 'Client User', 'CLIENT', true, true)
ON CONFLICT (email) DO NOTHING;

-- 4. Create audit log table for tracking
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity TEXT,
  entity_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

-- 5. Enable Row Level Security (optional - for extra security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 6. Create policies (users can read their own data, admins can read all)
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- 7. Return success message
SELECT 
  'Database schema created successfully for RBAC' as status,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE role = 'SUPER_ADMIN') as super_admins,
  COUNT(*) FILTER (WHERE role = 'ADMIN') as admins,
  COUNT(*) FILTER (WHERE role = 'INVESTOR') as investors,
  COUNT(*) FILTER (WHERE role = 'VENDOR') as vendors
FROM users;