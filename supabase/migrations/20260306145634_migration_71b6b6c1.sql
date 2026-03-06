-- =====================================================
-- BRAVECOM SUNRAY ECOSYSTEM - COMPLETE DATABASE SCHEMA
-- Version: 2.0 | Production Ready | January 2025
-- =====================================================

-- ==================== RBAC SYSTEM ====================

-- Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    level INTEGER NOT NULL UNIQUE,
    description TEXT,
    can_upgrade BOOLEAN DEFAULT TRUE,
    can_downgrade BOOLEAN DEFAULT TRUE,
    requires_approval BOOLEAN DEFAULT FALSE,
    approval_level INTEGER,
    max_session_hours INTEGER,
    require_2fa BOOLEAN DEFAULT FALSE,
    audit_level VARCHAR(20) DEFAULT 'BASIC',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permissions Table
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL,
    module VARCHAR(50) NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Role Permissions Mapping
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    granted_by UUID,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    UNIQUE(role_id, permission_id)
);

-- ==================== VENDOR SYSTEM ====================

-- Vendors Table
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    business_name VARCHAR(200) NOT NULL,
    vendor_status VARCHAR(20) DEFAULT 'pending',
    vendor_type VARCHAR(50) DEFAULT 'standard',
    investment_amount NUMERIC(15,2) DEFAULT 0,
    revenue_share_percentage NUMERIC(5,2) DEFAULT 85.00,
    platform_fee_percentage NUMERIC(5,2) DEFAULT 15.00,
    min_products_required INTEGER DEFAULT 5,
    active_products_count INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    total_revenue NUMERIC(15,2) DEFAULT 0,
    vendor_commission NUMERIC(15,2) DEFAULT 0,
    platform_fees_collected NUMERIC(15,2) DEFAULT 0,
    approval_date TIMESTAMPTZ,
    approved_by UUID,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT vendors_status_check CHECK (vendor_status IN ('pending', 'active', 'suspended', 'rejected')),
    CONSTRAINT vendors_type_check CHECK (vendor_type IN ('standard', 'premium', 'enterprise'))
);

-- Vendor Products Table
CREATE TABLE IF NOT EXISTS vendor_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    product_name VARCHAR(200) NOT NULL,
    product_description TEXT,
    category VARCHAR(100),
    price NUMERIC(15,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    images JSONB,
    product_status VARCHAR(20) DEFAULT 'draft',
    listing_approval_status VARCHAR(20) DEFAULT 'pending',
    listing_score NUMERIC(5,2),
    trend_score NUMERIC(5,2),
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    total_sales INTEGER DEFAULT 0,
    total_revenue NUMERIC(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT products_status_check CHECK (product_status IN ('draft', 'active', 'inactive', 'out_of_stock')),
    CONSTRAINT products_approval_check CHECK (listing_approval_status IN ('pending', 'approved', 'rejected', 'postponed'))
);

-- Vendor Orders Table
CREATE TABLE IF NOT EXISTS vendor_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES vendor_products(id),
    customer_id UUID,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_status VARCHAR(20) DEFAULT 'pending',
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(15,2) NOT NULL,
    total_amount NUMERIC(15,2) NOT NULL,
    vendor_share NUMERIC(15,2),
    platform_fee NUMERIC(15,2),
    payment_status VARCHAR(20) DEFAULT 'pending',
    shipping_status VARCHAR(20),
    tracking_number VARCHAR(100),
    qr_code VARCHAR(200),
    delivered_at TIMESTAMPTZ,
    return_requested BOOLEAN DEFAULT FALSE,
    return_reason TEXT,
    replacement_provided BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT orders_status_check CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
    CONSTRAINT orders_payment_check CHECK (payment_status IN ('pending', 'completed', 'refunded', 'failed'))
);

-- ==================== COMMISSION & PAYOUT SYSTEM ====================

-- Commission Accumulation Ledger
CREATE TABLE IF NOT EXISTS commission_accumulation_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    referral_user_id UUID,
    commission_type VARCHAR(50) NOT NULL,
    commission_level INTEGER,
    gross_commission NUMERIC(15,2) NOT NULL,
    admin_charge NUMERIC(15,2) DEFAULT 0,
    net_commission NUMERIC(15,2) NOT NULL,
    source_investment_id UUID,
    source_amount NUMERIC(15,2),
    commission_rate NUMERIC(5,2),
    royalty_bonus NUMERIC(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    processed_at TIMESTAMPTZ,
    payout_batch_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT commission_type_check CHECK (commission_type IN ('referral_level_1', 'referral_level_2', 'referral_level_3', 'referral_level_4', 'referral_level_5', 'referral_level_6', 'royalty', 'bonus')),
    CONSTRAINT commission_status_check CHECK (status IN ('pending', 'approved', 'paid', 'cancelled'))
);

-- Daily Payout Accumulation
CREATE TABLE IF NOT EXISTS daily_payout_accumulation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    payout_date DATE NOT NULL,
    payout_type VARCHAR(50) NOT NULL,
    gross_amount NUMERIC(15,2) NOT NULL,
    deductions NUMERIC(15,2) DEFAULT 0,
    net_amount NUMERIC(15,2) NOT NULL,
    accumulated_items JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    processed_at TIMESTAMPTZ,
    transaction_reference VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT payout_type_check CHECK (payout_type IN ('investor_profit', 'vendor_return', 'commission', 'royalty', 'bonus')),
    CONSTRAINT payout_status_check CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

-- User Business Volume (Rank Calculation)
CREATE TABLE IF NOT EXISTS user_business_volume (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    direct_investment NUMERIC(15,2) DEFAULT 0,
    total_team_business NUMERIC(15,2) DEFAULT 0,
    level_1_business NUMERIC(15,2) DEFAULT 0,
    level_2_business NUMERIC(15,2) DEFAULT 0,
    level_3_business NUMERIC(15,2) DEFAULT 0,
    level_4_business NUMERIC(15,2) DEFAULT 0,
    level_5_business NUMERIC(15,2) DEFAULT 0,
    level_6_business NUMERIC(15,2) DEFAULT 0,
    current_rank VARCHAR(50) DEFAULT 'BASE',
    rank_qualifying_volume NUMERIC(15,2),
    next_rank VARCHAR(50),
    rank_progress_percentage NUMERIC(5,2),
    last_rank_evaluation TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT rank_check CHECK (current_rank IN ('BASE', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'AMBASSADOR'))
);

-- Rank Change History (Audit Trail)
CREATE TABLE IF NOT EXISTS rank_change_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    previous_rank VARCHAR(50),
    new_rank VARCHAR(50) NOT NULL,
    change_type VARCHAR(20) NOT NULL,
    qualifying_volume NUMERIC(15,2),
    trigger_event VARCHAR(100),
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    CONSTRAINT rank_change_type_check CHECK (change_type IN ('upgrade', 'downgrade', 'manual_adjustment'))
);

-- ==================== AUTOMATION & WEBHOOKS ====================

-- Webhook Event Queue
CREATE TABLE IF NOT EXISTS webhook_event_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    event_payload JSONB NOT NULL,
    target_user_id UUID,
    batch_id UUID,
    status VARCHAR(20) DEFAULT 'queued',
    priority INTEGER DEFAULT 5,
    scheduled_for TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 5,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT webhook_status_check CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled'))
);

-- ==================== PRODUCT LISTING STRATEGY ====================

-- Google Trends Tracking
CREATE TABLE IF NOT EXISTS google_trends_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES vendor_products(id) ON DELETE CASCADE,
    trend_keyword VARCHAR(200) NOT NULL,
    trend_score NUMERIC(5,2),
    search_volume INTEGER,
    growth_rate NUMERIC(5,2),
    competition_level VARCHAR(20),
    data_timestamp TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT competition_level_check CHECK (competition_level IN ('low', 'medium', 'high'))
);

-- Product Listing Strategy
CREATE TABLE IF NOT EXISTS product_listing_strategy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES vendor_products(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    market_demand_score NUMERIC(5,2),
    trend_analysis_score NUMERIC(5,2),
    competition_score NUMERIC(5,2),
    timing_score NUMERIC(5,2),
    overall_strategy_score NUMERIC(5,2),
    recommendation VARCHAR(20),
    confidence_level NUMERIC(5,2),
    data_collection_hours INTEGER,
    analysis_completed_at TIMESTAMPTZ,
    decision_made_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT recommendation_check CHECK (recommendation IN ('LIST', 'POSTPONE', 'REJECT'))
);

-- ==================== AUDIT & COMPLIANCE ====================

-- Comprehensive Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address INET,
    user_agent TEXT,
    rbac_decision VARCHAR(20),
    rbac_reason VARCHAR(100),
    rbac_metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- KYC Documents (Separate from nominations)
CREATE TABLE IF NOT EXISTS kyc_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    document_url TEXT NOT NULL,
    document_hash VARCHAR(255) NOT NULL,
    verification_status VARCHAR(20) DEFAULT 'PENDING',
    verified_by UUID,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    expiry_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT doc_type_check CHECK (document_type IN ('AADHAAR', 'PAN', 'BANK_PROOF', 'PHOTO', 'SIGNATURE')),
    CONSTRAINT doc_status_check CHECK (verification_status IN ('PENDING', 'IN_PROGRESS', 'VERIFIED', 'REJECTED'))
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(vendor_status);
CREATE INDEX IF NOT EXISTS idx_vendor_products_vendor_id ON vendor_products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_products_status ON vendor_products(product_status);
CREATE INDEX IF NOT EXISTS idx_vendor_orders_vendor_id ON vendor_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_orders_status ON vendor_orders(order_status);
CREATE INDEX IF NOT EXISTS idx_commission_user_id ON commission_accumulation_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_commission_status ON commission_accumulation_ledger(status);
CREATE INDEX IF NOT EXISTS idx_payout_user_id ON daily_payout_accumulation(user_id);
CREATE INDEX IF NOT EXISTS idx_payout_date ON daily_payout_accumulation(payout_date);
CREATE INDEX IF NOT EXISTS idx_business_volume_user ON user_business_volume(user_id);
CREATE INDEX IF NOT EXISTS idx_rank_history_user ON rank_change_history(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_status ON webhook_event_queue(status);
CREATE INDEX IF NOT EXISTS idx_webhook_scheduled ON webhook_event_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_kyc_docs_user ON kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_docs_status ON kyc_documents(verification_status);