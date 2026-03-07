-- Add missing column to user_attributes table
ALTER TABLE user_attributes
ADD COLUMN IF NOT EXISTS two_factor_required BOOLEAN DEFAULT false;

-- Verify the schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_attributes'
ORDER BY ordinal_position;