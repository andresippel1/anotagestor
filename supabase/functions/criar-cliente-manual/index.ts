// Cadastro manual de cliente pelo Acesso Desenvolvedor: cria a empresa + o
// usuário com uma senha gerada na hora, para você repassar diretamente ao
// cliente (WhatsApp, Pix presencial etc.), sem depender da Kiwify.
//
// Só quem tem papel 'super_admin' pode chamar esta função — a verificação
// é feita aqui dentro, usando o token de sessão de quem está logado no app.
//
// Deploy (rodar uma vez, veja supabase/functions/README.md):
//   supabase functions deploy criar-cliente-manual

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

function gerarSenhaTemporaria() {
  const caracteres = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let senha = ''
  for (let i = 0; i < 10; i++) {
    senha += caracteres[Math.floor(Math.random() * caracteres.length)]
  }
  return senha
}

// Campos opcionais de cobrança/cadastro do responsável — cada um é copiado
// do payload apenas se vier preenchido, evitando gravar chaves arbitrárias.
const CAMPOS_OPCIONAIS = [
  'valor_mensalidade',
  'implantacao_paga',
  'implantacao_valor',
  'implantacao_data',
  'data_inicio_assinatura',
  'data_termino_plano',
  'documento',
  'nome_responsavel',
  'cep',
  'cidade',
]

function extrairCamposOpcionais(payload: Record<string, unknown>) {
  const extras: Record<string, unknown> = {}
  for (const campo of CAMPOS_OPCIONAIS) {
    if (payload[campo] !== undefined) extras[campo] = payload[campo]
  }
  return extras
}

function gerarSlug(nome: string) {
  const base = nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return base || 'empresa'
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Método não permitido', { status: 405 })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return new Response('Não autorizado', { status: 401 })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  // Descobre quem está chamando, usando o token de sessão dele (não a service role).
  const comoChamador = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  })
  const { data: dadosUsuario, error: erroSessao } = await comoChamador.auth.getUser()
  if (erroSessao || !dadosUsuario?.user) {
    return new Response('Não autorizado', { status: 401 })
  }

  const admin = createClient(supabaseUrl, serviceKey)

  // Só segue se o chamador tiver papel super_admin em algum vínculo.
  const { data: vinculoDev } = await admin
    .from('usuarios_empresa')
    .select('id')
    .eq('user_id', dadosUsuario.user.id)
    .eq('papel', 'super_admin')
    .maybeSingle()

  if (!vinculoDev) {
    return new Response('Apenas o Acesso Desenvolvedor pode cadastrar clientes', { status: 403 })
  }

  const payload = await req.json().catch(() => null)
  if (!payload?.nome || !payload?.email) {
    return new Response('Informe ao menos nome e e-mail do cliente', { status: 400 })
  }

  const slug = payload.slug?.trim() || gerarSlug(payload.nome)
  const senha = gerarSenhaTemporaria()

  const { data: usuarioCriado, error: erroCriacao } = await admin.auth.admin.createUser({
    email: payload.email,
    password: senha,
    email_confirm: true,
    user_metadata: { nome: payload.nome },
  })

  if (erroCriacao) {
    return new Response(`Erro ao criar usuário: ${erroCriacao.message}`, { status: 500 })
  }

  const { data: empresa, error: erroEmpresa } = await admin
    .from('empresas')
    .insert({
      nome: payload.nome,
      slug,
      plano: payload.plano || 'pro',
      status_assinatura: 'ativo',
      cor_primaria: payload.cor_primaria || '#ff6b35',
      cor_secundaria: payload.cor_secundaria || '#0f1115',
      email_comprador: payload.email,
      ...extrairCamposOpcionais(payload),
    })
    .select()
    .single()

  if (erroEmpresa) {
    return new Response(`Erro ao criar empresa: ${erroEmpresa.message}`, { status: 500 })
  }

  const { error: erroVinculo } = await admin.from('usuarios_empresa').insert({
    user_id: usuarioCriado.user.id,
    empresa_id: empresa.id,
    nome: payload.nome,
    email: payload.email,
    papel: 'admin',
  })

  if (erroVinculo) {
    return new Response(`Erro ao vincular usuário: ${erroVinculo.message}`, { status: 500 })
  }

  return new Response(JSON.stringify({ empresa, email: payload.email, senha }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
