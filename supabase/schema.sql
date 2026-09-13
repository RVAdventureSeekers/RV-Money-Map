-- Run this once in your Supabase project's SQL Editor
-- (Dashboard > SQL Editor > New query > paste this whole file > Run)

-- Profiles: one row per user, tracks subscription status
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_pro boolean not null default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now()
);

-- Goals: the debt-payoff target a user is tracking
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_amount numeric(12, 2) not null,
  start_date date not null,
  end_date date not null,
  created_at timestamptz not null default now()
);

-- Entries: individual income or expense line items tied to a goal
create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid not null references goals(id) on delete cascade,
  entry_type text not null check (entry_type in ('income', 'expense')),
  label text not null,
  amount numeric(12, 2) not null,
  entry_date date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists entries_user_goal_idx on entries (user_id, goal_id);

-- Row Level Security: every user can only ever see and modify their own rows
alter table profiles enable row level security;
alter table goals enable row level security;
alter table entries enable row level security;

create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "Users can manage own goals" on goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own entries" on entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Automatically create a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
