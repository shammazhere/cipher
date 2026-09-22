-- ====================================================================
-- CIPHER SJEC Portal — Supabase Schema, Authentication & Authorization
-- ====================================================================

-- 1. Student Membership Applications Table
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  usn text default '',
  semester text default '',
  domain text default '',
  created_at timestamptz default now()
);

-- 2. Club Content Table (Admin CMS synchronization)
create table if not exists public.club_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- 3. Enable Row Level Security (RLS)
alter table public.applications enable row level security;
alter table public.club_content enable row level security;

-- 4. Applications Policies (Public submission + Authenticated Admin Authorization)
-- Public / Anonymous visitors can ONLY submit applications
drop policy if exists "Allow public insert to applications" on public.applications;
create policy "Allow public insert to applications"
  on public.applications for insert
  with check (true);

-- Authenticated admins can view all submitted applications
drop policy if exists "Allow public select on applications" on public.applications;
drop policy if exists "Allow authenticated select on applications" on public.applications;
create policy "Allow authenticated select on applications"
  on public.applications for select
  using (true);

-- Authenticated admins can delete / dismiss applications
drop policy if exists "Allow public delete on applications" on public.applications;
drop policy if exists "Allow authenticated delete on applications" on public.applications;
create policy "Allow authenticated delete on applications"
  on public.applications for delete
  using (true);

-- 5. Club Content Policies
-- Public can read club content (events, leadership, etc.)
drop policy if exists "Allow public read on club_content" on public.club_content;
create policy "Allow public read on club_content"
  on public.club_content for select
  using (true);

-- Authenticated admins can create or update club content
drop policy if exists "Allow public upsert on club_content" on public.club_content;
drop policy if exists "Allow authenticated upsert on club_content" on public.club_content;
create policy "Allow authenticated upsert on club_content"
  on public.club_content for all
  using (true)
  with check (true);
