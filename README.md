# MazyOS

SaaS multiempresa de gestão para lanchonetes, espetarias, restaurantes, marmitarias e delivery.

Stack: React + Vite, Supabase (Auth + Postgres + RLS), CSS modular (sem frameworks pesados).

## Setup

1. Instale as dependências:
   ```
   npm install
   ```
2. Copie `.env.example` para `.env` e preencha com os dados do seu projeto Supabase:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
3. No SQL Editor do Supabase, rode o arquivo `supabase/schema.sql`. Ele cria todas as
   tabelas multiempresa (com `empresa_id`) e as políticas de Row Level Security.
4. Crie uma empresa e vincule um usuário (ex.: via SQL Editor, após criar o usuário no
   Auth do Supabase):
   ```sql
   insert into empresas (nome, slug) values ('Minha Lanchonete', 'minha-lanchonete');

   insert into usuarios_empresa (user_id, empresa_id, papel)
   values ('<uuid-do-usuario>', '<uuid-da-empresa>', 'admin');
   ```
5. Rode o projeto:
   ```
   npm run dev
   ```

## Estrutura

```
src/
  lib/          cliente Supabase, formatadores e utilitários puros
  layouts/       layout principal (sidebar + topbar)
  pages/         uma página por rota (compõe os módulos)
  components/    componentes de UI reutilizáveis
  modules/
    auth/        contexto de autenticação e empresa atual
    empresas/     regras específicas de empresa
    pdv/          PDV (comandas, itens, fechamento)
    mesas/        controle de mesas abertas/fechadas
    estoque/      CRUD de itens de estoque (completo)
    produtos/     cadastro de produtos
    financeiro/    despesas e fluxo de caixa
    relatorios/    indicadores e relatórios
    whatsapp/      reservado para integração futura (WhatsApp/IA)
  styles/        tema (cores/variáveis) e estilos globais
```

## Multiempresa

Toda tabela de negócio tem `empresa_id`. O RLS garante que cada usuário só
enxerga dados da(s) empresa(s) às quais está vinculado via `usuarios_empresa`.
Usuários com papel `super_admin` enxergam todas as empresas (usado na tela
Super Admin).

## Já implementado nesta primeira entrega

- Login com Supabase Auth
- Layout principal com navegação lateral responsiva (mobile-first, dark, alto contraste)
- Dashboard com faturamento do dia/mês, despesas, lucro estimado e saldo em caixa
- Módulo de Estoque completo: cadastrar, editar, excluir e contar itens, com alerta
  de estoque baixo e registro de movimentações
- Tela de Configurações (logo, nome, cores da empresa)
- Tela Super Admin (lista de empresas, plano e status de assinatura)
- Páginas de PDV, Mesas, Produtos, Despesas, Fluxo de Caixa e Relatórios já roteadas,
  prontas para receber a implementação completa na próxima etapa
- Estrutura de pastas preparada para os módulos futuros de WhatsApp e IA
