// Webhook da Kiwify: cria automaticamente o usuário + a empresa (tenant)
// quando uma venda é aprovada, e desativa o acesso em reembolso/cancelamento.
//
// Configuração necessária (rodar uma vez, veja supabase/functions/README.md):
//   supabase secrets set KIWIFY_WEBHOOK_TOKEN=escolha-um-token-secreto
//   supabase functions deploy kiwify-webhook
//
// Na Kiwify, configure o webhook para:
//   https://SEU-PROJETO.supabase.co/functions/v1/kiwify-webhook?token=escolha-um-token-secreto

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const STATUS_APROVADO = ['paid', 'approved', 'pago', 'aprovado']
const STATUS_CANCELADO = ['refunded', 'refused', 'chargedback', 'canceled', 'cancelled']

const PLANO_POR_PRODUTO: Record<string, string> = {
  // Ajuste aqui conforme o nome do produto configurado na Kiwify.
  // Se o nome não bater com nada, cai no plano 'pro' por padrão.
}

function gerarSlug(nome: string, sufixo: string) {
  const base = nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${base || 'empresa'}-${sufixo.slice(0, 6)}`
}

function extrairDadosKiwify(payload: any) {
  const status = String(
    payload.order_status ?? payload.status ?? payload.webhook_event_type ?? ''
  ).toLowerCase()

  const cliente = payload.Customer ?? payload.customer ?? {}
  const email = cliente.email ?? payload.email ?? null
  const nome = cliente.full_name ?? cliente.name ?? payload.customer_name ?? 'Novo cliente'

  const produto = payload.product ?? payload.Product ?? {}
  const nomeProduto = produto.product_name ?? produto.name ?? ''

  return { status, email, nome, nomeProduto }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Método não permitido', { status: 405 })
  }

  const url = new URL(req.url)
  const tokenRecebido = url.searchParams.get('token')
  const tokenEsperado = Deno.env.get('KIWIFY_WEBHOOK_TOKEN')

  if (!tokenEsperado || tokenRecebido !== tokenEsperado) {
    return new Response('Não autorizado', { status: 401 })
  }

  const payload = await req.json().catch(() => null)
  if (!payload) {
    return new Response('Payload inválido', { status: 400 })
  }

  console.log('Webhook Kiwify recebido:', JSON.stringify(payload))

  const { status, email, nome, nomeProduto } = extrairDadosKiwify(payload)

  if (!email) {
    return new Response('E-mail do comprador não encontrado no payload', { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Cancelamento / reembolso: desativa a empresa desse assinante
  if (STATUS_CANCELADO.includes(status)) {
    const { error } = await supabase
      .from('empresas')
      .update({ status_assinatura: 'cancelado' })
      .eq('email_comprador', email)

    if (error) return new Response(`Erro ao cancelar: ${error.message}`, { status: 500 })
    return new Response(JSON.stringify({ ok: true, acao: 'cancelado', email }), { status: 200 })
  }

  if (!STATUS_APROVADO.includes(status)) {
    // Evento que não tratamos (ex: pix gerado, aguardando pagamento) — só confirma recebimento.
    return new Response(JSON.stringify({ ok: true, acao: 'ignorado', status }), { status: 200 })
  }

  // Já existe empresa para esse e-mail? (renovação) — só garante que está ativa.
  const { data: empresaExistente } = await supabase
    .from('empresas')
    .select('id')
    .eq('email_comprador', email)
    .maybeSingle()

  if (empresaExistente) {
    await supabase
      .from('empresas')
      .update({ status_assinatura: 'ativo' })
      .eq('id', empresaExistente.id)

    return new Response(JSON.stringify({ ok: true, acao: 'renovacao', email }), { status: 200 })
  }

  // Cliente novo: cria o usuário (Supabase envia e-mail de convite automaticamente)
  const { data: usuarioCriado, error: erroUsuario } = await supabase.auth.admin.inviteUserByEmail(
    email,
    { data: { nome } }
  )

  if (erroUsuario) {
    console.log('Erro ao convidar usuário (pode já existir):', erroUsuario.message)
    return new Response(JSON.stringify({ ok: false, motivo: erroUsuario.message }), { status: 200 })
  }

  const plano = PLANO_POR_PRODUTO[nomeProduto] ?? 'pro'

  const { data: empresa, error: erroEmpresa } = await supabase
    .from('empresas')
    .insert({
      nome,
      slug: gerarSlug(nome, usuarioCriado.user.id),
      plano,
      status_assinatura: 'ativo',
      email_comprador: email,
    })
    .select()
    .single()

  if (erroEmpresa) return new Response(`Erro ao criar empresa: ${erroEmpresa.message}`, { status: 500 })

  const { error: erroVinculo } = await supabase.from('usuarios_empresa').insert({
    user_id: usuarioCriado.user.id,
    empresa_id: empresa.id,
    nome,
    email,
    papel: 'admin',
  })

  if (erroVinculo) return new Response(`Erro ao vincular usuário: ${erroVinculo.message}`, { status: 500 })

  return new Response(
    JSON.stringify({ ok: true, acao: 'criado', email, empresa_id: empresa.id }),
    { status: 200 }
  )
})
