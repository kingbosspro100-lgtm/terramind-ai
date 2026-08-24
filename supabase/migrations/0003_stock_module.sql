-- Phase 3: Stock Module Schema (Inventory, Movements, Suppliers)

-- 1. Suppliers (Fournisseurs)
create table public.suppliers (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    contact_person text,
    phone text,
    email text,
    address text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Inventory Items (Articles en stock)
create table public.inventory_items (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    category text not null, -- engrais, semences, phytosanitaire, recolte, materiel
    quantity numeric default 0,
    unit text not null, -- kg, L, unites, sacs, tonnes
    min_threshold numeric default 0,
    barcode text,
    location text, -- entrepot, silo
    supplier_id uuid references public.suppliers(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Stock Movements (Mouvements de stock)
create table public.stock_movements (
    id uuid default uuid_generate_v4() primary key,
    item_id uuid references public.inventory_items(id) on delete cascade not null,
    movement_type text not null, -- in, out, adjustment
    quantity numeric not null,
    movement_date timestamp with time zone default timezone('utc'::text, now()) not null,
    reason text,
    reference_doc text, -- numero de facture, numero de bon de commande
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.suppliers enable row level security;
alter table public.inventory_items enable row level security;
alter table public.stock_movements enable row level security;

-- RLS Policies for Suppliers
create policy "Users can view their own suppliers" on public.suppliers
    for select using (auth.uid() = user_id);
create policy "Users can insert their own suppliers" on public.suppliers
    for insert with check (auth.uid() = user_id);
create policy "Users can update their own suppliers" on public.suppliers
    for update using (auth.uid() = user_id);
create policy "Users can delete their own suppliers" on public.suppliers
    for delete using (auth.uid() = user_id);

-- RLS Policies for Inventory Items
create policy "Users can view their own inventory items" on public.inventory_items
    for select using (auth.uid() = user_id);
create policy "Users can insert their own inventory items" on public.inventory_items
    for insert with check (auth.uid() = user_id);
create policy "Users can update their own inventory items" on public.inventory_items
    for update using (auth.uid() = user_id);
create policy "Users can delete their own inventory items" on public.inventory_items
    for delete using (auth.uid() = user_id);

-- RLS Policies for Stock Movements
create policy "Users can view movements of their items" on public.stock_movements
    for select using (item_id in (select id from public.inventory_items where user_id = auth.uid()));
create policy "Users can insert movements to their items" on public.stock_movements
    for insert with check (item_id in (select id from public.inventory_items where user_id = auth.uid()));
create policy "Users can update movements of their items" on public.stock_movements
    for update using (item_id in (select id from public.inventory_items where user_id = auth.uid()));
create policy "Users can delete movements of their items" on public.stock_movements
    for delete using (item_id in (select id from public.inventory_items where user_id = auth.uid()));
