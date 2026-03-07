CREATE UNIQUE INDEX IF NOT EXISTS uix_commission_ledger_source_level
ON public.commission_accumulation_ledger (user_id, source_investment_id, commission_level)
WHERE source_investment_id IS NOT NULL AND commission_level IS NOT NULL;

CREATE OR REPLACE FUNCTION public.process_referral_commissions(
  p_downline_profile_id uuid,
  p_source_amount numeric,
  p_source_investment_id uuid DEFAULT NULL
) RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_profile_id uuid := p_downline_profile_id;
  downline_auth_id uuid;
  parent_profile_id uuid;
  upline_auth_id uuid;
  upline_rank text;
  rate_percent numeric;
  gross numeric;
  admin_fee numeric;
  net numeric;
  inserted_count integer := 0;
  level_idx integer := 1;
BEGIN
  IF p_source_amount IS NULL OR p_source_amount <= 0 THEN
    RETURN 0;
  END IF;

  SELECT user_id INTO downline_auth_id
  FROM public.user_profiles
  WHERE id = p_downline_profile_id
  LIMIT 1;

  IF downline_auth_id IS NULL THEN
    RETURN 0;
  END IF;

  WHILE level_idx <= 6 LOOP
    SELECT parent_id INTO parent_profile_id
    FROM public.referral_tree
    WHERE user_id = current_profile_id
    LIMIT 1;

    IF parent_profile_id IS NULL THEN
      EXIT;
    END IF;

    SELECT user_id INTO upline_auth_id
    FROM public.user_profiles
    WHERE id = parent_profile_id
    LIMIT 1;

    IF upline_auth_id IS NULL THEN
      current_profile_id := parent_profile_id;
      level_idx := level_idx + 1;
      CONTINUE;
    END IF;

    SELECT COALESCE(ubv.current_rank, 'BASE') INTO upline_rank
    FROM public.user_business_volume ubv
    WHERE ubv.user_id = upline_auth_id
    LIMIT 1;

    IF upline_rank IS NULL OR trim(upline_rank) = '' THEN
      upline_rank := 'BASE';
    END IF;

    SELECT
      CASE level_idx
        WHEN 1 THEN cr.level_1_rate
        WHEN 2 THEN cr.level_2_rate
        WHEN 3 THEN cr.level_3_rate
        WHEN 4 THEN cr.level_4_rate
        WHEN 5 THEN cr.level_5_rate
        WHEN 6 THEN cr.level_6_rate
        ELSE 0
      END
    INTO rate_percent
    FROM public.commission_rates cr
    WHERE upper(cr.rank) = upper(upline_rank)
    LIMIT 1;

    IF rate_percent IS NULL OR rate_percent <= 0 THEN
      rate_percent := CASE level_idx
        WHEN 1 THEN 20
        WHEN 2 THEN 10
        WHEN 3 THEN 7
        WHEN 4 THEN 5
        WHEN 5 THEN 2
        WHEN 6 THEN 1
        ELSE 0
      END;
    END IF;

    IF rate_percent > 0 AND rate_percent < 1 THEN
      rate_percent := rate_percent * 100;
    END IF;

    gross := round((p_source_amount * rate_percent / 100)::numeric, 2);
    admin_fee := round((gross * 0.10)::numeric, 2);
    net := round((gross - admin_fee)::numeric, 2);

    IF gross > 0 THEN
      IF NOT EXISTS (
        SELECT 1
        FROM public.commission_accumulation_ledger l
        WHERE l.user_id = upline_auth_id
          AND l.commission_level = level_idx
          AND l.commission_type = ('referral_level_' || level_idx)
          AND (
            (p_source_investment_id IS NOT NULL AND l.source_investment_id = p_source_investment_id)
            OR (p_source_investment_id IS NULL AND l.source_investment_id IS NULL AND l.referral_user_id = downline_auth_id AND l.source_amount = p_source_amount)
          )
      ) THEN
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
          status
        ) VALUES (
          upline_auth_id,
          downline_auth_id,
          ('referral_level_' || level_idx),
          level_idx,
          gross,
          admin_fee,
          net,
          p_source_investment_id,
          p_source_amount,
          rate_percent,
          'pending'
        );

        inserted_count := inserted_count + 1;

        UPDATE public.user_profiles
        SET total_commission = COALESCE(total_commission, 0) + net,
            updated_at = now()
        WHERE user_id = upline_auth_id;
      END IF;
    END IF;

    current_profile_id := parent_profile_id;
    level_idx := level_idx + 1;
  END LOOP;

  RETURN inserted_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_process_commissions_on_investment_confirm()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'UPDATE'
     AND NEW.payment_status = 'confirmed'
     AND (OLD.payment_status IS DISTINCT FROM 'confirmed') THEN
    PERFORM public.process_referral_commissions(NEW.user_id, NEW.amount, NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE t.tgname = 'investments_process_commissions'
      AND n.nspname = 'public'
      AND c.relname = 'investments'
  ) THEN
    CREATE TRIGGER investments_process_commissions
    AFTER UPDATE OF payment_status ON public.investments
    FOR EACH ROW
    EXECUTE FUNCTION public.trg_process_commissions_on_investment_confirm();
  END IF;
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can create their own investments"
  ON public.investments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = investments.user_id
        AND up.user_id = auth.uid()
    )
  );
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;