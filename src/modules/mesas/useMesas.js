import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import * as mesasApi from './mesasApi'

export function useMesas() {
  const { empresa } = useAuth()
  const [mesas, setMesas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    if (!empresa?.id) return
    setCarregando(true)
    const { data, error } = await mesasApi.listarMesas(empresa.id)
    if (error) setErro('Não foi possível carregar as mesas.')
    else setMesas(data ?? [])
    setCarregando(false)
  }, [empresa?.id])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function criarMesa(numero) {
    const { data, error } = await mesasApi.criarMesa(empresa.id, numero)
    if (error) return { error }
    setMesas((atual) => [...atual, data].sort((a, b) => a.numero.localeCompare(b.numero, undefined, { numeric: true })))
    return { data }
  }

  async function abrirMesa(mesaId) {
    const { data, error } = await mesasApi.abrirMesa(mesaId)
    if (error) return { error }
    setMesas((atual) => atual.map((m) => (m.id === mesaId ? data : m)))
    return { data }
  }

  async function liberarMesa(mesaId) {
    const { data, error } = await mesasApi.liberarMesa(mesaId)
    if (error) return { error }
    setMesas((atual) => atual.map((m) => (m.id === mesaId ? data : m)))
    return { data }
  }

  return { mesas, carregando, erro, criarMesa, abrirMesa, liberarMesa, recarregar: carregar }
}
