import { supabase } from '../../lib/supabaseClient'
import { MODO_DEMO } from '../auth/demoData'
import { demoStore } from '../../lib/demoStore'

export async function listarItensDaVenda(vendaId) {
  if (MODO_DEMO) {
    return {
      data: (demoStore.venda_itens ?? []).filter((i) => i.venda_id === vendaId),
      error: null,
    }
  }
  return supabase.from('venda_itens').select('*').eq('venda_id', vendaId).order('created_at')
}

// Cancela uma venda e estorna o lançamento correspondente no fluxo de caixa,
// para corrigir lançamentos duplicados ou errados sem sujar o saldo do dia.
export async function cancelarVenda(vendaId, movimentoId) {
  if (MODO_DEMO) {
    const venda = demoStore.vendas.find((v) => v.id === vendaId)
    if (venda) venda.status = 'cancelada'
    demoStore.caixa_movimentos = demoStore.caixa_movimentos.filter((m) => m.id !== movimentoId)
    return { error: null }
  }

  const { error: erroVenda } = await supabase
    .from('vendas')
    .update({ status: 'cancelada' })
    .eq('id', vendaId)
  if (erroVenda) return { error: erroVenda }

  return supabase.from('caixa_movimentos').delete().eq('id', movimentoId)
}
