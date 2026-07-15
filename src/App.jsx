import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './modules/auth/AuthContext'
import RotaProtegida from './modules/auth/RotaProtegida'
import LayoutPrincipal from './layouts/LayoutPrincipal'

import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PDV from './pages/PDV'
import Mesas from './pages/Mesas'
import Estoque from './pages/Estoque'
import Produtos from './pages/Produtos'
import Despesas from './pages/Despesas'
import FluxoCaixa from './pages/FluxoCaixa'
import Relatorios from './pages/Relatorios'
import Configuracoes from './pages/Configuracoes'
import AcessoDesenvolvedor from './pages/AcessoDesenvolvedor'
import Usuarios from './pages/Usuarios'
import Clientes from './pages/Clientes'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <RotaProtegida>
                <LayoutPrincipal />
              </RotaProtegida>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pdv" element={<PDV />} />
            <Route path="/mesas" element={<Mesas />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/despesas" element={<Despesas />} />
            <Route path="/fluxo-caixa" element={<FluxoCaixa />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/acesso-desenvolvedor" element={<AcessoDesenvolvedor />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
