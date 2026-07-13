import { supabase } from '../../lib/supabaseClient'
import { MODO_DEMO } from '../auth/demoData'
import { demoStore, novoId, agora } from '../../lib/demoStore'

export async function listarDespesas(empresaId) {
  if (MODO_DEMO) {
    return { data: demoStore.despesas.filter((d) => d.empresa_id === empresaId), error: null }
  }
  return supabase
    .from('despesas')
    .select('*')
    .eq('empresa_id', empresaId)
    .order('data_vencimento', { ascending: true })
}

export async function criarDespesa(empresaId, despesa) {
  if (MODO_DEMO) {
    const nova = { id: novoId(), empresa_id: empresaId, ...despesa, created_at: agora() }
    demoStore.despesas.push(nova)
    return { data: nova, error: null }
  }
  return supabase
    .from('despesas')
    .insert({ ...despesa, empresa_id: empresaId })
    .select()
    .single()
}

export async function atualizarDespesa(despesaId, campos) {
  if (MODO_DEMO) {
    const despesa = demoStore.despesas.find((d) => d.id === despesaId)
    Object.assign(despesa, campos)
    return { data: despesa, error: null }
  }
  return supabase.from('despesas').update(campos).eq('id', despesaId).select().single()
}

export async function excluirDespesa(despesaId) {
  if (MODO_DEMO) {
    demoStore.despesas = demoStore.despesas.filter((d) => d.id !== despesaId)
    return { error: null }
  }
  return supabase.from('despesas').delete().eq('id', despesaId)
}

export async function registrarSaidaCaixa(empresaId, { despesaId, valor, descricao }) {
  if (MODO_DEMO) {
    demoStore.caixa_movimentos.push({
      id: novoId(),
      empresa_id: empresaId,
      tipo: 'saida',
      origem: 'despesa',
      origem_id: despesaId,
      valor,
      descricao,
      created_at: agora(),
    })
    return { error: null }
  }
  return supabase.from('caixa_movimentos').insert({
    empresa_id: empresaId,
    tipo: 'saida',
    origem: 'despesa',
    origem_id: despesaId,
    valor,
    descricao,
  })
}
