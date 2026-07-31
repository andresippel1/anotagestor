-- =========================================================
-- MazyOS - Migração v7 (aditiva, rodar DEPOIS de migration_v6.sql)
-- 1) Permite excluir mesas mesmo com vendas antigas no histórico
--    (a venda continua existindo, só perde a referência à mesa).
-- 2) Cria venda_itens: guarda uma "foto" dos itens vendidos no
--    momento do fechamento (hoje comanda_itens é apagada ao fechar
--    a venda, então essa informação se perdia).
-- =========================================================

alter table vendas drop constraint if exists vendas_mesa_id_fkey;
alter table vendas add constraint vendas_mesa_id_fkey
  foreign key (mesa_id) references mesas(id) on delete set null;

create table if not exists venda_itens (
  id uuid primary key default uuid_generate_v4(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  venda_id uuid not null references vendas(id) on delete cascade,
  produto_id uuid,
  produto_nome text not null,
  quantidade numeric(10,2) not null default 1,
  preco_unitario numeric(10,2) not null,
  created_at timestamptz default now()
);

create index if not exists idx_venda_itens_venda on venda_itens(venda_id);

alter table venda_itens enable row level security;

create policy "venda_itens_all" on venda_itens
  for all using (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin())
  with check (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin());
