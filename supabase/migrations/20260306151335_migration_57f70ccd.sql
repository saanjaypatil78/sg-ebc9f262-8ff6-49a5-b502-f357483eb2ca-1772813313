-- =====================================================
-- ENFORCE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- =====================================================

-- 1. Roles & Permissions (Read-only for most, write for Super Admin)
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to roles" ON roles FOR SELECT USING (true);
CREATE POLICY "Public read access to permissions" ON permissions FOR SELECT USING (true);
CREATE POLICY "Public read access to role_permissions" ON role_permissions FOR SELECT USING (true);

-- 2. User Profiles & Hierarchy (Users can read their own, Admin can read all)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_tree ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchise_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their referral tree" ON referral_tree FOR SELECT USING (auth.uid() = user_id OR auth.uid() = parent_id);
CREATE POLICY "Users can view their franchise info" ON franchise_partners FOR SELECT USING (auth.uid() = user_id);

-- 3. Investments & Payments (Private to user)
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fundraising_capital ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own investments" ON investments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own payments" ON payment_confirmations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public read fundraising goals" ON fundraising_capital FOR SELECT USING (true);

-- 4. Payouts & Commissions (Private to user)
ALTER TABLE payout_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_accumulation_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_payout_accumulation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own payouts" ON payout_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own commissions" ON commission_accumulation_ledger FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own daily payouts" ON daily_payout_accumulation FOR SELECT USING (auth.uid() = user_id);

-- 5. Business Volume & Rank (Private to user)
ALTER TABLE user_business_volume ENABLE ROW LEVEL SECURITY;
ALTER TABLE rank_change_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own business volume" ON user_business_volume FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own rank history" ON rank_change_history FOR SELECT USING (auth.uid() = user_id);

-- 6. Vendors & Products (Private to vendor, public read for active products)
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors view own profile" ON vendors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Vendors view own products" ON vendor_products FOR SELECT USING (auth.uid() = vendor_id);
CREATE POLICY "Vendors view own orders" ON vendor_orders FOR SELECT USING (auth.uid() = vendor_id);
CREATE POLICY "Customers view own orders" ON vendor_orders FOR SELECT USING (auth.uid() = customer_id);

-- 7. System & Strategy (Admin only, deny public access)
ALTER TABLE webhook_event_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_trends_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_listing_strategy ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_change_log ENABLE ROW LEVEL SECURITY;

-- No public policies created for system tables, meaning implicitly DENY ALL.

-- 8. KYC (Private to user)
ALTER TABLE kyc_nominations ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own KYC nominations" ON kyc_nominations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own KYC documents" ON kyc_documents FOR SELECT USING (auth.uid() = user_id);