import { useState } from 'react'
import { useAuth } from '../modules/auth/AuthContext'
import { useEstoque } from '../modules/estoque/useEstoque'
import EstoqueLista from '../modules/estoque/EstoqueLista'
import EstoqueFormulario from '../modules/estoque/EstoqueFormulario'
import EstoqueRelatorioImpressao from '../modules/estoque/EstoqueRelatorioImpressao'
import { ordenarPorStatus, itensComEstoqueBaixo, statusEstoque } from '../modules/estoque/estoqueUtils'
import { exportarCsv } from '../lib/exportarArquivo'
import { imprimirA4 } from '../lib/imprimir'
import './Estoque.css'

export default function Estoque() {
  const { empresa } = useAuth()
  const { itens, carregando, erro, adicionarItem, editarItem, removerItem } = useEstoque()
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [itemEmEdicao, setItemEmEdicao] = useState(null)
  const [somenteEstoqueBaixo, setSomenteEstoqueBaixo] = useState(false)

  function abrirNovo() {
    setItemEmEdicao(null)
    setFormularioAberto(true)
  }

  function abrirEdicao(item) {
    setItemEmEdicao(item)
    setFormularioAberto(true)
  }

  function fecharFormulario() {
    setFormularioAberto(false)
    setItemEmEdicao(null)
  }

  async function salvar(dados) {
    const resultado = itemEmEdicao
      ? await editarItem(itemEmEdicao.id, dados)
      : await adicionarItem(dados)

    if (!resultado.error) fecharFormulario()
    return resultado
  }

  async function excluir(item) {
    const confirmar = window.confirm(`Excluir "${item.nome}" do estoque?`)
    if (!confirmar) return
    await removerItem(item.id)
  }

  const itensDoRelatorio = ordenarPorStatus(
    somenteEstoqueBaixo ? itensComEstoqueBaixo(itens) : itens
  )

  function imprimirEstoque() {
    imprimirA4()
  }

  function exportarExcel() {
    const cabecalhos = ['Produto', 'Categoria', 'Unidade', 'Quantidade atual', 'Quantidade mínima', 'Status']
    const linhas = itensDoRelatorio.map((item) => [
      item.nome,
      item.categoria || '',
      item.unidade,
      item.quantidade,
      item.quantidade_minima,
      statusEstoque(item).rotulo,
    ])
    exportarCsv('relatorio-estoque', cabecalhos, linhas)
  }

  return (
    <div>
      <div className="estoque-topo">
        <p>Controle os itens usados na produção e o nível mínimo de cada um.</p>
        <button className="btn btn-primario" onClick={abrirNovo}>
          + Novo item
        </button>
      </div>

      <div className="estoque-relatorio-acoes no-imprimir">
        <label className="estoque-checkbox">
          <input
            type="checkbox"
            checked={somenteEstoqueBaixo}
            onChange={(e) => setSomenteEstoqueBaixo(e.target.checked)}
          />
          Imprimir apenas itens com estoque baixo
        </label>
        <div className="estoque-relatorio-botoes">
          <button className="btn btn-secundario" onClick={imprimirEstoque}>
            🖨️ Imprimir Estoque
          </button>
          <button className="btn btn-secundario" onClick={exportarExcel}>
            📊 Exportar Excel
          </button>
          <button className="btn btn-secundario" onClick={imprimirEstoque}>
            📄 Exportar PDF
          </button>
        </div>
      </div>

      {erro && <div className="mensagem-erro">{erro}</div>}

      {carregando ? (
        <p>Carregando estoque...</p>
      ) : (
        <EstoqueLista itens={itens} aoEditar={abrirEdicao} aoExcluir={excluir} />
      )}

      {formularioAberto && (
        <EstoqueFormulario
          itemInicial={itemEmEdicao}
          aoSalvar={salvar}
          aoCancelar={fecharFormulario}
        />
      )}

      <EstoqueRelatorioImpressao
        empresa={empresa}
        itens={itensDoRelatorio}
        somenteEstoqueBaixo={somenteEstoqueBaixo}
      />
    </div>
  )
}
