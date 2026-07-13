import { useAuth } from '../modules/auth/AuthContext'
import SeletorEmpresaDev from './SeletorEmpresaDev'
import NotificacoesSino from './NotificacoesSino'
import './Topbar.css'

export default function Topbar({ titulo, aoAbrirMenu }) {
  const { empresa, nomeUsuario, papel } = useAuth()
  const inicial = (nomeUsuario || empresa?.nome || 'A')[0].toUpperCase()

  return (
    <header className="topbar">
      <button className="topbar-menu-btn" onClick={aoAbrirMenu} aria-label="Abrir menu">
        ☰
      </button>
      <h2 className="topbar-titulo">{titulo}</h2>

      <div className="topbar-acoes">
        {papel === 'super_admin' ? (
          <SeletorEmpresaDev />
        ) : (
          empresa?.nome && (
            <span className="topbar-loja" title={empresa.nome}>
              <span className="topbar-loja-icone">🏪</span>
              <span className="topbar-loja-nome">{empresa.nome}</span>
            </span>
          )
        )}
        <NotificacoesSino />
        <span className="topbar-avatar" title={nomeUsuario || empresa?.nome}>
          {inicial}
        </span>
      </div>
    </header>
  )
}
