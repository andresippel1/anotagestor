import { useRelatorioVendas } from '../modules/relatorios/useRelatorioVendas'
import CardMetrica from '../components/CardMetrica'
import { formatMoeda, formatDataHora, formatData } from '../lib/formatters'
import { rotuloTipoVenda } from '../modules/pdv/tiposVenda'
import { exportarCsv } from '../lib/exportarArquivo'
import { imprimirA4 } from '../lib/imprimir'
import '../pages/Estoque.css'
import './Relatorios.css'

function paraDataIso(data) {
  return data.toISOString().slice(0, 10)
}

const PRESETS_PERIODO = [
  {
    rotulo: 'Diário',
    calcular: () => {
      const hoje = paraDataIso(new Date())
      return { inicio: hoje, fim: hoje }
    },
  },
  {
    rotulo: 'Semanal',
    calcular: () => {
      const fim = new Date()
      const inicio = new Date()
      inicio.setDate(inicio.getDate() - 6)
      return { inicio: paraDataIso(inicio), fim: paraDataIso(fim) }
    },
  },
  {
    rotulo: 'Mensal',
    calcular: () => {
      const fim = new Date()
      const inicio = new Date()
      inicio.setDate(1)
      return { inicio: paraDataIso(inicio), fim: paraDataIso(fim) }
    },
  },
]

export default function Relatorios() {
  const {
    dataInicio,
    dataFim,
    setDataInicio,
    setDataFim,
    vendas,
    carregando,
    erro,
    totalVendido,
    quantidadeVendas,
    ticketMedio,
    porFormaPagamento,
  } = useRelatorioVendas()

  function aplicarPreset(preset) {
    const { inicio, fim } = preset.calcular()
    setDataInicio(inicio)
    setDataFim(fim)
  }

  function exportarExcel() {
    const cabecalhos = ['Data', 'Origem', 'Forma de pagamento', 'Total']
    const linhas = vendas.map((v) => [
      formatDataHora(v.created_at),
      rotuloTipoVenda(v.origem_venda ?? 'mesa'),
      v.forma_pagamento || '-',
      Number(v.total).toFixed(2).replace('.', ','),
    ])
    exportarCsv(`relatorio-vendas_${dataInicio}_a_${dataFim}`, cabecalhos, linhas)
  }

  function imprimir() {
    imprimirA4()
  }

  return (
    <div>
      <div className="relatorios-filtros card no-imprimir">
        <div className="relatorios-presets">
          {PRESETS_PERIODO.map((preset) => (
            <button
              key={preset.rotulo}
              type="button"
              className="btn btn-secundario"
              onClick={() => aplicarPreset(preset)}
            >
              {preset.rotulo}
            </button>
          ))}
        </div>

        <div className="campo">
          <label htmlFor="dataInicio">De</label>
          <input id="dataInicio" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        </div>
        <div className="campo">
          <label htmlFor="dataFim">Até</label>
          <input id="dataFim" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        </div>
        <div className="relatorios-acoes">
          <button className="btn btn-secundario" onClick={exportarExcel} disabled={carregando}>
            📊 Exportar Excel
          </button>
          <button className="btn btn-secundario" onClick={imprimir} disabled={carregando}>
            🖨️ Imprimir (PDF)
          </button>
        </div>
      </div>

      {erro && <div className="mensagem-erro">{erro}</div>}

      {carregando ? (
        <p>Carregando relatório...</p>
      ) : (
        <>
          <div className="grade-cards no-imprimir" style={{ margin: '1.25rem 0' }}>
            <CardMetrica titulo="Total vendido" valor={formatMoeda(totalVendido)} tom="sucesso" icone="💰" />
            <CardMetrica titulo="Nº de vendas" valor={quantidadeVendas} tom="neutro" icone="🧾" />
            <CardMetrica titulo="Ticket médio" valor={formatMoeda(ticketMedio)} tom="neutro" icone="📊" />
          </div>

          <div className="card relatorios-formas no-imprimir">
            <h3>Por forma de pagamento</h3>
            {Object.keys(porFormaPagamento).length === 0 ? (
              <p>Nenhuma venda no período.</p>
            ) : (
              <ul>
                {Object.entries(porFormaPagamento).map(([forma, valor]) => (
                  <li key={forma}>
                    <span>{forma}</span>
                    <strong>{formatMoeda(valor)}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="estoque-tabela-wrap card no-imprimir" style={{ marginTop: '1.25rem' }}>
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Origem</th>
                  <th>Forma de pagamento</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {vendas.map((venda) => (
                  <tr key={venda.id}>
                    <td>{formatDataHora(venda.created_at)}</td>
                    <td>{rotuloTipoVenda(venda.origem_venda ?? 'mesa')}</td>
                    <td>{venda.forma_pagamento || '-'}</td>
                    <td>{formatMoeda(venda.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="imprimir-area imprimir-a4">
            <h3>Relatório de vendas — {formatData(dataInicio)} a {formatData(dataFim)}</h3>
            <p>Total vendido: {formatMoeda(totalVendido)} · Nº de vendas: {quantidadeVendas} · Ticket médio: {formatMoeda(ticketMedio)}</p>
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Origem</th>
                  <th>Forma de pagamento</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {vendas.map((venda) => (
                  <tr key={venda.id}>
                    <td>{formatDataHora(venda.created_at)}</td>
                    <td>{rotuloTipoVenda(venda.origem_venda ?? 'mesa')}</td>
                    <td>{venda.forma_pagamento || '-'}</td>
                    <td>{formatMoeda(venda.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
