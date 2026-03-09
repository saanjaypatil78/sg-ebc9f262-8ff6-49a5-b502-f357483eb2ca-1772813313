do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='active_sessions' and column_name='is_active') then
    alter table public.active_sessions add column is_active boolean not null default true;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='active_sessions' and column_name='last_activity') then
    alter table public.active_sessions add column last_activity timestamptz;
  end if;
end $$;

do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='trusted_devices' and column_name='is_trusted') then
    alter table public.trusted_devices add column is_trusted boolean not null default true;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='trusted_devices' and column_name='browser_name') then
    alter table public.trusted_devices add column browser_name text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='trusted_devices' and column_name='last_seen') then
    alter table public.trusted_devices add column last_seen timestamptz;
  end if;
end $$;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='notifications' and policyname='Users can view their own notifications') then
    create policy "Users can view their own notifications" on public.notifications
      for select using (auth.uid() = user_id or public.is_staff());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='notifications' and policyname='Users can update their own notifications') then
    create policy "Users can update their own notifications" on public.notifications
      for update using (auth.uid() = user_id or public.is_staff()) with check (auth.uid() = user_id or public.is_staff());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='notifications' and policyname='Staff can insert notifications') then
    create policy "Staff can insert notifications" on public.notifications
      for insert with check (public.is_staff());
  end if;
end $$;

create table if not exists public.user_2fa (
  user_id uuid primary key references auth.users(id) on delete cascade,
  secret text,
  enabled boolean not null default false,
  backup_codes jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger user_2fa_set_updated_at
before update on public.user_2fa
for each row execute function public.set_updated_at();

alter table public.user_2fa enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_2fa' and policyname='Users can view their own 2fa') then
    create policy "Users can view their own 2fa" on public.user_2fa
      for select using (auth.uid() = user_id or public.is_staff());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_2fa' and policyname='Users can upsert their own 2fa') then
    create policy "Users can upsert their own 2fa" on public.user_2fa
      for insert with check (auth.uid() = user_id or public.is_staff());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_2fa' and policyname='Users can update their own 2fa') then
    create policy "Users can update their own 2fa" on public.user_2fa
      for update using (auth.uid() = user_id or public.is_staff()) with check (auth.uid() = user_id or public.is_staff());
  end if;
end $$;

create table if not exists public.email_verification_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists email_verification_tokens_user_idx on public.email_verification_tokens (user_id);
create index if not exists email_verification_tokens_expires_idx on public.email_verification_tokens (expires_at);

alter table public.email_verification_tokens enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='email_verification_tokens' and policyname='Users can manage their own email verification tokens') then
    create policy "Users can manage their own email verification tokens" on public.email_verification_tokens
      for all using (auth.uid() = user_id or public.is_staff()) with check (auth.uid() = user_id or public.is_staff());
  end if;
end $$;

create table if not exists public.password_reset_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists password_reset_tokens_user_idx on public.password_reset_tokens (user_id);
create index if not exists password_reset_tokens_expires_idx on public.password_reset_tokens (expires_at);

alter table public.password_reset_tokens enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='password_reset_tokens' and policyname='Users can manage their own password reset tokens') then
    create policy "Users can manage their own password reset tokens" on public.password_reset_tokens
      for all using (auth.uid() = user_id or public.is_staff()) with check (auth.uid() = user_id or public.is_staff());
  end if;
end $$;

create table if not exists public.login_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  status text not null,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists login_history_user_idx on public.login_history (user_id);
create index if not exists login_history_created_idx on public.login_history (created_at);

alter table public.login_history enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='login_history' and policyname='Users can view their own login history') then
    create policy "Users can view their own login history" on public.login_history
      for select using (auth.uid() = user_id or public.is_staff());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='login_history' and policyname='Staff can insert login history') then
    create policy "Staff can insert login history" on public.login_history
      for insert with check (public.is_staff());
  end if;
end $$;

create table if not exists public.withdrawal_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric not null,
  status text not null default 'PENDING',
  requested_at timestamptz not null default now(),
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger withdrawal_requests_set_updated_at
before update on public.withdrawal_requests
for each row execute function public.set_updated_at();

alter table public.withdrawal_requests enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='withdrawal_requests' and policyname='Users can view their own withdrawals') then
    create policy "Users can view their own withdrawals" on public.withdrawal_requests
      for select using (auth.uid() = user_id or public.is_staff());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='withdrawal_requests' and policyname='Users can create their own withdrawals') then
    create policy "Users can create their own withdrawals" on public.withdrawal_requests
      for insert with check (auth.uid() = user_id or public.is_staff());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='withdrawal_requests' and policyname='Staff can manage withdrawals') then
    create policy "Staff can manage withdrawals" on public.withdrawal_requests
      for update using (public.is_staff()) with check (public.is_staff());
  end if;
end $$;

create table if not exists public.platform_integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform_name text not null,
  platform_store_id text,
  api_key text,
  api_secret text,
  access_token text,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists platform_integrations_user_idx on public.platform_integrations (user_id);
create index if not exists platform_integrations_platform_idx on public.platform_integrations (platform_name);

create trigger platform_integrations_set_updated_at
before update on public.platform_integrations
for each row execute function public.set_updated_at();

alter table public.platform_integrations enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='platform_integrations' and policyname='Users can view their own integrations') then
    create policy "Users can view their own integrations" on public.platform_integrations
      for select using (auth.uid() = user_id or public.is_staff());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='platform_integrations' and policyname='Users can manage their own integrations') then
    create policy "Users can manage their own integrations" on public.platform_integrations
      for all using (auth.uid() = user_id or public.is_staff()) with check (auth.uid() = user_id or public.is_staff());
  end if;
end $$;

create table if not exists public.product_sync_mapping (
  id uuid primary key default gen_random_uuid(),
  integration_id uuid not null references public.platform_integrations(id) on delete cascade,
  platform_product_id text not null,
  local_product_id uuid,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists product_sync_mapping_integration_idx on public.product_sync_mapping (integration_id);
create index if not exists product_sync_mapping_platform_pid_idx on public.product_sync_mapping (platform_product_id);

create trigger product_sync_mapping_set_updated_at
before update on public.product_sync_mapping
for each row execute function public.set_updated_at();

alter table public.product_sync_mapping enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='product_sync_mapping' and policyname='Users can manage their own product sync mapping') then
    create policy "Users can manage their own product sync mapping" on public.product_sync_mapping
      for all using (
        exists(select 1 from public.platform_integrations pi where pi.id = integration_id and (pi.user_id = auth.uid() or public.is_staff()))
      )
      with check (
        exists(select 1 from public.platform_integrations pi where pi.id = integration_id and (pi.user_id = auth.uid() or public.is_staff()))
      );
  end if;
end $$;

create table if not exists public.product_sync_logs (
  id uuid primary key default gen_random_uuid(),
  integration_id uuid references public.platform_integrations(id) on delete set null,
  status text not null default 'OK',
  products_fetched integer not null default 0,
  conflicts_detected integer not null default 0,
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists product_sync_logs_integration_idx on public.product_sync_logs (integration_id);

alter table public.product_sync_logs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='product_sync_logs' and policyname='Users can view their own sync logs') then
    create policy "Users can view their own sync logs" on public.product_sync_logs
      for select using (
        public.is_staff()
        or exists(select 1 from public.platform_integrations pi where pi.id = integration_id and pi.user_id = auth.uid())
      );
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='product_sync_logs' and policyname='Staff can insert sync logs') then
    create policy "Staff can insert sync logs" on public.product_sync_logs
      for insert with check (public.is_staff());
  end if;
end $$;

create table if not exists public.product_aggregated_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid,
  rating_avg numeric,
  rating_count integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.product_aggregated_reviews enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='product_aggregated_reviews' and policyname='Anyone can view aggregated reviews') then
    create policy "Anyone can view aggregated reviews" on public.product_aggregated_reviews
      for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='product_aggregated_reviews' and policyname='Staff can manage aggregated reviews') then
    create policy "Staff can manage aggregated reviews" on public.product_aggregated_reviews
      for all using (public.is_staff()) with check (public.is_staff());
  end if;
end $$;

create table if not exists public.security_policies (
  id uuid primary key default gen_random_uuid(),
  policy_key text unique not null,
  policy_value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger security_policies_set_updated_at
before update on public.security_policies
for each row execute function public.set_updated_at();

alter table public.security_policies enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='security_policies' and policyname='Staff can view security policies') then
    create policy "Staff can view security policies" on public.security_policies
      for select using (public.is_staff());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='security_policies' and policyname='Admin can manage security policies') then
    create policy "Admin can manage security policies" on public.security_policies
      for all using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

create table if not exists public.user_attributes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  attributes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger user_attributes_set_updated_at
before update on public.user_attributes
for each row execute function public.set_updated_at();

alter table public.user_attributes enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_attributes' and policyname='Users can view their own attributes') then
    create policy "Users can view their own attributes" on public.user_attributes
      for select using (auth.uid() = user_id or public.is_staff());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_attributes' and policyname='Users can manage their own attributes') then
    create policy "Users can manage their own attributes" on public.user_attributes
      for all using (auth.uid() = user_id or public.is_staff()) with check (auth.uid() = user_id or public.is_staff());
  end if;
end $$;

create table if not exists public.user_business_volume (
  user_id uuid primary key references auth.users(id) on delete cascade,
  total_personal_business numeric not null default 0,
  total_team_business numeric not null default 0,
  current_rank text not null default 'BASE',
  updated_at timestamptz not null default now()
);

alter table public.user_business_volume enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_business_volume' and policyname='Users can view their own business volume') then
    create policy "Users can view their own business volume" on public.user_business_volume
      for select using (auth.uid() = user_id or public.is_staff());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_business_volume' and policyname='Staff can manage business volume') then
    create policy "Staff can manage business volume" on public.user_business_volume
      for all using (public.is_staff()) with check (public.is_staff());
  end if;
end $$;

create table if not exists public.investor_ranks (
  rank_name text primary key,
  business_target numeric not null,
  royalty_rate numeric not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint investor_ranks_royalty_rate_chk check (royalty_rate >= 0 and royalty_rate <= 1)
);

create trigger investor_ranks_set_updated_at
before update on public.investor_ranks
for each row execute function public.set_updated_at();

alter table public.investor_ranks enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='investor_ranks' and policyname='Anyone can view investor ranks') then
    create policy "Anyone can view investor ranks" on public.investor_ranks
      for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='investor_ranks' and policyname='Admin can manage investor ranks') then
    create policy "Admin can manage investor ranks" on public.investor_ranks
      for all using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

insert into public.investor_ranks (rank_name, business_target, royalty_rate)
values
  ('BRONZE', 5000000, 0.01),
  ('SILVER', 10000000, 0.0075),
  ('GOLD', 50000000, 0.005),
  ('PLATINUM', 250000000, 0.0035),
  ('DIAMOND', 750000000, 0.0025),
  ('AMBASSADOR', 1000000000, 0.0015)
on conflict (rank_name) do update set business_target = excluded.business_target, royalty_rate = excluded.royalty_rate;

create table if not exists public.rank_change_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  previous_rank text,
  new_rank text not null,
  changed_at timestamptz not null default now()
);

create index if not exists rank_change_history_user_idx on public.rank_change_history (user_id);

alter table public.rank_change_history enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='rank_change_history' and policyname='Staff can view rank change history') then
    create policy "Staff can view rank change history" on public.rank_change_history
      for select using (public.is_staff());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='rank_change_history' and policyname='System can insert rank change history') then
    create policy "System can insert rank change history" on public.rank_change_history
      for insert with check (public.is_staff());
  end if;
end $$;

create table if not exists public.payout_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric not null,
  status text not null,
  created_at timestamptz not null default now()
);

create index if not exists payout_history_user_idx on public.payout_history (user_id);

alter table public.payout_history enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='payout_history' and policyname='Users can view their own payout history') then
    create policy "Users can view their own payout history" on public.payout_history
      for select using (auth.uid() = user_id or public.is_staff());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='payout_history' and policyname='Staff can insert payout history') then
    create policy "Staff can insert payout history" on public.payout_history
      for insert with check (public.is_staff());
  end if;
end $$;

create table if not exists public.investor_network (
  user_id uuid primary key references auth.users(id) on delete cascade,
  sponsor_id uuid references auth.users(id) on delete set null,
  referral_code text,
  investor_level integer not null default 0,
  is_team_leader boolean not null default false,
  investment_amount numeric not null default 0,
  total_team_business numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger investor_network_set_updated_at
before update on public.investor_network
for each row execute function public.set_updated_at();

alter table public.investor_network enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='investor_network' and policyname='Users can view their own network row') then
    create policy "Users can view their own network row" on public.investor_network
      for select using (auth.uid() = user_id or public.is_staff());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='investor_network' and policyname='Staff can manage investor network') then
    create policy "Staff can manage investor network" on public.investor_network
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
  created_at timestamptz not null default now()
);

create index if not exists commission_accumulation_ledger_user_idx on public.commission_accumulation_ledger (user_id);

alter table public.commission_accumulation_ledger enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='commission_accumulation_ledger' and policyname='Users can view their own commission accumulation ledger') then
    create policy "Users can view their own commission accumulation ledger" on public.commission_accumulation_ledger
      for select using (auth.uid() = user_id or public.is_staff());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='commission_accumulation_ledger' and policyname='Staff can manage commission accumulation ledger') then
    create policy "Staff can manage commission accumulation ledger" on public.commission_accumulation_ledger
      for all using (public.is_staff()) with check (public.is_staff());
  end if;
end $$;

create or replace function public.resolve_referrer_user_id_v1(ref_code text)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.id
  from public.profiles p
  where p.referral_code is not null
    and lower(p.referral_code) = lower(ref_code)
  limit 1;
$$;

create or replace function public.get_network_tree(root_user_id uuid)
returns table (
  user_id uuid,
  sponsor_id uuid,
  depth integer,
  referral_code text
)
language sql
stable
security definer
set search_path = public
as $$
  with recursive t as (
    select rt.user_id, rt.sponsor_id, 0 as depth
    from public.referral_tree rt
    where rt.user_id = root_user_id
    union all
    select c.user_id, c.sponsor_id, t.depth + 1
    from public.referral_tree c
    join t on c.sponsor_id = t.user_id
    where t.depth < 25
  )
  select t.user_id, t.sponsor_id, t.depth, p.referral_code
  from t
  left join public.profiles p on p.id = t.user_id;
$$;

create or replace function public.get_network_stats(root_user_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'root_user_id', root_user_id,
    'total_nodes', (select count(*) from public.referral_tree),
    'direct_referrals', (select count(*) from public.referral_tree where sponsor_id = root_user_id)
  );
$$;

create or replace function public.recalculate_user_rank(user_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object('ok', true, 'user_id', user_id);
$$;

create or replace function public.auto_upgrade_rank(user_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object('ok', true, 'user_id', user_id);
$$;

create or replace function public.get_visible_network_commission_leaderboard_v1(root_user_id uuid)
returns table (
  user_id uuid,
  total_net_commission numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select cl.beneficiary_user_id as user_id, coalesce(sum(cl.net_amount), 0) as total_net_commission
  from public.commission_ledger cl
  group by cl.beneficiary_user_id
  order by total_net_commission desc
  limit 50;
$$;

create or replace function public.record_sync_result(result jsonb)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object('ok', true);
$$;