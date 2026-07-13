-- =========================================================
-- Seed: empresa ALPHAVILLE + vínculo de usuários
-- Rode isto DEPOIS de:
--   1) rodar schema.sql
--   2) criar os 2 usuários em Authentication > Users no Supabase
-- Troque os placeholders <...> pelos valores reais antes de rodar.
-- =========================================================

-- 1) Cria a empresa Alphaville com as cores da marca (fundo preto, chama laranja/vermelha)
insert into empresas (nome, slug, plano, status_assinatura, cor_primaria, cor_secundaria)
values ('Alphaville', 'alphaville', 'pro', 'ativo', '#ff5a1f', '#0a0a0a')
returning id;

-- Copie o "id" retornado acima e use no lugar de <EMPRESA_ID> abaixo.

-- 2) Vincula o usuário DESENVOLVEDOR (você) como super_admin
--    (super_admin enxerga e gerencia TODAS as empresas, não só a Alphaville)
insert into usuarios_empresa (user_id, empresa_id, nome, papel)
values ('<UID_DESENVOLVEDOR>', '<EMPRESA_ID>', 'Desenvolvedor', 'super_admin');

-- 3) Vincula o usuário do Thiago (cliente) como admin da empresa dele
insert into usuarios_empresa (user_id, empresa_id, nome, papel)
values ('<UID_THIAGO>', '<EMPRESA_ID>', 'Thiago', 'admin');

-- Dica: para pegar o UID de um usuário, vá em Authentication > Users,
-- clique no usuário e copie o "User UID" (formato uuid).
