create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  role text not null default 'farmer',
  country text check (country is null or country in ('Bénin', 'Côte d''Ivoire', 'Cameroun', 'Sénégal')),
  trial_used boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.exploitations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  country text not null check (country in ('Bénin', 'Côte d''Ivoire', 'Cameroun', 'Sénégal')),
  city text not null,
  latitude double precision,
  longitude double precision,
  surface_hectares numeric(12, 2) not null default 0 check (surface_hectares >= 0),
  main_crops text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cultures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exploitation_id uuid not null references public.exploitations(id) on delete cascade,
  name text not null,
  variety text,
  surface_hectares numeric(12, 2) not null default 0 check (surface_hectares >= 0),
  planting_date date,
  status text not null default 'planned',
  expected_yield_kg numeric(14, 2) check (expected_yield_kg is null or expected_yield_kg >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  quantity numeric(14, 2) not null default 0 check (quantity >= 0),
  unit text not null,
  min_threshold numeric(14, 2) not null default 0 check (min_threshold >= 0),
  unit_price_fcfa bigint not null default 0 check (unit_price_fcfa >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  amount_fcfa bigint not null check (amount_fcfa >= 0),
  category text not null,
  date date not null default current_date,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.store_products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text not null check (category in ('semences', 'engrais', 'phytosanitaire', 'matériel', 'produits')),
  price_fcfa bigint not null check (price_fcfa >= 0),
  available_quantity numeric(14, 2) not null default 0 check (available_quantity >= 0),
  unit text not null,
  location_city text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.market_prices (
  id uuid primary key default gen_random_uuid(),
  product_name text not null,
  market_name text not null,
  country text not null check (country in ('Bénin', 'Côte d''Ivoire', 'Cameroun', 'Sénégal')),
  price_fcfa bigint not null check (price_fcfa >= 0),
  unit text not null,
  recorded_at timestamptz not null default now()
);

create table if not exists public.abonnements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  plan text not null default 'FREE' check (plan in ('FREE', 'PRO', 'ENTREPRISE')),
  status text not null default 'active' check (status in ('active', 'trialing', 'expired', 'cancelled', 'past_due')),
  trial_start timestamptz,
  trial_end timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (trial_end is null or trial_start is not null)
);

create table if not exists public.ai_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  month_start date not null,
  message_count integer not null default 0 check (message_count >= 0),
  rewarded_bonus_messages integer not null default 0 check (rewarded_bonus_messages >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, month_start)
);

-- Complète les tables des anciennes installations sans perdre les données existantes.
alter table public.ai_usage
  add column if not exists rewarded_bonus_messages integer not null default 0;
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'ai_usage' and column_name = 'rewarded_messages'
  ) then
    execute 'update public.ai_usage set rewarded_bonus_messages = rewarded_messages where rewarded_bonus_messages = 0';
  end if;
end $$;

alter table public.transactions add column if not exists amount_fcfa bigint;
alter table public.transactions add column if not exists date date;
alter table public.transactions add column if not exists description text;
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'transactions' and column_name = 'amount'
  ) then
    execute 'update public.transactions set amount_fcfa = round(amount::numeric)::bigint where amount_fcfa is null';
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'transactions' and column_name = 'transaction_date'
  ) then
    execute 'update public.transactions set date = transaction_date::date where date is null';
  end if;
end $$;
update public.transactions set amount_fcfa = 0 where amount_fcfa is null;
update public.transactions set date = current_date where date is null;
alter table public.transactions alter column amount_fcfa set default 0;
alter table public.transactions alter column amount_fcfa set not null;
alter table public.transactions alter column date set default current_date;
alter table public.transactions alter column date set not null;

create index if not exists exploitations_user_id_idx on public.exploitations(user_id);
create index if not exists cultures_user_exploitation_idx on public.cultures(user_id, exploitation_id);
create index if not exists stocks_user_id_idx on public.stocks(user_id);
create index if not exists transactions_user_date_idx on public.transactions(user_id, date desc);
create index if not exists store_products_active_category_idx on public.store_products(is_active, category);
create index if not exists market_prices_country_product_idx on public.market_prices(country, product_name);
create index if not exists ai_usage_month_start_idx on public.ai_usage(month_start);

alter table public.profiles enable row level security;
alter table public.exploitations enable row level security;
alter table public.cultures enable row level security;
alter table public.stocks enable row level security;
alter table public.transactions enable row level security;
alter table public.store_products enable row level security;
alter table public.market_prices enable row level security;
alter table public.abonnements enable row level security;
alter table public.ai_usage enable row level security;

drop policy if exists "profiles_owner_all" on public.profiles;
drop policy if exists "profiles_select_owner" on public.profiles;
drop policy if exists "profiles_update_owner" on public.profiles;
create policy "profiles_select_owner" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_owner" on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);
revoke insert, update on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone, country) on public.profiles to authenticated;
drop policy if exists "exploitations_owner_all" on public.exploitations;
create policy "exploitations_owner_all" on public.exploitations for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "cultures_owner_all" on public.cultures;
create policy "cultures_owner_all" on public.cultures for all
  using (auth.uid() = user_id and exists (
    select 1 from public.exploitations e where e.id = exploitation_id and e.user_id = auth.uid()
  ))
  with check (auth.uid() = user_id and exists (
    select 1 from public.exploitations e where e.id = exploitation_id and e.user_id = auth.uid()
  ));
drop policy if exists "stocks_owner_all" on public.stocks;
create policy "stocks_owner_all" on public.stocks for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "transactions_owner_all" on public.transactions;
create policy "transactions_owner_all" on public.transactions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "store_products_public_read" on public.store_products;
create policy "store_products_public_read" on public.store_products for select
  using (is_active or auth.uid() = seller_id);
drop policy if exists "store_products_seller_insert" on public.store_products;
create policy "store_products_seller_insert" on public.store_products for insert
  with check (auth.uid() = seller_id);
drop policy if exists "store_products_seller_update" on public.store_products;
create policy "store_products_seller_update" on public.store_products for update
  using (auth.uid() = seller_id) with check (auth.uid() = seller_id);
drop policy if exists "store_products_seller_delete" on public.store_products;
create policy "store_products_seller_delete" on public.store_products for delete
  using (auth.uid() = seller_id);
drop policy if exists "market_prices_public_read" on public.market_prices;
create policy "market_prices_public_read" on public.market_prices for select using (true);
drop policy if exists "abonnements_owner_all" on public.abonnements;
drop policy if exists "abonnements_select_owner" on public.abonnements;
create policy "abonnements_select_owner" on public.abonnements for select using (auth.uid() = user_id);
drop policy if exists "ai_usage_owner_all" on public.ai_usage;
drop policy if exists "Users can insert their own AI usage" on public.ai_usage;
drop policy if exists "Users can update their own AI usage" on public.ai_usage;
drop policy if exists "Users can insert their own ai_usage" on public.ai_usage;
drop policy if exists "Users can update their own ai_usage" on public.ai_usage;
drop policy if exists "ai_usage_insert_own" on public.ai_usage;
drop policy if exists "ai_usage_update_own" on public.ai_usage;
drop policy if exists "ai_usage_select_owner" on public.ai_usage;
create policy "ai_usage_select_owner" on public.ai_usage for select using (auth.uid() = user_id);

create or replace function public.start_free_trial_v1()
returns public.abonnements
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_email text;
  v_trial_used boolean;
  v_existing public.abonnements%rowtype;
  v_subscription public.abonnements%rowtype;
  v_now timestamptz := now();
begin
  if v_user_id is null then
    raise exception 'Authentification requise.' using errcode = '28000';
  end if;

  select email into v_email from auth.users where id = v_user_id;
  insert into public.profiles (id, email)
  values (v_user_id, coalesce(v_email, ''))
  on conflict (id) do nothing;

  select trial_used into v_trial_used
  from public.profiles where id = v_user_id for update;
  if v_trial_used then
    raise exception 'L''essai gratuit a déjà été utilisé.' using errcode = 'P0001';
  end if;

  select * into v_existing
  from public.abonnements where user_id = v_user_id for update;
  if found and v_existing.plan <> 'FREE' then
    raise exception 'Un abonnement payant existe déjà pour ce compte.' using errcode = 'P0001';
  end if;

  update public.profiles set trial_used = true, updated_at = v_now where id = v_user_id;
  insert into public.abonnements (user_id, plan, status, trial_start, trial_end, expires_at, updated_at)
  values (v_user_id, 'PRO', 'trialing', v_now, v_now + interval '7 days', v_now + interval '7 days', v_now)
  on conflict (user_id) do update set
    plan = excluded.plan,
    status = excluded.status,
    trial_start = excluded.trial_start,
    trial_end = excluded.trial_end,
    expires_at = excluded.expires_at,
    updated_at = excluded.updated_at
  returning * into v_subscription;
  return v_subscription;
end;
$$;

create or replace function public.consume_ai_message_v1()
returns public.ai_usage
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_month_start date := date_trunc('month', now() at time zone 'utc')::date;
  v_plan text := 'FREE';
  v_quota integer := 5;
  v_usage public.ai_usage%rowtype;
begin
  if v_user_id is null then
    raise exception 'Authentification requise.' using errcode = '28000';
  end if;

  select plan into v_plan from public.abonnements
  where user_id = v_user_id
    and status in ('active', 'trialing')
    and (expires_at is null or expires_at > now())
    and (status <> 'trialing' or trial_end > now());

  v_quota := case v_plan
    when 'PRO' then 50
    when 'ENTREPRISE' then 500
    else 5
  end;

  insert into public.ai_usage (user_id, month_start)
  values (v_user_id, v_month_start)
  on conflict (user_id, month_start) do nothing;

  select * into v_usage from public.ai_usage
  where user_id = v_user_id and month_start = v_month_start for update;

  if v_usage.message_count < v_quota then
    update public.ai_usage set message_count = message_count + 1, updated_at = now()
    where user_id = v_user_id and month_start = v_month_start returning * into v_usage;
  elsif v_usage.rewarded_bonus_messages > 0 then
    update public.ai_usage set rewarded_bonus_messages = rewarded_bonus_messages - 1, updated_at = now()
    where user_id = v_user_id and month_start = v_month_start returning * into v_usage;
  else
    raise exception 'Quota mensuel de messages IA épuisé.' using errcode = 'P0001';
  end if;

  return v_usage;
end;
$$;

create or replace function public.credit_ai_bonus_message_v1(p_user_id uuid, p_amount integer default 1)
returns public.ai_usage
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_month_start date := date_trunc('month', now() at time zone 'utc')::date;
  v_usage public.ai_usage%rowtype;
begin
  if p_user_id is null or p_amount < 1 or p_amount > 100 then
    raise exception 'Crédit bonus invalide.' using errcode = '22023';
  end if;

  insert into public.ai_usage (user_id, month_start, rewarded_bonus_messages)
  values (p_user_id, v_month_start, p_amount)
  on conflict (user_id, month_start) do update set
    rewarded_bonus_messages = public.ai_usage.rewarded_bonus_messages + excluded.rewarded_bonus_messages,
    updated_at = now()
  returning * into v_usage;
  return v_usage;
end;
$$;

revoke all on function public.start_free_trial_v1() from public, anon;
grant execute on function public.start_free_trial_v1() to authenticated;
revoke all on function public.consume_ai_message_v1() from public, anon;
grant execute on function public.consume_ai_message_v1() to authenticated;
revoke all on function public.credit_ai_bonus_message_v1(uuid, integer) from public, anon, authenticated;
grant execute on function public.credit_ai_bonus_message_v1(uuid, integer) to service_role;