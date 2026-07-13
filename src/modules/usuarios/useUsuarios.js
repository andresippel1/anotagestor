import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import * as usuariosApi from './usuariosApi'

export function useUsuarios() {
  const { empresa } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    if (!empresa?.id) return
    setCarregando(true)
    const { data, error } = await usuariosApi.listarUsuariosDaEmpresa(empresa.id)
    if (error) setErro('Não foi possível carregar os usuários.')
    else setUsuarios(data ?? [])
    setCarregando(false)
  }, [empresa?.id])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function cadastrarFuncionario(dados) {
    const { data, error } = await usuariosApi.cadastrarFuncionario(empresa.id, dados)
    if (error) return { error }
    setUsuarios((atual) => [...atual, data])
    return { data }
  }

  async function editarUsuario(vinculoId, campos) {
    const { data, error } = await usuariosApi.atualizarUsuario(vinculoId, campos)
    if (error) return { error }
    setUsuarios((atual) => atual.map((u) => (u.id === vinculoId ? data : u)))
    return { data }
  }

  async function removerUsuario(vinculoId) {
    const { error } = await usuariosApi.removerUsuario(vinculoId)
    if (error) return { error }
    setUsuarios((atual) => atual.filter((u) => u.id !== vinculoId))
    return {}
  }

  async function enviarRedefinicaoSenha(email) {
    return usuariosApi.solicitarRedefinicaoSenha(email)
  }

  return {
    usuarios,
    carregando,
    erro,
    cadastrarFuncionario,
    editarUsuario,
    removerUsuario,
    enviarRedefinicaoSenha,
    recarregar: carregar,
  }
}
