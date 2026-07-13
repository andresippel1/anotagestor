import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import * as relatoriosApi from './relatoriosApi'

function primeiroDiaDoMes() {
  const d = new Date()
  d.setDate(1)
  return d.toISOString().slice(0, 10)
}

function hoje() {
  return new Date().toISOString().slice(0, 10)
}

export function useRelatorioVendas() {
  const { empresa } = useAuth()
  const [dataInicio, setDataInicio] = useState(primeiroDiaDoMes())
  const [dataFim, setDataFim] = useState(hoje())
  const [vendas, setVendas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!empresa?.id) return
    buscar()
  }, [empresa?.id, dataInicio, dataFim])

  async function buscar() {
    setCarregando(true)
    const inicioIso = new Date(`${dataInicio}T00:00:00`).toISOString()
    const fimIso = new Date(`${dataFim}T23:59:59`).toISOString()

    const { data, error } = await relatoriosApi.listarVendasPorPeriodo(empresa.id, inicioIso, fimIso)
    if (error) setErro('Não foi possível carregar o relatório.')
    else setVendas(data ?? [])
    setCarregando(false)
  }

  const totalVendido = vendas.reduce((acc, v) => acc + Number(v.total), 0)
  const quantidadeVendas = vendas.length
  const ticketMedio = quantidadeVendas > 0 ? totalVendido / quantidadeVendas : 0

  const porFormaPagamento = vendas.reduce((acc, v) => {
    const forma = v.forma_pagamento || 'não informado'
    acc[forma] = (acc[forma] ?? 0) + Number(v.total)
    return acc
  }, {})

  return {
    dataInicio,
    dataFim,
    setDataInicio,
    setDataFim,
    vendas,
    carregando,
    erro,
    totalVendido,
    quantidadeVendas,
    ticketMedio,
    porFormaPagamento,
  }
}
