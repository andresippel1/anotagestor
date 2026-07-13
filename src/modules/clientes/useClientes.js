import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import * as clientesApi from './clientesApi'

export function useClientes() {
  const { empresa } = useAuth()
  const [clientes, setClientes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    if (!empresa?.id) return
    setCarregando(true)
    const { data, error } = await clientesApi.listarClientes(empresa.id)
    if (error) setErro('Não foi possível carregar os clientes.')
    else setClientes(data ?? [])
    setCarregando(false)
  }, [empresa?.id])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function adicionarCliente(dados) {
    const { data, error } = await clientesApi.criarCliente(empresa.id, dados)
    if (error) return { error }
    setClientes((atual) => [...atual, data].sort((a, b) => a.nome.localeCompare(b.nome)))
    return { data }
  }

  async function editarCliente(clienteId, campos) {
    const { data, error } = await clientesApi.atualizarCliente(clienteId, campos)
    if (error) return { error }
    setClientes((atual) => atual.map((c) => (c.id === clienteId ? data : c)))
    return { data }
  }

  async function removerCliente(clienteId) {
    const { error } = await clientesApi.excluirCliente(clienteId)
    if (error) return { error }
    setClientes((atual) => atual.filter((c) => c.id !== clienteId))
    return {}
  }

  async function importarClientes(lista) {
    const { data, error } = await clientesApi.criarClientesEmLote(empresa.id, lista)
    if (error) return { error }
    setClientes((atual) => [...atual, ...data].sort((a, b) => a.nome.localeCompare(b.nome)))
    return { data }
  }

  return {
    clientes,
    carregando,
    erro,
    adicionarCliente,
    editarCliente,
    removerCliente,
    importarClientes,
    recarregar: carregar,
  }
}
