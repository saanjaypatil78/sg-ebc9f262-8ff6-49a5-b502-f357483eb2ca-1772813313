-- Create public read policy for vendors (so anyone can see vendor business names)
CREATE POLICY "Public can view vendor basic info"
  ON vendors
  FOR SELECT
  USING (true);  -- Allow all users to view vendor info