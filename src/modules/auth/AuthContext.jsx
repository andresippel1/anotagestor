import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { MODO_DEMO, USUARIOS_DEMO, EMPRESA_DEMO } from './demoData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [empresa, setEmpresa] = useState(null)
  const [empresaOriginal, setEmpresaOriginal] = useState(null)
  const [papel, setPapel] = useState(null)
  const [nomeUsuario, setNomeUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [autenticadoDemo, setAutenticadoDemo] = useState(false)
  const [usuarioDemoLogado, setUsuarioDemoLogado] = useState(null)

  useEffect(() => {
    if (MODO_DEMO) {
      setCarregando(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) carregarEmpresa(data.session.user.id)
      else setCarregando(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, novaSession) => {
      setSession(novaSession)
      if (novaSession) carregarEmpresa(novaSession.user.id)
      else {
        setEmpresa(null)
        setEmpresaOriginal(null)
        setPapel(null)
        setCarregando(false)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function carregarEmpresa(userId) {
    setCarregando(true)
    const { data, error } = await supabase
      .from('usuarios_empresa')
      .select('papel, nome, empresas (*)')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle()

    if (!error && data) {
      setEmpresa(data.empresas)
      setEmpresaOriginal(data.empresas)
      setPapel(data.papel)
      setNomeUsuario(data.nome)
    }
    setCarregando(false)
  }

  async function login(email, password) {
    if (MODO_DEMO) {
      const usuarioDemo = USUARIOS_DEMO.find((u) => u.email === email && u.senha === password)
      if (!usuarioDemo) return { error: { message: 'Credenciais inválidas' } }
      setEmpresa(EMPRESA_DEMO)
      setEmpresaOriginal(EMPRESA_DEMO)
      setPapel(usuarioDemo.papel)
      setNomeUsuario(usuarioDemo.nome)
      setUsuarioDemoLogado({ id: usuarioDemo.id, email: usuarioDemo.email })
      setAutenticadoDemo(true)
      return { error: null }
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function recuperarSenha(email) {
    if (MODO_DEMO) {
      return { error: { message: 'Recuperação de senha disponível quando o Supabase estiver conectado.' } }
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    return { error }
  }

  async function logout() {
    if (MODO_DEMO) {
      setAutenticadoDemo(false)
      setEmpresa(null)
      setEmpresaOriginal(null)
      setPapel(null)
      setUsuarioDemoLogado(null)
      return
    }
    await supabase.auth.signOut()
  }

  function atualizarEmpresaLocal(campos) {
    setEmpresa((atual) => (atual ? { ...atual, ...campos } : atual))
  }

  // Só faz sentido para super_admin: entra temporariamente nos dados de
  // outra empresa (suporte ao cliente), sem trocar de conta.
  function visualizarEmpresa(empresaAlvo) {
    setEmpresa(empresaAlvo)
  }

  function voltarMinhaEmpresa() {
    setEmpresa(empresaOriginal)
  }

  const value = {
    session,
    usuario: MODO_DEMO ? (autenticadoDemo ? usuarioDemoLogado : null) : session?.user ?? null,
    empresa,
    empresaOriginal,
    visualizandoOutraEmpresa: !!empresaOriginal && empresa?.id !== empresaOriginal?.id,
    papel,
    nomeUsuario,
    carregando,
    autenticado: MODO_DEMO ? autenticadoDemo : !!session,
    login,
    logout,
    recuperarSenha,
    atualizarEmpresaLocal,
    visualizarEmpresa,
    voltarMinhaEmpresa,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return ctx
}
