import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import * as caixaApi from './caixaApi'

export function useFluxoCaixa() {
  const { empresa } = useAuth()
  const [movimentos, setMovimentos] = useState([])
  const [sessaoDoDia, setSessaoDoDia] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    if (!empresa?.id) return
    setCarregando(true)
    const [{ data: movs, error }, { data: sessao }] = await Promise.all([
      caixaApi.listarMovimentos(empresa.id),
      caixaApi.buscarSessaoDoDia(empresa.id),
    ])
    if (error) setErro('Não foi possível carregar o fluxo de caixa.')
    else setMovimentos(movs ?? [])
    setSessaoDoDia(sessao)
    setCarregando(false)
  }, [empresa?.id])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function lancarMovimento(dados) {
    const { data, error } = await caixaApi.criarMovimentoManual(empresa.id, dados)
    if (error) return { error }
    setMovimentos((atual) => [data, ...atual])
    return { data }
  }

  async function editarMovimento(movimentoId, dados) {
    const { data, error } = await caixaApi.atualizarMovimento(movimentoId, dados)
    if (error) return { error }
    setMovimentos((atual) => atual.map((m) => (m.id === movimentoId ? data : m)))
    return { data }
  }

  async function abrirCaixaDoDia(valorAbertura) {
    const { data, error } = await caixaApi.abrirCaixa(empresa.id, valorAbertura)
    if (error) return { error }
    setSessaoDoDia(data)
    return { data }
  }

  async function fecharCaixaDoDia(valorFechamento) {
    if (!sessaoDoDia) return { error: 'Nenhum caixa aberto hoje.' }
    const { data, error } = await caixaApi.fecharCaixa(sessaoDoDia.id, valorFechamento)
    if (error) return { error }
    setSessaoDoDia(data)
    return { data }
  }

  const totalEntradas = movimentos
    .filter((m) => m.tipo === 'entrada')
    .reduce((acc, m) => acc + Number(m.valor), 0)

  const totalSaidas = movimentos
    .filter((m) => m.tipo === 'saida')
    .reduce((acc, m) => acc + Number(m.valor), 0)

  const saldo = totalEntradas - totalSaidas

  return {
    movimentos,
    sessaoDoDia,
    carregando,
    erro,
    totalEntradas,
    totalSaidas,
    saldo,
    lancarMovimento,
    editarMovimento,
    abrirCaixaDoDia,
    fecharCaixaDoDia,
    recarregar: carregar,
  }
}
