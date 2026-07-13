import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../auth/AuthContext'
import { MODO_DEMO } from '../auth/demoData'
import { demoStore } from '../../lib/demoStore'

function inicioDoDia() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function inicioDoMes() {
  const d = new Date()
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export function useDashboardData() {
  const { empresa } = useAuth()
  const [dados, setDados] = useState({
    faturamentoDia: 0,
    faturamentoMes: 0,
    despesasMes: 0,
    lucroEstimado: 0,
    saldoCaixa: 0,
  })
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!empresa?.id) return
    carregar()
  }, [empresa?.id])

  async function carregar() {
    setCarregando(true)

    if (MODO_DEMO) {
      const inicioDia = new Date(inicioDoDia()).getTime()
      const inicioMes = new Date(inicioDoMes()).getTime()

      const vendasEmpresa = demoStore.vendas.filter((v) => v.empresa_id === empresa.id)
      const somaFaturamentoDia = vendasEmpresa
        .filter((v) => new Date(v.created_at).getTime() >= inicioDia)
        .reduce((acc, v) => acc + Number(v.total), 0)
      const somaFaturamentoMes = vendasEmpresa
        .filter((v) => new Date(v.created_at).getTime() >= inicioMes)
        .reduce((acc, v) => acc + Number(v.total), 0)
      const somaDespesasMes = demoStore.despesas
        .filter((d) => d.empresa_id === empresa.id && d.tipo === 'empresa')
        .reduce((acc, d) => acc + Number(d.valor), 0)
      const saldoCaixa = demoStore.caixa_movimentos
        .filter((m) => m.empresa_id === empresa.id)
        .reduce((acc, m) => acc + (m.tipo === 'entrada' ? Number(m.valor) : -Number(m.valor)), 0)

      setDados({
        faturamentoDia: somaFaturamentoDia,
        faturamentoMes: somaFaturamentoMes,
        despesasMes: somaDespesasMes,
        lucroEstimado: somaFaturamentoMes - somaDespesasMes,
        saldoCaixa,
      })
      setCarregando(false)
      return
    }

    const [vendasDia, vendasMes, despesasMes, caixa] = await Promise.all([
      supabase
        .from('vendas')
        .select('total')
        .eq('empresa_id', empresa.id)
        .gte('created_at', inicioDoDia()),
      supabase
        .from('vendas')
        .select('total')
        .eq('empresa_id', empresa.id)
        .gte('created_at', inicioDoMes()),
      supabase
        .from('despesas')
        .select('valor')
        .eq('empresa_id', empresa.id)
        .eq('tipo', 'empresa')
        .gte('created_at', inicioDoMes()),
      supabase
        .from('caixa_movimentos')
        .select('tipo, valor')
        .eq('empresa_id', empresa.id),
    ])

    const somaFaturamentoDia = (vendasDia.data ?? []).reduce((acc, v) => acc + Number(v.total), 0)
    const somaFaturamentoMes = (vendasMes.data ?? []).reduce((acc, v) => acc + Number(v.total), 0)
    const somaDespesasMes = (despesasMes.data ?? []).reduce((acc, d) => acc + Number(d.valor), 0)

    const saldoCaixa = (caixa.data ?? []).reduce((acc, m) => {
      return acc + (m.tipo === 'entrada' ? Number(m.valor) : -Number(m.valor))
    }, 0)

    setDados({
      faturamentoDia: somaFaturamentoDia,
      faturamentoMes: somaFaturamentoMes,
      despesasMes: somaDespesasMes,
      lucroEstimado: somaFaturamentoMes - somaDespesasMes,
      saldoCaixa,
    })
    setCarregando(false)
  }

  return { dados, carregando, recarregar: carregar }
}
