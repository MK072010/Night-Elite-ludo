-- OPTIONAL: only run if your project has no admin broadcast table yet.
-- Customers can only READ active, unexpired rows. Admins insert/update via
-- the Supabase dashboard or the service role (no customer write policy exists).
create table if not exists public.announcements(
  id uuid primary key default gen_random_uuid(),
  message text not null check (char_length(message) between 1 and 500),
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.announcements enable row level security;
create policy "read active announcements" on public.announcements
  for select to authenticated
  using (active and (expires_at is null or expires_at > now()));
