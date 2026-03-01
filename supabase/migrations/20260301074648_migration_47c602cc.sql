-- Create penalties table
CREATE TABLE IF NOT EXISTS penalties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  reason text NOT NULL,
  amount decimal(10,2) NOT NULL,
  applied_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES profiles(id),
  settlement_id uuid REFERENCES settlements(id),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for penalties
ALTER TABLE penalties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view their own penalties" ON penalties
  FOR SELECT USING (
    vendor_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM vendors WHERE id = penalties.vendor_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'bdm')
    )
  );

CREATE POLICY "Admins can insert penalties" ON penalties
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add missing columns
ALTER TABLE returns ADD COLUMN IF NOT EXISTS resolved_at timestamp with time zone;
ALTER TABLE settlements ADD COLUMN IF NOT EXISTS return_count integer DEFAULT 0;
ALTER TABLE settlements ADD COLUMN IF NOT EXISTS penalty_amount decimal(12,2) DEFAULT 0;

-- Fix settlement status enum usage (we used payment_status in table def but settlement_status in code)
-- Let's stick to payment_status as defined in the table.