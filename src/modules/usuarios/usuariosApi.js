import { supabase } from '../../lib/supabaseClient'
import { MODO_DEMO } from '../auth/demoData'
import { demoStore, novoId, agora } from '../../lib/demoStore'

export async function listarUsuariosDaEmpresa(empresaId) {
  if (MODO_DEMO) {
    return { data: demoStore.usuarios_empresa.filter((u) => u.empresa_id === empresaId), error: null }
  }
  return supabase
    .from('usuarios_empresa')
    .select('*')
    .eq('empresa_id', empresaId)
    .order('created_at', { ascending: true })
}

export async function cadastrarFuncionario(empresaId, { nome, email, senha, papel }) {
  if (MODO_DEMO) {
    const novo = {
      id: novoId(),
      user_id: novoId(),
      empresa_id: empresaId,
      nome,
      email,
      papel,
      created_at: agora(),
    }
    demoStore.usuarios_empresa.push(novo)
    return { data: novo, error: null }
  }

  const { data: cadastro, error: erroCadastro } = await supabase.auth.signUp({ email, password: senha })
  if (erroCadastro) return { error: erroCadastro }

  return supabase
    .from('usuarios_empresa')
    .insert({ user_id: cadastro.user.id, empresa_id: empresaId, nome, email, papel })
    .select()
    .single()
}

export async function atualizarUsuario(vinculoId, campos) {
  if (MODO_DEMO) {
    const usuario = demoStore.usuarios_empresa.find((u) => u.id === vinculoId)
    Object.assign(usuario, campos)
    return { data: usuario, error: null }
  }
  return supabase.from('usuarios_empresa').update(campos).eq('id', vinculoId).select().single()
}

export async function removerUsuario(vinculoId) {
  if (MODO_DEMO) {
    demoStore.usuarios_empresa = demoStore.usuarios_empresa.filter((u) => u.id !== vinculoId)
    return { error: null }
  }
  return supabase.from('usuarios_empresa').delete().eq('id', vinculoId)
}

export async function solicitarRedefinicaoSenha(email) {
  if (MODO_DEMO) {
    return { error: null }
  }
  return supabase.auth.resetPasswordForEmail(email)
}

export async function alterarMinhaSenha(novaSenha) {
  if (MODO_DEMO) {
    return { error: null }
  }
  return supabase.auth.updateUser({ password: novaSenha })
}
