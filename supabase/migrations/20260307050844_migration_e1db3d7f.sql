-- Add unique constraint to user_attributes table
ALTER TABLE user_attributes
ADD CONSTRAINT user_attributes_user_id_key UNIQUE (user_id);

-- Verify constraint
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'user_attributes';