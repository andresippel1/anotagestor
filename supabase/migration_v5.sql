-- =========================================================
-- MazyOS - Migração v5 (aditiva, rodar DEPOIS de migration_v4.sql)
-- Dá ao super_admin (Acesso Desenvolvedor) visão total sobre os dados
-- operacionais de QUALQUER empresa (produtos, estoque, vendas, despesas,
-- mesas, caixa e clientes) — antes só via para a própria empresa vinculada.
-- Cada empresa continua enxergando só os próprios dados normalmente.
-- =========================================================

drop policy if exists "produtos_all" on produtos;
create policy "produtos_all" on produtos
  for all using (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin())
  with check (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin());

drop policy if exists "estoque_itens_all" on estoque_itens;
create policy "estoque_itens_all" on estoque_itens
  for all using (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin())
  with check (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin());

drop policy if exists "estoque_movimentacoes_all" on estoque_movimentacoes;
create policy "estoque_movimentacoes_all" on estoque_movimentacoes
  for all using (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin())
  with check (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin());

drop policy if exists "mesas_all" on mesas;
create policy "mesas_all" on mesas
  for all using (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin())
  with check (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin());

drop policy if exists "comanda_itens_all" on comanda_itens;
create policy "comanda_itens_all" on comanda_itens
  for all using (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin())
  with check (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin());

drop policy if exists "vendas_all" on vendas;
create policy "vendas_all" on vendas
  for all using (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin())
  with check (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin());

drop policy if exists "despesas_all" on despesas;
create policy "despesas_all" on despesas
  for all using (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin())
  with check (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin());

drop policy if exists "caixa_movimentos_all" on caixa_movimentos;
create policy "caixa_movimentos_all" on caixa_movimentos
  for all using (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin())
  with check (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin());

drop policy if exists "caixa_sessoes_all" on caixa_sessoes;
create policy "caixa_sessoes_all" on caixa_sessoes
  for all using (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin())
  with check (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin());

drop policy if exists "clientes_all" on clientes;
create policy "clientes_all" on clientes
  for all using (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin())
  with check (empresa_id in (select auth_empresas_ids()) or auth_is_super_admin());
