import { supabase } from '../../lib/supabaseClient'
import { MODO_DEMO } from '../auth/demoData'
import { demoStore } from '../../lib/demoStore'

export async function listarVendasPorPeriodo(empresaId, dataInicio, dataFim) {
  if (MODO_DEMO) {
    const inicio = new Date(dataInicio).getTime()
    const fim = new Date(dataFim).getTime()
    const vendas = demoStore.vendas
      .filter((v) => v.empresa_id === empresaId)
      .filter((v) => {
        const t = new Date(v.created_at).getTime()
        return t >= inicio && t <= fim
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return { data: vendas, error: null }
  }
  return supabase
    .from('vendas')
    .select('*')
    .eq('empresa_id', empresaId)
    .gte('created_at', dataInicio)
    .lte('created_at', dataFim)
    .order('created_at', { ascending: false })
}
