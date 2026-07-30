-- =========================================================
-- MazyOS - Migração v6 (aditiva, rodar DEPOIS de migration_v5.sql)
-- Permite persistir comandas de delivery/balcão em tempo real,
-- reaproveitando a estrutura de mesas com uma "mesa virtual"
-- (não aparece na lista de mesas do estabelecimento).
-- =========================================================

alter table mesas add column if not exists virtual boolean not null default false;
