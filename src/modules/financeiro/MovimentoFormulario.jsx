import { useState } from 'react'
import '../estoque/EstoqueFormulario.css'

export default function MovimentoFormulario({ movimentoInicial, aoSalvar, aoCancelar }) {
  const [tipo, setTipo] = useState(movimentoInicial?.tipo ?? 'entrada')
  const [valor, setValor] = useState(movimentoInicial?.valor ?? 0)
  const [descricao, setDescricao] = useState(movimentoInicial?.descricao ?? '')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const editando = Boolean(movimentoInicial)

  async function aoEnviar(e) {
    e.preventDefault()
    if (Number(valor) <= 0) {
      setErro('Informe um valor válido.')
      return
    }
    setErro('')
    setSalvando(true)
    const resultado = await aoSalvar({ tipo, valor: Number(valor), descricao: descricao.trim() || null })
    setSalvando(false)
    if (resultado?.error) setErro('Não foi possível salvar o movimento.')
  }

  return (
    <div className="modal-fundo">
      <form className="modal-card card" onSubmit={aoEnviar}>
        <h3>{editando ? 'Editar lançamento' : 'Novo lançamento manual'}</h3>

        <div className="campo">
          <label htmlFor="tipoMovimento">Tipo</label>
          <select id="tipoMovimento" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
        </div>

        <div className="campo">
          <label htmlFor="valorMovimento">Valor (R$)</label>
          <input
            id="valorMovimento"
            type="number"
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="descricaoMovimento">Descrição</label>
          <input
            id="descricaoMovimento"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Opcional"
          />
        </div>

        {erro && <div className="mensagem-erro">{erro}</div>}

        <div className="modal-acoes">
          <button type="button" className="btn btn-secundario" onClick={aoCancelar}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primario" disabled={salvando}>
            {salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Lançar'}
          </button>
        </div>
      </form>
    </div>
  )
}
