-- =========================================================
-- MazyOS - Migração v2 (aditiva, rodar DEPOIS de schema.sql)
-- Não substitui nem apaga nada do schema.sql original.
-- =========================================================

-- ---------------------------------------------------------
-- EMPRESAS: dados de contato e identidade
-- ---------------------------------------------------------
alter table empresas add column if not exists endereco text;
alter table empresas add column if not exists telefone text;
alter table empresas add column if not exists instagram text;
alter table empresas add column if not exists whatsapp_contato text;
alter table empresas add column if not exists mensagem_personalizada text;

-- ---------------------------------------------------------
-- USUARIOS_EMPRESA: e-mail denormalizado (evita join com auth.users
-- no client, que o anon key não pode consultar diretamente)
-- ---------------------------------------------------------
alter table usuarios_empresa add column if not exists email text;

-- ---------------------------------------------------------
-- ESTOQUE: categoria (usada no relatório de estoque)
-- ---------------------------------------------------------
alter table estoque_itens add column if not exists categoria text;

-- ---------------------------------------------------------
-- VENDAS: origem da venda (mesa, delivery, app, balcão)
-- ---------------------------------------------------------
alter table vendas add column if not exists origem_venda text not null default 'mesa';
alter table vendas drop constraint if exists vendas_origem_venda_check;
alter table vendas add constraint vendas_origem_venda_check
  check (origem_venda in ('mesa', 'delivery_whatsapp', 'app_delivery', 'balcao'));

-- ---------------------------------------------------------
-- CAIXA: abertura/fechamento por dia
-- ---------------------------------------------------------
create table if not exists caixa_sessoes (
  id uuid primary key default uuid_generate_v4(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  data date not null default current_date,
  valor_abertura numeric(10,2) not null default 0,
  valor_fechamento numeric(10,2),
  aberto boolean not null default true,
  aberto_em timestamptz default now(),
  fechado_em timestamptz,
  unique (empresa_id, data)
);

alter table caixa_movimentos add column if not exists caixa_sessao_id uuid references caixa_sessoes(id);

alter table caixa_sessoes enable row level security;

create policy "caixa_sessoes_all" on caixa_sessoes
  for all using (empresa_id in (select auth_empresas_ids()))
  with check (empresa_id in (select auth_empresas_ids()));

-- ---------------------------------------------------------
-- CLIENTES
-- ---------------------------------------------------------
create table if not exists clientes (
  id uuid primary key default uuid_generate_v4(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  nome text not null,
  telefone text,
  email text,
  endereco text,
  observacoes text,
  created_at timestamptz default now()
);

create index if not exists idx_clientes_empresa on clientes(empresa_id);

alter table clientes enable row level security;

create policy "clientes_all" on clientes
  for all using (empresa_id in (select auth_empresas_ids()))
  with check (empresa_id in (select auth_empresas_ids()));

-- ---------------------------------------------------------
-- GESTÃO DE FUNCIONÁRIOS: admin da própria empresa também gerencia
-- (antes só o super_admin podia cadastrar/editar/excluir vínculos)
-- ---------------------------------------------------------
create or replace function auth_e_admin_da_empresa(empresa_id_alvo uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from usuarios_empresa
    where user_id = auth.uid()
      and empresa_id = empresa_id_alvo
      and papel = 'admin'
  );
$$;

create policy "usuarios_empresa_admin_insert" on usuarios_empresa
  for insert with check (
    auth_is_super_admin()
    or (auth_e_admin_da_empresa(empresa_id) and papel <> 'super_admin')
  );

create policy "usuarios_empresa_admin_update" on usuarios_empresa
  for update using (auth_is_super_admin() or auth_e_admin_da_empresa(empresa_id))
  with check (
    auth_is_super_admin()
    or (auth_e_admin_da_empresa(empresa_id) and papel <> 'super_admin')
  );

create policy "usuarios_empresa_admin_delete" on usuarios_empresa
  for delete using (auth_is_super_admin() or auth_e_admin_da_empresa(empresa_id));
