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

alter table public.abonnements enable row level security;
alter table public.ai_usage enable row level security;

drop policy if exists "abonnements_owner_all" on public.abonnements;
drop policy if exists "abonnements_select_owner" on public.abonnements;
create policy "abonnements_select_owner" on public.abonnements
  for select using (auth.uid() = user_id);

drop policy if exists "ai_usage_owner_all" on public.ai_usage;
drop policy if exists "Users can insert their own AI usage" on public.ai_usage;
drop policy if exists "Users can update their own AI usage" on public.ai_usage;
drop policy if exists "Users can insert their own ai_usage" on public.ai_usage;
drop policy if exists "Users can update their own ai_usage" on public.ai_usage;
drop policy if exists "ai_usage_insert_own" on public.ai_usage;
drop policy if exists "ai_usage_update_own" on public.ai_usage;
drop policy if exists "ai_usage_select_owner" on public.ai_usage;
create policy "ai_usage_select_owner" on public.ai_usage
  for select using (auth.uid() = user_id);

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

revoke all on function public.consume_ai_message_v1() from public, anon;
grant execute on function public.consume_ai_message_v1() to authenticated;