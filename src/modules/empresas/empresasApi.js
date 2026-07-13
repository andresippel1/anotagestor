import { supabase } from '../../lib/supabaseClient'
import { MODO_DEMO } from '../auth/demoData'
import { demoStore, novoId, agora } from '../../lib/demoStore'
import { gerarSenhaTemporaria } from '../../lib/senha'

export async function listarTodasEmpresas() {
  if (MODO_DEMO) {
    return {
      data: [...demoStore.empresas].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
      error: null,
    }
  }
  return supabase.from('empresas').select('*').order('created_at', { ascending: false })
}

// Cadastro manual (você vendendo direto, fora da Kiwify): cria a empresa
// e o login do cliente numa vez só. Em modo demo, simula tudo localmente
// e devolve uma senha gerada para você conferir o fluxo.
export async function criarClienteComAcesso(dados) {
  const { nome, slug, email, plano, cor_primaria, cor_secundaria, ...detalhes } = dados

  if (MODO_DEMO) {
    const senha = gerarSenhaTemporaria()
    const empresa = {
      id: novoId(),
      nome,
      slug,
      plano: plano || 'pro',
      status_assinatura: 'ativo',
      cor_primaria: cor_primaria || '#ff6b35',
      cor_secundaria: cor_secundaria || '#0f1115',
      logo_url: null,
      endereco: '',
      telefone: '',
      instagram: '',
      whatsapp_contato: '',
      mensagem_personalizada: '',
      email_comprador: email,
      created_at: agora(),
      data_expiracao_trial: null,
      ...detalhes, // valor_mensalidade, implantacao_*, datas de assinatura, documento, nome_responsavel, cep, cidade
    }
    demoStore.empresas.push(empresa)
    demoStore.usuarios_empresa.push({
      id: novoId(),
      user_id: novoId(),
      empresa_id: empresa.id,
      nome,
      email,
      papel: 'admin',
      created_at: agora(),
    })
    return { data: { empresa, email, senha } }
  }

  return supabase.functions.invoke('criar-cliente-manual', { body: dados })
}

export async function atualizarEmpresa(empresaId, campos) {
  if (MODO_DEMO) {
    const empresa = demoStore.empresas.find((e) => e.id === empresaId)
    Object.assign(empresa, campos)
    return { data: empresa, error: null }
  }
  return supabase.from('empresas').update(campos).eq('id', empresaId).select().single()
}

export async function excluirEmpresa(empresaId) {
  if (MODO_DEMO) {
    demoStore.empresas = demoStore.empresas.filter((e) => e.id !== empresaId)
    return { error: null }
  }
  return supabase.from('empresas').delete().eq('id', empresaId)
}

export async function enviarLogo(empresaId, arquivo) {
  if (MODO_DEMO) {
    return { data: { url: URL.createObjectURL(arquivo) }, error: null }
  }

  const extensao = arquivo.name.split('.').pop()
  const caminho = `${empresaId}/logo-${Date.now()}.${extensao}`

  const { error: erroUpload } = await supabase.storage
    .from('logos')
    .upload(caminho, arquivo, { upsert: true, cacheControl: '3600' })

  if (erroUpload) return { error: erroUpload }

  const { data } = supabase.storage.from('logos').getPublicUrl(caminho)
  return { data: { url: data.publicUrl } }
}
