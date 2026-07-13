import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function RotaProtegida({ children }) {
  const { autenticado, carregando } = useAuth()

  if (carregando) return <div className="tela-carregando">Carregando...</div>
  if (!autenticado) return <Navigate to="/login" replace />

  return children
}
