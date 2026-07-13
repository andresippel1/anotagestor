import { useEmpresas } from '../modules/empresas/useEmpresas'
import { useAuth } from '../modules/auth/AuthContext'
import './Topbar.css'

export default function SeletorEmpresaDev() {
  const { empresas } = useEmpresas()
  const { empresa, visualizarEmpresa } = useAuth()

  function aoTrocar(e) {
    const alvo = empresas.find((emp) => emp.id === e.target.value)
    if (alvo) visualizarEmpresa(alvo)
  }

  return (
    <select
      className="topbar-seletor-empresa"
      value={empresa?.id ?? ''}
      onChange={aoTrocar}
      aria-label="Visualizar como empresa"
    >
      {empresas.map((emp) => (
        <option key={emp.id} value={emp.id}>
          🏪 {emp.nome}
        </option>
      ))}
    </select>
  )
}
