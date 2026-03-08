-- 1) Accrual function: inserts up to 6 commission rows into commission_accumulation_ledger
--    based on user_profiles referral_code chain (referred_by stores parent referral_code).
--    Runs as SECURITY DEFINER so it can execute from trigger safely.
CREATE OR REPLACE FUNCTION public.accrue_referral_commissions_for_investment(p_investment_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv RECORD;
  investor_profile RECORD;
  parent_profile RECORD;

  current_referral_code text;
  seen_codes text[] := ARRAY[]::text[];

  lvl int := 1;
  inserted_count int := 0;

  upline_rank text;
  rate_row RECORD;
  rate_percent numeric;

  gross numeric;
  admin_fee numeric;
  net numeric;

  investor_auth_id uuid;
  upline_auth_id uuid;
BEGIN
  SELECT *
    INTO inv
  FROM public.investments i
  WHERE i.id = p_investment_id;

  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  -- Only accrue for confirmed investments
  IF COALESCE(inv.payment_status, 'pending') <> 'confirmed' THEN
    RETURN 0;
  END IF;

  -- investments.user_id -> user_profiles.id
  SELECT up.*
    INTO investor_profile
  FROM public.user_profiles up
  WHERE up.id = inv.user_id;

  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  investor_auth_id := investor_profile.user_id;

  -- No referrer? nothing to accrue
  current_referral_code := NULLIF(TRIM(COALESCE(investor_profile.referred_by, '')), '');
  IF current_referral_code IS NULL THEN
    RETURN 0;
  END IF;

  WHILE lvl <= 6 LOOP
    -- Loop protection
    IF current_referral_code IS NULL THEN
      EXIT;
    END IF;
    IF current_referral_code = ANY(seen_codes) THEN
      EXIT;
    END IF;
    seen_codes := array_append(seen_codes, current_referral_code);

    -- Parent is the user_profiles row whose referral_code matches current_referral_code
    SELECT up.*
      INTO parent_profile
    FROM public.user_profiles up
    WHERE up.referral_code = current_referral_code
    LIMIT 1;

    IF NOT FOUND THEN
      EXIT;
    END IF;

    upline_auth_id := parent_profile.user_id;

    -- Defensive: must have a valid auth user id
    IF upline_auth_id IS NULL THEN
      current_referral_code := NULLIF(TRIM(COALESCE(parent_profile.referred_by, '')), '');
      lvl := lvl + 1;
      CONTINUE;
    END IF;

    -- Prevent self-crediting in edge cases
    IF investor_auth_id IS NOT NULL AND upline_auth_id = investor_auth_id THEN
      current_referral_code := NULLIF(TRIM(COALESCE(parent_profile.referred_by, '')), '');
      lvl := lvl + 1;
      CONTINUE;
    END IF;

    -- Rank lookup (fallback BASE)
    SELECT COALESCE(ub.current_rank, 'BASE')
      INTO upline_rank
    FROM public.user_business_volume ub
    WHERE ub.user_id = upline_auth_id;

    upline_rank := COALESCE(NULLIF(TRIM(upline_rank), ''), 'BASE');

    -- Fetch rates for that rank (fallback to defaults)
    SELECT *
      INTO rate_row
    FROM public.commission_rates cr
    WHERE cr.rank = upline_rank;

    IF NOT FOUND THEN
      -- Default % rates (BASE) per PRD: 20/10/7/5/2/1
      rate_percent := CASE lvl
        WHEN 1 THEN 20
        WHEN 2 THEN 10
        WHEN 3 THEN 7
        WHEN 4 THEN 5
        WHEN 5 THEN 2
        WHEN 6 THEN 1
        ELSE 0
      END;
    ELSE
      rate_percent := CASE lvl
        WHEN 1 THEN rate_row.level_1_rate
        WHEN 2 THEN rate_row.level_2_rate
        WHEN 3 THEN rate_row.level_3_rate
        WHEN 4 THEN rate_row.level_4_rate
        WHEN 5 THEN rate_row.level_5_rate
        WHEN 6 THEN rate_row.level_6_rate
        ELSE 0
      END;
    END IF;

    rate_percent := COALESCE(rate_percent, 0);

    -- Compute money with paise rounding at each step
    gross := ROUND((inv.amount * rate_percent) / 100.0, 2);
    admin_fee := ROUND(gross * 0.10, 2);
    net := ROUND(gross - admin_fee, 2);

    -- Insert ledger row (idempotent via unique index on (user_id, source_investment_id, commission_level))
    INSERT INTO public.commission_accumulation_ledger (
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
      royalty_bonus,
      status
    ) VALUES (
      upline_auth_id,
      investor_auth_id,
      ('referral_level_' || lvl)::varchar,
      lvl,
      COALESCE(gross, 0),
      COALESCE(admin_fee, 0),
      COALESCE(net, 0),
      inv.id,
      inv.amount,
      rate_percent,
      0,
      'pending'
    )
    ON CONFLICT (user_id, source_investment_id, commission_level) DO NOTHING;

    IF FOUND THEN
      inserted_count := inserted_count + 1;
    END IF;

    -- Next ancestor
    current_referral_code := NULLIF(TRIM(COALESCE(parent_profile.referred_by, '')), '');
    lvl := lvl + 1;
  END LOOP;

  RETURN inserted_count;
END;
$$;

-- 2) Trigger function: runs accrual when investment is confirmed
CREATE OR REPLACE FUNCTION public.trg_investments_accrue_commissions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF COALESCE(NEW.payment_status, 'pending') = 'confirmed' THEN
      PERFORM public.accrue_referral_commissions_for_investment(NEW.id);
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF COALESCE(NEW.payment_status, 'pending') = 'confirmed'
       AND COALESCE(OLD.payment_status, 'pending') IS DISTINCT FROM COALESCE(NEW.payment_status, 'pending') THEN
      PERFORM public.accrue_referral_commissions_for_investment(NEW.id);
    END IF;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

-- 3) Create triggers if missing (no DROP, so not destructive)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'investments_after_insert_accrue_commissions'
  ) THEN
    EXECUTE '
      CREATE TRIGGER investments_after_insert_accrue_commissions
      AFTER INSERT ON public.investments
      FOR EACH ROW
      EXECUTE FUNCTION public.trg_investments_accrue_commissions();
    ';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'investments_after_update_accrue_commissions'
  ) THEN
    EXECUTE '
      CREATE TRIGGER investments_after_update_accrue_commissions
      AFTER UPDATE OF payment_status ON public.investments
      FOR EACH ROW
      EXECUTE FUNCTION public.trg_investments_accrue_commissions();
    ';
  END IF;
END $$;