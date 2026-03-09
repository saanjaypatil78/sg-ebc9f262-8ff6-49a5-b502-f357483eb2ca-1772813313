do $$
begin
  if not exists (select 1 from pg_type where typname = 'commission_status') then
    create type public.commission_status as enum ('ACCRUED', 'APPROVED', 'PAID', 'REJECTED');
  end if;
end $$;

create table if not exists public.referral_tree (
  user_id uuid primary key references auth.users(id) on delete cascade,
  sponsor_id uuid references auth.users(id) on delete set null,
  placement_parent_id uuid references auth.users(id) on delete set null,
  placement_position integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'referral_tree_set_updated_at') then
    create trigger referral_tree_set_updated_at
    before update on public.referral_tree
    for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.referral_tree enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='referral_tree' and policyname='Users can view referral tree (staff-only by default)') then
    create policy "Users can view referral tree (staff-only by default)" on public.referral_tree
      for select using (public.is_staff());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='referral_tree' and policyname='Staff can manage referral tree') then
    create policy "Staff can manage referral tree" on public.referral_tree
      for all using (public.is_staff()) with check (public.is_staff());
  end if;
end $$;

create table if not exists public.commission_accumulation_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null,
  source_id uuid,
  level integer,
  commission_percent numeric,
  gross_commission numeric not null default 0,
  admin_charge numeric not null default 0,
  net_commission numeric not null default 0,
  status public.commission_status not null default 'ACCRUED',
  payout_batch_id uuid,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists commission_accumulation_ledger_user_idx on public.commission_accumulation_ledger (user_id);
create index if not exists commission_accumulation_ledger_status_idx on public.commission_accumulation_ledger (status);

alter table public.commission_accumulation_ledger enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='commission_accumulation_ledger' and policyname='Users can view their own commission ledger') then
    create policy "Users can view their own commission ledger" on public.commission_accumulation_ledger
      for select using (auth.uid() = user_id or public.is_staff());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='commission_accumulation_ledger' and policyname='Staff can manage commission ledger') then
    create policy "Staff can manage commission ledger" on public.commission_accumulation_ledger
      for all using (public.is_staff()) with check (public.is_staff());
  end if;
end $$;

create table if not exists public.product_sync_logs (
  id uuid primary key default gen_random_uuid(),
  integration_id uuid,
  status text not null default 'OK',
  products_fetched integer not null default 0,
  conflicts_detected integer not null default 0,
  details jsonb,
  created_at timestamptz not null default now()
);

alter table public.product_sync_logs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='product_sync_logs' and policyname='Staff can view sync logs') then
    create policy "Staff can view sync logs" on public.product_sync_logs
      for select using (public.is_staff());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='product_sync_logs' and policyname='Staff can insert sync logs') then
    create policy "Staff can insert sync logs" on public.product_sync_logs
      for insert with check (public.is_staff());
  end if;
end $$;

do $$
begin
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='investments') then
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='investments' and column_name='payment_status') then
      alter table public.investments add column payment_status text;
    end if;
  end if;
end $$;

do $$
begin
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='profiles') then
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='address') then
      alter table public.profiles add column address text;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='city') then
      alter table public.profiles add column city text;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='pincode') then
      alter table public.profiles add column pincode text;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='aadhaar_number') then
      alter table public.profiles add column aadhaar_number text;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='pan_number') then
      alter table public.profiles add column pan_number text;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='bank_name') then
      alter table public.profiles add column bank_name text;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='account_number') then
      alter table public.profiles add column account_number text;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='ifsc_code') then
      alter table public.profiles add column ifsc_code text;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='investment_amount') then
      alter table public.profiles add column investment_amount numeric;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='franchise_location') then
      alter table public.profiles add column franchise_location text;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='email_verified') then
      alter table public.profiles add column email_verified boolean not null default false;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='email_verified_at') then
      alter table public.profiles add column email_verified_at timestamptz;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='contact_verified') then
      alter table public.profiles add column contact_verified boolean not null default false;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='contact_verified_at') then
      alter table public.profiles add column contact_verified_at timestamptz;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='bank_verified') then
      alter table public.profiles add column bank_verified boolean not null default false;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='bank_verified_at') then
      alter table public.profiles add column bank_verified_at timestamptz;
    end if;
  end if;
end $$;

drop function if exists public.resolve_referrer_user_id_v1(text);
create or replace function public.resolve_referrer_user_id_v1(p_code text)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.id
  from public.profiles p
  where p.referral_code is not null
    and lower(p.referral_code) = lower(p_code)
  limit 1;
$$;

drop function if exists public.record_sync_result(jsonb);
create or replace function public.record_sync_result(
  p_integration_id uuid,
  p_sync_type text,
  p_products_fetched integer,
  p_products_created integer,
  p_products_updated integer,
  p_products_failed integer,
  p_status text,
  p_error_message text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  begin
    insert into public.product_sync_logs (
      integration_id,
      status,
      products_fetched,
      conflicts_detected,
      details,
      created_at
    )
    values (
      p_integration_id,
      coalesce(p_status, 'OK'),
      coalesce(p_products_fetched, 0),
      0,
      jsonb_build_object(
        'sync_type', p_sync_type,
        'products_created', coalesce(p_products_created, 0),
        'products_updated', coalesce(p_products_updated, 0),
        'products_failed', coalesce(p_products_failed, 0),
        'error_message', p_error_message
      ),
      now()
    );
  exception when others then
    null;
  end;

  return jsonb_build_object('ok', true);
end;
$$;

drop function if exists public.get_visible_network_commission_leaderboard_v1(uuid);
create or replace function public.get_visible_network_commission_leaderboard_v1(
  p_days integer,
  p_include_cancelled boolean default false
)
returns table (
  user_id uuid,
  full_name text,
  net_commission numeric,
  gross_commission numeric,
  admin_charge numeric,
  items_count integer
)
language sql
stable
security definer
set search_path = public
as $$
  with base as (
    select
      l.user_id,
      sum(coalesce(l.net_commission, 0)) as net_commission,
      sum(coalesce(l.gross_commission, 0)) as gross_commission,
      sum(coalesce(l.admin_charge, 0)) as admin_charge,
      count(*)::int as items_count
    from public.commission_accumulation_ledger l
    where l.created_at >= (now() - make_interval(days => greatest(1, least(365, coalesce(p_days, 30)))))
      and (p_include_cancelled or l.status <> 'REJECTED')
    group by l.user_id
  )
  select
    b.user_id,
    coalesce(p.full_name, 'Member') as full_name,
    b.net_commission,
    b.gross_commission,
    b.admin_charge,
    b.items_count
  from base b
  left join public.profiles p on p.id = b.user_id
  order by b.net_commission desc;
$$;

drop function if exists public.get_network_tree(uuid);
create or replace function public.get_network_tree(
  p_user_id uuid,
  p_max_level integer default 6
)
returns table (
  user_id uuid,
  full_name text,
  email text,
  level integer,
  investment_total numeric,
  direct_referrals integer,
  joined_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  with recursive tree as (
    select
      rt.user_id,
      rt.sponsor_id,
      1 as level
    from public.referral_tree rt
    where rt.sponsor_id = p_user_id

    union all

    select
      c.user_id,
      c.sponsor_id,
      t.level + 1
    from public.referral_tree c
    join tree t on c.sponsor_id = t.user_id
    where t.level < greatest(1, least(6, coalesce(p_max_level, 6)))
  ),
  inv as (
    select i.user_id, sum(coalesce(i.investment_amount, i.amount, 0)) as investment_total
    from public.investments i
    group by i.user_id
  ),
  direct_counts as (
    select sponsor_id as user_id, count(*)::int as direct_referrals
    from public.referral_tree
    group by sponsor_id
  )
  select
    t.user_id,
    coalesce(p.full_name, '') as full_name,
    coalesce(p.email, '') as email,
    t.level,
    coalesce(inv.investment_total, 0) as investment_total,
    coalesce(dc.direct_referrals, 0) as direct_referrals,
    coalesce(p.join_date, p.created_at, now()) as joined_at
  from tree t
  left join public.profiles p on p.id = t.user_id
  left join inv on inv.user_id = t.user_id
  left join direct_counts dc on dc.user_id = t.user_id
  order by t.level asc, t.user_id asc;
$$;

drop function if exists public.get_network_stats(uuid);
create or replace function public.get_network_stats(p_user_id uuid)
returns table (
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
)
language sql
stable
security definer
set search_path = public
as $$
  with t as (
    select * from public.get_network_tree(p_user_id, 6)
  )
  select
    (select count(*)::int from t) as total_network_size,
    (select count(*)::int from t where level = 1) as level_1_count,
    (select count(*)::int from t where level = 2) as level_2_count,
    (select count(*)::int from t where level = 3) as level_3_count,
    (select count(*)::int from t where level = 4) as level_4_count,
    (select count(*)::int from t where level = 5) as level_5_count,
    (select count(*)::int from t where level = 6) as level_6_count,
    (select coalesce(sum(investment_total), 0) from t) as total_network_investment,
    (select coalesce(sum(net_amount), 0) from public.commission_ledger cl where cl.beneficiary_user_id = p_user_id) as total_commissions_earned,
    (select coalesce(ubv.current_rank, 'BASE') from public.user_business_volume ubv where ubv.user_id = p_user_id) as rank,
    0::numeric as rank_progress;
$$;

drop function if exists public.recalculate_user_rank(uuid);
create or replace function public.recalculate_user_rank(p_user_auth_id uuid)
returns table (
  qualifying_volume numeric,
  previous_rank text,
  current_rank text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(ubv.total_team_business, 0) as qualifying_volume,
    null::text as previous_rank,
    coalesce(ubv.current_rank, 'BASE') as current_rank
  from public.user_business_volume ubv
  where ubv.user_id = p_user_auth_id;
$$;

drop function if exists public.auto_upgrade_rank(uuid);
create or replace function public.auto_upgrade_rank(investor_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return true;
end;
$$;