-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Create roles table
create table public.roles (
    id uuid default uuid_generate_v4() primary key,
    name text not null unique,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create default roles
insert into public.roles (name, description) values
    ('Admin', 'Administrator with full access'),
    ('Farmer', 'Farm owner/manager'),
    ('Worker', 'Farm worker with limited access');

-- Create users_profile table
create table public.users_profile (
    id uuid references auth.users(id) on delete cascade primary key,
    role_id uuid references public.roles(id),
    full_name text,
    avatar_url text,
    phone text,
    company_name text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.roles enable row level security;
alter table public.users_profile enable row level security;

-- RLS Policies for roles (Everyone can read)
create policy "Roles are viewable by everyone" on public.roles
    for select using (true);

-- RLS Policies for users_profile
create policy "Users can view their own profile" on public.users_profile
    for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.users_profile
    for update using (auth.uid() = id);

-- Function to handle new user registration
create or replace function public.handle_new_user()
returns trigger as $$
declare
    farmer_role_id uuid;
begin
    -- Get the Farmer role id
    select id into farmer_role_id from public.roles where name = 'Farmer' limit 1;

    insert into public.users_profile (id, full_name, role_id)
    values (new.id, new.raw_user_meta_data->>'full_name', farmer_role_id);
    return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
