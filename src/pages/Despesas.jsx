import { useState } from 'react'
import { useDespesas } from '../modules/financeiro/useDespesas'
import DespesasLista from '../modules/financeiro/DespesasLista'
import DespesaFormulario from '../modules/financeiro/DespesaFormulario'
import { formatMoeda } from '../lib/formatters'
import '../pages/Estoque.css'
import './Despesas.css'

export default function Despesas() {
  const { despesas, carregando, erro, adicionarDespesa, editarDespesa, marcarComoPaga, removerDespesa } =
    useDespesas()
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [despesaEmEdicao, setDespesaEmEdicao] = useState(null)
  const [filtro, setFiltro] = useState('empresa')

  const despesasFiltradas = despesas.filter((d) => d.tipo === filtro)
  const totalFiltrado = despesasFiltradas.reduce((acc, d) => acc + Number(d.valor), 0)

  function abrirNovo() {
    setDespesaEmEdicao(null)
    setFormularioAberto(true)
  }

  function abrirEdicao(despesa) {
    setDespesaEmEdicao(despesa)
    setFormularioAberto(true)
  }

  function fecharFormulario() {
    setFormularioAberto(false)
    setDespesaEmEdicao(null)
  }

  async function salvar(dados) {
    const resultado = despesaEmEdicao
      ? await editarDespesa(despesaEmEdicao.id, dados)
      : await adicionarDespesa(dados)

    if (!resultado.error) fecharFormulario()
    return resultado
  }

  async function excluir(despesa) {
    const confirmar = window.confirm(`Excluir a despesa "${despesa.descricao}"?`)
    if (!confirmar) return
    await removerDespesa(despesa.id)
  }

  return (
    <div>
      <div className="estoque-topo">
        <p>Total em {filtro === 'empresa' ? 'Empresa' : 'Pessoal'}: <strong>{formatMoeda(totalFiltrado)}</strong></p>
        <button className="btn btn-primario" onClick={abrirNovo}>
          + Nova despesa
        </button>
      </div>

      <div className="despesas-abas">
        <button
          className={`btn ${filtro === 'empresa' ? 'btn-primario' : 'btn-secundario'}`}
          onClick={() => setFiltro('empresa')}
        >
          Empresa
        </button>
        <button
          className={`btn ${filtro === 'pessoal' ? 'btn-primario' : 'btn-secundario'}`}
          onClick={() => setFiltro('pessoal')}
        >
          Pessoal
        </button>
      </div>

      {erro && <div className="mensagem-erro">{erro}</div>}

      {carregando ? (
        <p>Carregando despesas...</p>
      ) : (
        <DespesasLista
          despesas={despesasFiltradas}
          aoEditar={abrirEdicao}
          aoExcluir={excluir}
          aoMarcarPaga={marcarComoPaga}
        />
      )}

      {formularioAberto && (
        <DespesaFormulario
          despesaInicial={despesaEmEdicao}
          aoSalvar={salvar}
          aoCancelar={fecharFormulario}
        />
      )}
    </div>
  )
}
