import { supabase } from '../../lib/supabaseClient'
import { MODO_DEMO } from '../auth/demoData'
import { demoStore, novoId, agora } from '../../lib/demoStore'

function hoje() {
  return new Date().toISOString().slice(0, 10)
}

export async function listarMovimentos(empresaId) {
  if (MODO_DEMO) {
    const movimentos = demoStore.caixa_movimentos
      .filter((m) => m.empresa_id === empresaId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return { data: movimentos, error: null }
  }
  return supabase
    .from('caixa_movimentos')
    .select('*')
    .eq('empresa_id', empresaId)
    .order('created_at', { ascending: false })
}

export async function criarMovimentoManual(empresaId, { tipo, valor, descricao }) {
  if (MODO_DEMO) {
    const novo = {
      id: novoId(),
      empresa_id: empresaId,
      tipo,
      valor,
      descricao,
      origem: 'manual',
      created_at: agora(),
    }
    demoStore.caixa_movimentos.push(novo)
    return { data: novo, error: null }
  }
  return supabase
    .from('caixa_movimentos')
    .insert({ empresa_id: empresaId, tipo, valor, descricao, origem: 'manual' })
    .select()
    .single()
}

export async function atualizarMovimento(movimentoId, campos) {
  if (MODO_DEMO) {
    const movimento = demoStore.caixa_movimentos.find((m) => m.id === movimentoId)
    Object.assign(movimento, campos)
    return { data: movimento, error: null }
  }
  return supabase.from('caixa_movimentos').update(campos).eq('id', movimentoId).select().single()
}

export async function buscarSessaoDoDia(empresaId) {
  if (MODO_DEMO) {
    const sessao = demoStore.caixa_sessoes.find((s) => s.empresa_id === empresaId && s.data === hoje())
    return { data: sessao ?? null, error: null }
  }
  return supabase
    .from('caixa_sessoes')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('data', hoje())
    .maybeSingle()
}

export async function abrirCaixa(empresaId, valorAbertura) {
  if (MODO_DEMO) {
    let sessao = demoStore.caixa_sessoes.find((s) => s.empresa_id === empresaId && s.data === hoje())
    if (sessao) {
      Object.assign(sessao, {
        valor_abertura: valorAbertura,
        valor_fechamento: null,
        aberto: true,
        aberto_em: agora(),
        fechado_em: null,
      })
    } else {
      sessao = {
        id: novoId(),
        empresa_id: empresaId,
        data: hoje(),
        valor_abertura: valorAbertura,
        valor_fechamento: null,
        aberto: true,
        aberto_em: agora(),
        fechado_em: null,
      }
      demoStore.caixa_sessoes.push(sessao)
    }
    return { data: sessao, error: null }
  }
  return supabase
    .from('caixa_sessoes')
    .upsert(
      { empresa_id: empresaId, data: hoje(), valor_abertura: valorAbertura, aberto: true, valor_fechamento: null, fechado_em: null, aberto_em: new Date().toISOString() },
      { onConflict: 'empresa_id,data' }
    )
    .select()
    .single()
}

export async function fecharCaixa(sessaoId, valorFechamento) {
  if (MODO_DEMO) {
    const sessao = demoStore.caixa_sessoes.find((s) => s.id === sessaoId)
    Object.assign(sessao, { valor_fechamento: valorFechamento, aberto: false, fechado_em: agora() })
    return { data: sessao, error: null }
  }
  return supabase
    .from('caixa_sessoes')
    .update({ valor_fechamento: valorFechamento, aberto: false, fechado_em: new Date().toISOString() })
    .eq('id', sessaoId)
    .select()
    .single()
}
