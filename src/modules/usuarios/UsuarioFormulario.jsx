import { useState } from 'react'
import '../estoque/EstoqueFormulario.css'

export default function UsuarioFormulario({ usuarioInicial, aoSalvar, aoCancelar }) {
  const editando = Boolean(usuarioInicial)
  const [nome, setNome] = useState(usuarioInicial?.nome ?? '')
  const [email, setEmail] = useState(usuarioInicial?.email ?? '')
  const [senha, setSenha] = useState('')
  const [papel, setPapel] = useState(usuarioInicial?.papel ?? 'operador')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  async function aoEnviar(e) {
    e.preventDefault()
    if (!nome.trim() || (!editando && (!email.trim() || senha.length < 6))) {
      setErro('Preencha nome, e-mail e uma senha com pelo menos 6 caracteres.')
      return
    }
    setErro('')
    setSalvando(true)
    const resultado = editando
      ? await aoSalvar({ nome: nome.trim(), papel })
      : await aoSalvar({ nome: nome.trim(), email: email.trim(), senha, papel })
    setSalvando(false)
    if (resultado?.error) setErro('Não foi possível salvar o funcionário (verifique o e-mail).')
  }

  return (
    <div className="modal-fundo">
      <form className="modal-card card" onSubmit={aoEnviar}>
        <h3>{editando ? 'Editar funcionário' : 'Cadastrar funcionário'}</h3>

        <div className="campo">
          <label htmlFor="nomeUsuario">Nome</label>
          <input id="nomeUsuario" value={nome} onChange={(e) => setNome(e.target.value)} autoFocus />
        </div>

        <div className="campo">
          <label htmlFor="emailUsuario">E-mail de acesso</label>
          <input
            id="emailUsuario"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={editando}
            placeholder="funcionario@exemplo.com"
          />
        </div>

        {!editando && (
          <div className="campo">
            <label htmlFor="senhaUsuario">Senha inicial</label>
            <input
              id="senhaUsuario"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
        )}

        <div className="campo">
          <label htmlFor="papelUsuario">Função</label>
          <select id="papelUsuario" value={papel} onChange={(e) => setPapel(e.target.value)}>
            <option value="admin">Administrador</option>
            <option value="gerente">Gerente</option>
            <option value="operador">Operador (caixa/atendimento)</option>
          </select>
        </div>

        {erro && <div className="mensagem-erro">{erro}</div>}

        <div className="modal-acoes">
          <button type="button" className="btn btn-secundario" onClick={aoCancelar}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primario" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
}
