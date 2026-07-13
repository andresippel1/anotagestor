import { supabase } from '../../lib/supabaseClient'
import { MODO_DEMO } from '../auth/demoData'
import { demoStore, novoId, agora } from '../../lib/demoStore'

export async function listarItens(empresaId) {
  if (MODO_DEMO) {
    return { data: demoStore.estoque_itens.filter((i) => i.empresa_id === empresaId), error: null }
  }
  return supabase
    .from('estoque_itens')
    .select('*')
    .eq('empresa_id', empresaId)
    .order('nome', { ascending: true })
}

export async function criarItem(empresaId, item) {
  if (MODO_DEMO) {
    const novo = { id: novoId(), empresa_id: empresaId, ...item, created_at: agora(), updated_at: agora() }
    demoStore.estoque_itens.push(novo)
    return { data: novo, error: null }
  }
  return supabase
    .from('estoque_itens')
    .insert({ ...item, empresa_id: empresaId })
    .select()
    .single()
}

export async function atualizarItem(itemId, campos) {
  if (MODO_DEMO) {
    const item = demoStore.estoque_itens.find((i) => i.id === itemId)
    Object.assign(item, campos, { updated_at: agora() })
    return { data: item, error: null }
  }
  return supabase
    .from('estoque_itens')
    .update({ ...campos, updated_at: new Date().toISOString() })
    .eq('id', itemId)
    .select()
    .single()
}

export async function excluirItem(itemId) {
  if (MODO_DEMO) {
    demoStore.estoque_itens = demoStore.estoque_itens.filter((i) => i.id !== itemId)
    return { error: null }
  }
  return supabase.from('estoque_itens').delete().eq('id', itemId)
}

export async function registrarMovimentacao(empresaId, { estoqueItemId, tipo, quantidade, motivo }) {
  if (MODO_DEMO) {
    demoStore.caixa_movimentos // no-op, movimentações de estoque não afetam caixa
    return { error: null }
  }
  return supabase.from('estoque_movimentacoes').insert({
    empresa_id: empresaId,
    estoque_item_id: estoqueItemId,
    tipo,
    quantidade,
    motivo,
  })
}
