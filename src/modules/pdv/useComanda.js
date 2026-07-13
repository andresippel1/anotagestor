import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import * as pdvApi from './pdvApi'

// Quando mesaId é null (venda sem mesa: delivery/balcão), os itens ficam
// só em memória até o fechamento — não existe comanda persistida sem mesa.
export function useComanda(mesaId, origemVenda = 'mesa') {
  const { empresa } = useAuth()
  const [mesa, setMesa] = useState(null)
  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    if (!mesaId) {
      setMesa(null)
      setItens([])
      setCarregando(false)
      return
    }
    setCarregando(true)
    const [{ data: mesaData, error: erroMesa }, { data: itensData, error: erroItens }] = await Promise.all([
      pdvApi.buscarMesa(mesaId),
      pdvApi.listarItensComanda(mesaId),
    ])
    if (erroMesa || erroItens) setErro('Não foi possível carregar a comanda.')
    else {
      setMesa(mesaData)
      setItens(itensData ?? [])
    }
    setCarregando(false)
  }, [mesaId])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function adicionarProduto(produto) {
    if (!mesaId) {
      const itemLocal = {
        id: crypto.randomUUID(),
        produto_id: produto.id,
        quantidade: 1,
        preco_unitario: produto.preco_venda,
        produtos: { nome: produto.nome },
      }
      setItens((atual) => [...atual, itemLocal])
      return { data: itemLocal }
    }

    const { data, error } = await pdvApi.adicionarItemComanda(empresa.id, { mesaId, produto })
    if (error) {
      setErro('Não foi possível lançar o item.')
      return { error }
    }
    setItens((atual) => [...atual, data])
    return { data }
  }

  async function alterarQuantidade(item, novaQuantidade) {
    if (novaQuantidade <= 0) return removerItem(item)

    if (!mesaId) {
      setItens((atual) => atual.map((i) => (i.id === item.id ? { ...i, quantidade: novaQuantidade } : i)))
      return { data: { ...item, quantidade: novaQuantidade } }
    }

    const { data, error } = await pdvApi.atualizarQuantidadeItem(item.id, novaQuantidade)
    if (error) return { error }
    setItens((atual) => atual.map((i) => (i.id === item.id ? data : i)))
    return { data }
  }

  async function removerItem(item) {
    if (!mesaId) {
      setItens((atual) => atual.filter((i) => i.id !== item.id))
      return {}
    }

    const { error } = await pdvApi.removerItemComanda(item.id)
    if (error) return { error }
    setItens((atual) => atual.filter((i) => i.id !== item.id))
    return {}
  }

  const total = itens.reduce((acc, item) => acc + Number(item.quantidade) * Number(item.preco_unitario), 0)

  async function fecharVenda(formaPagamento) {
    const { data, error } = await pdvApi.finalizarVenda(empresa.id, {
      mesaId,
      total,
      formaPagamento,
      origemVenda: mesaId ? 'mesa' : origemVenda,
    })
    if (error) return { error }
    setItens([])
    setMesa((atual) => (atual ? { ...atual, status: 'fechada' } : atual))
    return { data }
  }

  return {
    mesa,
    itens,
    total,
    carregando,
    erro,
    adicionarProduto,
    alterarQuantidade,
    removerItem,
    fecharVenda,
    recarregar: carregar,
  }
}
