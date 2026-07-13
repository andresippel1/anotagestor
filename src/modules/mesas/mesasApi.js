import { supabase } from '../../lib/supabaseClient'
import { MODO_DEMO } from '../auth/demoData'
import { demoStore, novoId, agora } from '../../lib/demoStore'

export async function listarMesas(empresaId) {
  if (MODO_DEMO) {
    return { data: demoStore.mesas.filter((m) => m.empresa_id === empresaId), error: null }
  }
  return supabase
    .from('mesas')
    .select('*')
    .eq('empresa_id', empresaId)
    .order('numero', { ascending: true })
}

export async function criarMesa(empresaId, numero) {
  if (MODO_DEMO) {
    const nova = {
      id: novoId(),
      empresa_id: empresaId,
      numero,
      status: 'livre',
      aberta_em: null,
      fechada_em: null,
      created_at: agora(),
    }
    demoStore.mesas.push(nova)
    return { data: nova, error: null }
  }
  return supabase
    .from('mesas')
    .insert({ empresa_id: empresaId, numero, status: 'livre' })
    .select()
    .single()
}

export async function abrirMesa(mesaId) {
  if (MODO_DEMO) {
    const mesa = demoStore.mesas.find((m) => m.id === mesaId)
    Object.assign(mesa, { status: 'aberta', aberta_em: agora(), fechada_em: null })
    return { data: mesa, error: null }
  }
  return supabase
    .from('mesas')
    .update({ status: 'aberta', aberta_em: new Date().toISOString(), fechada_em: null })
    .eq('id', mesaId)
    .select()
    .single()
}

export async function liberarMesa(mesaId) {
  if (MODO_DEMO) {
    const mesa = demoStore.mesas.find((m) => m.id === mesaId)
    Object.assign(mesa, { status: 'livre', aberta_em: null, fechada_em: null })
    return { data: mesa, error: null }
  }
  return supabase
    .from('mesas')
    .update({ status: 'livre', aberta_em: null, fechada_em: null })
    .eq('id', mesaId)
    .select()
    .single()
}

export async function fecharMesa(mesaId) {
  if (MODO_DEMO) {
    const mesa = demoStore.mesas.find((m) => m.id === mesaId)
    Object.assign(mesa, { status: 'fechada', fechada_em: agora() })
    return { data: mesa, error: null }
  }
  return supabase
    .from('mesas')
    .update({ status: 'fechada', fechada_em: new Date().toISOString() })
    .eq('id', mesaId)
    .select()
    .single()
}
