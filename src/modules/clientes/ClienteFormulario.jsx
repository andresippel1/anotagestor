import { useState } from 'react'
import '../estoque/EstoqueFormulario.css'

export default function ClienteFormulario({ clienteInicial, aoSalvar, aoCancelar }) {
  const [form, setForm] = useState(
    clienteInicial ?? { nome: '', telefone: '', email: '', endereco: '', observacoes: '' }
  )
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  async function aoEnviar(e) {
    e.preventDefault()
    if (!form.nome.trim()) {
      setErro('Informe o nome do cliente.')
      return
    }
    setErro('')
    setSalvando(true)
    const resultado = await aoSalvar({
      nome: form.nome.trim(),
      telefone: form.telefone?.trim() || null,
      email: form.email?.trim() || null,
      endereco: form.endereco?.trim() || null,
      observacoes: form.observacoes?.trim() || null,
    })
    setSalvando(false)
    if (resultado?.error) setErro('Não foi possível salvar o cliente.')
  }

  return (
    <div className="modal-fundo">
      <form className="modal-card card" onSubmit={aoEnviar}>
        <h3>{clienteInicial ? 'Editar cliente' : 'Novo cliente'}</h3>

        <div className="campo">
          <label htmlFor="nomeCliente">Nome</label>
          <input
            id="nomeCliente"
            value={form.nome}
            onChange={(e) => atualizarCampo('nome', e.target.value)}
            autoFocus
          />
        </div>

        <div className="linha-campos">
          <div className="campo">
            <label htmlFor="telefoneCliente">Telefone</label>
            <input
              id="telefoneCliente"
              value={form.telefone ?? ''}
              onChange={(e) => atualizarCampo('telefone', e.target.value)}
              placeholder="(11) 99999-0000"
            />
          </div>

          <div className="campo">
            <label htmlFor="emailCliente">E-mail</label>
            <input
              id="emailCliente"
              value={form.email ?? ''}
              onChange={(e) => atualizarCampo('email', e.target.value)}
            />
          </div>
        </div>

        <div className="campo">
          <label htmlFor="enderecoCliente">Endereço</label>
          <input
            id="enderecoCliente"
            value={form.endereco ?? ''}
            onChange={(e) => atualizarCampo('endereco', e.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="observacoesCliente">Observações</label>
          <textarea
            id="observacoesCliente"
            rows={2}
            value={form.observacoes ?? ''}
            onChange={(e) => atualizarCampo('observacoes', e.target.value)}
          />
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
