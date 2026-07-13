import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../modules/auth/AuthContext'
import './Login.css'

export default function Login() {
  const { login, recuperarSenha, autenticado, carregando } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (!carregando && autenticado) return <Navigate to="/dashboard" replace />

  async function aoEnviar(e) {
    e.preventDefault()
    setErro('')
    setAviso('')
    setEnviando(true)
    const { error } = await login(email, senha)
    setEnviando(false)
    if (error) setErro('E-mail ou senha inválidos.')
  }

  async function aoRecuperarSenha() {
    setErro('')
    setAviso('')
    if (!email) {
      setErro('Informe seu e-mail para recuperar a senha.')
      return
    }
    const { error } = await recuperarSenha(email)
    setAviso(error ? error.message : 'Enviamos um link de recuperação para o seu e-mail.')
  }

  return (
    <div className="pagina-login">
      <div className="login-card card">
        <img src="/logo-completa.svg" alt="Anota Gestor" className="login-assinatura" />

        <h1>Acessar minha conta</h1>
        <p className="login-subtitulo">
          <span className="login-linha" />
          Balcão, caixa e delivery
          <span className="login-linha" />
        </p>

        <form onSubmit={aoEnviar}>
          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <div className="login-campo-com-icone">
              <svg className="login-icone-esquerda" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M4 6h16v12H4V6zm0 0l8 7 8-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <div className="login-campo-com-icone login-campo-senha">
              <svg className="login-icone-esquerda" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="5" y="10.5" width="14" height="9.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M8 10.5V7.5a4 4 0 0 1 8 0v3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <input
                id="senha"
                type={mostrarSenha ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <button
                type="button"
                className="login-olho-senha"
                onClick={() => setMostrarSenha((atual) => !atual)}
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {mostrarSenha ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="button" className="login-esqueci-senha" onClick={aoRecuperarSenha}>
            Não sei minha senha
          </button>

          {erro && <div className="mensagem-erro">{erro}</div>}
          {aviso && <p className="login-aviso">{aviso}</p>}

          <button type="submit" className="btn btn-primario btn-bloco" disabled={enviando}>
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
