import { useState } from 'react'
import { formatMoeda } from '../../lib/formatters'
import '../estoque/EstoqueFormulario.css'
import './FecharVendaModal.css'

const FORMAS = [
  { valor: 'dinheiro', rotulo: 'Dinheiro' },
  { valor: 'cartao', rotulo: 'Cartão' },
  { valor: 'pix', rotulo: 'Pix' },
]

export default function FecharVendaModal({ total, aoConfirmar, aoCancelar }) {
  const [forma, setForma] = useState('dinheiro')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  async function confirmar() {
    setSalvando(true)
    setErro('')
    const resultado = await aoConfirmar(forma)
    setSalvando(false)
    if (resultado?.error) setErro('Não foi possível fechar a venda. Tente novamente.')
  }

  return (
    <div className="modal-fundo">
      <div className="modal-card card">
        <h3>Fechar venda</h3>
        <p className="fechar-venda-total">Total: {formatMoeda(total)}</p>

        <div className="campo">
          <label>Forma de pagamento</label>
          <div className="fechar-venda-formas">
            {FORMAS.map((f) => (
              <button
                key={f.valor}
                type="button"
                className={`btn ${forma === f.valor ? 'btn-primario' : 'btn-secundario'}`}
                onClick={() => setForma(f.valor)}
              >
                {f.rotulo}
              </button>
            ))}
          </div>
        </div>

        {erro && <div className="mensagem-erro">{erro}</div>}

        <div className="modal-acoes">
          <button type="button" className="btn btn-secundario" onClick={aoCancelar}>
            Voltar
          </button>
          <button type="button" className="btn btn-primario" onClick={confirmar} disabled={salvando}>
            {salvando ? 'Fechando...' : 'Confirmar fechamento'}
          </button>
        </div>
      </div>
    </div>
  )
}
