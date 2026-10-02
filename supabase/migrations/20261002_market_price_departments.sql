alter table public.market_prices
  add column if not exists department text;

create index if not exists market_prices_country_department_product_idx
  on public.market_prices (country, department, product_name);
