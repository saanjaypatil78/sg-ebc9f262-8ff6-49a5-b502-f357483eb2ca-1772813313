-- Update user_role enum to include new roles
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'investor';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'franchise_partner';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';

-- Ensure profiles table has all necessary columns for the new onboarding flow
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pincode text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS aadhaar_number text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pan_number text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bank_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_number text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ifsc_code text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_holder_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS investment_amount numeric;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS investment_tier text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS franchise_location text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS franchise_type text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS kyc_status text DEFAULT 'pending';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;