create table public.energy_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lighting numeric not null,
  hvac_temp numeric not null,
  hvac_load numeric not null,
  parking_occupancy numeric not null,
  shops_active boolean not null,
  lifts_load numeric not null default 15,
  total_energy numeric not null,
  optimized_energy numeric,
  savings_pct numeric,
  eco_mode boolean not null default false
);

alter table public.energy_logs enable row level security;

create policy "Anyone can read energy logs"
  on public.energy_logs for select
  using (true);

create policy "Anyone can insert energy logs"
  on public.energy_logs for insert
  with check (true);

create index energy_logs_created_at_idx
  on public.energy_logs (created_at desc);