# Onboarding automático (webhook Kiwify)

Quando uma venda é aprovada na Kiwify, esta função:
1. Cria o usuário no Supabase Auth e envia e-mail de convite (o próprio Supabase manda o e-mail com o link para o cliente definir a senha).
2. Cria a empresa (tenant) do cliente.
3. Vincula o usuário à empresa como `admin`.

Em reembolso/cancelamento, ela muda `status_assinatura` da empresa para `cancelado` (o app já bloqueia acesso normalmente nesse caso — ajuste a tela de login/dashboard se quiser um bloqueio mais explícito).

## 1. Instalar a CLI do Supabase (uma vez só)

```
npm install -g supabase
supabase login
supabase link --project-ref SEU_PROJECT_REF
```
(o `SEU_PROJECT_REF` está em Project Settings > General, no painel do Supabase)

## 2. Rodar as migrations pendentes

No SQL Editor do Supabase, rode (nesta ordem, se ainda não rodou):
```
schema.sql
migration_v2.sql
migration_v3.sql   <- adiciona empresas.email_comprador
migration_v4.sql   <- cobrança, datas de assinatura e dados do responsável
migration_v5.sql   <- dá ao super_admin visão total de todas as empresas
```

## 3. Configurar o token secreto do webhook

Escolha uma senha aleatória forte (ex: gere em https://1password.com/password-generator/) e rode:
```
supabase secrets set KIWIFY_WEBHOOK_TOKEN=cole-aqui-o-token-que-voce-escolheu
```

## 4. Publicar a função

```
supabase functions deploy kiwify-webhook --no-verify-jwt
```
(`--no-verify-jwt` é necessário porque quem chama é a Kiwify, não um usuário logado)

Isso te devolve uma URL parecida com:
```
https://SEU-PROJETO.supabase.co/functions/v1/kiwify-webhook
```

## 5. Configurar na Kiwify

No painel da Kiwify → seu produto → **Webhooks** → adicionar novo webhook:
- **URL**: `https://SEU-PROJETO.supabase.co/functions/v1/kiwify-webhook?token=o-mesmo-token-do-passo-3`
- **Eventos**: marque pelo menos "Compra aprovada", "Reembolso" e "Chargeback"

## 6. Configurar o e-mail de convite (uma vez só)

No painel do Supabase → **Authentication → Email Templates → Invite user** — personalize o texto se quiser (ex: com a logo/nome do seu SaaS). É esse e-mail que o cliente recebe automaticamente com o link para criar a senha.

## 7. Testar

A Kiwify tem um modo de teste/sandbox no próprio painel de webhooks ("Enviar teste"). Depois de configurar, dispare um teste e confira em **Supabase → Edge Functions → kiwify-webhook → Logs** se apareceu o payload recebido e se a empresa foi criada em **Table Editor → empresas**.

## Ajustar o mapeamento de plano (opcional)

Se você tiver mais de um produto na Kiwify (ex: plano Básico e plano Pro), edite o objeto `PLANO_POR_PRODUTO` no topo de `index.ts` com o nome exato do produto cadastrado na Kiwify.

---

# Cadastro manual de cliente (`criar-cliente-manual`)

Para quando você vende diretamente (consultoria + Pix, sem Kiwify). Só quem está logado com papel `super_admin` (Acesso Desenvolvedor) consegue chamar essa função — ela mesma verifica isso, então não precisa de token separado.

Diferente do webhook, ela cria o usuário **com uma senha gerada na hora** (não manda e-mail automático) — a função devolve essa senha na resposta, e é você quem repassa ao cliente do jeito que preferir (WhatsApp, presencial etc.), exatamente como você descreveu que vai vender.

## Deploy (uma vez só, depois do passo 1 e 2 acima)

```
supabase functions deploy criar-cliente-manual
```

Repare que **não** tem `--no-verify-jwt` aqui — ao contrário do webhook da Kiwify, essa função exige que quem chama esteja autenticado no app (é o próprio André logado como Acesso Desenvolvedor).

Depois do deploy, o botão "Cadastrar novo cliente" dentro da tela **Acesso Desenvolvedor** já chama essa função sozinho — nenhuma configuração extra é necessária.
