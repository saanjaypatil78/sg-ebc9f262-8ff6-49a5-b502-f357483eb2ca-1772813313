create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_status') then
    create type public.user_status as enum ('RED', 'GREEN');
  end if;

  if not exists (select 1 from pg_type where typname = 'kyc_status') then
    create type public.kyc_status as enum ('PENDING', 'VERIFIED', 'REJECTED');
  end if;

  if not exists (select 1 from pg_type where typname = 'investment_status') then
    create type public.investment_status as enum ('ACTIVE', 'COMPLETED', 'TERMINATED');
  end if;

  if not exists (select 1 from pg_type where typname = 'roi_payout_status') then
    create type public.roi_payout_status as enum ('DUE', 'PROCESSING', 'PAID');
  end if;

  if not exists (select 1 from pg_type where typname = 'commission_status') then
    create type public.commission_status as enum ('ACCRUED', 'APPROVED', 'PAID', 'REJECTED');
  end if;

  if not exists (select 1 from pg_type where typname = 'payout_status') then
    create type public.payout_status as enum ('DUE', 'PROCESSING', 'PAID', 'FAILED', 'CANCELLED');
  end if;

  if not exists (select 1 from pg_type where typname = 'vendor_status') then
    create type public.vendor_status as enum ('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED');
  end if;

  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type public.order_status as enum ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED');
  end if;

  if not exists (select 1 from pg_type where typname = 'return_status') then
    create type public.return_status as enum ('REQUESTED', 'APPROVED', 'REJECTED', 'PICKED', 'REFUNDED', 'CLOSED');
  end if;

  if not exists (select 1 from pg_type where typname = 'webhook_event_status') then
    create type public.webhook_event_status as enum ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'RETRY_SCHEDULED');
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter table public.profiles
  add column if not exists role text not null default 'REGISTERED',
  add column if not exists rbac_level integer not null default 2,
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists kyc_status public.kyc_status not null default 'PENDING',
  add column if not exists status public.user_status not null default 'RED',
  add column if not exists first_name text,
  add column if not exists middle_name text,
  add column if not exists last_name text,
  add column if not exists phone text,
  add column if not exists state text,
  add column if not exists join_date timestamptz default now(),
  add column if not exists wallet_balance numeric not null default 0,
  add column if not exists referral_code text,
  add column if not exists referred_by uuid,
  add column if not exists contact_verified boolean not null default false,
  add column if not exists contact_verified_at timestamptz,
  add column if not exists email_verified boolean not null default false,
  add column if not exists email_verified_at timestamptz,
  add column if not exists bank_verified boolean not null default false,
  add column if not exists bank_verified_at timestamptz,
  add column if not exists two_factor_enabled boolean not null default false,
  add column if not exists is_active boolean not null default true;

create unique index if not exists profiles_referral_code_key on public.profiles (referral_code) where referral_code is not null;
create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_kyc_status_idx on public.profiles (kyc_status);
create index if not exists profiles_state_idx on public.profiles (state);
create index if not exists profiles_referred_by_idx on public.profiles (referred_by);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_referred_by_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_referred_by_fkey foreign key (referred_by) references auth.users(id) on delete set null;
  end if;
end $$;

create or replace function public.has_any_role(required_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = any(required_roles)
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_any_role(array['ADMIN','SUPER_ADMIN','ROOT']);
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_any_role(array['FINANCE','COMPLIANCE','ADMIN','SUPER_ADMIN','ROOT']);
$$;

create table if not exists public.referral_tree (
  user_id uuid primary key references auth.users(id) on delete cascade,
  sponsor_id uuid references auth.users(id) on delete set null,
  placement_parent_id uuid references auth.users(id) on delete set null,
  placement_position integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint referral_tree_placement_position_chk check (placement_position is null or (placement_position >= 1 and placement_position <= 12))
);

create index if not exists referral_tree_sponsor_idx on public.referral_tree (sponsor_id);
create index if not exists referral_tree_parent_idx on public.referral_tree (placement_parent_id);

alter table public.referral_tree enable row level security;

create policy "Users can view their own referral node" on public.referral_tree
  for select
  using (auth.uid() = user_id or public.is_staff());

create policy "Users can insert their own referral node" on public.referral_tree
  for insert
  with check (auth.uid() = user_id or public.is_staff());

create policy "Staff can update referral tree" on public.referral_tree
  for update
  using (public.is_staff())
  with check (public.is_staff());

create table if not exists public.investment_plans (
  code text primary key,
  agreement_months integer not null default 12,
  roi_rate numeric not null default 0.15,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger investment_plans_set_updated_at
before update on public.investment_plans
for each row execute function public.set_updated_at();

alter table public.investment_plans enable row level security;

create policy "Anyone can view investment plans" on public.investment_plans
  for select using (true);

create policy "Admin can manage investment plans" on public.investment_plans
  for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_code text references public.investment_plans(code) on delete set null,
  investment_amount numeric not null,
  roi_rate numeric not null default 0.15,
  agreement_months integer not null default 12,
  status public.investment_status not null default 'ACTIVE',
  investment_date timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists investments_user_idx on public.investments (user_id);
create index if not exists investments_status_idx on public.investments (status);

create trigger investments_set_updated_at
before update on public.investments
for each row execute function public.set_updated_at();

alter table public.investments enable row level security;

create policy "Users can view their own investments" on public.investments
  for select using (auth.uid() = user_id or public.is_staff());

create policy "Users can insert their own investments" on public.investments
  for insert with check (auth.uid() = user_id or public.is_staff());

create policy "Staff can update investments" on public.investments
  for update using (public.is_staff()) with check (public.is_staff());

create table if not exists public.investment_roi_payouts (
  id uuid primary key default gen_random_uuid(),
  investment_id uuid not null references public.investments(id) on delete cascade,
  investor_user_id uuid not null references auth.users(id) on delete cascade,
  period_month date not null,
  roi_amount numeric not null,
  status public.roi_payout_status not null default 'DUE',
  due_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint investment_roi_payouts_unique unique (investment_id, period_month)
);

create index if not exists investment_roi_payouts_investor_idx on public.investment_roi_payouts (investor_user_id);
create index if not exists investment_roi_payouts_status_idx on public.investment_roi_payouts (status);

create trigger investment_roi_payouts_set_updated_at
before update on public.investment_roi_payouts
for each row execute function public.set_updated_at();

alter table public.investment_roi_payouts enable row level security;

create policy "Users can view their own ROI payouts" on public.investment_roi_payouts
  for select using (auth.uid() = investor_user_id or public.is_staff());

create policy "Staff can manage ROI payouts" on public.investment_roi_payouts
  for all using (public.is_staff()) with check (public.is_staff());

create table if not exists public.commission_rate_matrix (
  level integer primary key,
  rate numeric not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint commission_rate_matrix_level_chk check (level >= 1 and level <= 6),
  constraint commission_rate_matrix_rate_chk check (rate >= 0 and rate <= 1)
);

create trigger commission_rate_matrix_set_updated_at
before update on public.commission_rate_matrix
for each row execute function public.set_updated_at();

alter table public.commission_rate_matrix enable row level security;

create policy "Anyone can view commission rates" on public.commission_rate_matrix
  for select using (true);

create policy "Admin can manage commission rates" on public.commission_rate_matrix
  for all using (public.is_admin()) with check (public.is_admin());

insert into public.commission_rate_matrix (level, rate)
values
  (1, 0.20),
  (2, 0.10),
  (3, 0.07),
  (4, 0.05),
  (5, 0.02),
  (6, 0.01)
on conflict (level) do update set rate = excluded.rate;

create table if not exists public.direct_target_royalty_rules (
  rank_name text primary key,
  target_amount numeric not null,
  royalty_rate numeric not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint direct_target_royalty_rate_chk check (royalty_rate >= 0 and royalty_rate <= 1)
);

create trigger direct_target_royalty_rules_set_updated_at
before update on public.direct_target_royalty_rules
for each row execute function public.set_updated_at();

alter table public.direct_target_royalty_rules enable row level security;

create policy "Anyone can view royalty rules" on public.direct_target_royalty_rules
  for select using (true);

create policy "Admin can manage royalty rules" on public.direct_target_royalty_rules
  for all using (public.is_admin()) with check (public.is_admin());

insert into public.direct_target_royalty_rules (rank_name, target_amount, royalty_rate)
values
  ('BRONZE', 5000000, 0.01),
  ('SILVER', 10000000, 0.0075),
  ('GOLD', 50000000, 0.005),
  ('PLATINUM', 250000000, 0.0035),
  ('DIAMOND', 750000000, 0.0025),
  ('AMBASSADOR', 1000000000, 0.0015)
on conflict (rank_name) do update set target_amount = excluded.target_amount, royalty_rate = excluded.royalty_rate;

create table if not exists public.commission_ledger (
  id uuid primary key default gen_random_uuid(),
  source_type text not null default 'ROI_PAYOUT',
  source_id uuid not null references public.investment_roi_payouts(id) on delete cascade,
  source_user_id uuid not null references auth.users(id) on delete cascade,
  beneficiary_user_id uuid not null references auth.users(id) on delete cascade,
  level integer not null,
  rate numeric not null,
  gross_amount numeric not null,
  admin_fee_amount numeric not null,
  net_amount numeric not null,
  status public.commission_status not null default 'ACCRUED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint commission_ledger_level_chk check (level >= 1 and level <= 6),
  constraint commission_ledger_rate_chk check (rate >= 0 and rate <= 1)
);

create index if not exists commission_ledger_beneficiary_idx on public.commission_ledger (beneficiary_user_id);
create index if not exists commission_ledger_source_idx on public.commission_ledger (source_id);

create trigger commission_ledger_set_updated_at
before update on public.commission_ledger
for each row execute function public.set_updated_at();

alter table public.commission_ledger enable row level security;

create policy "Users can view their own commissions" on public.commission_ledger
  for select using (auth.uid() = beneficiary_user_id or auth.uid() = source_user_id or public.is_staff());

create policy "Staff can manage commissions" on public.commission_ledger
  for all using (public.is_staff()) with check (public.is_staff());

create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payout_type text not null,
  gross_amount numeric not null,
  fees_amount numeric not null default 0,
  net_amount numeric not null,
  status public.payout_status not null default 'DUE',
  due_at timestamptz,
  paid_at timestamptz,
  reference_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payouts_user_idx on public.payouts (user_id);
create index if not exists payouts_status_idx on public.payouts (status);

create trigger payouts_set_updated_at
before update on public.payouts
for each row execute function public.set_updated_at();

alter table public.payouts enable row level security;

create policy "Users can view their own payouts" on public.payouts
  for select using (auth.uid() = user_id or public.is_staff());

create policy "Staff can manage payouts" on public.payouts
  for all using (public.is_staff()) with check (public.is_staff());

create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  txn_type text not null,
  amount numeric not null,
  direction text not null,
  source_type text,
  source_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists wallet_transactions_user_idx on public.wallet_transactions (user_id);

alter table public.wallet_transactions enable row level security;

create policy "Users can view their own wallet txns" on public.wallet_transactions
  for select using (auth.uid() = user_id or public.is_staff());

create policy "Staff can insert wallet txns" on public.wallet_transactions
  for insert with check (public.is_staff());

create table if not exists public.kyc_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type text not null,
  document_url text not null,
  document_hash text,
  verification_status public.kyc_status not null default 'PENDING',
  verified_by uuid references auth.users(id) on delete set null,
  verified_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kyc_documents_user_idx on public.kyc_documents (user_id);

create trigger kyc_documents_set_updated_at
before update on public.kyc_documents
for each row execute function public.set_updated_at();

alter table public.kyc_documents enable row level security;

create policy "Users can view their own kyc documents" on public.kyc_documents
  for select using (auth.uid() = user_id or public.is_staff());

create policy "Users can insert their own kyc documents" on public.kyc_documents
  for insert with check (auth.uid() = user_id or public.is_staff());

create policy "Staff can update kyc documents" on public.kyc_documents
  for update using (public.is_staff()) with check (public.is_staff());

create table if not exists public.otp_storage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  otp_type text not null,
  otp_hash text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0,
  max_attempts integer not null default 3,
  verified boolean not null default false,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists otp_storage_user_idx on public.otp_storage (user_id);
create index if not exists otp_storage_expires_idx on public.otp_storage (expires_at);

alter table public.otp_storage enable row level security;

create policy "Users can manage their own otp records" on public.otp_storage
  for all using (auth.uid() = user_id or public.is_staff()) with check (auth.uid() = user_id or public.is_staff());

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id uuid,
  metadata jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_user_idx on public.audit_logs (user_id);
create index if not exists audit_logs_created_idx on public.audit_logs (created_at);

alter table public.audit_logs enable row level security;

create policy "Staff can view audit logs" on public.audit_logs
  for select using (public.is_staff());

create policy "Authenticated can insert audit logs" on public.audit_logs
  for insert with check (auth.uid() is not null);

create table if not exists public.webhook_event_queue (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  payload jsonb not null,
  status public.webhook_event_status not null default 'QUEUED',
  retry_count integer not null default 0,
  next_retry_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists webhook_event_queue_status_idx on public.webhook_event_queue (status);
create index if not exists webhook_event_queue_type_idx on public.webhook_event_queue (event_type);

create trigger webhook_event_queue_set_updated_at
before update on public.webhook_event_queue
for each row execute function public.set_updated_at();

alter table public.webhook_event_queue enable row level security;

create policy "Staff can manage webhook queue" on public.webhook_event_queue
  for all using (public.is_staff()) with check (public.is_staff());

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vendor_status public.vendor_status not null default 'PENDING',
  revenue_share numeric not null default 0.85,
  platform_fee numeric not null default 0.15,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vendors_user_unique unique (user_id)
);

create trigger vendors_set_updated_at
before update on public.vendors
for each row execute function public.set_updated_at();

alter table public.vendors enable row level security;

create policy "Vendors can view their own vendor record" on public.vendors
  for select using (auth.uid() = user_id or public.is_staff());

create policy "Staff can manage vendors" on public.vendors
  for all using (public.is_staff()) with check (public.is_staff());

create table if not exists public.vendor_products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  product_name text not null,
  status text not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vendor_products_vendor_idx on public.vendor_products (vendor_id);

create trigger vendor_products_set_updated_at
before update on public.vendor_products
for each row execute function public.set_updated_at();

alter table public.vendor_products enable row level security;

create policy "Vendors can manage their own products" on public.vendor_products
  for all using (
    exists(select 1 from public.vendors v where v.id = vendor_id and v.user_id = auth.uid())
    or public.is_staff()
  )
  with check (
    exists(select 1 from public.vendors v where v.id = vendor_id and v.user_id = auth.uid())
    or public.is_staff()
  );

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  status public.order_status not null default 'PENDING',
  total_amount numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

alter table public.orders enable row level security;

create policy "Order visibility for involved parties" on public.orders
  for select using (
    auth.uid() = user_id
    or exists(select 1 from public.vendors v where v.id = vendor_id and v.user_id = auth.uid())
    or public.is_staff()
  );

create policy "Staff can manage orders" on public.orders
  for all using (public.is_staff()) with check (public.is_staff());

create table if not exists public.returns (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  vendor_id uuid references public.vendors(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  status public.return_status not null default 'REQUESTED',
  amount numeric not null default 0,
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger returns_set_updated_at
before update on public.returns
for each row execute function public.set_updated_at();

alter table public.returns enable row level security;

create policy "Return visibility for involved parties" on public.returns
  for select using (
    auth.uid() = user_id
    or exists(select 1 from public.vendors v where v.id = vendor_id and v.user_id = auth.uid())
    or public.is_staff()
  );

create policy "Staff can manage returns" on public.returns
  for all using (public.is_staff()) with check (public.is_staff());

create table if not exists public.settlements (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors(id) on delete set null,
  amount numeric not null default 0,
  status text not null default 'PENDING',
  period_start date,
  period_end date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger settlements_set_updated_at
before update on public.settlements
for each row execute function public.set_updated_at();

alter table public.settlements enable row level security;

create policy "Settlement visibility for vendor or staff" on public.settlements
  for select using (
    exists(select 1 from public.vendors v where v.id = vendor_id and v.user_id = auth.uid())
    or public.is_staff()
  );

create policy "Staff can manage settlements" on public.settlements
  for all using (public.is_staff()) with check (public.is_staff());

create table if not exists public.phonepe_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  merchant_transaction_id text not null,
  transaction_type text not null default 'PAYMENT',
  amount numeric not null default 0,
  status text not null default 'INITIATED',
  payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint phonepe_transactions_merchant_txn_unique unique (merchant_transaction_id)
);

create trigger phonepe_transactions_set_updated_at
before update on public.phonepe_transactions
for each row execute function public.set_updated_at();

alter table public.phonepe_transactions enable row level security;

create policy "Users can view their own PhonePe txns" on public.phonepe_transactions
  for select using (auth.uid() = user_id or public.is_staff());

create policy "Staff can manage PhonePe txns" on public.phonepe_transactions
  for all using (public.is_staff()) with check (public.is_staff());

create table if not exists public.active_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  device_id text not null,
  device_fingerprint text not null,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index if not exists active_sessions_user_idx on public.active_sessions (user_id);

alter table public.active_sessions enable row level security;

create policy "Users can view their own sessions" on public.active_sessions
  for select using (auth.uid() = user_id or public.is_staff());

create policy "Users can manage their own sessions" on public.active_sessions
  for all using (auth.uid() = user_id or public.is_staff()) with check (auth.uid() = user_id or public.is_staff());

create table if not exists public.trusted_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  device_name text,
  device_id text not null,
  device_fingerprint text not null,
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists trusted_devices_user_idx on public.trusted_devices (user_id);

alter table public.trusted_devices enable row level security;

create policy "Users can view their own trusted devices" on public.trusted_devices
  for select using (auth.uid() = user_id or public.is_staff());

create policy "Users can manage their own trusted devices" on public.trusted_devices
  for all using (auth.uid() = user_id or public.is_staff()) with check (auth.uid() = user_id or public.is_staff());

create or replace function public.process_daily_payouts()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  return jsonb_build_object('ok', true, 'note', 'Schema-ready. Business logic executed by DrapCode workflows per Excel.');
end;
$$;