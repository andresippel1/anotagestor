-- =========================================================
-- MazyOS - Schema Multiempresa (Supabase / Postgres)
-- =========================================================
-- Convenção: toda tabela de dados de negócio tem empresa_id
-- e é protegida por Row Level Security (RLS) baseada no
-- vínculo do usuário autenticado com a empresa.
-- =========================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------
-- EMPRESAS (tenants)
-- ---------------------------------------------------------
create table if not exists empresas (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  slug text unique not null,
  logo_url text,
  cor_primaria text default '#ff6b35',
  cor_secundaria text default '#0f1115',
  plano text not null default 'trial', -- trial | basico | pro | enterprise
  status_assinatura text not null default 'ativo', -- ativo | atrasado | cancelado | trial
  data_expiracao_trial date,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------
-- USUÁRIOS DA EMPRESA (vincula auth.users a uma empresa)
-- ---------------------------------------------------------
create table if not exists usuarios_empresa (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  empresa_id uuid not null references empresas(id) on delete cascade,
  nome text,
  papel text not null default 'operador', -- super_admin | admin | gerente | operador
  created_at timestamptz default now(),
  unique (user_id, empresa_id)
);

create index if not exists idx_usuarios_empresa_user on usuarios_empresa(user_id);
create index if not exists idx_usuarios_empresa_empresa on usuarios_empresa(empresa_id);

-- ---------------------------------------------------------
-- PRODUTOS
-- ---------------------------------------------------------
create table if not exists produtos (
  id uuid primary key default uuid_generate_v4(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  nome text not null,
  categoria text,
  preco_venda numeric(10,2) not null default 0,
  preco_custo numeric(10,2) not null default 0,
  controla_estoque boolean not null default false,
  estoque_item_id uuid, -- referência opcional ao item de estoque vinculado
  ativo boolean not null default true,
  created_at timestamptz default now()
);

create index if not exists idx_produtos_empresa on produtos(empresa_id);

-- ---------------------------------------------------------
-- ESTOQUE
-- ---------------------------------------------------------
create table if not exists estoque_itens (
  id uuid primary key default uuid_generate_v4(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  nome text not null,
  unidade text not null default 'un', -- un, kg, l, cx...
  quantidade numeric(10,3) not null default 0,
  quantidade_minima numeric(10,3) not null default 0,
  custo_unitario numeric(10,2) not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_estoque_empresa on estoque_itens(empresa_id);

create table if not exists estoque_movimentacoes (
  id uuid primary key default uuid_generate_v4(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  estoque_item_id uuid not null references estoque_itens(id) on delete cascade,
  tipo text not null, -- entrada | saida | ajuste
  quantidade numeric(10,3) not null,
  motivo text,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------
-- MESAS / COMANDAS
-- ---------------------------------------------------------
create table if not exists mesas (
  id uuid primary key default uuid_generate_v4(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  numero text not null,
  status text not null default 'livre', -- livre | aberta | fechada
  aberta_em timestamptz,
  fechada_em timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_mesas_empresa on mesas(empresa_id);

create table if not exists comanda_itens (
  id uuid primary key default uuid_generate_v4(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  mesa_id uuid not null references mesas(id) on delete cascade,
  produto_id uuid not null references produtos(id),
  quantidade numeric(10,2) not null default 1,
  preco_unitario numeric(10,2) not null,
  observacao text,
  created_at timestamptz default now()
);

create index if not exists idx_comanda_itens_mesa on comanda_itens(mesa_id);

-- ---------------------------------------------------------
-- VENDAS (fechamento de mesa / PDV direto)
-- ---------------------------------------------------------
create table if not exists vendas (
  id uuid primary key default uuid_generate_v4(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  mesa_id uuid references mesas(id),
  total numeric(10,2) not null default 0,
  forma_pagamento text, -- dinheiro | cartao | pix
  status text not null default 'concluida',
  created_at timestamptz default now()
);

create index if not exists idx_vendas_empresa on vendas(empresa_id);
create index if not exists idx_vendas_created_at on vendas(created_at);

-- ---------------------------------------------------------
-- FINANCEIRO: DESPESAS
-- ---------------------------------------------------------
create table if not exists despesas (
  id uuid primary key default uuid_generate_v4(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  descricao text not null,
  categoria text,
  tipo text not null default 'empresa', -- empresa | pessoal
  valor numeric(10,2) not null,
  data_vencimento date,
  pago boolean not null default false,
  created_at timestamptz default now()
);

create index if not exists idx_despesas_empresa on despesas(empresa_id);

-- ---------------------------------------------------------
-- FLUXO DE CAIXA (entradas/saídas manuais + geradas por vendas/despesas)
-- ---------------------------------------------------------
create table if not exists caixa_movimentos (
  id uuid primary key default uuid_generate_v4(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  tipo text not null, -- entrada | saida
  origem text not null default 'manual', -- manual | venda | despesa
  origem_id uuid,
  valor numeric(10,2) not null,
  descricao text,
  created_at timestamptz default now()
);

create index if not exists idx_caixa_empresa on caixa_movimentos(empresa_id);

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table empresas enable row level security;
alter table usuarios_empresa enable row level security;
alter table produtos enable row level security;
alter table estoque_itens enable row level security;
alter table estoque_movimentacoes enable row level security;
alter table mesas enable row level security;
alter table comanda_itens enable row level security;
alter table vendas enable row level security;
alter table despesas enable row level security;
alter table caixa_movimentos enable row level security;

-- Função auxiliar: empresas do usuário autenticado
create or replace function auth_empresas_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select empresa_id from usuarios_empresa where user_id = auth.uid();
$$;

-- Função auxiliar: usuário é super_admin em alguma empresa (uso interno da plataforma)
create or replace function auth_is_super_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from usuarios_empresa
    where user_id = auth.uid() and papel = 'super_admin'
  );
$$;

-- usuarios_empresa: usuário só vê seus próprios vínculos; super_admin vê e gerencia todos
create policy "usuarios_empresa_select_own" on usuarios_empresa
  for select using (user_id = auth.uid() or auth_is_super_admin());

create policy "usuarios_empresa_gestao_super_admin" on usuarios_empresa
  for insert with check (auth_is_super_admin());

create policy "usuarios_empresa_update_super_admin" on usuarios_empresa
  for update using (auth_is_super_admin());

create policy "usuarios_empresa_delete_super_admin" on usuarios_empresa
  for delete using (auth_is_super_admin());

-- empresas: usuário vê apenas a(s) empresa(s) a que pertence; super_admin vê todas
create policy "empresas_select" on empresas
  for select using (id in (select auth_empresas_ids()) or auth_is_super_admin());

create policy "empresas_update" on empresas
  for update using (id in (select auth_empresas_ids()) or auth_is_super_admin());

-- apenas super_admin cria e exclui empresas (gestão do SaaS pelo desenvolvedor)
create policy "empresas_insert_super_admin" on empresas
  for insert with check (auth_is_super_admin());

create policy "empresas_delete_super_admin" on empresas
  for delete using (auth_is_super_admin());

-- Política genérica reaproveitada por tabela (select/insert/update/delete por empresa_id)
create policy "produtos_all" on produtos
  for all using (empresa_id in (select auth_empresas_ids()))
  with check (empresa_id in (select auth_empresas_ids()));

create policy "estoque_itens_all" on estoque_itens
  for all using (empresa_id in (select auth_empresas_ids()))
  with check (empresa_id in (select auth_empresas_ids()));

create policy "estoque_movimentacoes_all" on estoque_movimentacoes
  for all using (empresa_id in (select auth_empresas_ids()))
  with check (empresa_id in (select auth_empresas_ids()));

create policy "mesas_all" on mesas
  for all using (empresa_id in (select auth_empresas_ids()))
  with check (empresa_id in (select auth_empresas_ids()));

create policy "comanda_itens_all" on comanda_itens
  for all using (empresa_id in (select auth_empresas_ids()))
  with check (empresa_id in (select auth_empresas_ids()));

create policy "vendas_all" on vendas
  for all using (empresa_id in (select auth_empresas_ids()))
  with check (empresa_id in (select auth_empresas_ids()));

create policy "despesas_all" on despesas
  for all using (empresa_id in (select auth_empresas_ids()))
  with check (empresa_id in (select auth_empresas_ids()));

create policy "caixa_movimentos_all" on caixa_movimentos
  for all using (empresa_id in (select auth_empresas_ids()))
  with check (empresa_id in (select auth_empresas_ids()));

-- =========================================================
-- STORAGE: logos das empresas
-- =========================================================
-- Bucket público para leitura (a logo aparece no app sem login),
-- mas só quem pertence à empresa pode enviar/atualizar/excluir.
-- Convenção de caminho: <empresa_id>/logo.<ext>

insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

create policy "logos_leitura_publica" on storage.objects
  for select using (bucket_id = 'logos');

create policy "logos_upload_da_propria_empresa" on storage.objects
  for insert with check (
    bucket_id = 'logos'
    and (storage.foldername(name))[1]::uuid in (select auth_empresas_ids())
  );

create policy "logos_atualizacao_da_propria_empresa" on storage.objects
  for update using (
    bucket_id = 'logos'
    and (storage.foldername(name))[1]::uuid in (select auth_empresas_ids())
  );

create policy "logos_exclusao_da_propria_empresa" on storage.objects
  for delete using (
    bucket_id = 'logos'
    and (storage.foldername(name))[1]::uuid in (select auth_empresas_ids())
  );
