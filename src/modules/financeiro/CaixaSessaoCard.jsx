import { useState } from 'react'
import { formatMoeda, formatDataHora } from '../../lib/formatters'

export default function CaixaSessaoCard({ sessao, aoAbrir, aoFechar }) {
  const [valor, setValor] = useState(0)
  const [processando, setProcessando] = useState(false)

  async function confirmar() {
    setProcessando(true)
    if (sessao?.aberto) await aoFechar(Number(valor))
    else await aoAbrir(Number(valor))
    setProcessando(false)
  }

  if (sessao?.aberto) {
    return (
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h3>Caixa aberto hoje</h3>
        <p>
          Abertura: {formatMoeda(sessao.valor_abertura)} às {formatDataHora(sessao.aberto_em)}
        </p>
        <div className="campo">
          <label htmlFor="valorFechamento">Valor contado para fechar (R$)</label>
          <input
            id="valorFechamento"
            type="number"
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>
        <button className="btn btn-perigo btn-bloco" onClick={confirmar} disabled={processando}>
          {processando ? 'Fechando...' : 'Fechar caixa do dia'}
        </button>
      </div>
    )
  }

  return (
    <div className="card" style={{ marginBottom: '1.25rem' }}>
      <h3>{sessao ? 'Caixa fechado hoje' : 'Caixa ainda não foi aberto hoje'}</h3>
      {sessao && (
        <p>
          Fechado às {formatDataHora(sessao.fechado_em)} com {formatMoeda(sessao.valor_fechamento)}
        </p>
      )}
      <div className="campo">
        <label htmlFor="valorAbertura">Valor de abertura (troco inicial, R$)</label>
        <input
          id="valorAbertura"
          type="number"
          step="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
      </div>
      <button className="btn btn-primario btn-bloco" onClick={confirmar} disabled={processando}>
        {processando ? 'Abrindo...' : 'Abrir novo caixa do dia'}
      </button>
    </div>
  )
}
