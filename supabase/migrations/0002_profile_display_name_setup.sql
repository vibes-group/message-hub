alter table public.profiles
add column if not exists display_name_set_at timestamptz;

create index if not exists profiles_display_name_lower_idx
on public.profiles (lower(display_name))
where display_name_set_at is not null;
