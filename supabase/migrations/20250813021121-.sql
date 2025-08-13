-- Enable UUID generation
create extension if not exists pgcrypto;

-- Update updated_at helper
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Family members table
create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  age int,
  adventurousness text not null,
  dietary_restrictions text[] not null default '{}',
  allergies text[] not null default '{}',
  preferences text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Family-wide preferences table
create table if not exists public.family_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  favorite_cuisines text[] not null default '{}',
  cooking_equipment text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.family_members enable row level security;
alter table public.family_preferences enable row level security;

-- Policies for family_members
drop policy if exists "Users can view their own family members" on public.family_members;
create policy "Users can view their own family members"
  on public.family_members for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own family members" on public.family_members;
create policy "Users can insert their own family members"
  on public.family_members for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own family members" on public.family_members;
create policy "Users can update their own family members"
  on public.family_members for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own family members" on public.family_members;
create policy "Users can delete their own family members"
  on public.family_members for delete
  using (auth.uid() = user_id);

-- Policies for family_preferences
drop policy if exists "Users can view their family preferences" on public.family_preferences;
create policy "Users can view their family preferences"
  on public.family_preferences for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their family preferences" on public.family_preferences;
create policy "Users can insert their family preferences"
  on public.family_preferences for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their family preferences" on public.family_preferences;
create policy "Users can update their family preferences"
  on public.family_preferences for update
  using (auth.uid() = user_id);

-- Triggers for updated_at
drop trigger if exists trg_family_members_updated_at on public.family_members;
create trigger trg_family_members_updated_at
  before update on public.family_members
  for each row execute function public.update_updated_at_column();

drop trigger if exists trg_family_preferences_updated_at on public.family_preferences;
create trigger trg_family_preferences_updated_at
  before update on public.family_preferences
  for each row execute function public.update_updated_at_column();

-- Realtime setup
alter table public.family_members replica identity full;
alter table public.family_preferences replica identity full;

do $$
begin
  begin
    alter publication supabase_realtime add table public.family_members;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.family_preferences;
  exception when duplicate_object then null;
  end;
end $$;