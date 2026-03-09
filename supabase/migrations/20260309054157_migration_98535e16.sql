do $$
begin
  if not exists (select 1 from information_schema.tables where table_schema='public' and table_name='users') then
    create table public.users (
      id uuid primary key references auth.users(id) on delete cascade,
      full_name text,
      email text,
      phone text,
      role text not null default 'REGISTERED',
      rbac_level integer not null default 2,
      status public.user_status not null default 'RED',
      kyc_status public.kyc_status not null default 'PENDING',
      referral_code text,
      referred_by uuid references auth.users(id) on delete set null,
      state text,
      join_date timestamptz default now(),
      wallet_balance numeric not null default 0,
      two_factor_enabled boolean not null default false,
      investment_amount numeric not null default 0,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create unique index users_referral_code_key on public.users (referral_code) where referral_code is not null;
    create index users_role_idx on public.users (role);
    create index users_kyc_status_idx on public.users (kyc_status);
    create index users_referred_by_idx on public.users (referred_by);

    create trigger users_set_updated_at
    before update on public.users
    for each row execute function public.set_updated_at();

    alter table public.users enable row level security;

    create policy "Users can view their own user record" on public.users
      for select using (auth.uid() = id or public.is_staff());

    create policy "Users can insert their own user record" on public.users
      for insert with check (auth.uid() = id or public.is_staff());

    create policy "Users can update their own user record" on public.users
      for update using (auth.uid() = id or public.is_staff()) with check (auth.uid() = id or public.is_staff());

    create policy "Staff can manage users" on public.users
      for all using (public.is_staff()) with check (public.is_staff());
  end if;
end $$;

do $$
begin
  if not exists (select 1 from information_schema.tables where table_schema='public' and table_name='user_profiles') then
    create table public.user_profiles (
      id uuid primary key references auth.users(id) on delete cascade,
      full_name text,
      email text,
      phone text,
      address text,
      city text,
      pincode text,
      state text,
      aadhaar_number text,
      pan_number text,
      kyc_status public.kyc_status not null default 'PENDING',
      status public.user_status not null default 'RED',
      role text not null default 'REGISTERED',
      wallet_balance numeric not null default 0,
      referral_code text,
      referred_by uuid references auth.users(id) on delete set null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create index user_profiles_kyc_status_idx on public.user_profiles (kyc_status);
    create index user_profiles_role_idx on public.user_profiles (role);

    create trigger user_profiles_set_updated_at
    before update on public.user_profiles
    for each row execute function public.set_updated_at();

    alter table public.user_profiles enable row level security;

    create policy "Users can view their own profile" on public.user_profiles
      for select using (auth.uid() = id or public.is_staff());

    create policy "Users can insert their own profile" on public.user_profiles
      for insert with check (auth.uid() = id or public.is_staff());

    create policy "Users can update their own profile" on public.user_profiles
      for update using (auth.uid() = id or public.is_staff()) with check (auth.uid() = id or public.is_staff());

    create policy "Staff can manage user profiles" on public.user_profiles
      for all using (public.is_staff()) with check (public.is_staff());
  end if;
end $$;

do $$
begin
  if not exists (select 1 from information_schema.tables where table_schema='public' and table_name='commission_rates') then
    create table public.commission_rates (
      id uuid primary key default gen_random_uuid(),
      rank_name text not null default 'BASE',
      level integer not null,
      rate numeric not null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      constraint commission_rates_level_chk check (level >= 1 and level <= 6),
      constraint commission_rates_rate_chk check (rate >= 0 and rate <= 1),
      constraint commission_rates_rank_level_unique unique (rank_name, level)
    );

    create index commission_rates_rank_idx on public.commission_rates (rank_name);

    create trigger commission_rates_set_updated_at
    before update on public.commission_rates
    for each row execute function public.set_updated_at();

    alter table public.commission_rates enable row level security;

    create policy "Anyone can view commission rates table" on public.commission_rates
      for select using (true);

    create policy "Admin can manage commission rates table" on public.commission_rates
      for all using (public.is_admin()) with check (public.is_admin());

    insert into public.commission_rates (rank_name, level, rate)
    values
      ('BASE', 1, 0.20),
      ('BASE', 2, 0.10),
      ('BASE', 3, 0.07),
      ('BASE', 4, 0.05),
      ('BASE', 5, 0.02),
      ('BASE', 6, 0.01)
    on conflict (rank_name, level) do update set rate = excluded.rate;
  end if;
end $$;

do $$
begin
  if not exists (select 1 from information_schema.tables where table_schema='public' and table_name='investment_agreements') then
    create table public.investment_agreements (
      id uuid primary key default gen_random_uuid(),
      investment_id uuid references public.investments(id) on delete cascade,
      agreement_number text,
      agreement_date date,
      start_date date,
      end_date date,
      monthly_roi_rate numeric,
      total_months integer,
      principal_amount numeric,
      total_expected_profit numeric,
      total_expected_payout numeric,
      notarized_by text,
      notarization_date date,
      advocate_name text,
      advocate_license text,
      agreement_status text,
      early_termination_allowed boolean,
      early_termination_penalty numeric,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create index investment_agreements_investment_idx on public.investment_agreements (investment_id);

    create trigger investment_agreements_set_updated_at
    before update on public.investment_agreements
    for each row execute function public.set_updated_at();

    alter table public.investment_agreements enable row level security;

    create policy "Users can view their own agreements" on public.investment_agreements
      for select using (
        exists(select 1 from public.investments i where i.id = investment_id and i.user_id = auth.uid())
        or public.is_staff()
      );

    create policy "Staff can manage agreements" on public.investment_agreements
      for all using (public.is_staff()) with check (public.is_staff());
  end if;
end $$;

do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='trusted_devices' and column_name='os_name') then
    alter table public.trusted_devices add column os_name text;
  end if;
end $$;

do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='email_verification_tokens' and column_name='token') then
    alter table public.email_verification_tokens add column token text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='email_verification_tokens' and column_name='verified_at') then
    alter table public.email_verification_tokens add column verified_at timestamptz;
  end if;
end $$;

do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='password_reset_tokens' and column_name='email') then
    alter table public.password_reset_tokens add column email text;
  end if;
end $$;

do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='security_policies' and column_name='policy_name') then
    alter table public.security_policies add column policy_name text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='security_policies' and column_name='condition') then
    alter table public.security_policies add column condition jsonb;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='security_policies' and column_name='is_active') then
    alter table public.security_policies add column is_active boolean not null default true;
  end if;

  update public.security_policies
  set policy_name = coalesce(policy_name, policy_key),
      condition = coalesce(condition, policy_value)
  where policy_name is null or condition is null;

  if not exists (select 1 from pg_constraint where conname = 'security_policies_policy_name_unique') then
    alter table public.security_policies add constraint security_policies_policy_name_unique unique (policy_name);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='user_attributes' and column_name='investment_tier') then
    alter table public.user_attributes add column investment_tier text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='user_attributes' and column_name='investment_amount') then
    alter table public.user_attributes add column investment_amount numeric;
  end if;
end $$;

do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='user_business_volume' and column_name='last_rank_evaluation') then
    alter table public.user_business_volume add column last_rank_evaluation timestamptz;
  end if;
end $$;

do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='investments' and column_name='amount') then
    alter table public.investments add column amount numeric;
  end if;
end $$;

create or replace function public.investments_amount_sync()
returns trigger
language plpgsql
as $$
begin
  if new.investment_amount is null and new.amount is not null then
    new.investment_amount := new.amount;
  end if;

  if new.amount is null and new.investment_amount is not null then
    new.amount := new.investment_amount;
  end if;

  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'investments_amount_sync_trg') then
    create trigger investments_amount_sync_trg
    before insert or update on public.investments
    for each row execute function public.investments_amount_sync();
  end if;
end $$;