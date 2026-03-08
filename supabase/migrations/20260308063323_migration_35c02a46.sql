DO $$
BEGIN
  BEGIN
    CREATE POLICY "Admins can view all commissions"
    ON public.commission_accumulation_ledger
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1
        FROM public.users u
        WHERE u.id = auth.uid()
          AND u.role = ANY (ARRAY['ADMIN','SUPER_ADMIN'])
      )
    );
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    CREATE POLICY "Admins can update commissions"
    ON public.commission_accumulation_ledger
    FOR UPDATE
    USING (
      EXISTS (
        SELECT 1
        FROM public.users u
        WHERE u.id = auth.uid()
          AND u.role = ANY (ARRAY['ADMIN','SUPER_ADMIN'])
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1
        FROM public.users u
        WHERE u.id = auth.uid()
          AND u.role = ANY (ARRAY['ADMIN','SUPER_ADMIN'])
      )
    );
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;
END $$;