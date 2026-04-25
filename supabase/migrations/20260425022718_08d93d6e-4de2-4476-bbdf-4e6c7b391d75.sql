-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles readable by all"
  on public.profiles for select
  using (true);

create policy "users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- products (digital downloads)
create table public.products (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text not null default 'asset',
  price_cents integer not null default 0,
  image_url text,
  download_url text,
  created_at timestamptz not null default now()
);
alter table public.products enable row level security;

create policy "products readable by all"
  on public.products for select using (true);

create policy "owners insert products"
  on public.products for insert
  with check (auth.uid() = owner_id);

create policy "owners update own products"
  on public.products for update
  using (auth.uid() = owner_id);

create policy "owners delete own products"
  on public.products for delete
  using (auth.uid() = owner_id);

-- community_messages
create table public.community_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);
alter table public.community_messages enable row level security;

create policy "messages readable by all"
  on public.community_messages for select using (true);

create policy "auth users post own messages"
  on public.community_messages for insert
  with check (auth.uid() = user_id);

create policy "users delete own messages"
  on public.community_messages for delete
  using (auth.uid() = user_id);

-- realtime for chat
alter publication supabase_realtime add table public.community_messages;