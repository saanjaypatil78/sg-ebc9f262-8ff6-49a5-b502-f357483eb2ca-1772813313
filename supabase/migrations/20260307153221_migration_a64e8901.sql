-- ═══════════════════════════════════════════════════════════════
-- COMPLETE REFERRAL SYSTEM WITH 6-LEVEL COMMISSION
-- User ID = Referral Code | Zero Tolerance Production Ready
-- ═══════════════════════════════════════════════════════════════

-- Function: Get full 6-level network tree
CREATE OR REPLACE FUNCTION get_network_tree(
  p_user_id uuid,
  p_max_level integer DEFAULT 6
)
RETURNS TABLE (
  user_id uuid,
  full_name text,
  email text,
  level integer,
  investment_total numeric,
  direct_referrals integer,
  joined_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE tree AS (
    -- Level 0: Self
    SELECT 
      u.id,
      u.full_name,
      u.email,
      0 as level,
      COALESCE(SUM(i.amount), 0) as investment_total,
      0 as direct_referrals,
      u.created_at as joined_at
    FROM users u
    LEFT JOIN investments i ON i.user_id = u.id
    WHERE u.id = p_user_id
    GROUP BY u.id, u.full_name, u.email, u.created_at
    
    UNION ALL
    
    -- Recursive: All downline levels
    SELECT 
      u.id,
      u.full_name,
      u.email,
      tree.level + 1,
      COALESCE(SUM(i.amount), 0),
      COUNT(DISTINCT ref.id) as direct_referrals,
      u.created_at
    FROM tree
    JOIN users u ON u.referred_by = tree.user_id
    LEFT JOIN investments i ON i.user_id = u.id
    LEFT JOIN users ref ON ref.referred_by = u.id
    WHERE tree.level < p_max_level
    GROUP BY u.id, u.full_name, u.email, u.created_at, tree.level
  )
  SELECT * FROM tree ORDER BY level, full_name;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate 6-level commission on investment
CREATE OR REPLACE FUNCTION calculate_6_level_commission(
  p_investment_id uuid,
  p_investor_id uuid,
  p_amount numeric
)
RETURNS void AS $$
DECLARE
  v_upline_id uuid;
  v_level integer := 1;
  v_commission_rate numeric;
  v_gross_commission numeric;
  v_admin_fee numeric := 0.10; -- 10% admin charge
  v_admin_deduction numeric;
  v_net_commission numeric;
  v_rates numeric[] := ARRAY[0.20, 0.10, 0.07, 0.05, 0.02, 0.01]; -- 6 levels
BEGIN
  -- Start with investor's upline
  SELECT referred_by INTO v_upline_id FROM users WHERE id = p_investor_id;
  
  -- Loop through 6 levels
  WHILE v_upline_id IS NOT NULL AND v_level <= 6 LOOP
    -- Get commission rate for this level
    v_commission_rate := v_rates[v_level];
    v_gross_commission := p_amount * v_commission_rate;
    v_admin_deduction := v_gross_commission * v_admin_fee;
    v_net_commission := v_gross_commission - v_admin_deduction;
    
    -- Insert commission record
    INSERT INTO commission_accumulation_ledger (
      user_id,
      referral_user_id,
      commission_type,
      commission_level,
      gross_commission,
      admin_charge,
      net_commission,
      source_investment_id,
      source_amount,
      commission_rate,
      status
    ) VALUES (
      v_upline_id,
      p_investor_id,
      'referral_level_' || v_level,
      v_level,
      v_gross_commission,
      v_admin_deduction,
      v_net_commission,
      p_investment_id,
      p_amount,
      v_commission_rate,
      'pending'
    );
    
    -- Move to next level
    SELECT referred_by INTO v_upline_id FROM users WHERE id = v_upline_id;
    v_level := v_level + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function: Get network statistics
CREATE OR REPLACE FUNCTION get_network_stats(p_user_id uuid)
RETURNS TABLE (
  total_network_size integer,
  level_1_count integer,
  level_2_count integer,
  level_3_count integer,
  level_4_count integer,
  level_5_count integer,
  level_6_count integer,
  total_network_investment numeric,
  total_commissions_earned numeric,
  rank text,
  rank_progress numeric
) AS $$
BEGIN
  RETURN QUERY
  WITH network AS (
    SELECT * FROM get_network_tree(p_user_id, 6)
  ),
  level_counts AS (
    SELECT 
      COUNT(*) FILTER (WHERE level = 1) as l1,
      COUNT(*) FILTER (WHERE level = 2) as l2,
      COUNT(*) FILTER (WHERE level = 3) as l3,
      COUNT(*) FILTER (WHERE level = 4) as l4,
      COUNT(*) FILTER (WHERE level = 5) as l5,
      COUNT(*) FILTER (WHERE level = 6) as l6,
      SUM(investment_total) as total_inv
    FROM network WHERE level > 0
  ),
  commissions AS (
    SELECT COALESCE(SUM(net_commission), 0) as total_comm
    FROM commission_accumulation_ledger
    WHERE user_id = p_user_id
  ),
  volume AS (
    SELECT 
      current_rank,
      rank_progress_percentage
    FROM user_business_volume
    WHERE user_id = p_user_id
  )
  SELECT 
    (l1 + l2 + l3 + l4 + l5 + l6)::integer,
    l1::integer,
    l2::integer,
    l3::integer,
    l4::integer,
    l5::integer,
    l6::integer,
    COALESCE(total_inv, 0),
    COALESCE(total_comm, 0),
    COALESCE(volume.current_rank, 'BASE'),
    COALESCE(volume.rank_progress_percentage, 0)
  FROM level_counts
  CROSS JOIN commissions
  LEFT JOIN volume ON true;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-distribute commission on investment confirmation
CREATE OR REPLACE FUNCTION trigger_commission_distribution()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'confirmed' AND OLD.payment_status != 'confirmed' THEN
    PERFORM calculate_6_level_commission(NEW.id, NEW.user_id, NEW.amount);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_commission_on_investment ON investments;
CREATE TRIGGER auto_commission_on_investment
AFTER UPDATE ON investments
FOR EACH ROW
WHEN (NEW.payment_status = 'confirmed')
EXECUTE FUNCTION trigger_commission_distribution();

-- Ensure user_business_volume exists for all users
INSERT INTO user_business_volume (user_id, direct_investment, current_rank)
SELECT id, 0, 'BASE'
FROM users
WHERE id NOT IN (SELECT user_id FROM user_business_volume)
ON CONFLICT (user_id) DO NOTHING;