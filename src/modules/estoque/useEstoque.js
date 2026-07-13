import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import * as estoqueApi from './estoqueApi'

export function useEstoque() {
  const { empresa } = useAuth()
  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    if (!empresa?.id) return
    setCarregando(true)
    const { data, error } = await estoqueApi.listarItens(empresa.id)
    if (error) setErro('Não foi possível carregar o estoque.')
    else setItens(data ?? [])
    setCarregando(false)
  }, [empresa?.id])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function adicionarItem(item) {
    const { data, error } = await estoqueApi.criarItem(empresa.id, item)
    if (error) return { error }
    setItens((atual) => [...atual, data].sort((a, b) => a.nome.localeCompare(b.nome)))
    return { data }
  }

  async function editarItem(itemId, campos) {
    const { data, error } = await estoqueApi.atualizarItem(itemId, campos)
    if (error) return { error }
    setItens((atual) => atual.map((i) => (i.id === itemId ? data : i)))
    return { data }
  }

  async function removerItem(itemId) {
    const { error } = await estoqueApi.excluirItem(itemId)
    if (error) return { error }
    setItens((atual) => atual.filter((i) => i.id !== itemId))
    return {}
  }

  async function ajustarQuantidade(item, novaQuantidade, motivo = 'Ajuste manual') {
    const diferenca = novaQuantidade - item.quantidade
    if (diferenca === 0) return {}

    const { error } = await editarItem(item.id, { quantidade: novaQuantidade })
    if (error) return { error }

    await estoqueApi.registrarMovimentacao(empresa.id, {
      estoqueItemId: item.id,
      tipo: diferenca > 0 ? 'entrada' : 'saida',
      quantidade: Math.abs(diferenca),
      motivo,
    })

    return {}
  }

  return {
    itens,
    carregando,
    erro,
    adicionarItem,
    editarItem,
    removerItem,
    ajustarQuantidade,
    recarregar: carregar,
  }
}
