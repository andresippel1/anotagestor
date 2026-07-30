import { supabase } from '../../lib/supabaseClient'
import { MODO_DEMO } from '../auth/demoData'
import { demoStore, novoId, agora } from '../../lib/demoStore'

export async function listarMesas(empresaId) {
  if (MODO_DEMO) {
    return { data: demoStore.mesas.filter((m) => m.empresa_id === empresaId && !m.virtual), error: null }
  }
  return supabase
    .from('mesas')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('virtual', false)
    .order('numero', { ascending: true })
}

// Mesa "invisível", criada nos bastidores pra permitir que pedidos de
// delivery/balcão sejam salvos item a item, igual às mesas reais —
// sem aparecer na lista de mesas do estabelecimento.
export async function criarMesaVirtual(empresaId, rotulo) {
  if (MODO_DEMO) {
    const nova = {
      id: novoId(),
      empresa_id: empresaId,
      numero: rotulo,
      status: 'aberta',
      virtual: true,
      aberta_em: agora(),
      fechada_em: null,
      created_at: agora(),
    }
    demoStore.mesas.push(nova)
    return { data: nova, error: null }
  }
  return supabase
    .from('mesas')
    .insert({ empresa_id: empresaId, numero: rotulo, status: 'aberta', virtual: true, aberta_em: new Date().toISOString() })
    .select()
    .single()
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
    demoStore.comanda_itens = demoStore.comanda_itens.filter((i) => i.mesa_id !== mesaId)
    return { data: mesa, error: null }
  }
  const { error: erroLimpeza } = await supabase.from('comanda_itens').delete().eq('mesa_id', mesaId)
  if (erroLimpeza) return { error: erroLimpeza }
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
