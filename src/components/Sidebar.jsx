import { NavLink } from 'react-router-dom'
import { useAuth } from '../modules/auth/AuthContext'
import { useMesas } from '../modules/mesas/useMesas'
import './Sidebar.css'

const ITENS = [
  { to: '/dashboard', label: 'Dashboard', icone: '📊' },
  { to: '/pdv', label: 'PDV', icone: '🧾' },
  { to: '/mesas', label: 'Mesas', icone: '🍽️' },
  { to: '/estoque', label: 'Estoque', icone: '📦' },
  { to: '/produtos', label: 'Produtos', icone: '🍔' },
  { to: '/despesas', label: 'Despesas', icone: '💸' },
  { to: '/fluxo-caixa', label: 'Fluxo de Caixa', icone: '💰' },
  { to: '/relatorios', label: 'Relatórios', icone: '📈' },
  { to: '/clientes', label: 'Clientes', icone: '👥' },
  { to: '/configuracoes', label: 'Configurações', icone: '⚙️' },
]

const PAPEIS_COM_GESTAO_USUARIOS = ['admin', 'super_admin']

export default function Sidebar({ aberta, aoFechar }) {
  const { empresa, papel, logout } = useAuth()
  const { mesas } = useMesas()
  const mesasAbertas = mesas.filter((m) => m.status === 'aberta').length

  return (
    <>
      {aberta && <div className="sidebar-overlay" onClick={aoFechar} />}

      <aside className={`sidebar ${aberta ? 'sidebar-aberta' : ''}`}>
        <div className="sidebar-topo">
          {empresa?.logo_url ? (
            <img src={empresa.logo_url} alt={empresa.nome} className="sidebar-logo" />
          ) : (
            <div className="sidebar-logo-placeholder">
              {empresa?.nome?.[0]?.toUpperCase() ?? 'M'}
            </div>
          )}
          <div>
            <strong>{empresa?.nome ?? 'Painel de Gestão'}</strong>
          </div>
        </div>

        <nav className="sidebar-nav">
          {ITENS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-ativo' : ''}`}
              onClick={aoFechar}
            >
              <span>{item.icone}</span>
              {item.label}
              {item.to === '/mesas' && mesasAbertas > 0 && (
                <span className="sidebar-badge">{mesasAbertas}</span>
              )}
            </NavLink>
          ))}

          {PAPEIS_COM_GESTAO_USUARIOS.includes(papel) && (
            <NavLink
              to="/usuarios"
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-ativo' : ''}`}
              onClick={aoFechar}
            >
              <span>👤</span>
              Usuários
            </NavLink>
          )}

          {papel === 'super_admin' && (
            <NavLink
              to="/acesso-desenvolvedor"
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-ativo' : ''}`}
              onClick={aoFechar}
            >
              <span>🛠️</span>
              Acesso Desenvolvedor
            </NavLink>
          )}
        </nav>

        <button className="btn btn-secundario btn-bloco sidebar-sair" onClick={logout}>
          Sair
        </button>
      </aside>
    </>
  )
}
