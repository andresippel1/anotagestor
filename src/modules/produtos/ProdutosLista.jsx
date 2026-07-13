import { formatMoeda } from '../../lib/formatters'
import '../estoque/EstoqueLista.css'

export default function ProdutosLista({ produtos, aoEditar, aoExcluir }) {
  if (produtos.length === 0) {
    return <p className="estoque-vazio">Nenhum produto cadastrado ainda.</p>
  }

  return (
    <div className="estoque-tabela-wrap card">
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Categoria</th>
            <th>Preço venda</th>
            <th>Custo</th>
            <th>Estoque</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.nome}</td>
              <td>{produto.categoria || '-'}</td>
              <td>{formatMoeda(produto.preco_venda)}</td>
              <td>{formatMoeda(produto.preco_custo)}</td>
              <td>
                <span className={`tag ${produto.controla_estoque ? 'tag-sucesso' : 'tag-alerta'}`}>
                  {produto.controla_estoque ? 'Controla' : 'Não controla'}
                </span>
              </td>
              <td>
                <span className={`tag ${produto.ativo ? 'tag-sucesso' : 'tag-erro'}`}>
                  {produto.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="estoque-acoes">
                <button className="btn btn-secundario" onClick={() => aoEditar(produto)}>
                  Editar
                </button>
                <button className="btn btn-perigo" onClick={() => aoExcluir(produto)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
