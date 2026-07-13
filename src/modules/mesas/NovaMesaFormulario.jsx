import { useState } from 'react'
import '../estoque/EstoqueFormulario.css'

export default function NovaMesaFormulario({ aoCriar, aoCancelar }) {
  const [numero, setNumero] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  async function aoEnviar(e) {
    e.preventDefault()
    if (!numero.trim()) {
      setErro('Informe o número ou nome da mesa.')
      return
    }
    setErro('')
    setSalvando(true)
    const resultado = await aoCriar(numero.trim())
    setSalvando(false)
    if (resultado?.error) setErro('Não foi possível criar a mesa.')
  }

  return (
    <div className="modal-fundo">
      <form className="modal-card card" onSubmit={aoEnviar}>
        <h3>Nova mesa</h3>
        <div className="campo">
          <label htmlFor="numeroMesa">Número / identificação</label>
          <input
            id="numeroMesa"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            placeholder="Ex: 1, 2, Balcão 3..."
            autoFocus
          />
        </div>

        {erro && <div className="mensagem-erro">{erro}</div>}

        <div className="modal-acoes">
          <button type="button" className="btn btn-secundario" onClick={aoCancelar}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primario" disabled={salvando}>
            {salvando ? 'Criando...' : 'Criar mesa'}
          </button>
        </div>
      </form>
    </div>
  )
}
