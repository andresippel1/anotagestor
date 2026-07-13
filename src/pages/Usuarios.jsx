import { useState } from 'react'
import { useUsuarios } from '../modules/usuarios/useUsuarios'
import UsuariosLista from '../modules/usuarios/UsuariosLista'
import UsuarioFormulario from '../modules/usuarios/UsuarioFormulario'
import '../pages/Estoque.css'

export default function Usuarios() {
  const { usuarios, carregando, erro, cadastrarFuncionario, editarUsuario, removerUsuario, enviarRedefinicaoSenha } =
    useUsuarios()
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null)
  const [mensagem, setMensagem] = useState('')

  function abrirNovo() {
    setUsuarioEmEdicao(null)
    setFormularioAberto(true)
  }

  function abrirEdicao(usuario) {
    setUsuarioEmEdicao(usuario)
    setFormularioAberto(true)
  }

  function fecharFormulario() {
    setFormularioAberto(false)
    setUsuarioEmEdicao(null)
  }

  async function salvar(dados) {
    const resultado = usuarioEmEdicao
      ? await editarUsuario(usuarioEmEdicao.id, dados)
      : await cadastrarFuncionario(dados)
    if (!resultado.error) fecharFormulario()
    return resultado
  }

  async function excluir(usuario) {
    const confirmar = window.confirm(`Remover o acesso de "${usuario.nome}" a este sistema?`)
    if (!confirmar) return
    await removerUsuario(usuario.id)
  }

  async function redefinirSenha(usuario) {
    setMensagem('')
    const { error } = await enviarRedefinicaoSenha(usuario.email)
    setMensagem(
      error
        ? 'Não foi possível enviar o link de redefinição.'
        : `Link de redefinição de senha enviado para ${usuario.email}.`
    )
  }

  return (
    <div>
      <div className="estoque-topo">
        <p>Cadastre funcionários, defina a função de cada um e gerencie o acesso ao sistema.</p>
        <button className="btn btn-primario" onClick={abrirNovo}>
          + Cadastrar funcionário
        </button>
      </div>

      {erro && <div className="mensagem-erro">{erro}</div>}
      {mensagem && <p className="config-mensagem-ok">{mensagem}</p>}

      {carregando ? (
        <p>Carregando usuários...</p>
      ) : (
        <UsuariosLista
          usuarios={usuarios}
          aoEditar={abrirEdicao}
          aoExcluir={excluir}
          aoRedefinirSenha={redefinirSenha}
        />
      )}

      {formularioAberto && (
        <UsuarioFormulario
          usuarioInicial={usuarioEmEdicao}
          aoSalvar={salvar}
          aoCancelar={fecharFormulario}
        />
      )}
    </div>
  )
}
