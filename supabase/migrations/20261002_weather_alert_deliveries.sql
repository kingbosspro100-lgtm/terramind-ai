create table if not exists public.weather_alert_deliveries (
  id uuid primary key default gen_random_uuid(),
  farm_source text not null check (farm_source in ('exploitations')),
  farm_id uuid not null,
  alert_date date not null,
  alert_signature text not null,
  sent_at timestamptz not null default now(),
  unique (farm_source, farm_id, alert_date, alert_signature)
);

create index if not exists weather_alert_deliveries_sent_at_idx
  on public.weather_alert_deliveries (sent_at desc);

alter table public.weather_alert_deliveries enable row level security;
revoke all on public.weather_alert_deliveries from public, anon, authenticated;
grant all on public.weather_alert_deliveries to service_role;
