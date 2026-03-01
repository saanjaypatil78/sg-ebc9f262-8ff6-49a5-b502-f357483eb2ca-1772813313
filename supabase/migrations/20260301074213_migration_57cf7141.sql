-- Enable RLS on all tables
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_performance_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies (update existing)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Vendors policies
CREATE POLICY "Vendors can view their own data" ON vendors
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'bdm')
  ));

CREATE POLICY "Admins and BDMs can insert vendors" ON vendors
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'bdm')
    )
  );

CREATE POLICY "Vendors can update their own data" ON vendors
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can update any vendor" ON vendors
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Products policies
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true OR EXISTS (
    SELECT 1 FROM vendors v 
    WHERE v.id = products.vendor_id AND v.user_id = auth.uid()
  ));

CREATE POLICY "Vendors can insert their own products" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE id = vendor_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can update their own products" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE id = vendor_id AND user_id = auth.uid()
    )
  );

-- Orders policies
CREATE POLICY "Users can view their related orders" ON orders
  FOR SELECT USING (
    client_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE id = orders.vendor_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'bdm')
    )
  );

CREATE POLICY "Clients can create orders" ON orders
  FOR INSERT WITH CHECK (client_id = auth.uid());

CREATE POLICY "Vendors can update their orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE id = orders.vendor_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update any order" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Returns policies
CREATE POLICY "Users can view their related returns" ON returns
  FOR SELECT USING (
    client_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE id = returns.vendor_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Clients can create returns" ON returns
  FOR INSERT WITH CHECK (client_id = auth.uid());

CREATE POLICY "Admins can update returns" ON returns
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Settlements policies
CREATE POLICY "Vendors can view their own settlements" ON settlements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE id = settlements.vendor_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'bdm')
    )
  );

CREATE POLICY "Admins can manage settlements" ON settlements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- File uploads policies
CREATE POLICY "Vendors can view their own uploads" ON file_uploads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE id = file_uploads.vendor_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'bdm')
    )
  );

CREATE POLICY "Vendors can insert their own uploads" ON file_uploads
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE id = vendor_id AND user_id = auth.uid()
    )
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Vendor performance logs policies
CREATE POLICY "Vendors can view their own performance" ON vendor_performance_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vendors 
      WHERE id = vendor_performance_logs.vendor_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'bdm')
    )
  );