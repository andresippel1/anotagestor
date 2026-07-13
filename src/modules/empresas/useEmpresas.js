import { useCallback, useEffect, useState } from 'react'
import * as empresasApi from './empresasApi'

export function useEmpresas() {
  const [empresas, setEmpresas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    setCarregando(true)
    const { data, error } = await empresasApi.listarTodasEmpresas()
    if (error) setErro('Não foi possível carregar as empresas.')
    else setEmpresas(data ?? [])
    setCarregando(false)
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function criarCliente(dados) {
    const { data, error } = await empresasApi.criarClienteComAcesso(dados)
    if (error) return { error }
    setEmpresas((atual) => [data.empresa, ...atual])
    return { data }
  }

  async function editarEmpresa(empresaId, campos) {
    const { data, error } = await empresasApi.atualizarEmpresa(empresaId, campos)
    if (error) return { error }
    setEmpresas((atual) => atual.map((e) => (e.id === empresaId ? data : e)))
    return { data }
  }

  async function removerEmpresa(empresaId) {
    const { error } = await empresasApi.excluirEmpresa(empresaId)
    if (error) return { error }
    setEmpresas((atual) => atual.filter((e) => e.id !== empresaId))
    return {}
  }

  return {
    empresas,
    carregando,
    erro,
    criarCliente,
    editarEmpresa,
    removerEmpresa,
    recarregar: carregar,
  }
}
