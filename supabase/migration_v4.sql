-- =========================================================
-- MazyOS - Migração v4 (aditiva, rodar DEPOIS de migration_v3.sql)
-- Controle de assinatura e cadastro do responsável (uso exclusivo
-- do Acesso Desenvolvedor / super_admin — o cliente nunca vê isso).
-- =========================================================

-- Cobrança
alter table empresas add column if not exists valor_mensalidade numeric(10,2);
alter table empresas add column if not exists implantacao_paga boolean not null default false;
alter table empresas add column if not exists implantacao_valor numeric(10,2);
alter table empresas add column if not exists implantacao_data date;

-- Vigência da assinatura
alter table empresas add column if not exists data_inicio_assinatura date;
alter table empresas add column if not exists data_termino_plano date;

-- Responsável pela conta (pode ser diferente do nome do estabelecimento)
alter table empresas add column if not exists documento text; -- CPF ou CNPJ
alter table empresas add column if not exists nome_responsavel text;
alter table empresas add column if not exists cep text;
alter table empresas add column if not exists cidade text;
