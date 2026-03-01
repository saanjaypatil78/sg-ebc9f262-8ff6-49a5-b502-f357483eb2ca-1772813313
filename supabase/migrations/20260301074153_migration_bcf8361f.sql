-- Create enum types for status tracking
CREATE TYPE user_role AS ENUM ('client', 'vendor', 'admin', 'bdm');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE return_status AS ENUM ('requested', 'approved', 'rejected', 'replacement_shipped', 'completed');
CREATE TYPE vendor_status AS ENUM ('pending', 'active', 'suspended', 'rejected');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE onboarding_step AS ENUM ('qualification', 'documentation', 'sla_agreement', 'integration', 'training', 'pilot');

-- Update profiles table to include role and vendor-specific fields
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'client',
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS company_name text,
ADD COLUMN IF NOT EXISTS business_registration text,
ADD COLUMN IF NOT EXISTS tax_id text,
ADD COLUMN IF NOT EXISTS bank_details jsonb,
ADD COLUMN IF NOT EXISTS address jsonb,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Create vendors table for extended vendor information
CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status vendor_status DEFAULT 'pending',
  commission_rate decimal(5,2) DEFAULT 10.00,
  return_limit decimal(5,2) DEFAULT 10.00,
  onboarding_step onboarding_step DEFAULT 'qualification',
  onboarding_completed boolean DEFAULT false,
  sla_agreement_signed boolean DEFAULT false,
  sla_agreement_date timestamp with time zone,
  assigned_bdm uuid REFERENCES profiles(id),
  performance_score decimal(5,2) DEFAULT 0,
  total_orders integer DEFAULT 0,
  on_time_deliveries integer DEFAULT 0,
  total_returns integer DEFAULT 0,
  rating decimal(3,2) DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  sku text UNIQUE NOT NULL,
  price decimal(10,2) NOT NULL,
  cost_price decimal(10,2),
  stock_quantity integer DEFAULT 0,
  category text,
  images jsonb,
  specifications jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number text UNIQUE NOT NULL,
  client_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  commission_amount decimal(10,2),
  status order_status DEFAULT 'pending',
  qr_code text UNIQUE,
  qr_validated boolean DEFAULT false,
  tracking_number text,
  shipping_address jsonb NOT NULL,
  packaging_verified boolean DEFAULT false,
  expected_delivery_date timestamp with time zone,
  actual_delivery_date timestamp with time zone,
  is_on_time boolean,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create returns table
CREATE TABLE IF NOT EXISTS returns (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_number text UNIQUE NOT NULL,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES profiles(id),
  vendor_id uuid NOT NULL REFERENCES vendors(id),
  reason text NOT NULL,
  status return_status DEFAULT 'requested',
  images jsonb,
  replacement_order_id uuid REFERENCES orders(id),
  is_within_limit boolean DEFAULT true,
  admin_notes text,
  approved_by uuid REFERENCES profiles(id),
  approved_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create settlements table
CREATE TABLE IF NOT EXISTS settlements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  settlement_number text UNIQUE NOT NULL,
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  total_sales decimal(12,2) DEFAULT 0,
  total_orders integer DEFAULT 0,
  commission_amount decimal(12,2) DEFAULT 0,
  return_penalty decimal(12,2) DEFAULT 0,
  sla_penalty decimal(12,2) DEFAULT 0,
  other_deductions decimal(12,2) DEFAULT 0,
  net_payout decimal(12,2) DEFAULT 0,
  payment_status payment_status DEFAULT 'pending',
  payment_date timestamp with time zone,
  payment_reference text,
  details jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create file_uploads table for tracking uploaded files
CREATE TABLE IF NOT EXISTS file_uploads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_url text NOT NULL,
  file_size integer,
  upload_category text NOT NULL, -- 'inventory', 'tracking', 'delivery', 'returns'
  processing_status text DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  records_processed integer DEFAULT 0,
  errors jsonb,
  uploaded_by uuid NOT NULL REFERENCES profiles(id),
  created_at timestamp with time zone DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL, -- 'order', 'return', 'sla', 'settlement', 'system'
  link text,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Create vendor_performance_logs table
CREATE TABLE IF NOT EXISTS vendor_performance_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  date date NOT NULL,
  total_orders integer DEFAULT 0,
  on_time_deliveries integer DEFAULT 0,
  late_deliveries integer DEFAULT 0,
  returns_count integer DEFAULT 0,
  return_rate decimal(5,2) DEFAULT 0,
  on_time_rate decimal(5,2) DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(vendor_id, date)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_orders_client_id ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_qr_code ON orders(qr_code);
CREATE INDEX IF NOT EXISTS idx_returns_order_id ON returns(order_id);
CREATE INDEX IF NOT EXISTS idx_returns_vendor_id ON returns(vendor_id);
CREATE INDEX IF NOT EXISTS idx_settlements_vendor_id ON settlements(vendor_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_vendor_id ON file_uploads(vendor_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_performance_vendor_id ON vendor_performance_logs(vendor_id);

COMMENT ON TABLE vendors IS 'Extended vendor information and performance tracking';
COMMENT ON TABLE orders IS 'Main orders table with QR code and delivery tracking';
COMMENT ON TABLE returns IS 'Return and replacement management with 10% limit tracking';
COMMENT ON TABLE settlements IS 'Financial settlements with automatic penalty calculations';
COMMENT ON TABLE file_uploads IS 'Track vendor file uploads for reconciliation';