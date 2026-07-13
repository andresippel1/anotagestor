import { supabase } from '../../lib/supabaseClient'
import { MODO_DEMO } from '../auth/demoData'
import { demoStore, novoId, agora } from '../../lib/demoStore'

export async function listarAtivos(empresaId) {
  if (MODO_DEMO) {
    return {
      data: demoStore.produtos.filter((p) => p.empresa_id === empresaId && p.ativo),
      error: null,
    }
  }
  return supabase
    .from('produtos')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('ativo', true)
    .order('categoria', { ascending: true })
    .order('nome', { ascending: true })
}

export async function listarTodos(empresaId) {
  if (MODO_DEMO) {
    return { data: demoStore.produtos.filter((p) => p.empresa_id === empresaId), error: null }
  }
  return supabase
    .from('produtos')
    .select('*')
    .eq('empresa_id', empresaId)
    .order('nome', { ascending: true })
}

export async function criarProduto(empresaId, produto) {
  if (MODO_DEMO) {
    const novo = { id: novoId(), empresa_id: empresaId, ...produto, created_at: agora() }
    demoStore.produtos.push(novo)
    return { data: novo, error: null }
  }
  return supabase
    .from('produtos')
    .insert({ ...produto, empresa_id: empresaId })
    .select()
    .single()
}

export async function atualizarProduto(produtoId, campos) {
  if (MODO_DEMO) {
    const produto = demoStore.produtos.find((p) => p.id === produtoId)
    Object.assign(produto, campos)
    return { data: produto, error: null }
  }
  return supabase.from('produtos').update(campos).eq('id', produtoId).select().single()
}

export async function excluirProduto(produtoId) {
  if (MODO_DEMO) {
    demoStore.produtos = demoStore.produtos.filter((p) => p.id !== produtoId)
    return { error: null }
  }
  return supabase.from('produtos').delete().eq('id', produtoId)
}
