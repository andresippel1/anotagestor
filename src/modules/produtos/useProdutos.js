import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import * as produtosApi from './produtosApi'

export function useProdutos() {
  const { empresa } = useAuth()
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    if (!empresa?.id) return
    setCarregando(true)
    const { data, error } = await produtosApi.listarTodos(empresa.id)
    if (error) setErro('Não foi possível carregar os produtos.')
    else setProdutos(data ?? [])
    setCarregando(false)
  }, [empresa?.id])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function adicionarProduto(produto) {
    const { data, error } = await produtosApi.criarProduto(empresa.id, produto)
    if (error) return { error }
    setProdutos((atual) => [...atual, data].sort((a, b) => a.nome.localeCompare(b.nome)))
    return { data }
  }

  async function editarProduto(produtoId, campos) {
    const { data, error } = await produtosApi.atualizarProduto(produtoId, campos)
    if (error) return { error }
    setProdutos((atual) => atual.map((p) => (p.id === produtoId ? data : p)))
    return { data }
  }

  async function removerProduto(produtoId) {
    const { error } = await produtosApi.excluirProduto(produtoId)
    if (error) return { error }
    setProdutos((atual) => atual.filter((p) => p.id !== produtoId))
    return {}
  }

  return {
    produtos,
    carregando,
    erro,
    adicionarProduto,
    editarProduto,
    removerProduto,
    recarregar: carregar,
  }
}
