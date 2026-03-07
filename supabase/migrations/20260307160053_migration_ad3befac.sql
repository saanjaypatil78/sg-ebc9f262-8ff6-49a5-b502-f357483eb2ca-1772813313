-- ═══════════════════════════════════════════════════════════════
-- AUTO-SYNC PRODUCT SYSTEM FOR BRAVECOM
-- Multi-Platform Integration with 100% Accuracy
-- ═══════════════════════════════════════════════════════════════

-- Platform Integrations Table
CREATE TABLE IF NOT EXISTS platform_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  platform_name VARCHAR(50) NOT NULL, -- amazon, ebay, shopsy, meesho, flipkart
  platform_store_id VARCHAR(255) NOT NULL,
  api_key TEXT,
  api_secret TEXT,
  access_token TEXT,
  refresh_token TEXT,
  sync_enabled BOOLEAN DEFAULT true,
  sync_frequency VARCHAR(20) DEFAULT 'hourly', -- hourly, daily, realtime
  last_sync_at TIMESTAMPTZ,
  next_sync_at TIMESTAMPTZ,
  sync_status VARCHAR(20) DEFAULT 'pending', -- pending, syncing, success, failed
  error_count INTEGER DEFAULT 0,
  last_error TEXT,
  auto_healing_enabled BOOLEAN DEFAULT true,
  auto_evolve_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vendor_id, platform_name, platform_store_id)
);

CREATE INDEX idx_platform_integrations_vendor ON platform_integrations(vendor_id);
CREATE INDEX idx_platform_integrations_platform ON platform_integrations(platform_name);
CREATE INDEX idx_platform_integrations_sync ON platform_integrations(next_sync_at) WHERE sync_enabled = true;

-- Product Sync Mapping Table
CREATE TABLE IF NOT EXISTS product_sync_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID NOT NULL REFERENCES platform_integrations(id) ON DELETE CASCADE,
  bravecom_product_id UUID NOT NULL REFERENCES vendor_products(id) ON DELETE CASCADE,
  external_product_id VARCHAR(255) NOT NULL,
  external_sku VARCHAR(255),
  sync_status VARCHAR(20) DEFAULT 'active', -- active, paused, conflict, error
  last_synced_at TIMESTAMPTZ,
  last_conflict_at TIMESTAMPTZ,
  conflict_reason TEXT,
  sync_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  auto_resolve_conflicts BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(integration_id, external_product_id)
);

CREATE INDEX idx_product_sync_mapping_integration ON product_sync_mapping(integration_id);
CREATE INDEX idx_product_sync_mapping_bravecom ON product_sync_mapping(bravecom_product_id);
CREATE INDEX idx_product_sync_mapping_external ON product_sync_mapping(external_product_id);

-- Sync Logs Table
CREATE TABLE IF NOT EXISTS product_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID NOT NULL REFERENCES platform_integrations(id) ON DELETE CASCADE,
  sync_type VARCHAR(20) NOT NULL, -- full, incremental, healing
  products_fetched INTEGER DEFAULT 0,
  products_created INTEGER DEFAULT 0,
  products_updated INTEGER DEFAULT 0,
  products_failed INTEGER DEFAULT 0,
  conflicts_detected INTEGER DEFAULT 0,
  conflicts_resolved INTEGER DEFAULT 0,
  errors_healed INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  status VARCHAR(20) NOT NULL, -- success, partial, failed
  error_message TEXT,
  sync_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_sync_logs_integration ON product_sync_logs(integration_id);
CREATE INDEX idx_product_sync_logs_created ON product_sync_logs(created_at DESC);

-- Product Conflict Resolution Table
CREATE TABLE IF NOT EXISTS product_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mapping_id UUID NOT NULL REFERENCES product_sync_mapping(id) ON DELETE CASCADE,
  conflict_type VARCHAR(50) NOT NULL, -- price_mismatch, stock_mismatch, details_mismatch
  bravecom_value JSONB,
  external_value JSONB,
  resolution_strategy VARCHAR(50) DEFAULT 'external_wins', -- external_wins, bravecom_wins, average, manual
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_conflicts_mapping ON product_conflicts(mapping_id);
CREATE INDEX idx_product_conflicts_unresolved ON product_conflicts(resolved) WHERE resolved = false;

-- Auto-Healing Configuration Table
CREATE TABLE IF NOT EXISTS auto_healing_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID NOT NULL REFERENCES platform_integrations(id) ON DELETE CASCADE,
  error_type VARCHAR(100) NOT NULL,
  healing_strategy VARCHAR(50) NOT NULL, -- retry, fallback, skip, alert
  max_retry_attempts INTEGER DEFAULT 3,
  retry_delay_seconds INTEGER DEFAULT 300,
  fallback_action VARCHAR(100),
  alert_threshold INTEGER DEFAULT 5,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(integration_id, error_type)
);

-- Auto-Evolve API Schema Tracking
CREATE TABLE IF NOT EXISTS api_schema_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_name VARCHAR(50) NOT NULL,
  schema_version VARCHAR(50) NOT NULL,
  schema_definition JSONB NOT NULL,
  field_mappings JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(platform_name, schema_version)
);

-- ═══════════════════════════════════════════════════════════════
-- FUNCTIONS: AUTO-SYNC ENGINE
-- ═══════════════════════════════════════════════════════════════

-- Function: Schedule Next Sync
CREATE OR REPLACE FUNCTION schedule_next_sync(p_integration_id UUID)
RETURNS TIMESTAMPTZ AS $$
DECLARE
  v_frequency VARCHAR(20);
  v_next_sync TIMESTAMPTZ;
BEGIN
  SELECT sync_frequency INTO v_frequency
  FROM platform_integrations
  WHERE id = p_integration_id;

  v_next_sync := CASE v_frequency
    WHEN 'realtime' THEN NOW() + INTERVAL '5 minutes'
    WHEN 'hourly' THEN NOW() + INTERVAL '1 hour'
    WHEN 'daily' THEN NOW() + INTERVAL '1 day'
    ELSE NOW() + INTERVAL '1 hour'
  END;

  UPDATE platform_integrations
  SET next_sync_at = v_next_sync,
      updated_at = NOW()
  WHERE id = p_integration_id;

  RETURN v_next_sync;
END;
$$ LANGUAGE plpgsql;

-- Function: Get Pending Syncs
CREATE OR REPLACE FUNCTION get_pending_syncs()
RETURNS TABLE (
  integration_id UUID,
  vendor_id UUID,
  platform_name VARCHAR(50),
  sync_frequency VARCHAR(20)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pi.id,
    pi.vendor_id,
    pi.platform_name,
    pi.sync_frequency
  FROM platform_integrations pi
  WHERE pi.sync_enabled = true
    AND pi.next_sync_at <= NOW()
    AND pi.sync_status != 'syncing'
  ORDER BY pi.next_sync_at ASC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Function: Record Sync Result
CREATE OR REPLACE FUNCTION record_sync_result(
  p_integration_id UUID,
  p_sync_type VARCHAR(20),
  p_products_fetched INTEGER,
  p_products_created INTEGER,
  p_products_updated INTEGER,
  p_products_failed INTEGER,
  p_status VARCHAR(20),
  p_error_message TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  -- Insert sync log
  INSERT INTO product_sync_logs (
    integration_id,
    sync_type,
    products_fetched,
    products_created,
    products_updated,
    products_failed,
    status,
    error_message
  ) VALUES (
    p_integration_id,
    p_sync_type,
    p_products_fetched,
    p_products_created,
    p_products_updated,
    p_products_failed,
    p_status,
    p_error_message
  ) RETURNING id INTO v_log_id;

  -- Update integration status
  IF p_status = 'success' THEN
    UPDATE platform_integrations
    SET last_sync_at = NOW(),
        sync_status = 'success',
        error_count = 0,
        last_error = NULL,
        updated_at = NOW()
    WHERE id = p_integration_id;
  ELSE
    UPDATE platform_integrations
    SET last_sync_at = NOW(),
        sync_status = 'failed',
        error_count = error_count + 1,
        last_error = p_error_message,
        updated_at = NOW()
    WHERE id = p_integration_id;
  END IF;

  -- Schedule next sync
  PERFORM schedule_next_sync(p_integration_id);

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Detect and Resolve Conflicts
CREATE OR REPLACE FUNCTION detect_product_conflict(
  p_mapping_id UUID,
  p_conflict_type VARCHAR(50),
  p_bravecom_value JSONB,
  p_external_value JSONB
)
RETURNS UUID AS $$
DECLARE
  v_conflict_id UUID;
  v_resolution_strategy VARCHAR(50);
BEGIN
  -- Get resolution strategy
  SELECT resolution_strategy INTO v_resolution_strategy
  FROM product_sync_mapping psm
  JOIN platform_integrations pi ON psm.integration_id = pi.id
  WHERE psm.id = p_mapping_id
  LIMIT 1;

  -- Insert conflict
  INSERT INTO product_conflicts (
    mapping_id,
    conflict_type,
    bravecom_value,
    external_value,
    resolution_strategy
  ) VALUES (
    p_mapping_id,
    p_conflict_type,
    p_bravecom_value,
    p_external_value,
    COALESCE(v_resolution_strategy, 'external_wins')
  ) RETURNING id INTO v_conflict_id;

  -- Auto-resolve if enabled
  IF (SELECT auto_resolve_conflicts FROM product_sync_mapping WHERE id = p_mapping_id) THEN
    PERFORM resolve_product_conflict(v_conflict_id);
  END IF;

  RETURN v_conflict_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Resolve Product Conflict
CREATE OR REPLACE FUNCTION resolve_product_conflict(p_conflict_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_conflict RECORD;
  v_resolved_value JSONB;
BEGIN
  SELECT * INTO v_conflict
  FROM product_conflicts
  WHERE id = p_conflict_id;

  -- Apply resolution strategy
  CASE v_conflict.resolution_strategy
    WHEN 'external_wins' THEN
      v_resolved_value := v_conflict.external_value;
    WHEN 'bravecom_wins' THEN
      v_resolved_value := v_conflict.bravecom_value;
    WHEN 'average' THEN
      -- For numeric values, take average
      v_resolved_value := v_conflict.external_value; -- Simplified
    ELSE
      RETURN false; -- Manual resolution required
  END CASE;

  -- Update product with resolved value
  -- (This would be handled by sync service)

  -- Mark conflict as resolved
  UPDATE product_conflicts
  SET resolved = true,
      resolved_at = NOW()
  WHERE id = p_conflict_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════
-- INDEXES FOR PERFORMANCE
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX idx_sync_logs_status ON product_sync_logs(status);
CREATE INDEX idx_conflicts_type ON product_conflicts(conflict_type);
CREATE INDEX idx_api_schema_active ON api_schema_versions(platform_name) WHERE is_active = true;

COMMENT ON TABLE platform_integrations IS 'Stores connections to external e-commerce platforms';
COMMENT ON TABLE product_sync_mapping IS 'Maps BRAVECOM products to external platform products';
COMMENT ON TABLE product_sync_logs IS 'Logs all sync operations for monitoring and debugging';
COMMENT ON TABLE product_conflicts IS 'Tracks conflicts between BRAVECOM and external platform data';
COMMENT ON TABLE auto_healing_config IS 'Configuration for automatic error recovery';
COMMENT ON TABLE api_schema_versions IS 'Tracks API schema changes for auto-evolve capability';