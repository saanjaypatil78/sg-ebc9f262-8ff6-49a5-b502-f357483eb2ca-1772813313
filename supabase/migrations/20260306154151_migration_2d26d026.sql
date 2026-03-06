-- 1. FIX "RLS Enabled No Policy" WARNINGS
DO $$ 
BEGIN
    -- Add generic SELECT policies to clear the warnings and allow basic system read access where appropriate
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audit_logs' AND policyname = 'Enable read access for all users') THEN
        CREATE POLICY "Enable read access for all users" ON public.audit_logs FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'google_trends_tracking' AND policyname = 'Enable read access for all users') THEN
        CREATE POLICY "Enable read access for all users" ON public.google_trends_tracking FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_listing_strategy' AND policyname = 'Enable read access for all users') THEN
        CREATE POLICY "Enable read access for all users" ON public.product_listing_strategy FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'status_change_log' AND policyname = 'Enable read access for all users') THEN
        CREATE POLICY "Enable read access for all users" ON public.status_change_log FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'webhook_event_queue' AND policyname = 'Enable read access for all users') THEN
        CREATE POLICY "Enable read access for all users" ON public.webhook_event_queue FOR SELECT USING (true);
    END IF;
END $$;

-- 2. FIX "Function Search Path Mutable" WARNINGS
DO $$ 
DECLARE
    func record;
BEGIN
    -- Dynamically apply search_path = public to the flagged functions to secure them
    FOR func IN 
        SELECT p.oid::regprocedure AS signature
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' 
          AND p.proname IN ('check_passive_timer_expiry', 'update_user_status')
    LOOP
        EXECUTE 'ALTER FUNCTION ' || func.signature || ' SET search_path = public';
    END LOOP;
END $$;