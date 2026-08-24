-- Phase 2: Core ERP Schema (Farms, Plots, Crops, Harvests)

-- 1. Farms (Exploitations)
create table public.farms (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    location text,
    gps_coordinates text, -- format: "lat,long"
    area_hectares numeric default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Plots (Parcelles)
create table public.plots (
    id uuid default uuid_generate_v4() primary key,
    farm_id uuid references public.farms(id) on delete cascade not null,
    name text not null,
    area_hectares numeric default 0,
    soil_type text,
    status text default 'active', -- active, resting, preparation
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Crops (Cultures)
create table public.crops (
    id uuid default uuid_generate_v4() primary key,
    plot_id uuid references public.plots(id) on delete cascade not null,
    name text not null,
    variety text,
    planting_date date not null,
    expected_harvest_date date,
    status text default 'growing', -- growing, harvested, failed, planned
    estimated_yield_kg numeric,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Harvests (Récoltes)
create table public.harvests (
    id uuid default uuid_generate_v4() primary key,
    crop_id uuid references public.crops(id) on delete cascade not null,
    harvest_date date not null,
    quantity_kg numeric not null,
    quality_grade text, -- A, B, C, Reject
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.farms enable row level security;
alter table public.plots enable row level security;
alter table public.crops enable row level security;
alter table public.harvests enable row level security;

-- RLS Policies for Farms
create policy "Users can view their own farms" on public.farms
    for select using (auth.uid() = user_id);
create policy "Users can insert their own farms" on public.farms
    for insert with check (auth.uid() = user_id);
create policy "Users can update their own farms" on public.farms
    for update using (auth.uid() = user_id);
create policy "Users can delete their own farms" on public.farms
    for delete using (auth.uid() = user_id);

-- RLS Policies for Plots
create policy "Users can view plots of their farms" on public.plots
    for select using (farm_id in (select id from public.farms where user_id = auth.uid()));
create policy "Users can insert plots to their farms" on public.plots
    for insert with check (farm_id in (select id from public.farms where user_id = auth.uid()));
create policy "Users can update plots of their farms" on public.plots
    for update using (farm_id in (select id from public.farms where user_id = auth.uid()));
create policy "Users can delete plots of their farms" on public.plots
    for delete using (farm_id in (select id from public.farms where user_id = auth.uid()));

-- RLS Policies for Crops
create policy "Users can view crops in their plots" on public.crops
    for select using (plot_id in (select id from public.plots where farm_id in (select id from public.farms where user_id = auth.uid())));
create policy "Users can insert crops to their plots" on public.crops
    for insert with check (plot_id in (select id from public.plots where farm_id in (select id from public.farms where user_id = auth.uid())));
create policy "Users can update crops in their plots" on public.crops
    for update using (plot_id in (select id from public.plots where farm_id in (select id from public.farms where user_id = auth.uid())));
create policy "Users can delete crops in their plots" on public.crops
    for delete using (plot_id in (select id from public.plots where farm_id in (select id from public.farms where user_id = auth.uid())));

-- RLS Policies for Harvests
create policy "Users can view harvests of their crops" on public.harvests
    for select using (crop_id in (select id from public.crops where plot_id in (select id from public.plots where farm_id in (select id from public.farms where user_id = auth.uid()))));
create policy "Users can insert harvests to their crops" on public.harvests
    for insert with check (crop_id in (select id from public.crops where plot_id in (select id from public.plots where farm_id in (select id from public.farms where user_id = auth.uid()))));
create policy "Users can update harvests of their crops" on public.harvests
    for update using (crop_id in (select id from public.crops where plot_id in (select id from public.plots where farm_id in (select id from public.farms where user_id = auth.uid()))));
create policy "Users can delete harvests of their crops" on public.harvests
    for delete using (crop_id in (select id from public.crops where plot_id in (select id from public.plots where farm_id in (select id from public.farms where user_id = auth.uid()))));
