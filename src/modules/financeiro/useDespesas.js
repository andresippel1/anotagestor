import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import * as despesasApi from './despesasApi'

export function useDespesas() {
  const { empresa } = useAuth()
  const [despesas, setDespesas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    if (!empresa?.id) return
    setCarregando(true)
    const { data, error } = await despesasApi.listarDespesas(empresa.id)
    if (error) setErro('Não foi possível carregar as despesas.')
    else setDespesas(data ?? [])
    setCarregando(false)
  }, [empresa?.id])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function adicionarDespesa(despesa) {
    const { data, error } = await despesasApi.criarDespesa(empresa.id, despesa)
    if (error) return { error }

    if (data.pago) {
      await despesasApi.registrarSaidaCaixa(empresa.id, {
        despesaId: data.id,
        valor: data.valor,
        descricao: data.descricao,
      })
    }

    setDespesas((atual) => [...atual, data])
    return { data }
  }

  async function editarDespesa(despesaId, campos) {
    const { data, error } = await despesasApi.atualizarDespesa(despesaId, campos)
    if (error) return { error }
    setDespesas((atual) => atual.map((d) => (d.id === despesaId ? data : d)))
    return { data }
  }

  async function marcarComoPaga(despesa) {
    if (despesa.pago) return {}
    const { data, error } = await despesasApi.atualizarDespesa(despesa.id, { pago: true })
    if (error) return { error }

    await despesasApi.registrarSaidaCaixa(empresa.id, {
      despesaId: despesa.id,
      valor: despesa.valor,
      descricao: despesa.descricao,
    })

    setDespesas((atual) => atual.map((d) => (d.id === despesa.id ? data : d)))
    return { data }
  }

  async function removerDespesa(despesaId) {
    const { error } = await despesasApi.excluirDespesa(despesaId)
    if (error) return { error }
    setDespesas((atual) => atual.filter((d) => d.id !== despesaId))
    return {}
  }

  return {
    despesas,
    carregando,
    erro,
    adicionarDespesa,
    editarDespesa,
    marcarComoPaga,
    removerDespesa,
    recarregar: carregar,
  }
}
