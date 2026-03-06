-- Change address column type from jsonb to text
ALTER TABLE profiles 
  ALTER COLUMN address TYPE text USING address::text;