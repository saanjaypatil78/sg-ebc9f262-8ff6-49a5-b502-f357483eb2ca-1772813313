-- Drop the restrictive policy
DROP POLICY IF EXISTS "Vendors view own products" ON vendor_products;

-- Create public read access for active products
CREATE POLICY "Public can view active products"
  ON vendor_products
  FOR SELECT
  USING (product_status = 'active');

-- Create vendor-only policies for modifications
CREATE POLICY "Vendors can insert their own products"
  ON vendor_products
  FOR INSERT
  WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can update their own products"
  ON vendor_products
  FOR UPDATE
  USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can delete their own products"
  ON vendor_products
  FOR DELETE
  USING (auth.uid() = vendor_id);