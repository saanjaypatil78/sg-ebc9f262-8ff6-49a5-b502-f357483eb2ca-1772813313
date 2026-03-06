-- Temporarily adjust investment constraint to match PRD
ALTER TABLE investments DROP CONSTRAINT IF EXISTS investments_amount_check;
ALTER TABLE investments ADD CONSTRAINT investments_amount_check 
CHECK (amount >= 51111 AND amount <= 11000000000);