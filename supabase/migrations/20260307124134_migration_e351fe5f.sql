ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES users(id);

INSERT INTO users (id, email, password_hash, full_name, role, referral_code, kyc_status)
VALUES 
  (gen_random_uuid(), 'system@investor.com', 'hash', 'Investor Referrer', 'investor', 'INVEST2025', 'verified'),
  (gen_random_uuid(), 'system@vendor.com', 'hash', 'Vendor Referrer', 'vendor', 'VENDOR2025', 'verified'),
  (gen_random_uuid(), 'system@client.com', 'hash', 'Client Referrer', 'client', 'CLIENT2025', 'verified'),
  (gen_random_uuid(), 'system@admin.com', 'hash', 'Admin Referrer', 'admin', 'ADMIN2025', 'verified'),
  (gen_random_uuid(), 'system@bdm.com', 'hash', 'BDM Referrer', 'bdm', 'BDM2025', 'verified')
ON CONFLICT (email) DO NOTHING;