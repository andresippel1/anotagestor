import { useState } from 'react'
import { useFluxoCaixa } from '../modules/financeiro/useFluxoCaixa'
import MovimentosLista from '../modules/financeiro/MovimentosLista'
import MovimentoFormulario from '../modules/financeiro/MovimentoFormulario'
import CaixaSessaoCard from '../modules/financeiro/CaixaSessaoCard'
import CardMetrica from '../components/CardMetrica'
import { formatMoeda } from '../lib/formatters'
import '../pages/Estoque.css'

export default function FluxoCaixa() {
  const {
    movimentos,
    sessaoDoDia,
    carregando,
    erro,
    totalEntradas,
    totalSaidas,
    saldo,
    lancarMovimento,
    editarMovimento,
    abrirCaixaDoDia,
    fecharCaixaDoDia,
  } = useFluxoCaixa()
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [movimentoEmEdicao, setMovimentoEmEdicao] = useState(null)

  function abrirEdicao(movimento) {
    setMovimentoEmEdicao(movimento)
    setFormularioAberto(true)
  }

  function fecharFormulario() {
    setFormularioAberto(false)
    setMovimentoEmEdicao(null)
  }

  async function salvar(dados) {
    const resultado = movimentoEmEdicao
      ? await editarMovimento(movimentoEmEdicao.id, dados)
      : await lancarMovimento(dados)
    if (!resultado.error) fecharFormulario()
    return resultado
  }

  if (carregando) return <p>Carregando fluxo de caixa...</p>

  return (
    <div>
      <CaixaSessaoCard sessao={sessaoDoDia} aoAbrir={abrirCaixaDoDia} aoFechar={fecharCaixaDoDia} />

      <div className="grade-cards" style={{ marginBottom: '1.25rem' }}>
        <CardMetrica titulo="Entradas" valor={formatMoeda(totalEntradas)} tom="sucesso" icone="⬆️" />
        <CardMetrica titulo="Saídas" valor={formatMoeda(totalSaidas)} tom="erro" icone="⬇️" />
        <CardMetrica
          titulo="Saldo"
          valor={formatMoeda(saldo)}
          tom={saldo >= 0 ? 'neutro' : 'alerta'}
          icone="💰"
        />
      </div>

      <div className="estoque-topo">
        <p>Extrato de todas as movimentações de caixa (vendas, despesas e lançamentos manuais).</p>
        <button className="btn btn-primario" onClick={() => setFormularioAberto(true)}>
          + Lançamento manual
        </button>
      </div>

      {erro && <div className="mensagem-erro">{erro}</div>}

      <MovimentosLista movimentos={movimentos} aoEditar={abrirEdicao} />

      {formularioAberto && (
        <MovimentoFormulario
          movimentoInicial={movimentoEmEdicao}
          aoSalvar={salvar}
          aoCancelar={fecharFormulario}
        />
      )}
    </div>
  )
}
