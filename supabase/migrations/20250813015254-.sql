-- Enable required extensions
create extension if not exists pgcrypto;

-- Timestamp update trigger function
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- family_members table
create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  age int,
  dietary_restrictions text[],
  allergies text[],
  adventurousness_level text,
  other_preferences text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- family_preferences table (1:1 per user)
create table if not exists public.family_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  preferred_cuisines text[],
  cooking_apparatus text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- meals table
create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  cuisine_type text,
  complexity_level text,
  prep_time int,
  cook_time int,
  servings int,
  can_prepare_ahead boolean not null default false,
  ingredients jsonb[],
  instructions text[],
  tags text[],
  equipment_needed text[],
  is_favorite boolean not null default false,
  feedback_rating int,
  feedback_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- meal_plans table
create table if not exists public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  date date not null,
  meal_id uuid not null,
  family_member_ids text[],
  meal_type text not null default 'dinner',
  is_skipped boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.family_members enable row level security;
alter table public.family_preferences enable row level security;
alter table public.meals enable row level security;
alter table public.meal_plans enable row level security;

-- RLS Policies: Users can only access their own rows
-- family_members
create policy if not exists "family_members_select_own"
  on public.family_members for select
  to authenticated
  using (auth.uid() = user_id);

create policy if not exists "family_members_insert_own"
  on public.family_members for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy if not exists "family_members_update_own"
  on public.family_members for update
  to authenticated
  using (auth.uid() = user_id);

create policy if not exists "family_members_delete_own"
  on public.family_members for delete
  to authenticated
  using (auth.uid() = user_id);

-- family_preferences
create policy if not exists "family_preferences_select_own"
  on public.family_preferences for select
  to authenticated
  using (auth.uid() = user_id);

create policy if not exists "family_preferences_insert_own"
  on public.family_preferences for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy if not exists "family_preferences_update_own"
  on public.family_preferences for update
  to authenticated
  using (auth.uid() = user_id);

create policy if not exists "family_preferences_delete_own"
  on public.family_preferences for delete
  to authenticated
  using (auth.uid() = user_id);

-- meals
create policy if not exists "meals_select_own"
  on public.meals for select
  to authenticated
  using (auth.uid() = user_id);

create policy if not exists "meals_insert_own"
  on public.meals for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy if not exists "meals_update_own"
  on public.meals for update
  to authenticated
  using (auth.uid() = user_id);

create policy if not exists "meals_delete_own"
  on public.meals for delete
  to authenticated
  using (auth.uid() = user_id);

-- meal_plans
create policy if not exists "meal_plans_select_own"
  on public.meal_plans for select
  to authenticated
  using (auth.uid() = user_id);

create policy if not exists "meal_plans_insert_own"
  on public.meal_plans for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy if not exists "meal_plans_update_own"
  on public.meal_plans for update
  to authenticated
  using (auth.uid() = user_id);

create policy if not exists "meal_plans_delete_own"
  on public.meal_plans for delete
  to authenticated
  using (auth.uid() = user_id);

-- Indexes
create index if not exists idx_family_members_user_id on public.family_members(user_id);
create index if not exists idx_family_preferences_user_id on public.family_preferences(user_id);
create index if not exists idx_meals_user_id on public.meals(user_id);
create index if not exists idx_meal_plans_user_id on public.meal_plans(user_id);
create index if not exists idx_meal_plans_user_id_date on public.meal_plans(user_id, date);

-- Triggers to maintain updated_at
create or replace trigger trg_family_members_updated_at
  before update on public.family_members
  for each row execute function public.update_updated_at_column();

create or replace trigger trg_family_preferences_updated_at
  before update on public.family_preferences
  for each row execute function public.update_updated_at_column();

create or replace trigger trg_meals_updated_at
  before update on public.meals
  for each row execute function public.update_updated_at_column();

create or replace trigger trg_meal_plans_updated_at
  before update on public.meal_plans
  for each row execute function public.update_updated_at_column();

-- Realtime configuration
alter table public.family_members replica identity full;
alter table public.family_preferences replica identity full;
alter table public.meals replica identity full;
alter table public.meal_plans replica identity full;

alter publication supabase_realtime add table public.family_members;
alter publication supabase_realtime add table public.family_preferences;
alter publication supabase_realtime add table public.meals;
alter publication supabase_realtime add table public.meal_plans;

-- Storage: public bucket for recipe images
insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true)
on conflict (id) do nothing;

-- Storage policies for 'recipe-images'
create policy if not exists "Public can view recipe-images"
  on storage.objects for select
  using (bucket_id = 'recipe-images');

create policy if not exists "Users can upload to their folder in recipe-images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'recipe-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy if not exists "Users can update their own recipe-images"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'recipe-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'recipe-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy if not exists "Users can delete their own recipe-images"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'recipe-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
