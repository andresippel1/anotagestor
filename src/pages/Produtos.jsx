import { useState } from 'react'
import { useProdutos } from '../modules/produtos/useProdutos'
import ProdutosLista from '../modules/produtos/ProdutosLista'
import ProdutoFormulario from '../modules/produtos/ProdutoFormulario'
import '../pages/Estoque.css'

export default function Produtos() {
  const { produtos, carregando, erro, adicionarProduto, editarProduto, removerProduto } = useProdutos()
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null)

  function abrirNovo() {
    setProdutoEmEdicao(null)
    setFormularioAberto(true)
  }

  function abrirEdicao(produto) {
    setProdutoEmEdicao(produto)
    setFormularioAberto(true)
  }

  function fecharFormulario() {
    setFormularioAberto(false)
    setProdutoEmEdicao(null)
  }

  async function salvar(dados) {
    const resultado = produtoEmEdicao
      ? await editarProduto(produtoEmEdicao.id, dados)
      : await adicionarProduto(dados)

    if (!resultado.error) fecharFormulario()
    return resultado
  }

  async function excluir(produto) {
    const confirmar = window.confirm(`Excluir o produto "${produto.nome}"?`)
    if (!confirmar) return
    await removerProduto(produto.id)
  }

  return (
    <div>
      <div className="estoque-topo">
        <p>Cadastre os produtos vendidos, preço, custo e se controlam estoque.</p>
        <button className="btn btn-primario" onClick={abrirNovo}>
          + Novo produto
        </button>
      </div>

      {erro && <div className="mensagem-erro">{erro}</div>}

      {carregando ? (
        <p>Carregando produtos...</p>
      ) : (
        <ProdutosLista produtos={produtos} aoEditar={abrirEdicao} aoExcluir={excluir} />
      )}

      {formularioAberto && (
        <ProdutoFormulario
          produtoInicial={produtoEmEdicao}
          aoSalvar={salvar}
          aoCancelar={fecharFormulario}
        />
      )}
    </div>
  )
}
