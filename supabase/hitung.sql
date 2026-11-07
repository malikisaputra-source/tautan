-- Penghitung unduhan & kunjungan Maliki Studio (/kode)
-- Jalankan sekali di Supabase: SQL Editor > New query > tempel > Run.
create table if not exists public.hitungan (
  id bigserial primary key,
  slug text not null check (char_length(slug) between 1 and 60),
  jenis text not null check (jenis in ('zip','skill','lihat','follow_tt','follow_ig')),
  waktu timestamptz not null default now()
);
create index if not exists hitungan_slug_jenis on public.hitungan (slug, jenis);
alter table public.hitungan enable row level security;  -- tanpa policy: tabel tidak bisa dibaca/ditulis langsung
revoke all on public.hitungan from anon, authenticated;

-- catat satu kejadian (dipanggil dari browser dengan anon key)
create or replace function public.catat(p_slug text, p_jenis text)
returns void language sql security definer set search_path = public as $$
  insert into hitungan (slug, jenis) values (p_slug, p_jenis);
$$;

-- ringkasan total per paket (publik, hanya angka)
create or replace function public.ringkasan()
returns table (slug text, zip bigint, skill bigint, lihat bigint)
language sql stable security definer set search_path = public as $$
  select slug,
    count(*) filter (where jenis = 'zip'),
    count(*) filter (where jenis = 'skill'),
    count(*) filter (where jenis = 'lihat')
  from hitungan group by slug;
$$;

revoke all on function public.catat(text, text) from public;
revoke all on function public.ringkasan() from public;
grant execute on function public.catat(text, text) to anon;
grant execute on function public.ringkasan() to anon;
