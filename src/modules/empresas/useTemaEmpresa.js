import { useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'

export function useTemaEmpresa() {
  const { empresa } = useAuth()

  useEffect(() => {
    const raiz = document.documentElement
    if (empresa?.cor_primaria) {
      raiz.style.setProperty('--cor-primaria', empresa.cor_primaria)
      raiz.style.setProperty('--cor-primaria-hover', clarear(empresa.cor_primaria, 15))
    }
    if (empresa?.cor_secundaria) {
      raiz.style.setProperty('--cor-secundaria', empresa.cor_secundaria)
    }

    return () => {
      raiz.style.removeProperty('--cor-primaria')
      raiz.style.removeProperty('--cor-primaria-hover')
      raiz.style.removeProperty('--cor-secundaria')
    }
  }, [empresa?.cor_primaria, empresa?.cor_secundaria])
}

function clarear(hex, percentual) {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percentual)
  const r = Math.min(255, (num >> 16) + amt)
  const g = Math.min(255, ((num >> 8) & 0x00ff) + amt)
  const b = Math.min(255, (num & 0x0000ff) + amt)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}
