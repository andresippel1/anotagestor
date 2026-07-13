import { supabase } from '../../lib/supabaseClient'
import { MODO_DEMO } from '../auth/demoData'
import { demoStore, novoId, agora } from '../../lib/demoStore'

export async function listarClientes(empresaId) {
  if (MODO_DEMO) {
    return { data: demoStore.clientes.filter((c) => c.empresa_id === empresaId), error: null }
  }
  return supabase
    .from('clientes')
    .select('*')
    .eq('empresa_id', empresaId)
    .order('nome', { ascending: true })
}

export async function criarCliente(empresaId, cliente) {
  if (MODO_DEMO) {
    const novo = { id: novoId(), empresa_id: empresaId, ...cliente, created_at: agora() }
    demoStore.clientes.push(novo)
    return { data: novo, error: null }
  }
  return supabase
    .from('clientes')
    .insert({ ...cliente, empresa_id: empresaId })
    .select()
    .single()
}

export async function atualizarCliente(clienteId, campos) {
  if (MODO_DEMO) {
    const cliente = demoStore.clientes.find((c) => c.id === clienteId)
    Object.assign(cliente, campos)
    return { data: cliente, error: null }
  }
  return supabase.from('clientes').update(campos).eq('id', clienteId).select().single()
}

export async function excluirCliente(clienteId) {
  if (MODO_DEMO) {
    demoStore.clientes = demoStore.clientes.filter((c) => c.id !== clienteId)
    return { error: null }
  }
  return supabase.from('clientes').delete().eq('id', clienteId)
}

export async function criarClientesEmLote(empresaId, clientes) {
  if (MODO_DEMO) {
    const novos = clientes.map((c) => ({ id: novoId(), empresa_id: empresaId, ...c, created_at: agora() }))
    demoStore.clientes.push(...novos)
    return { data: novos, error: null }
  }
  return supabase
    .from('clientes')
    .insert(clientes.map((c) => ({ ...c, empresa_id: empresaId })))
    .select()
}
