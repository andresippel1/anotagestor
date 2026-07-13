import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { useTemaEmpresa } from '../modules/empresas/useTemaEmpresa'
import { useAuth } from '../modules/auth/AuthContext'
import './LayoutPrincipal.css'

const TITULOS = {
  '/dashboard': 'Dashboard',
  '/pdv': 'PDV',
  '/mesas': 'Mesas',
  '/estoque': 'Estoque',
  '/produtos': 'Produtos',
  '/despesas': 'Despesas',
  '/fluxo-caixa': 'Fluxo de Caixa',
  '/relatorios': 'Relatórios',
  '/clientes': 'Clientes',
  '/configuracoes': 'Configurações',
  '/usuarios': 'Usuários',
  '/acesso-desenvolvedor': 'Acesso Desenvolvedor',
}

export default function LayoutPrincipal() {
  const [menuAberto, setMenuAberto] = useState(false)
  const { pathname } = useLocation()
  const { empresa, visualizandoOutraEmpresa, voltarMinhaEmpresa } = useAuth()
  useTemaEmpresa()

  return (
    <div className="layout-principal">
      <Sidebar aberta={menuAberto} aoFechar={() => setMenuAberto(false)} />

      <div className="layout-conteudo">
        {visualizandoOutraEmpresa && (
          <div className="banner-visualizando">
            Visualizando como <strong>{empresa?.nome}</strong> (modo suporte)
            <button className="btn btn-secundario" onClick={voltarMinhaEmpresa}>
              Voltar para minha conta
            </button>
          </div>
        )}
        <Topbar titulo={TITULOS[pathname] ?? 'Painel'} aoAbrirMenu={() => setMenuAberto(true)} />
        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
