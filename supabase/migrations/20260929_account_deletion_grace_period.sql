create table if not exists public.account_deletion_requests (
  user_id uuid primary key references auth.users(id) on delete cascade,
  requested_at timestamptz not null default now(),
  scheduled_for timestamptz not null
);

create index if not exists account_deletion_requests_scheduled_for_idx
  on public.account_deletion_requests (scheduled_for);

alter table public.account_deletion_requests enable row level security;

revoke all on public.account_deletion_requests from anon, authenticated;
grant select on public.account_deletion_requests to authenticated;
grant all on public.account_deletion_requests to service_role;

drop policy if exists "account_deletion_requests_select_own"
  on public.account_deletion_requests;
create policy "account_deletion_requests_select_own"
  on public.account_deletion_requests
  for select
  to authenticated
  using (auth.uid() = user_id);