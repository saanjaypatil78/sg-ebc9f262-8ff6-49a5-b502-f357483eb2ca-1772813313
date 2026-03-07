-- Add missing verification columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS contact_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS contact_verified_at TIMESTAMPTZ;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;