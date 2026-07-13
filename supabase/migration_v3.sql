-- =========================================================
-- MazyOS - Migração v3 (aditiva, rodar DEPOIS de migration_v2.sql)
-- Suporte ao onboarding automático via webhook da Kiwify.
-- =========================================================

-- E-mail de quem comprou na Kiwify, para localizar a empresa em
-- eventos futuros do mesmo assinante (renovação, reembolso, cancelamento).
alter table empresas add column if not exists email_comprador text;

create index if not exists idx_empresas_email_comprador on empresas(email_comprador);
